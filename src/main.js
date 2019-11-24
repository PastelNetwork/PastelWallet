import * as path from 'path';
import {app, BrowserWindow, ipcMain} from 'electron';
import * as axios from 'axios';
import * as log from 'electron-log';
import * as constants from './constants';
import callRpcMethod from './main-process/utils';
import './main-process/pastelid';
import './main-process/ImageRegistration';
import {LOCAL_PY_URL} from "./main-process/settings";
import {checkAndRunPastelD} from './main-process/StartProcesses';
import {cleanUp} from './main-process/StartProcesses';
import {GETBALANCE_COMMAND} from "./constants";
import {RESPONSE_STATUS_OK} from "./constants";
import {RESPONSE_STATUS_ERROR} from "./constants";
import {SEND_TO_ADDRESS_COMMAND} from "./constants";
import {GET_ACCOUNT_ADDRESS_COMMAND} from "./constants";
import {GETINFO_COMMAND} from "./constants";


const PING_RESOURCE = `${LOCAL_PY_URL}ping`;

/*************************************************************
 * py process
 *************************************************************/

let pyStatusTaskID;
let cNodeStatusTaskID;
let win = null;

// suppress security warning in dev mode - cause we local from webpack dev server on localhost:3000
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

export let addMessageToBox = (msg) => {
    if (win) {
        win.webContents.send('addMessageToBox', {
            msg
        });
    }
};


ipcMain.on('getBalanceRequest', (event, arg) => {
    return callRpcMethod(GETBALANCE_COMMAND).then((response) => {
        const balance = response.data.result;
        win.webContents.send('getBalanceResponse', {
            status: RESPONSE_STATUS_OK,
            balance
        })
    }).catch((err) => {
        win.webContents.send('getBalanceResponse', {
            status: RESPONSE_STATUS_ERROR,
            msg: `Error accessing local cNode: ${err.response.data.error.message}, command: ${GETBALANCE_COMMAND}`
        })
    });
});

ipcMain.on('sendPSLRequest', (event, arg) => {
    log.info(`Send PSL request received to ${arg.address} for ${arg.amount} PSL`);
    return callRpcMethod(SEND_TO_ADDRESS_COMMAND, [arg.address, arg.amount]).then((response) => {
        log.warn('PSL sent ok');
        win.webContents.send('sendPSLResponse', {
            status: RESPONSE_STATUS_OK,
            msg: 'Funds succesfully sent'
        })
    }).catch((err) => {
        log.warn(`PSL sent error: ${err.response.data.error.message}`);
        win.webContents.send('sendPSLResponse', {
            status: RESPONSE_STATUS_ERROR,
            msg: err.response.data.error.message
        })
    });
});

ipcMain.on('blockchainDataRequest', (event, arg) => {
    return callRpcMethod(GET_ACCOUNT_ADDRESS_COMMAND, [""]).then((response) => {
        const bcAddress = response.data.result;
        win.webContents.send('blockchainDataResponse', {
            status: RESPONSE_STATUS_OK,
            address: bcAddress,
        });
    }).catch((err) => {
        win.webContents.send('walletAddress', `Cannot connect to local pasteld!, command: ${GET_ACCOUNT_ADDRESS_COMMAND}`);
    });
});


const updateCnodeStatus = () => {
    callRpcMethod(GETINFO_COMMAND).then((response) => {
        const data = response.data;
        win.webContents.send('updateCNodeStatus', {
            status: constants.CNODE_STATUS_CONNECTED
        });

    }).catch((err) => {
        win.webContents.send('updateCNodeStatus', {
            status: constants.CNODE_STATUS_DISCONNECTED
        });
    })

};

const updatePynodeStatus = () => {
    axios.post(PING_RESOURCE, {}).then(() => {
        win.webContents.send('updatePynodeStatus', {
            status: constants.PYNODE_STATUS_CONNECTED
        });
        clearInterval(pyStatusTaskID);
    }).catch((err) => {
        win.webContents.send('updatePynodeStatus', {
            status: constants.PYNODE_STATUS_DISCONNECTED
        });
        clearInterval(cNodeStatusTaskID);
    });
};

const updateNodeStatusesProccess = () => {
    cNodeStatusTaskID = setInterval(updateCnodeStatus, 3000);
    pyStatusTaskID = setInterval(updatePynodeStatus, 3000);
};


function createWindow() {
    log.silly('Starting main proccess....');
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 400,
        webPreferences: {nodeIntegration: true, webSecurity: false}
    });

    if (process.defaultApp) {
        win.loadURL('http://localhost:3000/');
        win.webContents.openDevTools();
        BrowserWindow.addDevToolsExtension(
            '/Users/alex/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
    } else {
        win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    }
}


app.on('ready', createWindow);
app.on('ready', updateNodeStatusesProccess);
app.on('ready', checkAndRunPastelD);
app.on('will-quit', cleanUp);
