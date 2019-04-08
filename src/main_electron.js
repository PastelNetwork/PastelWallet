const path = require('path');
const {app, BrowserWindow, ipcMain } = require('electron');

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

    console.log(arg);
});

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({width: 800, height: 600});

    if (process.defaultApp) {
       win.loadURL('http://localhost:3000/');
       win.webContents.openDevTools();
    } else {
        win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
    }

}

app.on('ready', createWindow);
