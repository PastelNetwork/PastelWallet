import * as actionTypes from './actionTypes';
import {defaultProfileEditMode, initialState} from "./app";


const reducer  = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.SAVE_API_TOKEN:
            return {...state, token: action.token};
        case actionTypes.USER_PROFILE_SET_EDIT_MODE:
            return {...state, profileEditMode: {...state.profileEditMode, [action.entity]: action.value}};
        case actionTypes.USER_PROFILE_SET_EDIT_MODE_ALL:
            let editMode = defaultProfileEditMode;
            Object.keys(editMode).forEach(k => editMode[k] = action.value);
            return {...state, profileEditMode: editMode};
        case actionTypes.USER_PROFILE_BULK_UPDATE_DETAILS_TO_EDIT:
            return {...state, detailsToEdit: {...action.profileDetailsToEdit}};
        case actionTypes.USER_PROFILE_UPDATE_DETAILS_TO_EDIT:
            return {...state, detailsToEdit: {...state.detailsToEdit, [action.field]: action.value}};
        case actionTypes.SAVE_USER_PROFILE:
            return {...state, userProfile: action.profile};
        case actionTypes.CHANGE_USER_PROFILE:
            return {...state, userProfile: {...state.userProfile, [action.field]: action.value}};
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
        case actionTypes.SWITCH_LEFT_MENU:
            return {...state, leftMenuShow: !state.leftMenuShow};
        case actionTypes.RESET_STORE:
            return {...initialState};
        default:
            return state;
    }
};

export default reducer;
