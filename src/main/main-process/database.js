import sqlite3 from 'sqlite3';
import * as path from 'path';
import * as log from 'electron-log';
import { getWorkDir } from '../main';

let WALLET_DATABASE;

export const SELECT_PASTELID_SQL = 'select pastelid from pastelid';

export const GET_PROFILE_SQL = 'select firstName, lastName, phone, email, photo from profile where pastelid=?';

// SQLite support UPSERT starting from version 3.24, but hoping that node-sqlite package has the right version is unreliable
// So, old insert or ignore/update sql here.
export const setProfileSQL = (data) => {
  const { firstName, lastName, phone, email, photo, pastelid } = data;
  return `INSERT OR IGNORE INTO profile 
    (pastelid, firstName, lastName, phone, email, photo) 
    VALUES ("${pastelid}", "${firstName}", "${lastName}", "${phone}", "${email}", "${photo}");
    UPDATE profile SET firstName="${firstName}", lastName="${lastName}", phone="${phone}", email="${email}", photo=${photo? '"' + photo + '"' : 'NULL'}  WHERE pastelid="${pastelid}";`;
};


const createTableSQL = `
     CREATE TABLE IF NOT EXISTS pastelid
     (
         pastelid varchar
     );
    CREATE TABLE IF NOT EXISTS profile
    (
        pastelid  varchar NOT NULL UNIQUE,
        firstName varchar,
        lastName  varchar,
        phone     varchar,
        email     varchar,
        photo     varchar
    );
`;

const getDbFilePath = () => path.join(getWorkDir(), 'wallet_.db');

export const initDatabase = () => {
  WALLET_DATABASE = new sqlite3.Database(getDbFilePath(),
    e => {
      if (e) {
        log.error(`Error opening wallet sqlite DB: ${e}`);
      } else {
        WALLET_DATABASE.exec(createTableSQL, e => e && log.error(`Init database failed: ${e}`));
      }
    }
  );
};

export const getDatabase = () => {
  return WALLET_DATABASE;
};
