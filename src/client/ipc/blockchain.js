import { RESPONSE_STATUS_OK } from '../constants';
import { store } from '../app';
import {
    SET_ARTWORK_QUANTITY,
    SET_MASTERNODE_QUANTITY,
    SET_BLOCKCHAIN_INFO,
    SET_PSL_SEND_ERROR,
    SET_CNODE_STATUS, SET_PYNODE_STATUS, SET_BLOCKCHAIN_ADDRESS, ADD_MESSAGE, SET_PEER_INFO
} from '../actionTypes';
import { getBalance, setBalance } from '../actions';
import {ipcRenderer} from './ipc';

ipcRenderer.on('blockchainDataResponse', (event, data) => {
    if (data.status === RESPONSE_STATUS_OK) {
        console.log(data);
        store.dispatch({type: SET_MASTERNODE_QUANTITY, value: data.mnQuantity});
        store.dispatch({type: SET_ARTWORK_QUANTITY, value: data.artworkAmount});
        store.dispatch({type: SET_BLOCKCHAIN_ADDRESS, value: data.address});
    } else {
        // if error - try until service will start
        setTimeout(() => {
            ipcRenderer.send('blockchainDataRequest', {})
        }, 500);
    }
});

ipcRenderer.on('getBalanceResponse', (event, data) => {
    if (data.status === RESPONSE_STATUS_OK) {
        store.dispatch(setBalance(data.balance));
    } else {
        // if error - try until service will start
        setTimeout(() => {
            ipcRenderer.send('getBalanceResponse', {})
        }, 1000);
    }
});

ipcRenderer.on('getInfoResponse', (event, data) => {
    if (data.status === RESPONSE_STATUS_OK) {
        store.dispatch({type: SET_BLOCKCHAIN_INFO, value: data.data});
    } else {
        console.log('Error white calling getInfo: ' + data)
    }
});

ipcRenderer.on('getPeerInfoResponse', (event, data) => {
    if (data.status === RESPONSE_STATUS_OK) {
        store.dispatch({type: SET_PEER_INFO, value: data.data});
    } else {
        console.log('Error white calling getPeerInfo: ' + data)
    }
});

ipcRenderer.on('sendPSLResponse', (event, data) => {
    if (data.status !== RESPONSE_STATUS_OK) {
        store.dispatch({type: SET_PSL_SEND_ERROR, value: data.msg})
    } else {
        //refresh balance
        store.dispatch(getBalance());
    }
});

ipcRenderer.on('updateCNodeStatus', (event, data) => {
    store.dispatch({type: SET_CNODE_STATUS, value: data.status});
});

ipcRenderer.on('updatePynodeStatus', (event, data) => {
    store.dispatch({type: SET_PYNODE_STATUS, value: data.status});
});

ipcRenderer.on('addMessageToBox', (event, data) => {
    store.dispatch({type: ADD_MESSAGE, value: data.msg})
});
