import * as actionTypes from './actionTypes';
import axios from 'axios';
import * as settings from './settings';
import {ipcRenderer} from './ipc/ipc';
import history from './history';
import * as constants from '../main/constants';
import {store} from './app';
import {SET_CNODE_STATUS} from './actionTypes';
import {PASTELID_REG_STATUS_IN_PROGRESS} from "../main/constants";

export const setBalance = (value) => ({
  type: actionTypes.SET_BALANCE,
  value
});

export const setImageRegFormError = (key, value) => ({
  type: actionTypes.SET_IMAGE_REGISTER_FORM_ERROR,
  key,
  value
});

export const setImageRegFormState = (value) => ({
  type: actionTypes.SET_IMAGE_REGISTER_FORM_STATE,
  value
});

export const setImageRegFormTxid = (value) => ({
  type: actionTypes.SET_IMAGE_REGISTER_FORM_TXID,
  value
});

export const setImageRegFormTxidActTicket = (value) => ({
  type: actionTypes.SET_IMAGE_REGISTER_FORM_TXID_ACT_TICKET,
  value
});

export const resetImageRegFormErrors = () => ({
  type: actionTypes.RESET_IMAGE_REGISTER_FORM_ERRORS
});

export const setImageRegFormRegFee = (value) => ({
  type: actionTypes.SET_IMAGE_REGISTER_FORM_FEE,
  value
});

export const setImageRegFormMsg = (value) => ({
  type: actionTypes.SET_IMAGE_REGISTER_MESSAGE,
  value
});

export const setImageRegWorkerFee = (value) => ({
  type: actionTypes.SET_IMAGE_REGISTER_WORKER_FEE,
  value
});
export const setImageRegTicketID = (value) => ({
  type: actionTypes.SET_IMAGE_REGTICKET_ID,
  value
});

// User profile data from server:
// date_joined_for_human: "Sep 18 2019"
// email: null
// first_name: null
// last_name: null
// pastel_id: "PBg8W1Q0tKXaZOxewi0uuXr96IXvg6AcBd23ebEmjJ5f3vRUMr0/dKoCWvqHV58c05uZ6PHtLY3TRpAOq2tV1BqA"
// phone_number: null
// picture: null
// export const fetchProfile = () => {
//   return (dispatch, getState) => {
//     const { currentPastelID } = getState();
//     console.log(currentPastelID);
//     return axios.post(settings.USER_PROFILE_URL, { pastel_id: currentPastelID }).then((resp) => {
//       dispatch(setUserProfile(resp.data));
//     }).catch((err) => {
//       console.log('Error getting user profile from cloud');
//     });
//   };
// };

export const setPasteIDList = (value) => {
  return (dispatch, getState) => {
    const {pastelid: {refreshTaskID}} = getState();
    if (value.some(x => x.regStatus === PASTELID_REG_STATUS_IN_PROGRESS)) {
      if (!refreshTaskID) {
        //create task to refresh pastelID list
        const taskID = setInterval(() => ipcRenderer.send('pastelIdList', {}), 5000);
        dispatch({type: actionTypes.SET_REFRESH_TASK_ID, value: taskID});
      }
    } else {
      if (refreshTaskID) {
        // remove task
        clearInterval(refreshTaskID);
        dispatch({type: actionTypes.SET_REFRESH_TASK_ID, value: null});
      }
    }
    dispatch({
      type: actionTypes.SET_PASTEL_ID_LIST,
      value
    });
  }
};

export const setPasteIDError = (value) => ({
  type: actionTypes.SET_PASTEL_ID_ERROR,
  value
});

export const setCurrentPasteID = (value) => ({
  type: actionTypes.SET_CURRENT_PASTEL_ID,
  value
});

export const setCurrentPassphrase = (value) => ({
  type: actionTypes.SET_CURRENT_PASSPHRASE,
  value
});

export const getBalance = () => {
  return (dispatch, getState) => {
    ipcRenderer.send('getBalanceRequest', {});
  };
};

export const getInfo = () => {
  return (dispatch, getState) => {
    ipcRenderer.send('getInfoRequest', {});
  };
};

export const saveProfileData = () => {
  return (dispatch, getState) => {
    const {profileEdit: {firstName, lastName, phone, email, photo}} = getState();
    const {pastelid: {currentPastelID}} = getState();
    const errors = [];
    const PHONE_RE = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    const EMAIL_RE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!PHONE_RE.test(phone)) {
      errors.push('Invalid phone');
    }
    if (!EMAIL_RE.test(email)) {
      errors.push('Invalid email');
    }
    if (firstName.trim() === '') {
      errors.push('First name is empty');
    }
    if (lastName.trim() === '') {
      errors.push('Last name is empty');
    }

    if (errors.length === 0) {
      // send IPC with data
      ipcRenderer.send('saveProfile', {firstName, lastName, phone, email, photo, pastelid: currentPastelID});
    } else {
      // has some errors
      dispatch({type: actionTypes.SET_USER_PROFILE_EDIT_DATA, field: 'errors', value: errors});
    }
  };

};

export const updateCnodeStatus = (status) => {
  return (dispatch, getState) => {
    const {others: {cNodeStatus}} = getState();
    if (status === constants.NODE_STATUS_CONNECTED && cNodeStatus !== constants.NODE_STATUS_CONNECTED) {
      // refresh blockchain data
      ipcRenderer.send('blockchainDataRequest', {});
      ipcRenderer.send('getInfoRequest', {});
      ipcRenderer.send('getPeerInfoRequest', {});
      ipcRenderer.send('pastelIdList', {});
    }
    dispatch({type: SET_CNODE_STATUS, value: status});
  };
};
