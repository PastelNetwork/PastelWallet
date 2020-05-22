import { ipcMain } from 'electron';
import { RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK } from '../constants';
import { GET_PROFILE_SQL, getDatabase, setProfileSQL } from './database';

const getProfileFromDB = (pastelid, fn) => {
  getDatabase().all(GET_PROFILE_SQL, [pastelid], (e, r) => {
    const profileObj = r ? r[0] : {};
    fn(profileObj);
  });
};

const saveProfile = (data, fn) => {
  getDatabase().exec(setProfileSQL(data), e => fn(e));
};

const getProfileHandler = (event, data) => {
  getProfileFromDB(data.pastelid, profileObj => {
    event.reply('getProfileResponse', {
      status: RESPONSE_STATUS_OK,
      data: profileObj
    });
  });
};

const saveProfileHandler = (event, data) => {

  saveProfile(data, error => {
    if (error) {
      event.reply('saveProfileResponse', {
        status: RESPONSE_STATUS_ERROR,
        msg: `${error}`
      });
    } else {
      getProfileFromDB(data.pastelid, profileObj => {
        event.reply('saveProfileResponse', {
          status: RESPONSE_STATUS_OK,
          data: profileObj
        });
      });
    }
  });
};

ipcMain.on('getProfile', getProfileHandler);
ipcMain.on('saveProfile', saveProfileHandler);
