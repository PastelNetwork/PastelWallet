const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const axios = require('axios');
const fs = require('fs');
let win = null;

const MASTERNODE_REGFEE_COMMAND = "masternode regfee";

ipcMain.on('imageRegFormSubmit', (event, arg) => {
    const stats = fs.statSync(arg.filePath);
    const fileSizeInBytes = stats.size;
    console.log(`File size is ${fileSizeInBytes} bytes`);
    return axios.post('http://localhost:9932', {
        "jsonrpc": "1.0",
        "id": "curltest",
        "method": MASTERNODE_REGFEE_COMMAND,  // it is not implemented yet
        "params": [""]
    }, {
        headers: {
            'Content-Type': 'text/plain'
        },
        auth: {
            username: 'rpcuser',
            password: 'rpcpassword'
        }
    }).then((response) => {
        win.webContents.send('regFee', response.data.result);
    }).catch((err) => {
        win.webContents.send('regFee', `Error accessing local cNode: Status code: ${err.response.status}, message: ${err.response.data.error.message}`);
    });

});

ipcMain.on('requestWalletAddress', (event, arg) => {
        return axios.post('http://localhost:9932', {
            "jsonrpc": "1.0",
            "id": "curltest",
            "method": "getaccountaddress",
            "params": [""]
        }, {
            headers: {
                'Content-Type': 'text/plain'
            },
            auth: {
                username: 'rpcuser',
                password: 'rpcpassword'
            }
        }).then((response) => {
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
