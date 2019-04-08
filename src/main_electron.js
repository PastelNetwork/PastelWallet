const path = require('path');
const {app, BrowserWindow} = require('electron');

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
