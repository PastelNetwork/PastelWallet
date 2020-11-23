import { ipcRenderer } from './ipc';
import * as constants from "../constants";
import {REMOVE_ARTWORK_FROM_SELL_LOADING} from "../actionTypes";
import {store} from "../app";

ipcRenderer.on('sellArtworkResponse', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      store.dispatch({type: REMOVE_ARTWORK_FROM_SELL_LOADING, image_hash: data.image_hash});
      console.log('Sell ticket creation error from IPC');
      break;
    case constants.RESPONSE_STATUS_OK:
      store.dispatch({type: REMOVE_ARTWORK_FROM_SELL_LOADING, image_hash: data.image_hash});
      console.log(`Sell ticket creation ok, txid: ${data.txid}`);
      break;
    default:
      break;
  }
});
