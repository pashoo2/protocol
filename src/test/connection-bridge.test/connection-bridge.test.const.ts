import { IConnectionBridgeOptions } from '../../classes/connection-bridge/connection-bridge.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_WATCHA } from '../../classes/connection-bridge/connection-bridge.const';

export const CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES_DB1 = {
  dbName: 'test_db1',
  isPublic: true,
};

export const CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES_DB2 = {
  dbName: 'test_db2',
};

export const CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES: IConnectionBridgeOptions<
  ESwarmStoreConnector.OrbitDB
>['storage']['databases'] = [
  CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES_DB1,
  CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES_DB2,
];

export const CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_ACCESS_CONTROL: IConnectionBridgeOptions<
  ESwarmStoreConnector.OrbitDB
>['storage']['accessControl'] = {
  allowAccessFor: [],
  grantAccess: async (message, userId, dbName) => true,
};

export const CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_AUTH_CREDENTIALS = {
  login: 'yayakof795@upcmaill.com',
  password: 'qawsde1234',
};

export const CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_AUTH = {
  credentials: CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_AUTH_CREDENTIALS,
  providerUrl:
    CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_WATCHA.databaseURL,
};

export const CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_AUTH_NO_EMAIL_VERIFIED = {
  credentials: {
    ...CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_AUTH_CREDENTIALS,
    login: 'fagawa6394@mailernam.com',
  },
  providerUrl:
    CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_WATCHA.databaseURL,
};

export const CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS: IConnectionBridgeOptions<ESwarmStoreConnector.OrbitDB> = {
  auth: CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_AUTH,
  user: {},
  storage: {
    databases: CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES,
    provider: ESwarmStoreConnector.OrbitDB,
    directory: 'directory/test',
    accessControl: CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_ACCESS_CONTROL,
  },
};

export const CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_EMAIL_NOT_VERIFIED: IConnectionBridgeOptions<ESwarmStoreConnector.OrbitDB> = {
  ...CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS,
  auth: CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_AUTH_NO_EMAIL_VERIFIED,
};
