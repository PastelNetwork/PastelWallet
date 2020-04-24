import {ipcMain} from 'electron';
import axios from 'axios';
import callRpcMethod from './utils';
import {LOCAL_PY_URL} from "./settings";
import log from 'electron-log';
import {addMessageToBox} from "../main";
import {GETBALANCE_COMMAND, RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK, RESPONSE_STATUS_PENDING} from "../constants";

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
    const pyApiData = {
        image: data.filePath,
        artwork_title: data.name,
        total_copies: data.numCopies,
        copy_price: data.copyPrice,
        artist_name: data.artistName,
        artist_website: data.artistWebsite,
        artist_written_statement: data.artistWrittenStatement,
        artwork_series_name: data.artworkSeriesName,
        artwork_creation_video_youtube_url: data.artworkCreationVideoYoutubeUrl,
        artwork_keyword_set: data.artworkKeywordSet
    };
    axios.post(IMAGE_REGISTRATION_STEP_2_RESOURCE, pyApiData).then((response) => {
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

const createActivationTicket = (event, params) => {
    callRpcMethod('tickets', params).then(response => {
        event.reply('imageRegFormActTicketCreated', {
            status: RESPONSE_STATUS_OK,
            txid: response.data.result.txid
        });
    }).catch(err => {
        // error will be returned if regticket is not read by cNode yet. Need to wait and retry until success
        log.error('setting interval for create actticket');
        setTimeout(() => createActivationTicket(event, params), 10000);
        event.reply('imageRegFormStep3Response', {
            status: RESPONSE_STATUS_PENDING,
            msg: `Error received from cNode: ${err.response.data.error.message}. Will retry in 10 seconds..`
        });
    });
};

const imageRegistrationStep3Handler = (event, data) => {
    axios.post(IMAGE_REGISTRATION_STEP_3_RESOURCE, {regticket_id: data.regticketId}).then((response) => {
        if (response.data.status === 'SUCCESS') {
            const actTicketParams = [response.data.txid, response.data.blocknum, response.data.fee, response.data.pastel_id, response.data.passphrase];
            event.reply('imageRegFormStep3Response', {
                status: RESPONSE_STATUS_OK,
                txid: response.data.txid
            });
            createActivationTicket(event, ['register', 'act', ...actTicketParams]);
        } else {
            event.reply('imageRegFormStep3Response', {
                status: RESPONSE_STATUS_ERROR,
                msg: JSON.stringify(response.data.msg)
            });
        }
    }).catch((err) => {
        log.warn(err);
        event.reply('imageRegFormStep3Response', {
            status: RESPONSE_STATUS_ERROR,
            msg: JSON.stringify(err.response.data.error)
        });
    })
};

// image registration form step 3
ipcMain.on('imageRegFormStep3', imageRegistrationStep3Handler);
