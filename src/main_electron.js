const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const axios = require('axios');
const fs = require('fs');
const bs58 = require('bs58');
const log = require('electron-log');
const constants = require('./constants');
let stringify = require('json-stable-stringify');

let win = null;

const RESPONSE_STATUS_OK = 'OK';
const RESPONSE_STATUS_ERROR = 'ERROR';
const GETBALANCE_COMMAND = 'getbalance';
const GETINFO_COMMAND = 'getinfo';
const GET_ACCOUNT_ADDRESS_COMMAND = 'getaccountaddress';
const SEND_TO_ADDRESS_COMMAND = 'sendtoaddress';

const PASTEL_ID_COMMAND = 'pastelid';

const LOCAL_PY_URL = 'http://127.0.0.1:5000/';


const IMAGE_REGISTRATION_STEP_2_RESOURCE = `${LOCAL_PY_URL}image_registration_step_2`;
const IMAGE_REGISTRATION_STEP_3_RESOURCE = `${LOCAL_PY_URL}image_registration_step_3`;
const IMAGE_REGISTRATION_CANCEL_RESOURCE = `${LOCAL_PY_URL}image_registration_cancel`;
const PING_RESOURCE = `${LOCAL_PY_URL}ping`;

/*************************************************************
 * py process
 *************************************************************/

const PY_DIST_FOLDER = 'src';
const PY_FOLDER = 'StoVaCore';
const PY_MODULE = 'wallet_api'; // without .py suffix

let pyProc = null;
let pastelProc = null;
let pyPort = 5000;

let pyStatusTaskID;
let cNodeStatusTaskID;

// suppress security warning in dev mode - cause we local from webpack dev server on localhost:3000
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

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


const createPyProc = (pastelid, passphrase) => {
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
        const msg = 'child process success on port ' + port;
        log.info(msg);
        addMessageToBox(msg);
    } else {
        const msg = 'Wallet api proccess failed to start';
        log.warn(msg);
        addMessageToBox(msg);
    }
};

const checkAndRunPastelD = () => {
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
        log.warn('PastelD proccess failed to start')
    }
};


const cleanUp = () => {
    addMessageToBox = (msg) => {
    };
    pyProc.kill();
    if (pastelProc) {
        pastelProc.kill();
    }
    pastelProc = null;
    pyProc = null;
};

let addMessageToBox = (msg) => {
    if (win) {
        win.webContents.send('addMessageToBox', {
            msg
        });
    }
};

const callRpcMethod = (method, params) => {
    // return Promise
    let data = {
        "jsonrpc": "1.0",
        "id": "curltest",
        "method": method
    };
    if (params) {
        data.params = params;
    }
    return axios.post('http://localhost:19932', data, {
        headers: {
            'Content-Type': 'text/plain'
        },
        auth: {
            username: 'rt',
            password: 'rt'
        }
    });
};


// image registration form step 1
ipcMain.on('imageRegFormSubmit', (event, arg) => {
    return callRpcMethod('masternode', ['getnetworkfee']).then((response) => {
        const regFee = response.data.result.networkfee;
        log.info(`Regfee from 'masternode getnetworkfee' is ${regFee}`);
        addMessageToBox(`Regfee from 'masternode getnetworkfee' is ${regFee}`);
        addMessageToBox('Image reg form submitted');
        callRpcMethod(GETBALANCE_COMMAND).then((response) => {
            if (response.data.result >= regFee) {
                win.webContents.send('imageRegFormSubmitResponse', {status: RESPONSE_STATUS_OK, msg: 'OK', regFee})
            } else {
                win.webContents.send('imageRegFormSubmitResponse', {
                    status: RESPONSE_STATUS_ERROR,
                    msg: `Not enough funds to pay fee (need PSL${regFee}`,
                    regFee
                })
            }
        }).catch((err) => {
            win.webContents.send('imageRegFormSubmitResponse', {
                status: RESPONSE_STATUS_ERROR,
                msg: `Error accessing local cNode: ${err.response.data.error.message}, command: ${GETBALANCE_COMMAND}`
            })
        })
    }).catch((err) => {
        win.webContents.send('imageRegFormSubmitResponse', {
            status: RESPONSE_STATUS_ERROR,
            msg: `Error accessing local cNode: Status code: ${err.response.status}, message: ${err.response.data.error.message}, command: 'masternode getnetworkfee'`
        });
    });
});

