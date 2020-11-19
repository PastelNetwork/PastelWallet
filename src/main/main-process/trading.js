import {ipcMain} from "electron";
import {RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK} from "../constants";
import log from "electron-log";
import axios from "axios";
import {LOCAL_PY_URL} from "./settings";

const SELL_TICKET_CREATE_RESOURCE = `${LOCAL_PY_URL}create_sell_ticket`;

const sellArtworkRequestHandler = (event, data) => {
  axios.post(SELL_TICKET_CREATE_RESOURCE, data).then((response) => {
        event.reply('sellArtworkResponse', {
            status: RESPONSE_STATUS_OK,
            txid: response.data.result.txid
        });
    }).catch(() => {
        event.reply('sellArtworkResponse', {
            status: RESPONSE_STATUS_ERROR
        });
    })
};

ipcMain.on('sellArtworkRequest', sellArtworkRequestHandler);
