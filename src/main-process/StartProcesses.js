import * as path from "path";
import * as log from "electron-log";
import {addMessageToBox} from '../main';
import callRpcMethod from "./utils";
import {GETINFO_COMMAND} from "../constants";
import * as constants from "../constants";

let pyProc = null;
let pastelProc = null;
let pyPort = 5000;

const PY_DIST_FOLDER = 'src';
const PY_FOLDER = 'StoVaCore';
const PY_MODULE = 'wallet_api'; // without .py suffix


const getScriptPath = () => {
    if (process.defaultApp) {
        return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py');
    }
    if (process.platform === 'win32') {
        return path.join(process.resourcesPath, PY_DIST_FOLDER, PY_FOLDER, 'dist', PY_MODULE + '.exe')
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
    if (process.platform === 'win32') {
        scriptPath = path.join(process.resourcesPath, 'pasteld_binary', 'pasteld' + '.exe')
    } else {
        scriptPath = path.join(process.resourcesPath, 'pasteld_binary', 'pasteld');
    }

    log.warn(`Pasteld path: ${scriptPath}`);
    return scriptPath;
};


export const createPyProc = (pastelid, passphrase) => {
    let script = getScriptPath();
    let port = pyPort;
    if (process.defaultApp) {
        pyProc = require('child_process').execFile('python', [script, process.cwd(), pastelid, passphrase], (error, stdout, stderr) => {
        });
    } else {
        let appPath;
        switch (process.platform) {
            case "linux":
                appPath = path.join(process.resourcesPath, '..');
                break;
            default:
                appPath = path.join(process.resourcesPath, '..', '..');
                break;
        }
        pyProc = require('child_process').execFile(script, [appPath, pastelid, passphrase], (error, stdout, stderr) => {
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

export const checkAndRunPastelD = () => {
    // first check if pastelD is already running. If not - start it.
    callRpcMethod(GETINFO_COMMAND).then((response) => {
        // cNode is running, don't need to do anything
        log.info('PastelD is already running')
    }).catch((err) => {
        // start cNode
        const pastelPath = getPasteldPath();
        if (!process.defaultApp) {
            pastelProc = require('child_process').execFile(pastelPath, [], (error, stdout, stderr) => {
                log.error(`[pasteld] Error: ${error}`);
                log.info(`[pasteld] Stdout: ${stdout}`);
                log.warn(`[pasteld] Stderr: ${stderr}`);
            });
        }

        if (pastelProc != null) {
            log.info('PastelD is running')
        } else {
            log.warn('PastelD process failed to start')
        }
    });
};


export const cleanUp = () => {
    if (pyProc) {
        pyProc.kill();
    }
    if (pastelProc) {
        pastelProc.kill();
    }
    pastelProc = null;
    pyProc = null;
};