ipcMain.on('imageRegFormCancel', (event, data) => {
    axios.post(IMAGE_REGISTRATION_CANCEL_RESOURCE, {regticket_id: data.regticketId}).then((response) => {
        win.webContents.send('imageRegFormCancelResponse', {
            status: RESPONSE_STATUS_OK
        });
    }).catch(() => {
        win.webContents.send('imageRegFormCancelResponse', {
            status: RESPONSE_STATUS_ERROR
        });
    })
});


// image registration form step 2
ipcMain.on('imageRegFormProceed', (event, data) => {
    axios.post(IMAGE_REGISTRATION_STEP_2_RESOURCE, {image: data.filePath, title: data.name}).then((response) => {
        const fee = response.data.fee;
        const regticket_id = response.data.regticket_id;
        callRpcMethod(GETBALANCE_COMMAND).then((response) => {
            if (response.data.result >= fee) {
                win.webContents.send('imageRegFormProceedResponse', {
                    status: RESPONSE_STATUS_OK,
                    fee,
                    regticket_id
                });
            } else {
                win.webContents.send('imageRegFormProceedResponse', {
                    status: RESPONSE_STATUS_ERROR,
                    msg: `Not enough funds to pay fee (need PSL${fee})`,
                    fee
                })
            }
        }).catch((err) => {
            win.webContents.send('imageRegFormProceedResponse', {
                status: RESPONSE_STATUS_ERROR,
                msg: `Error accessing local cNode: ${err.response.data.error.message}, command: ${GETBALANCE_COMMAND}`
            })
        });

    }).catch((err) => {
        let msg = 'Error obtaining worker fee';
        if (err.response.data) {
            msg = err.response.data.error;
        }

        win.webContents.send('imageRegFormProceedResponse', {
            status: RESPONSE_STATUS_ERROR,
            msg
        });
    });
});

// image registration form step 3
ipcMain.on('imageRegFormStep3', (event, data) => {
    axios.post(IMAGE_REGISTRATION_STEP_3_RESOURCE, {regticket_id: data.regticketId}).then((response) => {
        // const msg = `mn0: ${response.data.mn_data.mn0.status}: ${response.data.mn_data.mn0.msg};
        //              mn1: ${response.data.mn_data.mn1.status}: ${response.data.mn_data.mn1.msg};
        //              mn2: ${response.data.mn_data.mn2.status}: ${response.data.mn_data.mn2.msg}`;
        if (response.data.status === 'SUCCESS') {
            win.webContents.send('imageRegFormStep3Response', {
                status: RESPONSE_STATUS_OK,
                msg: data.msg
            });
            // TODO: create activation ticket with cNode api when cNode will be ready

        } else {
            win.webContents.send('imageRegFormStep3Response', {
                status: RESPONSE_STATUS_ERROR,
                msg: data.msg
            });
        }
    }).catch((err) => {
        log.warn(err);
        win.webContents.send('imageRegFormStep3Response', {
            status: RESPONSE_STATUS_ERROR
        });
    })

});

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
        log.info(`BC data result ${bcAddress}`);
        win.webContents.send('blockchainDataResponse', {
            status: RESPONSE_STATUS_OK,
            address: bcAddress,
        });
    }).catch((err) => {
        win.webContents.send('walletAddress', `Cannot connect to local pasteld!, command: ${GET_ACCOUNT_ADDRESS_COMMAND}`);
    });
});

