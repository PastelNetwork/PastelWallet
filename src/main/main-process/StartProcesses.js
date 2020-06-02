import * as path from 'path';
import * as log from 'electron-log';
import { addMessageToBox, getCnodeDir, getWorkDir } from '../main';
import callRpcMethod from './utils';
import { GETINFO_COMMAND } from '../constants';
import * as fs from 'fs';
import { app } from "electron";

let pyProc = null;
let pastelProc = null;
let pyPort = 5000;

const PY_DIST_FOLDER = 'src';
const PY_FOLDER = 'StoVaCore';
const PY_MODULE = 'wallet_api'; // without .py suffix

const PASTEL_CONF_DATA = `
testnet=1
server=1
addnode=51.15.79.175
addnode=51.158.176.36
addnode=51.158.188.130
addnode=51.15.83.99
addnode=51.158.167.70
addnode=51.158.183.93
addnode=51.15.109.152
addnode=51.15.94.215
addnode=51.15.116.190
addnode=51.15.38.6
rpcuser=rt
rpcpassword=rt
rpcallowip=0.0.0.0/0
`;

const getScriptPath = () => {
  if (process.defaultApp) {
    return path.join(process.cwd(), PY_DIST_FOLDER, PY_FOLDER, PY_MODULE + '.py');
  }
  if (process.platform === 'win32') {
    return path.join(process.resourcesPath, PY_DIST_FOLDER, PY_FOLDER, 'dist', PY_MODULE + '.exe');
  }
  const scriptPath = path.join(process.resourcesPath, PY_DIST_FOLDER, PY_FOLDER, 'dist', PY_MODULE);
  log.warn(`Script path: ${scriptPath}`);
  return scriptPath;
};

const getPasteldPath = () => {
  if (process.defaultApp) {
    return null;
  }
  let scriptPath;
  switch (process.platform) {
      case 'win32':
        scriptPath = path.join(process.resourcesPath, 'pasteld_binary', 'pasteld' + '.exe');
        break;
      case 'linux':
          scriptPath = path.join(process.resourcesPath, 'pasteld_binary', 'pasteld');
          break;
      case 'darwin':
          scriptPath = path.join(process.resourcesPath, 'pasteld_binary', 'pasteld');
          break;
      default:
          throw new Error(`Not supported platform ${process.platform}`);
  }

  log.warn(`Pasteld path: ${scriptPath}`);
  return scriptPath;
};

export const createPyProc = (pastelid, passphrase) => {
  let script = getScriptPath();
  let port = pyPort;
  if (process.defaultApp) {
    pyProc = require('child_process').execFile('python', [script, getWorkDir(), pastelid, passphrase], (error, stdout, stderr) => {
    });
  } else {
    let appPath;
    switch (process.platform) {
      case 'linux':
        appPath = path.join(process.resourcesPath, '..');
        break;
      default:
        appPath = path.join(process.resourcesPath, '..', '..');
        break;
    }
    pyProc = require('child_process').execFile(script, [getWorkDir(), pastelid, passphrase], (error, stdout, stderr) => {
        log.error(`[wallet_api] Error: ${error}`);
        log.info(`[wallet_api] Stdout: ${stdout}`);
        log.warn(`[wallet_api] Stderr: ${stderr}`);
    });
  }

  pyProc.stdout.on('data', (data) => {
    const msg = `wallet_api stdout: ${data}`;
    log.info(msg);
    addMessageToBox(msg)
  });

  pyProc.stderr.on('data', (data) => {
    const msg = `wallet_api stderr: ${data}`;
    log.warn(msg);
    addMessageToBox(msg);
  });
  if (pyProc != null) {
    const msg = 'wallet_api process is started and listening on port ' + port;
    log.info(msg);
    addMessageToBox(msg);
  } else {
    const msg = 'Wallet api proccess failed to start';
    log.warn(msg);
    addMessageToBox(msg);
  }
};

const checkPastelConf = () => {
  const pastelConfPath = path.join(getCnodeDir(), 'pastel.conf');
  try {
    fs.accessSync(pastelConfPath);
  } catch (e) {
    fs.writeFile(pastelConfPath, PASTEL_CONF_DATA, () => null);
  }
};
export const checkAndRunPastelD = () => {
  // very first - check if pastel.conf exists, create one
  checkPastelConf();
  // first check if pastelD is already running. If not - start it.
  callRpcMethod(GETINFO_COMMAND).then((response) => {
    // cNode is running, don't need to do anything
    log.info('PastelD is already running');
  }).catch((err) => {
    // start cNode
    const pastelPath = getPasteldPath();
    log.warn(`PastelD path detected: ${pastelPath}`);
    if (!process.defaultApp) {
      pastelProc = require('child_process').execFile(pastelPath, [], (error, stdout, stderr) => {
        log.error(`[pasteld] Error: ${error}`);
        log.info(`[pasteld] Stdout: ${stdout}`);
        log.warn(`[pasteld] Stderr: ${stderr}`);
        addMessageToBox(`[pasteld] Error: ${error}`);
        addMessageToBox(`[pasteld] Stdout: ${stdout}`);
        addMessageToBox(`[pasteld] Stderr: ${stderr}`);
      });
    }

    if (pastelProc != null) {
      log.info('PastelD is running');
    } else {
      log.warn('PastelD process failed to start');
    }
  });
};

export const killPyProcess = () => {
  if (pyProc) {
    pyProc.kill();
  }
  pyProc = null;
};

export const cleanUp = () => {
  killPyProcess();
  if (pastelProc) {
    pastelProc.kill();
  }
  pastelProc = null;
};
