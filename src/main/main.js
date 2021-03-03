import * as path from 'path';
import {app, BrowserWindow, ipcMain} from 'electron';
import * as os from 'os';
import * as axios from 'axios';
import * as log from 'electron-log';
import * as constants from './constants';
import callRpcMethod from './main-process/utils';
import './main-process/pastelid';
import './main-process/ImageRegistration';
import './main-process/artworks';
import './main-process/profile';
import './main-process/trading';
import {LOCAL_PY_URL} from './main-process/settings';
import {checkAndRunPastelD, killPyProcess} from './main-process/StartProcesses';
import {cleanUp} from './main-process/StartProcesses';
import {GETBALANCE_COMMAND} from './constants';
import {RESPONSE_STATUS_OK} from './constants';
import {RESPONSE_STATUS_ERROR} from './constants';
import {SEND_TO_ADDRESS_COMMAND} from './constants';
import {GET_ACCOUNT_ADDRESS_COMMAND} from './constants';
import {GETINFO_COMMAND} from './constants';
import {initDatabase} from './main-process/database';
import * as fs from 'fs';
import {GET_PEER_INFO_COMMAND} from './constants';

const PING_RESOURCE = `${LOCAL_PY_URL}ping`;

/*************************************************************
 * py process
 *************************************************************/

let pyStatusTaskID;
let cNodeStatusTaskID;
let win = null;

// suppress security warning in dev mode - cause we local from webpack dev server on localhost:3000
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

export const getWorkDir = () => {
  // if (process.defaultApp) {
  //   //dev mode
  //   return process.cwd();
  // } else {
  //build mode
  const pastelPath = path.join(app.getPath('home'), '.pastel');
  try {
    fs.accessSync(pastelPath);
  } catch (e) {
    fs.mkdirSync(pastelPath);
  }
  return pastelPath;
  // }
};

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
    });
  }).catch((err) => {
    win.webContents.send('getBalanceResponse', {
      status: RESPONSE_STATUS_ERROR,
      msg: `Error accessing local cNode: ${err.response.data.error.message}, command: ${GETBALANCE_COMMAND}`
    });
  });
});

ipcMain.on('sendPSLRequest', (event, arg) => {
  log.info(`Send PSL request received to ${arg.address} for ${arg.amount} PSL`);
  return callRpcMethod(SEND_TO_ADDRESS_COMMAND, [arg.address, arg.amount]).then((response) => {
    log.warn('PSL sent ok');
    win.webContents.send('sendPSLResponse', {
      status: RESPONSE_STATUS_OK,
      msg: 'Funds succesfully sent'
    });
  }).catch((err) => {
    log.warn(`PSL sent error: ${err.response.data.error.message}`);
    win.webContents.send('sendPSLResponse', {
      status: RESPONSE_STATUS_ERROR,
      msg: err.response.data.error.message
    });
  });
});

ipcMain.on('blockchainDataRequest', (event, arg) => {
  // also request number of masternode and number of artworks
  // masternode list
  const accountAddressCall = callRpcMethod(GET_ACCOUNT_ADDRESS_COMMAND, ['']);
  const masternodeListCall = callRpcMethod('masternode', ['list']);
  const listActTickets = callRpcMethod('tickets', ['list', 'act']);
  axios.all([accountAddressCall, masternodeListCall, listActTickets]).then(axios.spread((...responses) => {
    const addressResponse = responses[0];
    const mnListResponse = responses[1];
    const actTicketResponse = responses[2];
    const bcAddress = addressResponse.data.result;
    const mnQuantity = Object.keys(mnListResponse.data.result).length;
    const artworkAmount = actTicketResponse.data.result ? actTicketResponse.data.result.filter(x => x.length === 64).length : 0;
    event.reply('blockchainDataResponse', {
      status: RESPONSE_STATUS_OK,
      address: bcAddress,
      mnQuantity: mnQuantity,
      artworkAmount: artworkAmount
    });
  })).catch((err) => {
    event.reply('blockchainDataResponse', {
      status: RESPONSE_STATUS_ERROR,
      error: err.stack ? err.stack : String(err)
    });
  });
});