// TODO: extract to another file
// IPC pastel ID related events
ipcMain.on('pastelIdList', (event, arg) => {
    callRpcMethod(PASTEL_ID_COMMAND, ['list']).then((response) => {
        // FIXME: remove. For testing purposes when cNode API is not 100% implemented
        // non-empty, all are not registered
        const data = response.data.result.map(key => ({PastelID: key.PastelID, isRegistered: true}));
        // const data = response.data.result.map((key, index) => ({
        //     PastelID: key.PastelID,
        //     isRegistered: index % 2 === 1
        // }));
        //
        // non-empty, all are registered
        // const data = response.data.result.map(key => ({PastelID: key.PastelID, isRegistered: true}));
        // empty
        // const data = [];

        // FIXME: uncomment the following line after cNode API will work.
        // const data = response.data.result;
        win.webContents.send('pastelIdListResponse', {
            status: constants.RESPONSE_STATUS_OK,
            data
        });

    }).catch((err) => {
        win.webContents.send('pastelIdListResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdCreate', (event, arg) => {
    const passphrase = arg.passphrase;
    callRpcMethod(PASTEL_ID_COMMAND, ['newkey', passphrase]).then((response) => {
        win.webContents.send('pastelIdCreateResponse', {
            status: constants.RESPONSE_STATUS_OK,
            data: response.data.result
        });
    }).catch((err) => {
        win.webContents.send('pastelIdCreateResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdCreateAndRegister', (event, arg) => {
    const passphrase = arg.passphrase;
    callRpcMethod(PASTEL_ID_COMMAND, ['newkey', passphrase]).then((response) => {
        const pastelId = response.data.result.pastelid;
        callRpcMethod(PASTEL_ID_COMMAND, ['register', pastelId]).then((resp) => {
            win.webContents.send('pastelIdCreateResponse', {
                status: constants.RESPONSE_STATUS_OK
            });
        }).catch((err) => {
            win.webContents.send('pastelIdCreateResponse', {
                status: constants.RESPONSE_STATUS_ERROR,
                err: err.response.data.error
            });
        });
    }).catch((err) => {
        win.webContents.send('pastelIdCreateResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdRegister', (event, arg) => {
    const pastelID = arg.pastelID;
    callRpcMethod(PASTEL_ID_COMMAND, ['register', pastelID]).then((resp) => {
        win.webContents.send('pastelIdRegisterResponse', {
            status: constants.RESPONSE_STATUS_OK
        });
    }).catch((err) => {
        win.webContents.send('pastelIdRegisterResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdImport', (event, arg) => {
    const passphrase = arg.passphrase;
    const key = arg.key;
    callRpcMethod(PASTEL_ID_COMMAND, ['importkey', key, passphrase]).then((response) => {
        win.webContents.send('pastelIdImportResponse', {
            status: constants.RESPONSE_STATUS_OK,
            data: response.data.result
        });
    }).catch((err) => {
        win.webContents.send('pastelIdImportResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdImportAndRegister', (event, arg) => {
    const passphrase = arg.passphrase;
    const key = arg.key;
    callRpcMethod(PASTEL_ID_COMMAND, ['importkey', key, passphrase]).then((response) => {
        const pastelId = response.data.result.pastelid;
        callRpcMethod(PASTEL_ID_COMMAND, ['register', pastelId]).then((resp) => {
            win.webContents.send('pastelIdCreateResponse', {
                status: constants.RESPONSE_STATUS_OK
            });
        }).catch((err) => {
            win.webContents.send('pastelIdCreateResponse', {
                status: constants.RESPONSE_STATUS_ERROR,
                err: err.response.data.error
            });
        });
    }).catch((err) => {
        win.webContents.send('pastelIdCreateResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdCheckPassphrase', (event, arg) => {
    const passphrase = arg.passphrase;
    const pastelID = arg.pastelID;
    callRpcMethod(PASTEL_ID_COMMAND, ['sign', 'sample_text', pastelID, passphrase]).then((response) => {
        win.webContents.send('pastelIdCheckPassphraseResponse', {
            status: constants.RESPONSE_STATUS_OK,
            pastelID,
            passphrase
        });
        // TODO: start python proccess
        createPyProc(pastelID, passphrase);
    }).catch((err) => {
        win.webContents.send('pastelIdCheckPassphraseResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('signMessage', (event, arg) => {
    const {data, pastelID, passphrase, dataType} = arg;
    let picture_data = null;
    if (data.picture_data) {
        picture_data = data.picture_data;
        delete data.picture_data
    }
    const text = stringify(data);
    callRpcMethod(PASTEL_ID_COMMAND, ['sign', text, pastelID, passphrase]).then((response) => {
        const signature = response.data.result.signature;
        if (picture_data) {
            data.picture_data = picture_data;
        }
        win.webContents.send('signMessageResponse', {
            status: constants.RESPONSE_STATUS_OK,
            signature,
            dataType,
            data
        });
    }).catch((err) => {
        win.webContents.send('signMessageResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });
});

// END of IPC pastel ID related events


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
