import { ICentralAuthorityOptions } from '../central-authority-class/central-authority-class.types';
import { CA_CONNECTION_AUTH_PROVIDERS } from '../central-authority-class/central-authority-connections/central-authority-connections.const';
import { ISerializer } from '../../types/serialization.types';

export const CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT = '_//_';

export const CONNECTION_BRIDGE_DEFAULT_SERIALIZER: ISerializer = JSON;

export enum CONNECTION_BRIDGE_SESSION_STORAGE_KEYS {
  USER_LOGIN = 'CONNECTION_BRIDGE_SESSION_STORAGE_KEYS_USER_LOGIN',
  SESSION_DATA_AVAILABLE = 'CONNECTION_BRIDGE_SESSION_STORAGE_KEYS_SESSION_DATA_AVAILABLE',
}

export enum CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX {
  MESSAGE_CACHE_STORAGE = '__MESSAGE_CACHE_STORAGE',
  CONNECTION_SESSION_DATA_STORAGE = '__USER_DATA_STORAGE',
  DATABASE_LIST_STORAGE = '__DATABASE_LIST_STORAGE',
  SECRET_STORAGE = '__SECRET_STORAGE',
}

export enum CONNECTION_BRIDGE_STORAGE_DATABASE_NAME {
  MESSAGE_CACHE_STORAGE = '_CONNECTION_BRIDGE',
}

export const CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_PROTOCOL = {
  apiKey: 'AIzaSyA8KU5yA0ot19_LRHOazke2HrZT2Gdv8k4',
  authDomain: 'protocol-firebase.firebaseapp.com',
  databaseURL: 'https://protocol-firebase-default-rtdb.firebaseio.com',
  projectId: 'protocol-firebase',
  storageBucket: 'protocol-firebase.appspot.com',
  messagingSenderId: '95355551133',
  appId: '1:95355551133:web:a14aba0f275224eadd4374',
};

export const CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_WATCHA = {
  apiKey: 'AIzaSyALm9cCWRpqtn1zxGhQJnt34skvRrmBwmg',
  authDomain: 'protocol-firebase-central.firebaseapp.com',
  databaseURL: 'https://protocol-firebase-central-default-rtdb.firebaseio.com',
  projectId: 'protocol-firebase-central',
  storageBucket: 'protocol-firebase-central.appspot.com',
  messagingSenderId: '155785265930',
  appId: '1:155785265930:web:0013300df655405366b0f3',
};

export const CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL: ICentralAuthorityOptions['authProvidersPool'] = {
  providersConfigurations: [
    {
      options: CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_WATCHA,
      caProviderUrl: CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_WATCHA.databaseURL,
      caProvider: CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
    },
    {
      options: CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_PROTOCOL,
      caProviderUrl: CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_PROTOCOL.databaseURL,
      caProvider: CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
    },
  ],
};

export const CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE = {
  storagePrefix: CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.CONNECTION_SESSION_DATA_STORAGE,
};