ipcMain.on('getInfoRequest', (event, arg) => {
  return callRpcMethod(GETINFO_COMMAND, []).then((response) => {
    win.webContents.send('getInfoResponse', {
      status: RESPONSE_STATUS_OK,
      data: response.data.result
    });
  }).catch((err) => {
    win.webContents.send('getInfoResponse', {
      status: RESPONSE_STATUS_ERROR,
      msg: err.response.data.error.message
    });
  });
});

ipcMain.on('getPeerInfoRequest', (event, arg) => {
  return callRpcMethod(GET_PEER_INFO_COMMAND, []).then((response) => {
    win.webContents.send('getPeerInfoResponse', {
      status: RESPONSE_STATUS_OK,
      data: response.data.result
    });
  }).catch((err) => {
    win.webContents.send('getPeerInfoResponse', {
      status: RESPONSE_STATUS_ERROR,
      msg: err.response.data.error.message
    });
  });
});

ipcMain.on('logout', () => {
  killPyProcess();
});

const updateCnodeStatus = () => {
  callRpcMethod(GETINFO_COMMAND).then((response) => {
    win.webContents.send('updateCNodeStatus', {
      status: constants.NODE_STATUS_CONNECTED
    });

  }).catch((err) => {
    win.webContents.send('updateCNodeStatus', {
      status: constants.NODE_STATUS_DISCONNECTED
    });
  });

};

const updatePynodeStatus = () => {
  axios.post(PING_RESOURCE, {}).then(() => {
    win.webContents.send('updatePynodeStatus', {
      status: constants.NODE_STATUS_CONNECTED
    });
  }).catch((err) => {
    win.webContents.send('updatePynodeStatus', {
      status: constants.NODE_STATUS_DISCONNECTED
    });
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
    width: 850,
    height: 630,
    resizable: false,
    webPreferences: {nodeIntegration: true, webSecurity: false},
    icon: '/Users/alex/PycharmProjects/spa/src/client/assets/images/favicon.png'
  });

  win.removeMenu();
  app.setName('Pastel');
  if (process.defaultApp) {
    win.loadURL('http://localhost:3000/');
    win.webContents.openDevTools();
    // BrowserWindow.addDevToolsExtension(
    //   '/Users/mac/Library/Application Support/Google/Chrome/Profile 1/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0');
    // BrowserWindow.addDevToolsExtension(
    //   '/Users/mac/Library/Application Support/Google/Chrome/Profile 1/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.10.1_0');
  } else {
    const indexPath = path.join(__dirname, '../index.html');
    win.loadFile(indexPath);
    // win.webContents.openDevTools();
  }
  win.on('closed', () => {
    win = null;
  });
}

export const getCnodeDir = () => {
  //those one which is ~/.pastel in Linux, which store config and pasteld data
  let pastelPrefix;
  switch (os.platform()) {
    case 'win32':
      pastelPrefix = 'AppData/Roaming/Pastel';
      break;
    case 'linux':
      pastelPrefix = '.pastel';
      break;
    case 'darwin':
      pastelPrefix = 'Library/Application Support/Pastel';
      break;
    default:
      throw new Error(`Platform ${os.platform()} is not supported`);
  }
  return path.join(app.getPath('home'), pastelPrefix);
};


const createPastelkeysDir = () => {
  const pastelKeysPath = path.join(getCnodeDir(), 'testnet3', 'pastelkeys');

  try {
    fs.accessSync(pastelKeysPath);
  } catch (e) {
    try {
      fs.mkdirSync(pastelKeysPath);
    } catch (e) {
    }
  }
};

app.on('ready', createWindow);
app.on('ready', updateNodeStatusesProccess);
app.on('ready', createPastelkeysDir);
// app.on('ready', checkAndRunPastelD);
app.on('ready', initDatabase);
app.on('will-quit', cleanUp);
