import * as constants from '../constants';
import { store } from '../app';
import { setCurrentPassphrase, setCurrentPasteID, setPasteIDError, setPasteIDList } from '../actions';
import history from '../history';
import { PASTELID_REG_STATUS_REGISTERED } from '../constants';
import {ipcRenderer} from './ipc';


ipcRenderer.on('pastelIdListResponse', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      store.dispatch(setPasteIDError(data.err));
      break;
    case constants.RESPONSE_STATUS_OK:
      const pastelIdList = data.data;
      store.dispatch(setPasteIDList(pastelIdList));
      break;
    default:
      break;
  }
});

ipcRenderer.on('pastelIdCreateResponse', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      store.dispatch(setPasteIDError(data.err));
      history.push('/pastel_id/error');
      break;
    case constants.RESPONSE_STATUS_OK:
      history.push('/pastel_id/fetching');
      break;
    default:
      break;
  }
});

ipcRenderer.on('pastelIdImportResponse', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      store.dispatch(setPasteIDError(data.err));
      history.push('/pastel_id/error');
      break;
    case constants.RESPONSE_STATUS_OK:
      history.push('/pastel_id/fetching');
      break;
    default:
      break;
  }

});

ipcRenderer.on('pastelIdRegisterResponse', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      store.dispatch(setPasteIDError(data.err));
      history.push('/pastel_id/error');
      break;
    case constants.RESPONSE_STATUS_OK:
      history.push('/pastel_id/fetching');
      break;
    default:
      break;
  }

});

ipcRenderer.on('pastelIdCheckPassphraseResponse', (event, data) => {
  switch (data.status) {
    case constants.RESPONSE_STATUS_ERROR:
      store.dispatch(setPasteIDError(data.err));
      break;
    case constants.RESPONSE_STATUS_OK:
      // At this point we start wallet_api python proccess from main_electron with given pastelID and passphrase
      store.dispatch(setCurrentPasteID(data.pastelID));
      store.dispatch(setCurrentPassphrase(data.passphrase));
      history.push('/main');
      break;
    default:
      break;
  }
});