import { ipcMain } from 'electron';
import axios from 'axios';
import log from 'electron-log';
import { LOCAL_PY_URL } from './settings';
import { RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK } from '../constants';

const ARTWORKS_DATA_REQUEST_RESOURCE = `${LOCAL_PY_URL}artworks_data`;

const artworksDataRequestHandler = (event, data) => {
  axios.get(ARTWORKS_DATA_REQUEST_RESOURCE).then((response) => {
    // response.data
      event.reply('artworksDataResponse', {
        status: RESPONSE_STATUS_OK,
        data: response.data
      });
  }).catch((err) => {
    log.warn(err);
    event.reply('artworksDataResponse', {
      status: RESPONSE_STATUS_ERROR,
      msg: JSON.stringify(err.response.data.error)
    });
  });
};

ipcMain.on('artworksDataRequest', artworksDataRequestHandler);
