import localforage from 'localforage';

export const SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DEFAULTS_DB_NAME =
  '___localforagedb';

export const SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DRIVER =
  localforage.INDEXEDDB;
