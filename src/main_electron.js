const path = require('path');
const {app, BrowserWindow} = require('electron');

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600});
    win.webContents.openDevTools();
    // win.loadFile('src/index.html');
    // win.loadURL('http://localhost:3000/');
    win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
}

app.on('ready', createWindow);
