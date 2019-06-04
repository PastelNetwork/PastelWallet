const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const axios = require('axios');
const fs = require('fs');
const exec = require('child_process').exec;
const bs58 = require('bs58');
const log = require('electron-log');

let win = null;

const MASTERNODE_REGFEE_COMMAND = "masternode regfee";
const RESPONSE_STATUS_OK = 'OK';
const RESPONSE_STATUS_ERROR = 'ERROR';
const GETBALANCE_COMMAND = 'getbalance';
const GET_ACCOUNT_ADDRESS_COMMAND = 'getaccountaddress';
const SEND_TO_ADDRESS_COMMAND = 'sendtoaddress';
const LOCAL_PY_URL = 'http://127.0.0.1:5000/';

/*************************************************************
 * py process
 *************************************************************/

const PY_DIST_FOLDER = 'src';
const PY_FOLDER = 'StoVaCore';
const PY_MODULE = 'wallet_api'; // without .py suffix

let pyProc = null;
let pastelProc = null;
let pyPort = 5000;


const getScriptPath = () => {
    if (process.defaultApp) {
        return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py');
    }
    if (process.platform === 'win32') {
        return path.join(process.resourcesPath, PY_DIST_FOLDER, PY_FOLDER, 'dist', PY_MODULE + '.exe')
    }
    const scriptPath = path.join(process.resourcesPath, PY_DIST_FOLDER, PY_FOLDER, 'dist', PY_MODULE);
    log.warn(`Script path: ${scriptPath}`);
    return scriptPath;
};


const getPasteldPath = () => {
    if (process.defaultApp) {
        return null;
    }
    let scriptPath;
    if (process.platform === 'win32') {
        scriptPath = path.join(process.resourcesPath, 'pasteld_binary', 'pasteld' + '.exe')
    } else {
        scriptPath = path.join(process.resourcesPath, 'pasteld_binary', 'pasteld');
    }

    log.warn(`Pasteld path: ${scriptPath}`);
    return scriptPath;
};


const createPyProc = () => {
    let script = getScriptPath();
    let port = pyPort;
    if (process.defaultApp) {
        pyProc = require('child_process').execFile('python', [script, process.cwd()]);
    } else {
        let appPath;
        switch (process.platform) {
            case "linux":
                appPath = path.join(process.resourcesPath, '..');
                break;
            default:
                appPath = path.join(process.resourcesPath, '..', '..');
                break;
        }
        pyProc = require('child_process').execFile(script, [appPath], (error, stdout, stderr) => {
            log.error(`[wallet_api.py] Error: ${error}`);
            log.info(`[wallet_api.py] Stdout: ${stdout}`);
            log.warn(`[wallet_api.py] Stderr: ${stderr}`);
        });
    }

    if (pyProc != null) {
        log.info('child process success on port ' + port)
    } else {
        log.warn('Wallet api proccess failed to start')
    }
};

const checkAndRunPastelD = () => {
    //TODO: stqart pastelD proccess
    //TODO: stop it on exit
    //TODO: as this is no mac build for pastelD available -
    const pastelPath = getPasteldPath();
    if (!process.defaultApp) {
        pastelProc = require('child_process').execFile(pastelPath, [], (error, stdout, stderr) => {
            log.error(`[pasteld] Error: ${error}`);
            log.info(`[pasteld] Stdout: ${stdout}`);
            log.warn(`[pasteld] Stderr: ${stderr}`);
        });
    }

    if (pastelProc != null) {
        log.info('PastelD is running')
    } else {
        log.warn('PastelD proccess failed to start')
    }
};


const cleanUp = () => {
    pyProc.kill();
    if (pastelProc) {
        pastelProc.kill();
    }
    pastelProc = null;
    pyProc = null;
};

app.on('ready', createPyProc);
app.on('ready', checkAndRunPastelD);
app.on('will-quit', cleanUp);


const callRpcMethod = (method, params) => {
    // return Promise
    return axios.post('http://localhost:19932', {
        "jsonrpc": "1.0",
        "id": "curltest",
        "method": method,
        "params": params ? params : [""]
    }, {
        headers: {
            'Content-Type': 'text/plain'
        },
        auth: {
            username: 'rt',
            password: 'rt'
        }
    });
};

