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



/*************************************************************
 * py process
 *************************************************************/

const PY_DIST_FOLDER = 'pydist';
const PY_FOLDER = 'python_interface';
const PY_MODULE = 'http_api'; // without .py suffix

let pyProc = null;
let pyPort = 4242;

const guessPackaged = () => {
    const fullPath = path.join(__dirname, PY_DIST_FOLDER)
    return require('fs').existsSync(fullPath)
};

const getScriptPath = () => {
    if (!guessPackaged()) {
        return path.join(__dirname, '..', PY_FOLDER, PY_MODULE + '.py')
    }
    // TODO: adjust for compiled python script
    if (process.platform === 'win32') {
        return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
    }
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
};


const createPyProc = () => {
    let script = getScriptPath();
    console.log('Script');
    console.log(script);
    let port = pyPort;
    const PyRpcStartCallback = (err, stdo, stde) => {
        // TODO: start flask server insead of zerorpc
            if (err === null) {
                ConnectRpc();
            } else {
                console.log(`Error starting python RPC process : ${err}`);
            }
        };
    if (guessPackaged()) {
        pyProc = require('child_process').execFile(script, PyRpcStartCallback);
    } else {
        pyProc = require('child_process').execFile('python', [script], PyRpcStartCallback);
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
    return axios.post('http://localhost:9932', {
        "jsonrpc": "1.0",
        "id": "curltest",
        "method": method,
        "params": [""]
    }, {
        headers: {
            'Content-Type': 'text/plain'
        },
        auth: {
            username: 'rpcuser',
            password: 'rpcpassword'
        }
    });
};

ipcMain.on('imageRegFormSubmit', (event, arg) => {
    const stats = fs.statSync(arg.filePath);
    const fileSizeInBytes = stats.size;
    console.log(`File size is ${fileSizeInBytes} bytes`);
    return callRpcMethod(MASTERNODE_REGFEE_COMMAND).then((response) => {
        // TODO: check if user's address has enough funds to pay fee
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
        win.webContents.send('imageRegFormSubmitResponse', {
            status: RESPONSE_STATUS_ERROR,
            msg: `Error accessing local cNode: Status code: ${err.response.status}, message: ${err.response.data.error.message}, command: ${GETBALANCE_COMMAND}`
        });
    });
});


ipcMain.on('blockchainDataRequest', (event, arg) => {
    return callRpcMethod(GET_ACCOUNT_ADDRESS_COMMAND).then((response) => {
        const bcAddress = response.data.result;
        if (!fs.existsSync(path.join(process.cwd(), 'private.key') || !fs.existsSync(path.join(process.cwd(), 'public.key')))) {
            // TODO: call rpc generate keys
            exec('/Users/alex/PycharmProjects/spa/src/assets2/executable/generate_keys', (error, stdout, stderr) => {
                console.log('Executed');
                console.log(error);
            })
        }
        const publicKeyBuff = fs.readFileSync(path.join(process.cwd(), 'public.key'));
        const pastelIdAddress = bs58.encode(publicKeyBuff);
        win.webContents.send('blockchainDataResponse', {address: bcAddress, pastelID: pastelIdAddress});
    }).catch((err) => {
        win.webContents.send('walletAddress', `Cannot connect to local pasteld!, command: ${GET_ACCOUNT_ADDRESS_COMMAND}`);
    });
});

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600});
    // TODO: make sure pasteld is running locally
    // TODO: generate key pair. store it in current folder.
    // TODO: check RPC port
    // TODO: send event if pasteld connection estalished
    // TODO: otherwise - send event that connection to local pasteld is failed
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
