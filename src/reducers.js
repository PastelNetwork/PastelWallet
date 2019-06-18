import * as actionTypes from './actionTypes';
import {initialState} from "./app";


const reducer  = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.START_AJAX:
            return {...state, ajaxInProgress: {...state.ajaxInProgress, [action.entity]: true}};
        case actionTypes.STOP_AJAX:
            return {...state, ajaxInProgress: {...state.ajaxInProgress, [action.entity]: false}};
        case actionTypes.SET_IMAGE_REGISTER_FORM_ERROR:
            return {...state, regFormError: action.value};
        case actionTypes.SET_IMAGE_REGISTER_FORM_FEE:
            return {...state, regFormFee: action.value};
        case actionTypes.SET_BLOCKCHAIN_DATA:
            return {...state, blockchainData: action.value};
        case actionTypes.SET_BALANCE:
            return {...state, balance: action.value};
        case actionTypes.SET_SEND_PSL_SEND_STATUS_DATA:
            return {...state, sendPslStatusData: action.value};
        case actionTypes.RESET_STORE:
            return {...initialState};
        default:
            return state;
    }
};

export default reducer;
