import {ipcMain} from "electron";
import {RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK} from "../constants";
import log from "electron-log";
import axios from "axios";
import {LOCAL_PY_URL} from "./settings";

const SELL_TICKET_CREATE_RESOURCE = `${LOCAL_PY_URL}create_sell_ticket`;
const BUY_TICKET_CREATE_RESOURCE = `${LOCAL_PY_URL}create_buy_ticket`;

const sellArtworkRequestHandler = (event, data) => {
  const image_hash = data.image_hash;
  delete data.image_hash;
  axios.post(SELL_TICKET_CREATE_RESOURCE, data).then((response) => {
        event.reply('sellArtworkResponse', {
            status: RESPONSE_STATUS_OK,
            txid: response.data.txid,
            image_hash: response.data.image_hash
        });
    }).catch((e) => {
        event.reply('sellArtworkResponse', {
            status: RESPONSE_STATUS_ERROR,
            image_hash: image_hash,
            error: e.response.data
        });
    })
};

const buyArtworkHandler = (event, data) => {
    axios.post(BUY_TICKET_CREATE_RESOURCE, data.data).then((response) => {
        event.reply('buyArtworkResponse', {
            status: RESPONSE_STATUS_OK,
            txid: response.data.txid,
            act_txid: data.act_txid
        });
    }).catch((e) => {
        event.reply('buyArtworkResponse', {
            status: RESPONSE_STATUS_ERROR,
            error: e.response.data,
            act_txid: data.act_txid
        });
    })
};

ipcMain.on('sellArtworkRequest', sellArtworkRequestHandler);
ipcMain.on('buyArtworkRequest', buyArtworkHandler);
