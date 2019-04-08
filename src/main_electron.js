const path = require('path');
const {app, BrowserWindow} = require('electron');

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({width: 800, height: 600});
    // win.webContents.openDevTools();

    if (process.defaultApp) {
       win.loadURL('http://localhost:3000/');
    } else {
        win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
    }

}

app.on('ready', createWindow);
