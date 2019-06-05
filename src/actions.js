import * as actionTypes from './actionTypes';
import * as ajaxEntities from './ajaxEntities';
import axios from 'axios';
import * as settings from './settings';
import history from './history';
import {defaultDetailsToEdit} from "./app";

export const saveAPIToken = (token) => ({
    type: actionTypes.SAVE_API_TOKEN,
    token
});

export const forgetAPIToken = () => saveAPIToken('');

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

export const saveUserProfile = (profile) => ({
    type: actionTypes.SAVE_USER_PROFILE,
    profile
});

export const userProfileSetEditMode = (entity, value) => ({
    type: actionTypes.USER_PROFILE_SET_EDIT_MODE,
    entity,
    value
});

export const userProfileSetEditModeAll = (value) => ({
    type: actionTypes.USER_PROFILE_SET_EDIT_MODE_ALL,
    value
});

export const fetchUserProfile = () => {
    return (dispatch, getState) => {
        const {token} = getState();
        dispatch(startAjax(ajaxEntities.USER_PROFILE));
        return axios.get(settings.USER_PROFILE_URL, {headers: {Authorization: 'Token ' + token}}).then((r) => {
            dispatch(saveUserProfile(r.data));
            return dispatch(stopAjax(ajaxEntities.USER_PROFILE));
        }, (err) => {
            if ([401, 403].some(i => i === err.response.status)) {
                history.push('/logout');
            }
            return dispatch(ajaxEntities.USER_PROFILE);
        });
    }
};

export const pushUserProfileDetails = () => {
    return (dispatch, getState) => {
        const {token, detailsToEdit} = getState();
        const data = {
            first_name: detailsToEdit.firstName,
            last_name: detailsToEdit.lastName,
            email: detailsToEdit.email,
            phone_number: detailsToEdit.phone
        };
        dispatch(startAjax(ajaxEntities.USER_PROFILE_DETAILS));
        return axios.patch(settings.USER_PROFILE_URL,
            data,
            {headers: {Authorization: 'Token ' + token}}).then((r) => {
            dispatch(saveUserProfile(r.data));
            dispatch(bulkUpdateUserProfileDetailsToEdit(defaultDetailsToEdit));

            return dispatch(stopAjax(ajaxEntities.USER_PROFILE_DETAILS));
        }, (err) => {
            // TODO: save errors somewhere
            if ([401, 403].some(i => i === err.response.status)) {
                history.push('/logout');
            }
            return dispatch(ajaxEntities.USER_PROFILE_DETAILS);
        });
    }
};
export const changeUserProfile = (field, value) => ({
    type: actionTypes.CHANGE_USER_PROFILE,
    field,
    value
});

export const bulkUpdateUserProfileDetailsToEdit = (profileDetailsToEdit) => ({
    type: actionTypes.USER_PROFILE_BULK_UPDATE_DETAILS_TO_EDIT,
    profileDetailsToEdit
});

export const updateUserProfileDetailsToEdit = (field, value) => ({
    type: actionTypes.USER_PROFILE_UPDATE_DETAILS_TO_EDIT,
    field,
    value
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

export const switchLeftMenu = () => ({
    type: actionTypes.SWITCH_LEFT_MENU
});

export const setPSLSendStatusData = (value) => ({
    type: actionTypes.SET_SEND_PSL_SEND_STATUS_DATA,
    value
});
