import * as actionTypes from './actionTypes';
import * as ajaxEntities from './ajaxEntities';
import axios from 'axios';
import * as settings from './settings';
import history from './history';
import {defaultDetailsToEdit} from "./app";

export const startAjax = (entity) => ({
    type: actionTypes.START_AJAX,
    entity
});

export const stopAjax = (entity) => ({
    type: actionTypes.STOP_AJAX,
    entity
});

export const resetStore = () => ({
    type: actionTypes.RESET_STORE
});

export const setBlockchainData = (value) => ({
    type: actionTypes.SET_BLOCKCHAIN_DATA,
    value
});

export const setBalance = (value) => ({
    type: actionTypes.SET_BALANCE,
    value
});

export const setImageRegFormError = (value) => ({
    type: actionTypes.SET_IMAGE_REGISTER_FORM_ERROR,
    value
});

export const setImageRegFormRegFee = (value) => ({
    type: actionTypes.SET_IMAGE_REGISTER_FORM_FEE,
    value
});

export const setPSLSendStatusData = (value) => ({
    type: actionTypes.SET_SEND_PSL_SEND_STATUS_DATA,
    value
});
