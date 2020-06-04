import {ipcMain} from 'electron';
import stringify from 'json-stable-stringify';
import {createPyProc} from "./StartProcesses";
import {
    PASTELID_REG_STATUS_IN_PROGRESS,
    PASTELID_REG_STATUS_NON_REGISTERED,
    PASTELID_REG_STATUS_REGISTERED
} from '../constants';
import { getDatabase, SELECT_PASTELID_SQL } from './database';

const callRpcMethod = require('./utils');
const constants = require('../constants');

const PASTEL_ID_COMMAND = 'pastelid';
const TICKETS_COMMAND = 'tickets';

const getPastelIdsRegistrationInProgress = (fn) => {
  getDatabase().all(SELECT_PASTELID_SQL, [], (e, r) => {
    const pastelIdInProgress = r.map(i => i.pastelid);
    fn(pastelIdInProgress);
  });
};

ipcMain.on('pastelIdList', (event, arg) => {
    callRpcMethod(PASTEL_ID_COMMAND, ['list']).then((response) => {
        const pastelIdList = response.data.result;
        callRpcMethod(TICKETS_COMMAND, ['list', 'id']).then(response => {
            getPastelIdsRegistrationInProgress(pastelIdInProgress => {
                const getPastelIdRegStatus = (pastelID) => {
                    if (registeredPastelIDs.includes(pastelID)) {
                        if (pastelID === 'jXXkRCqifwY8SmwV3Dd5H4LRVKiZLStn1VGeWTqDk4DMHK5EraYKCZwikJaddJbkidRoAy1G3jywtbxc1CFy5p')                          {
                            return PASTELID_REG_STATUS_IN_PROGRESS;
                        }
                        return PASTELID_REG_STATUS_REGISTERED;
                    } else if (pastelIdInProgress.includes(pastelID)) {
                        return PASTELID_REG_STATUS_IN_PROGRESS;
                    } else {
                        return PASTELID_REG_STATUS_NON_REGISTERED;
                    }
                };
                const registeredPastelIDs = response.data.result;
                const data = pastelIdList.map(key => ({
                    PastelID: key.PastelID,
                    regStatus: getPastelIdRegStatus(key.PastelID)
                }));
                event.reply('pastelIdListResponse', {
                    status: constants.RESPONSE_STATUS_OK,
                    data
                });
            });
        }).catch(err => {
            event.sender.send('pastelIdListResponse', {
                status: constants.RESPONSE_STATUS_ERROR,
                err: err.response.data.error
            });
        });

    }).catch((err) => {
        event.sender.send('pastelIdListResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdCreate', (event, arg) => {
    const passphrase = arg.passphrase;
    callRpcMethod(PASTEL_ID_COMMAND, ['newkey', passphrase]).then((response) => {
        event.sender.send('pastelIdCreateResponse', {
            status: constants.RESPONSE_STATUS_OK,
            data: response.data.result
        });
    }).catch((err) => {
        event.sender.send('pastelIdCreateResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdCreateAndRegister', (event, arg) => {
    const passphrase = arg.passphrase;
    const blockchainAddress = arg.blockchainAddress;

    callRpcMethod(PASTEL_ID_COMMAND, ['newkey', passphrase]).then((response) => {
        const pastelId = response.data.result.pastelid;
        callRpcMethod(TICKETS_COMMAND, ['register', 'id', pastelId, passphrase, blockchainAddress]).then((resp) => {
            // create database record with pastelID registered
            getDatabase().run(`INSERT INTO pastelid values ('${pastelId}');`, [], (e) => {
                event.sender.send('pastelIdCreateResponse', {
                    status: constants.RESPONSE_STATUS_OK
                });
            });
        }).catch((err) => {
            event.sender.send('pastelIdCreateResponse', {
                status: constants.RESPONSE_STATUS_ERROR,
                err: err.response.data.error
            });
        });
    }).catch((err) => {
        event.sender.send('pastelIdCreateResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdRegister', (event, arg) => {
    callRpcMethod(TICKETS_COMMAND,
        [
            'register', 'id', arg.pastelID, arg.passphrase, arg.blockchainAddress
        ]).then((resp) => {
        event.sender.send('pastelIdRegisterResponse', {
            status: constants.RESPONSE_STATUS_OK
        });
    }).catch((err) => {
        event.sender.send('pastelIdRegisterResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdImport', (event, arg) => {
    const passphrase = arg.passphrase;
    const key = arg.key;
    callRpcMethod(PASTEL_ID_COMMAND, ['importkey', key, passphrase]).then((response) => {
        event.sender.send('pastelIdImportResponse', {
            status: constants.RESPONSE_STATUS_OK,
            data: response.data.result
        });
    }).catch((err) => {
        event.sender.send('pastelIdImportResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdImportAndRegister', (event, arg) => {
    const passphrase = arg.passphrase;
    const key = arg.key;
    const blockchainAddress = arg.blockchainAddress;
    callRpcMethod(PASTEL_ID_COMMAND, ['importkey', key, passphrase]).then((response) => {
        const pastelId = response.data.result.pastelid;
        callRpcMethod(TICKETS_COMMAND, ['register', 'id', pastelId, passphrase, blockchainAddress]).then((resp) => {
            event.sender.send('pastelIdCreateResponse', {
                status: constants.RESPONSE_STATUS_OK
            });
        }).catch((err) => {
            event.sender.send('pastelIdCreateResponse', {
                status: constants.RESPONSE_STATUS_ERROR,
                err: err.response.data.error
            });
        });
    }).catch((err) => {
        event.sender.send('pastelIdCreateResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });

});

ipcMain.on('pastelIdCheckPassphrase', (event, arg) => {
    const passphrase = arg.passphrase;
    const pastelID = arg.pastelID;
    callRpcMethod(PASTEL_ID_COMMAND, ['sign', 'sample_text', pastelID, passphrase]).then((response) => {
        event.sender.send('pastelIdCheckPassphraseResponse', {
            status: constants.RESPONSE_STATUS_OK,
            pastelID,
            passphrase
        });
        createPyProc(pastelID, passphrase);
    }).catch((err) => {
        event.sender.send('pastelIdCheckPassphraseResponse', {
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
        delete data.picture_data;
    }
    const text = stringify(data);
    callRpcMethod(PASTEL_ID_COMMAND, ['sign', text, pastelID, passphrase]).then((response) => {
        const signature = response.data.result.signature;
        if (picture_data) {
            data.picture_data = picture_data;
        }
        event.sender.send('signMessageResponse', {
            status: constants.RESPONSE_STATUS_OK,
            signature,
            dataType,
            data
        });
    }).catch((err) => {
        event.sender.send('signMessageResponse', {
            status: constants.RESPONSE_STATUS_ERROR,
            err: err.response.data.error
        });
    });
});

ipcMain.on('aniImport', (event, arg) => {
    const key = arg.key;
    // TODO: run python process with `key` argument, collect its stdout and reply to sender
    // event.sender.send('aniImportResponse', {
    //     status: constants.RESPONSE_STATUS_OK,
    //     data: 'ANI key is imported'
    // });

    event.sender.send('aniImportResponse', {
        status: constants.RESPONSE_STATUS_ERROR,
        err: 'Failed to import ANI key'
    });
});

