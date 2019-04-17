const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const axios = require('axios');
const fs = require('fs');
let win = null;

const MASTERNODE_REGFEE_COMMAND = "masternode regfee";
const RESPONSE_STATUS_OK = 'OK';
const RESPONSE_STATUS_ERROR = 'ERROR';

const callRpcMethod = (method) => {
    // return Promise
    return axios.post('http://localhost:9932', {
        "jsonrpc": "1.0",
        "id": "curltest",
        "method": method,  // it is not implemented yet
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
        callRpcMethod('getbalance').then((response) => {
            if (response.data.result >= regFee) {
                win.webContents.send('imageRegFormSubmitResponse', {status: RESPONSE_STATUS_OK, msg: 'OK', regFee})
            } else {
                win.webContents.send('imageRegFormSubmitResponse', {status: RESPONSE_STATUS_ERROR, msg: `Not enough funds to pay fee (need PSL${regFee}`, regFee})
            }
        }).catch((err) => {
            win.webContents.send('imageRegFormSubmitResponse', {status: RESPONSE_STATUS_ERROR, msg: `Error accessing local cNode: ${err.response.data.error.message}`})
        })
    }).catch((err) => {
        win.webContents.send('imageRegFormSubmitResponse', {status: RESPONSE_STATUS_ERROR, msg: `Error accessing local cNode: Status code: ${err.response.status}, message: ${err.response.data.error.message}`});
    });
});

ipcMain.on('requestWalletAddress', (event, arg) => {
        return callRpcMethod('getaccountaddress').then((response) => {
            win.webContents.send('walletAddress', response.data.result);
        }).catch((err) => {
            win.webContents.send('walletAddress', 'Cannot connect to local pasteld!');
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
    } else {
        win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
    }
}

app.on('ready', createWindow);
