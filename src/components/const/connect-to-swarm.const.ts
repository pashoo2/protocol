import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageBodyDeserialized,
  TSwarmMessageSerialized,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  IConnectionBridgeOptionsUser,
  IConnectionBridgeOptionsAuth,
} from '../../classes/connection-bridge/connection-bridge.types';
import { IConnectionBridgeStorageOptionsDefault } from '../../classes/connection-bridge/connection-bridge.types';
import { TSwarmStoreDatabaseOptions } from 'classes/swarm-store-class/index';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/connection-bridge.types';

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY = 'key';

export const CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY: ISwarmMessageBodyDeserialized = {
  iss: 'test connection',
  typ: 1,
  pld: 'Hello',
  ts: 0,
};

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_1 = {
  login: 'mohiwas553@homedepinst.com',
  password: 'qawsde1234',
};

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1 = '02https://watcha3-191815.firebaseio.com|sgFtcpibSAaMUwNZwR88jLD7uF82';

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_2 = {
  login: 'cecaye9745@emailhost99.com',
  password: 'sdfwmfgjk12kH',
};

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2 = '02https://watcha3-191815.firebaseio.com|c2wDISuQVBaVANDrTdTWGVi5F0C3';

export enum CONNECT_TO_SWARM_AUTH_PROVIDERS {
  FIREBASE_WATCHA = 'https://watcha3-191815.firebaseio.com',
  FIREBASE_PRTOCOL = 'https://protocol-f251b.firebaseio.com',
}

export const CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT = ESwarmStoreConnector.OrbitDB;

const CONNECT_TO_SWARM_DATABASE_PREFIX = 'chat/test';

export const CONNECT_TO_SWARM_DATABASE_MAIN_NAME = `${CONNECT_TO_SWARM_DATABASE_PREFIX}/database_main`;

export const CONNECT_TO_SWARM_DATABASE_MAIN: TSwarmStoreDatabaseOptions<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
> = {
  dbName: CONNECT_TO_SWARM_DATABASE_MAIN_NAME,
  isPublic: true,
  useEncryptedStorage: true,
  preloadCount: 10,
  dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
};

export const CONNECT_TO_SWARM_DATABASE_MAIN_2: TSwarmStoreDatabaseOptions<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
> = {
  dbName: CONNECT_TO_SWARM_DATABASE_MAIN_NAME,
  isPublic: true,
  useEncryptedStorage: true,
  preloadCount: 10,
  dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
};

export const CONNECT_TO_SWARM_DATABASES_DEFAULT: Array<TSwarmStoreDatabaseOptions<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
>> = [CONNECT_TO_SWARM_DATABASE_MAIN];

export const CONNECT_TO_SWARM_CONNECTION_USER_OPTIONS: IConnectionBridgeOptionsUser = {
  profile: {},
};

export const CONNECT_TO_SWARM_CONNECTION_STORAGE_OPTIONS: IConnectionBridgeStorageOptionsDefault<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
> = {
  accessControl: undefined, // use the default access control
  swarmMessageConstructorFabric: undefined, // use the default swarm message constructor fabric
  connectorBasicFabric: undefined,
  connectorMainFabric: undefined,
  getMainConnectorFabric: undefined,
  provider: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
  directory: CONNECT_TO_SWARM_DATABASE_PREFIX,
  databases: [],
};

export const CONNECT_TO_SWARM_CONNECTION_AUTH_OPTOINS: IConnectionBridgeOptionsAuth<false> = {
  providerUrl: CONNECT_TO_SWARM_AUTH_PROVIDERS.FIREBASE_WATCHA,
  // use session persistanse
  session: {},
  credentials: undefined,
};

export const CONNECT_TO_SWARM_CONNECTION_OPTIONS: IConnectionBridgeOptionsDefault<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  false
> = {
  swarmStoreConnectorType: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
  user: CONNECT_TO_SWARM_CONNECTION_USER_OPTIONS,
  auth: CONNECT_TO_SWARM_CONNECTION_AUTH_OPTOINS,
  storage: CONNECT_TO_SWARM_CONNECTION_STORAGE_OPTIONS,
  swarm: undefined, // use the default value
};
