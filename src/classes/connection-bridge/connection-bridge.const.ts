import { ICentralAuthorityOptions } from '../central-authority-class/central-authority-class.types';
import { CA_CONNECTION_AUTH_PROVIDERS } from '../central-authority-class/central-authority-connections/central-authority-connections.const';

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
