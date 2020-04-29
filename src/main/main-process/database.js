import sqlite3 from 'sqlite3';
import * as path from 'path';
import { app } from 'electron';
import * as log from 'electron-log';
import { getWorkDir } from '../main';

let WALLET_DATABASE;

export const SELECT_PASTELID_SQL = 'select pastelid from pastelid';

const createTableSQL = 'CREATE TABLE IF NOT EXISTS pastelid (pastelid varchar);';

const getDbFilePath = () => path.join(getWorkDir(), 'wallet_.db');

export const initDatabase = () => {
  WALLET_DATABASE = new sqlite3.Database(getDbFilePath(),
    e => {
      if (e) {
        log.error(`Error opening wallet sqlite DB: ${e}`);
      } else {
        WALLET_DATABASE.run(createTableSQL);
      }
    }
  );
};

export const getDatabase = () => {
  return WALLET_DATABASE;
};
