import sqlite3 from 'sqlite3';
import * as path from 'path';
import { app } from 'electron';
import * as log from 'electron-log';

let WALLET_DATABASE;

export const SELECT_PASTELID_SQL = 'select pastelid from pastelid';

const createTableSQL = 'CREATE TABLE IF NOT EXISTS pastelid (pastelid varchar);';

export const initDatabase = () => {
  const dbFile = path.join(app.getPath('home'), 'wallet_.db');
  WALLET_DATABASE = new sqlite3.Database(dbFile,
    e => {
      if (e) {
        log.error(`Error opening wallet sqlitee DB: ${e}`);
      } else {
        WALLET_DATABASE.run(createTableSQL);
      }
    }
  );
};

export const getDatabase = () => {
  return WALLET_DATABASE;
};
