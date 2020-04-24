import sqlite3 from 'sqlite3';

let WALLET_DATABASE;

export const initDatabase = () => {
  WALLET_DATABASE = new sqlite3.Database('wallet_.db');
};

export const getDatabase = () => {
  return WALLET_DATABASE;
};
