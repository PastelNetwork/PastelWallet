import { ipcRenderer } from './ipc';
import * as constants from "../constants";
import {REMOVE_ARTWORK_FROM_SELL_LOADING, SET_ARTWORKS_ERRORS, SET_ARTWORKS_MESSAGES, SET_TICKET_ERROR, SET_TICKET_MSG} from "../actionTypes";
import {store} from "../app";

ipcRenderer.on('sellArtworkResponse', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      setTimeout(() => store.dispatch({type: REMOVE_ARTWORK_FROM_SELL_LOADING, image_hash: data.image_hash}), 3000)
      // store.dispatch({type: REMOVE_ARTWORK_FROM_SELL_LOADING, image_hash: data.image_hash});
      store.dispatch({type: SET_TICKET_ERROR, error: data.error});
      break;
    case constants.RESPONSE_STATUS_OK:
      store.dispatch({type: REMOVE_ARTWORK_FROM_SELL_LOADING, image_hash: data.image_hash});
      store.dispatch({type: SET_TICKET_MSG, message: `Sell ticket created, txid: ${data.txid}`});
      console.log(`Sell ticket creation ok, txid: ${data.txid}`);
      break;
    default:
      break;
  }
});

ipcRenderer.on('buyArtworkResponse', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      setTimeout(() => store.dispatch({type: REMOVE_ARTWORK_FROM_SELL_LOADING, image_hash: data.image_hash}), 3000)
      store.dispatch({type: SET_ARTWORKS_ERRORS, key:data.act_txid, value: data.error.error});
      // store.dispatch({type: SET_TICKET_ERROR, error: data.error});
      break;
    case constants.RESPONSE_STATUS_OK:
      store.dispatch({type: REMOVE_ARTWORK_FROM_SELL_LOADING, image_hash: data.image_hash});
      store.dispatch({type: SET_ARTWORKS_MESSAGES, key:data.act_txid, value: `Buy ticket created, txid: ${data.txid}`});
      console.log(`Buy ticket creation ok, txid: ${data.txid}`);
      break;
    default:
      break;
  }
});
