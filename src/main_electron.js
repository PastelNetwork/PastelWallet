const path = require('path');
const os = require('os');
const {app, BrowserWindow, ipcMain} = require('electron');
const axios = require('axios');
const fs = require('fs');
const exec = require('child_process').exec;
const bs58 = require('bs58');

let win = null;

const MASTERNODE_REGFEE_COMMAND = "masternode regfee";
const RESPONSE_STATUS_OK = 'OK';
const RESPONSE_STATUS_ERROR = 'ERROR';
const GETBALANCE_COMMAND = 'getbalance';
const GET_ACCOUNT_ADDRESS_COMMAND = 'getaccountaddress';
const LOCAL_PY_URL = 'http://127.0.0.1:5000/';

/*************************************************************
 * py process
 *************************************************************/

const PY_DIST_FOLDER = 'src';
const PY_FOLDER = 'StoVaCore';
const PY_MODULE = 'wallet_api'; // without .py suffix

let pyProc = null;
let pyPort = 5000;

const guessPackaged = () => {
    const fullPath = path.join(__dirname, PY_DIST_FOLDER)
    return require('fs').existsSync(fullPath)
};

const getScriptPath = () => {
    if (!guessPackaged()) {
        return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py');
    }
    // TODO: adjust for compiled python script
    if (process.platform === 'win32') {
        return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
    }
    return path.join(process.resourcesPath, PY_DIST_FOLDER, PY_FOLDER, PY_MODULE)
};


const createPyProc = () => {
    let script = getScriptPath();
    let port = pyPort;
    if (guessPackaged()) {
        pyProc = require('child_process').execFile(script);
    } else {
        pyProc = require('child_process').execFile('python', [script]);
    }

    if (pyProc != null) {
        console.log('child process success on port ' + port)
    }
};

const exitPyProc = () => {
    pyProc.kill();
    pyProc = null;
};

app.on('ready', createPyProc);
app.on('will-quit', exitPyProc);


const callRpcMethod = (method) => {
    // return Promise
    return axios.post('http://localhost:19932', {
        "jsonrpc": "1.0",
        "id": "curltest",
        "method": method,
        "params": [""]
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


ipcMain.on('blockchainDataRequest', (event, arg) => {
    return callRpcMethod(GET_ACCOUNT_ADDRESS_COMMAND).then((response) => {
        const bcAddress = response.data.result;
        axios.get(`${LOCAL_PY_URL}generate_keys`).then((response) => {
            const publicKeyBuff = fs.readFileSync(path.join(process.cwd(), response.data.public));
            const pastelIdAddress = bs58.encode(publicKeyBuff);
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
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600, minWidth: 600, minHeight: 400, webPreferences: {nodeIntegration: true}});
    if (process.defaultApp) {
        win.loadURL('http://localhost:3000/');
        win.webContents.openDevTools();
        BrowserWindow.addDevToolsExtension(
            '/Users/alex/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
    } else {
        win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
    }
}

app.on('ready', createWindow);
