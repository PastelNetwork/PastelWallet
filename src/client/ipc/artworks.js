import { RESPONSE_STATUS_OK } from '../constants';
import { store } from '../app';
import { SET_ARTWORKS_DATA, SET_ARTWORKS_DATA_LOADING } from '../actionTypes';
import {ipcRenderer} from './ipc';

ipcRenderer.on('artworksDataResponse', (event, data) => {
  if (data.status === RESPONSE_STATUS_OK) {
    console.log(data);
    store.dispatch({ type: SET_ARTWORKS_DATA, value: data.data });
    store.dispatch({ type: SET_ARTWORKS_DATA_LOADING, value: false });
  } else {
    console.log('Error requesting artworks data');
  }
});
