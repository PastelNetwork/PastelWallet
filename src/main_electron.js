const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');


ipcMain.on('imageRegFormSubmit', (event, arg) => {
    // TODO: arg =
    //     this.state = {
    //         file: null,
    //         artName: '',
    //         numCopies: 0,
    //         copyPrice: 0,
    //         publicKey: '',
    //         privateKey: '',
    //         filePath: ''
    //     }
    // TODO: get image file size
    // TODO: request pastelD fee based on file size.
    // TODO: for this - make request to local cNode
    console.log(arg);
});

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({width: 800, height: 600});
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
    // console.log(__dirname);
    // const pubKeyPath = `${path.join(__dirname, 'keys/bc_public.key')}`;
    // const privKeyPath = `${path.join(__dirname, 'keys/bc_private.key')}`;
    //
    // if (!fs.existsSync(path.join(__dirname, 'keys'))) {
    //     fs.mkdirSync(path.join(__dirname, 'keys'));
    // }
    //
    // if (fs.existsSync(pubKeyPath)) {
    //     console.log('Pub key path exists')
    // } else {
    //     console.log('Pub key path DOES NOT exists')
    // }
    // if (fs.existsSync(privKeyPath)) {
    //     console.log('Priv key path exists')
    // } else {
    //     console.log('Priv key path DOES NOT exists')
    // }
    // const keyPair = bitcoin.ECPair.makeRandom();
    // const publicKey = keyPair.publicKey;
    // const privateKey = keyPair.privateKey;
    // let wstream = fs.createWriteStream(pubKeyPath);
    // wstream.write(publicKey);
    // wstream.end();
    // wstream = fs.createWriteStream(privKeyPath);
    // wstream.write(privateKey);
    // wstream.end();

    // TODO: check blockchain keys, if not exists - generate
    // TODO: __dirname/keys/(bc_public.key || bc_private.key)

}

app.on('ready', createWindow);
