import { ICentralAuthorityOptions } from '../central-authority-class/central-authority-class.types';
import { CA_CONNECTION_AUTH_PROVIDERS } from '../central-authority-class/central-authority-connections/central-authority-connections.const';

export enum CONNECTION_BRIDGE_SESSION_STORAGE_KEYS {
  USER_LOGIN = 'CONNECTION_BRIDGE_SESSION_STORAGE_KEYS_USER_LOGIN',
  SESSION_DATA_AVAILABLE = 'CONNECTION_BRIDGE_SESSION_STORAGE_KEYS_SESSION_DATA_AVAILABLE',
}

export enum CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX {
  MESSAGE_CACHE_STORAGE = '__MESSAGE_CACHE_STORAGE',
  USER_DATA_STORAGE = '__USER_DATA_STORAGE',
  DATABASE_LIST_STORAGE = '__DATABASE_LIST_STORAGE',
  SECRET_STORAGE = '__SECRET_STORAGE',
}

export enum CONNECTION_BRIDGE_STORAGE_DATABASE_NAME {
  MESSAGE_CACHE_STORAGE = '_CONNECTION_BRIDGE',
}

export const CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_PROTOCOL = {
  apiKey: 'AIzaSyCwmUlVklNmGZ0SD11NKT8gpvmZXbgbBRk',
  authDomain: 'protocol-f251b.firebaseapp.com',
  databaseURL: 'https://protocol-f251b.firebaseio.com',
  projectId: 'protocol-f251b',
  storageBucket: '',
  messagingSenderId: '275196342406',
  appId: '1:275196342406:web:40b79d671c50af57',
};

export const CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_WATCHA = {
  apiKey: 'AIzaSyCmjgbWZjUcDYxV2d0DxbiuroFrftW7qrQ',
  authDomain: 'watcha3-191815.firebaseapp.com',
  databaseURL: 'https://watcha3-191815.firebaseio.com',
  projectId: 'watcha3-191815',
  storageBucket: 'watcha3-191815.appspot.com',
  messagingSenderId: '271822572791',
  appId: '1:271822572791:web:2e31bfd34ccabe551597f2',
};

export const CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL: ICentralAuthorityOptions['authProvidersPool'] = {
  providersConfigurations: [
    {
      options: CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_WATCHA,
      caProviderUrl:
        CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_WATCHA.databaseURL,
      caProvider: CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
    },
    {
      options: CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_PROTOCOL,
      caProviderUrl:
        CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_PROTOCOL.databaseURL,
      caProvider: CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
    },
  ],
};
