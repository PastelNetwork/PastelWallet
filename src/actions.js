import * as actionTypes from './actionTypes';
import axios from 'axios';
import * as settings from './settings';


export const setBlockchainAddress = (value) => ({
    type: actionTypes.SET_BLOCKCHAIN_ADDRESS,
    value
});

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

export const setImageRegWorkerFee = (value) => ({
    type: actionTypes.SET_IMAGE_REGISTER_WORKER_FEE,
    value
});
export const setImageRegTicketID = (value) => ({
    type: actionTypes.SET_IMAGE_REGTICKET_ID,
    value
});

export const setPSLSendStatusData = (value) => ({
    type: actionTypes.SET_SEND_PSL_SEND_STATUS_DATA,
    value
});

export const setUserProfile = (value) => ({
    type: actionTypes.SET_USER_PROFILE,
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
export const fetchProfile = () => {
    return (dispatch, getState) => {
        const {currentPastelID} = getState();
        console.log(currentPastelID);
        return axios.post(settings.USER_PROFILE_URL, {pastel_id: currentPastelID}).then((resp) => {
            dispatch(setUserProfile(resp.data));
        }).catch((err) => {
            console.log('Error getting user profile from cloud');
        });
    }
};

export const setCNodeStatus = (value) => ({
    type: actionTypes.SET_CNODE_STATUS,
    value
});

export const setPynodeStatus = (value) => ({
    type: actionTypes.SET_PYNODE_STATUS,
    value
});

export const toggleMessageBox = () => ({
    type: actionTypes.TOGGLE_MESSAGE_BOX
});

export const addMessage = (msg) => ({
    type: actionTypes.ADD_MESSAGE,
    value: msg
});

export const setPasteIDList = (value) => ({
    type: actionTypes.SET_PASTEL_ID_LIST,
    value
});

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