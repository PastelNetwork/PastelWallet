import { ipcRenderer } from './ipc';
import * as constants from "../constants";
// import {store} from "../app";
// import {resetImageRegFormErrors, setImageRegFormError, setImageRegFormRegFee, setImageRegFormState} from "../actions";

ipcRenderer.on('sellArtworkResponse', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      console.log('Sell ticket creation error from IPC');
      break;
    case constants.RESPONSE_STATUS_OK:
      console.log(`Sell ticket creation ok, txid: ${data.txid}`);
      break;
    default:
      break;
  }
});
