import * as constants from '../constants';
import { store } from '../app';
import {
  resetImageRegFormErrors,
  setImageRegFormError, setImageRegFormMsg,
  setImageRegFormRegFee,
  setImageRegFormState, setImageRegFormTxid, setImageRegFormTxidActTicket, setImageRegTicketID,
  setImageRegWorkerFee
} from '../actions';
import { ipcRenderer } from './ipc';

ipcRenderer.on('imageRegFormSubmitResponse', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      store.dispatch(setImageRegFormError('all', data.msg));
      store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_ERROR));
      break;
    case constants.RESPONSE_STATUS_OK:
      store.dispatch(resetImageRegFormErrors());
      store.dispatch(setImageRegFormRegFee(data.regFee));
      store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_PREL_FEE_RECEIVED));
      break;
    default:
      break;
  }
});

ipcRenderer.on('imageRegFormProceedResponse', (event, data) => {
  console.log('imageRegFormProceedResponse RECEIVED');
  console.log(data);
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      store.dispatch(setImageRegFormError('all', data.msg));
      store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_ERROR));
      break;
    case constants.RESPONSE_STATUS_OK:
      store.dispatch(resetImageRegFormErrors());
      store.dispatch(setImageRegWorkerFee(data.fee));
      store.dispatch(setImageRegTicketID(data.regticket_id));
      store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_WORKER_FEE_RECEIVED));
      break;
    default:
      break;
  }
});

ipcRenderer.on('imageRegFormStep3Response', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      console.log(data);
      store.dispatch(setImageRegFormError('all', data.msg));
      store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_ERROR));
      break;
    case constants.RESPONSE_STATUS_PENDING:
      store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_MN_2_3_RESPONSE_RECEIVED));
      store.dispatch(setImageRegFormMsg(data.msg));
      break;
    case constants.RESPONSE_STATUS_OK:
      store.dispatch(resetImageRegFormErrors());
      store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_MN_2_3_RESPONSE_RECEIVED));
      const message = `Registration ticket has been written to the blockchain.
                        TXID: ${data.txid}.
                        Waiting for activation ticket...`;
      store.dispatch(setImageRegFormMsg(message));
      store.dispatch(setImageRegFormTxid(data.txid));
      break;
    default:
      break;
  }
});

ipcRenderer.on('imageRegFormActTicketCreated', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      console.log(data);
      store.dispatch(setImageRegFormError('all', data.msg));
      store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_ERROR));
      break;
    case constants.RESPONSE_STATUS_OK:
      store.dispatch(resetImageRegFormErrors());
      store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_ACT_TICKET_RECEIVED));
      const message = `Activation ticket was created
                          TXID: ${data.txid}
                          Artwork will appear in the network when current block will be mined.`;
      store.dispatch(setImageRegFormMsg(message));
      store.dispatch(setImageRegFormTxidActTicket(data.txid));
      break;
    default:
      break;
  }
});
