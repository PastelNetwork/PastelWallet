import {ipcMain} from 'electron';
import axios from 'axios';
import callRpcMethod from './utils';
import {LOCAL_PY_URL} from "./settings";
import log from 'electron-log';
import {addMessageToBox} from "../main";
import {GETBALANCE_COMMAND, RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK} from "../constants";

const IMAGE_REGISTRATION_STEP_2_RESOURCE = `${LOCAL_PY_URL}image_registration_step_2`;
const IMAGE_REGISTRATION_STEP_3_RESOURCE = `${LOCAL_PY_URL}image_registration_step_3`;
const IMAGE_REGISTRATION_CANCEL_RESOURCE = `${LOCAL_PY_URL}image_registration_cancel`;


// image registration form step 1
ipcMain.on('imageRegFormSubmit', (event, arg) => {
    return callRpcMethod('storagefee', ['getnetworkfee']).then((response) => {
        const regFee = response.data.result.networkfee;
        addMessageToBox(`Regfee from 'storagefee getnetworkfee' is ${regFee}`);
        addMessageToBox('Image reg form submitted');
        callRpcMethod(GETBALANCE_COMMAND).then((response) => {
            if (response.data.result >= regFee) {
                event.reply('imageRegFormSubmitResponse', {status: RESPONSE_STATUS_OK, msg: 'OK', regFee})
            } else {
                event.reply('imageRegFormSubmitResponse', {
                    status: RESPONSE_STATUS_ERROR,
                    msg: `Not enough funds to pay fee (need PSL${regFee}`,
                    regFee
                })
            }
        }).catch((err) => {
            event.reply('imageRegFormSubmitResponse', {
                status: RESPONSE_STATUS_ERROR,
                msg: `Error accessing local cNode: ${err.response.data.error.message}, command: ${GETBALANCE_COMMAND}`
            })
        })
    }).catch((err) => {
        event.reply('imageRegFormSubmitResponse', {
            status: RESPONSE_STATUS_ERROR,
            msg: `Error accessing local cNode: Status code: ${err.response.status}, message: ${err.response.data.error.message}, command: 'storagefee getnetworkfee'`
        });
    });
});

ipcMain.on('imageRegFormCancel', (event, data) => {
    axios.post(IMAGE_REGISTRATION_CANCEL_RESOURCE, {regticket_id: data.regticketId}).then((response) => {
        event.reply('imageRegFormCancelResponse', {
            status: RESPONSE_STATUS_OK
        });
    }).catch(() => {
        event.reply('imageRegFormCancelResponse', {
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
                event.reply('imageRegFormProceedResponse', {
                    status: RESPONSE_STATUS_OK,
                    fee,
                    regticket_id
                });
            } else {
                event.reply('imageRegFormProceedResponse', {
                    status: RESPONSE_STATUS_ERROR,
                    msg: `Not enough funds to pay fee (need PSL${fee})`,
                    fee
                })
            }
        }).catch((err) => {
            event.reply('imageRegFormProceedResponse', {
                status: RESPONSE_STATUS_ERROR,
                msg: `Error accessing local cNode: ${err.response.data.error.message}, command: ${GETBALANCE_COMMAND}`
            })
        });

    }).catch((err) => {
        let msg = 'Error obtaining worker fee';
        if (err.response.data) {
            msg = err.response.data.error;
        }

        event.reply('imageRegFormProceedResponse', {
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
            event.reply('imageRegFormStep3Response', {
                status: RESPONSE_STATUS_OK,
                txid: response.data.txid
            });
            const regticketTXID = response.data.txid;
            callRpcMethod('getblockcount', resp => {
                const currentHeight = resp.data.result;
                const fee = 100;
                // TODO: get height from regticket, get fee from regticket as well.
                callRpcMethod('tickets', ['register', 'conf', fee, regticketTXID, currentHeight]).then(response => {
                    log.error(response.data);
                })
            });


        } else {
            event.reply('imageRegFormStep3Response', {
                status: RESPONSE_STATUS_ERROR,
                msg: data.msg
            });
        }
    }).catch((err) => {
        log.warn(err);
        event.reply('imageRegFormStep3Response', {
            status: RESPONSE_STATUS_ERROR
        });
    })

});
