import { RESPONSE_STATUS_OK } from '../constants';
import { store } from '../app';
import { SET_USER_PROFILE_DATA } from '../actionTypes';
import { ipcRenderer } from './ipc';
import history from '../history';

ipcRenderer.on('getProfileResponse', (event, data) => {
  if (data.status === RESPONSE_STATUS_OK) {
    console.log(data);
    Object.keys(data.data).map(field =>
      store.dispatch({ type: SET_USER_PROFILE_DATA, field, value: data.data[field] })
    );
  } else {
    console.log('Error fetching user profile data');
  }
});

ipcRenderer.on('saveProfileResponse', (event, data) => {
  if (data.status === RESPONSE_STATUS_OK) {
    console.log(data);
    Object.keys(data.data).map(field =>
      store.dispatch({ type: SET_USER_PROFILE_DATA, field, value: data.data[field] })
    );
    history.goBack();
  } else {
    console.log(`Error saving user profile data: ${data.msg}`);
  }
});
