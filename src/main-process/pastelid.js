const {ipcMain} = require('electron');
let stringify = require('json-stable-stringify');
const callRpcMethod = require('./utils');
const log = require('electron-log');
const constants = require('../constants');

const PASTEL_ID_COMMAND = 'pastelid';

ipcMain.on('pastelIdList', (event, arg) => {
    callRpcMethod(PASTEL_ID_COMMAND, ['list']).then((response) => {
        // FIXME: remove. For testing purposes when cNode API is not 100% implemented
        // non-empty, all are not registered
        // eval('debugger;');
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
        event.reply('pastelIdListResponse', {
            status: constants.RESPONSE_STATUS_OK,
            data
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
    callRpcMethod(PASTEL_ID_COMMAND, ['newkey', passphrase]).then((response) => {
        const pastelId = response.data.result.pastelid;
        callRpcMethod(PASTEL_ID_COMMAND, ['register', pastelId]).then((resp) => {
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

ipcMain.on('pastelIdRegister', (event, arg) => {
    const pastelID = arg.pastelID;
    callRpcMethod(PASTEL_ID_COMMAND, ['register', pastelID]).then((resp) => {
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
    callRpcMethod(PASTEL_ID_COMMAND, ['importkey', key, passphrase]).then((response) => {
        const pastelId = response.data.result.pastelid;
        callRpcMethod(PASTEL_ID_COMMAND, ['register', pastelId]).then((resp) => {
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
        // TODO: start python proccess
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
