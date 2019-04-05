const path = require('path');
const {app, BrowserWindow} = require('electron');

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({width: 800, height: 600});
    // win.webContents.openDevTools();

    //use the following line for local development
    win.loadURL('http://localhost:3000/');

    //use the following line for build
    // win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
}

app.on('ready', createWindow);
