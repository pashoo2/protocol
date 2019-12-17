import { IAuthProviderConnectionConfiguration } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-pool/central-authority-connections-pool.types';
import { CA_CONNECTION_AUTH_PROVIDERS } from 'classes/central-authority-class/central-authority-connections/central-authority-connections.const';

export const CA_CONNECTOINS_CONNECTIONS_POOL_TEST_OPTIONS_FIREBASE_DB_PROTOCOL = {
  apiKey: 'AIzaSyCwmUlVklNmGZ0SD11NKT8gpvmZXbgbBRk',
  authDomain: 'protocol-f251b.firebaseapp.com',
  databaseURL: 'https://protocol-f251b.firebaseio.com',
  projectId: 'protocol-f251b',
  storageBucket: '',
  messagingSenderId: '275196342406',
  appId: '1:275196342406:web:40b79d671c50af57',
};

export const CA_CONNECTOINS_CONNECTIONS_POOL_TEST_OPTIONS_FIREBASE_DB_WATCHA = {
  apiKey: 'AIzaSyCmjgbWZjUcDYxV2d0DxbiuroFrftW7qrQ',
  authDomain: 'watcha3-191815.firebaseapp.com',
  databaseURL: 'https://watcha3-191815.firebaseio.com',
  projectId: 'watcha3-191815',
  storageBucket: 'watcha3-191815.appspot.com',
  messagingSenderId: '271822572791',
  appId: '1:271822572791:web:2e31bfd34ccabe551597f2',
};

export const CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF: IAuthProviderConnectionConfiguration = {
  options: CA_CONNECTOINS_CONNECTIONS_POOL_TEST_OPTIONS_FIREBASE_DB_WATCHA,
  caProviderUrl:
    CA_CONNECTOINS_CONNECTIONS_POOL_TEST_OPTIONS_FIREBASE_DB_WATCHA.databaseURL,
  caProvider: CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
};

export const CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF: IAuthProviderConnectionConfiguration = {
  options: CA_CONNECTOINS_CONNECTIONS_POOL_TEST_OPTIONS_FIREBASE_DB_PROTOCOL,
  caProviderUrl:
    CA_CONNECTOINS_CONNECTIONS_POOL_TEST_OPTIONS_FIREBASE_DB_PROTOCOL.databaseURL,
  caProvider: CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
};

export const CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF_INVALID = {
  options: {
    ...CA_CONNECTOINS_CONNECTIONS_POOL_TEST_OPTIONS_FIREBASE_DB_PROTOCOL,
    apiKey: '',
  },
  caProviderUrl:
    CA_CONNECTOINS_CONNECTIONS_POOL_TEST_OPTIONS_FIREBASE_DB_PROTOCOL.databaseURL,
  caProvider: CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
};

export const CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF_INVALID = {
  options: {
    ...CA_CONNECTOINS_CONNECTIONS_POOL_TEST_OPTIONS_FIREBASE_DB_WATCHA,
    databaseURL: 'd.',
  },
  caProviderUrl:
    CA_CONNECTOINS_CONNECTIONS_POOL_TEST_OPTIONS_FIREBASE_DB_WATCHA.databaseURL,
  caProvider: CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
};
