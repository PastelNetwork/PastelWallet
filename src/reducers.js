import * as actionTypes from './actionTypes';
import {initialState} from "./app";


const reducer  = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.START_AJAX:
            return {...state, ajaxInProgress: {...state.ajaxInProgress, [action.entity]: true}};
        case actionTypes.STOP_AJAX:
            return {...state, ajaxInProgress: {...state.ajaxInProgress, [action.entity]: false}};
        case actionTypes.SET_IMAGE_REGISTER_FORM_ERROR:
            console.log(`Set form error reducer`);
            console.log(action);
            return {...state, regFormError: {...state.regFormError, [action.key]: action.value}};
        case actionTypes.RESET_IMAGE_REGISTER_FORM_ERRORS:
            return {...state, regFormError: {}};
        case actionTypes.SET_IMAGE_REGISTER_FORM_FEE:
            return {...state, regFormFee: action.value};
        case actionTypes.SET_IMAGE_REGISTER_FORM_TXID:
            return {...state, regFormTxid: action.value};
        case actionTypes.SET_IMAGE_REGISTER_FORM_TXID_ACT_TICKET:
            return {...state, regFormTxidAct: action.value};
        case actionTypes.SET_IMAGE_REGISTER_WORKER_FEE:
            return {...state, workerFee: action.value};
        case actionTypes.SET_IMAGE_REGISTER_MESSAGE:
            return {...state, imageRegFormMessage: action.value};
        case actionTypes.SET_IMAGE_REGTICKET_ID:
            return {...state, regticketId: action.value};
        case actionTypes.SET_BLOCKCHAIN_ADDRESS:
            return {...state, blockchainAddress: action.value};
        case actionTypes.SET_BALANCE:
            return {...state, balance: action.value};
        case actionTypes.SET_USER_PROFILE:
            return {...state, userProfile: action.value};
        case actionTypes.SET_SEND_PSL_SEND_STATUS_DATA:
            return {...state, sendPslStatusData: action.value};
        case actionTypes.SET_IMAGE_REGISTER_FORM_STATE:
            return {...state, regFormState: action.value};
        case actionTypes.SET_CNODE_STATUS:
            return {...state, cNodeStatus: action.value};
        case actionTypes.SET_PYNODE_STATUS:
            return {...state, pyNodeStatus: action.value};
        case actionTypes.TOGGLE_MESSAGE_BOX:
            return {...state, messageBoxCollaped: !state.messageBoxCollaped};
        case actionTypes.ADD_MESSAGE:
            return {...state, userDisplayMessages: [...state.userDisplayMessages, action.value]};
        case actionTypes.SET_PASTEL_ID_LIST:
            return {...state, pastelIDs: action.value};
        case actionTypes.SET_PASTEL_ID_ERROR:
            return {...state, pastelIDError: JSON.stringify(action.value)};
        case actionTypes.SET_CURRENT_PASTEL_ID:
            return {...state, currentPastelID: action.value};
        case actionTypes.SET_CURRENT_PASSPHRASE:
            return {...state, currentPassphrase: action.value};
        case actionTypes.SET_ARTWORKS_DATA:
            return {...state, artworksData: action.value};
        case actionTypes.RESET_STORE:
            return {...initialState};
        default:
            return state;
    }
};

export default reducer;