ipcMain.on('imageRegFormSubmit', (event, arg) => {
    const stats = fs.statSync(arg.filePath);
    const fileSizeInBytes = stats.size;
    return callRpcMethod(MASTERNODE_REGFEE_COMMAND).then((response) => {
        const regFee = response.data.result;
        callRpcMethod(GETBALANCE_COMMAND).then((response) => {
            if (response.data.result >= regFee) {
                win.webContents.send('imageRegFormSubmitResponse', {status: RESPONSE_STATUS_OK, msg: 'OK', regFee})
            } else {
                win.webContents.send('imageRegFormSubmitResponse', {
                    status: RESPONSE_STATUS_ERROR,
                    msg: `Not enough funds to pay fee (need PSL${regFee}`,
                    regFee
                })
            }
        }).catch((err) => {
            win.webContents.send('imageRegFormSubmitResponse', {
                status: RESPONSE_STATUS_ERROR,
                msg: `Error accessing local cNode: ${err.response.data.error.message}, command: ${GETBALANCE_COMMAND}`
            })
        })
    }).catch((err) => {
        // TODO: send error. OK response is here only for debugging purposes until cNode does not support regfee command
        // win.webContents.send('imageRegFormSubmitResponse', {
        //     status: RESPONSE_STATUS_ERROR,
        //     msg: `Error accessing local cNode: Status code: ${err.response.status}, message: ${err.response.data.error.message}, command: ${GETBALANCE_COMMAND}`
        // });
        const regFee = 20;
        win.webContents.send('imageRegFormSubmitResponse', {status: RESPONSE_STATUS_OK, msg: 'OK', regFee})
    });
});

ipcMain.on('getBalanceRequest', (event, arg) => {
    return callRpcMethod(GETBALANCE_COMMAND).then((response) => {
        const balance = response.data.result;
        win.webContents.send('getBalanceResponse', {
            status: RESPONSE_STATUS_OK,
            balance
        })
    }).catch((err) => {
        win.webContents.send('getBalanceResponse', {
            status: RESPONSE_STATUS_ERROR,
            msg: `Error accessing local cNode: ${err.response.data.error.message}, command: ${GETBALANCE_COMMAND}`
        })
    });
});

ipcMain.on('sendPSLRequest', (event, arg) => {
    log.info(`Send PSL request received to ${arg.address} for ${arg.amount} PSL`);
    return callRpcMethod(SEND_TO_ADDRESS_COMMAND, [arg.address, arg.amount]).then((response) => {
        log.warn('PSL sent ok');
        win.webContents.send('sendPSLResponse', {
            status: RESPONSE_STATUS_OK,
            msg: 'Funds succesfully sent'
        })
    }).catch((err) => {
        log.warn('PSL sent error');
        win.webContents.send('sendPSLResponse', {
            status: RESPONSE_STATUS_ERROR,
            msg: `Error send PSL`
        })
    });
});

ipcMain.on('blockchainDataRequest', (event, arg) => {
    return callRpcMethod(GET_ACCOUNT_ADDRESS_COMMAND).then((response) => {
        const bcAddress = response.data.result;
        log.info(`BC data result ${bcAddress}`);
        axios.get(`${LOCAL_PY_URL}get_keys`).then((response) => {
            const publicKeyBuff = fs.readFileSync(response.data.public);
            const pastelIdAddress = bs58.encode(publicKeyBuff);
            log.info(`BC data result2 ${pastelIdAddress}`);
            log.info(`BC data result2-1 ${response.data.public}`);
            win.webContents.send('blockchainDataResponse', {
                status: RESPONSE_STATUS_OK,
                address: bcAddress,
                pastelID: pastelIdAddress
            });
        }).catch((err) => {
            win.webContents.send('blockchainDataResponse', {
                status: RESPONSE_STATUS_ERROR,
                error: 'Request errror. Try again later'
            });
        });
    }).catch((err) => {
        win.webContents.send('walletAddress', `Cannot connect to local pasteld!, command: ${GET_ACCOUNT_ADDRESS_COMMAND}`);
    });
});

function createWindow() {
    log.silly('Starting main proccess....');
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 400,
        webPreferences: {nodeIntegration: true, webSecurity: false}
    });
    if (process.defaultApp) {
        win.loadURL('http://localhost:3000/');
        win.webContents.openDevTools();
        // BrowserWindow.addDevToolsExtension(
        //     '/Users/alex/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
    } else {
        win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    }
}

app.on('ready', createWindow);
