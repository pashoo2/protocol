import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageBodyDeserialized,
  ISwarmMessageInstanceDecrypted,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  IConnectionBridgeOptionsUser,
  IConnectionBridgeOptionsAuth,
} from '../../classes/connection-bridge/types/connection-bridge.types';
import { TNativeConnectionOptions } from 'classes/connection-bridge/types/connection-bridge.types';
import { TSwarmStoreDatabaseOptions } from 'classes/swarm-store-class/index';
import {
  IConnectionBridgeOptionsDefault,
  TConnectionBridgeStorageOptionsDefault,
} from '../../classes/connection-bridge/types/connection-bridge.types';
import { ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions } from '../../classes/swarm-messages-database/swarm-messages-database.types';
import { SwarmMessagesDatabaseCache } from '../../classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-cache/swarm-messages-database-cache';
import { ConstructorArgumentType } from '../../types/helper.types';
import { ISwarmMessagesDatabaseCacheConstructor } from '../../classes/swarm-messages-database/swarm-messages-database.types';
import {
  ISwarmMessagesDatabaseMessagesCollector,
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta,
} from '../../classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import { getMainConnectorFabricWithEntriesCountDefault } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-to-swarm-connector-fabrics';
import { TCentralAuthorityUserIdentity } from '../../classes/central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { SwarmMessagesDatabaseCacheWithEntitiesCount } from '../../classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-cache-with-entities-count/swarm-messages-database-cache-with-entities-count';
import { ISwarmMessagesStoreMeta } from '../../classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../classes/swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import {
  TSwarmStoreConnectorBasicFabric,
  TSwarmStoreDatabaseType,
} from '../../classes/swarm-store-class/swarm-store-class.types';
import { connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-database-list-storage-fabrics';
import { SerializerClass } from '../../classes/basic-classes/serializer-class';
import {
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntryOperation,
} from '../../classes/swarm-store-class/swarm-store-class.types';
import { connectorBasicFabricOrbitDBWithEntriesCount } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-to-swarm-database-fabrics';
import { swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-swarm-store-fabrics';
import { asyncValidateVerboseBySchemaWithVoidResult } from '../../utils/validation-utils/validation-utils';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { IConnectionBridgeOptionsByStorageOptions } from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-storage-options.types.helpers';

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY = 'key';

export const CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY: ISwarmMessageBodyDeserialized = {
  iss: 'test connection',
  typ: 1,
  pld: 'Hello',
  ts: 0,
};

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_1 = {
  login: 'tebar13028@hrandod.com',
  password: 'qwdfrerwd',
};

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1 =
  '02https://protocol-firebase-default-rtdb.firebaseio.com|dlGUW2tKOjZDYYjE4U25CMbaNCF3';

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_2 = {
  login: 'kerzucolta@nedoz.com',
  password: 'sdfsdf4r',
};

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2 =
  '02https://protocol-firebase-default-rtdb.firebaseio.com|f7Yy0au1vuM2e7c9PJSwmrliHyz2';

export enum CONNECT_TO_SWARM_AUTH_PROVIDERS {
  FIREBASE_WATCHA = 'https://protocol-firebase-default-rtdb.firebaseio.com',
  FIREBASE_PRTOCOL = 'https://protocol-firebase-central-default-rtdb.firebaseio.com',
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

export const CONNECT_TO_SWARM_DATABASES_DEFAULT: Array<
  TSwarmStoreDatabaseOptions<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
  >
> = [CONNECT_TO_SWARM_DATABASE_MAIN];

export const CONNECT_TO_SWARM_CONNECTION_USER_OPTIONS: IConnectionBridgeOptionsUser = {
  profile: {},
};

export const CONNECT_TO_SWARM_CONNECTION_STORAGE_OPTIONS: TConnectionBridgeStorageOptionsDefault<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
> = {
  accessControl: {
    grantAccess: function grantAccess(
      message: unknown,
      userId: TCentralAuthorityUserIdentity,
      dbName: string,
      key?: TSwarmStoreDatabaseEntityKey<ESwarmStoreConnector.OrbitDB>,
      // operation on the database
      op?: TSwarmStoreDatabaseEntryOperation<ESwarmStoreConnector.OrbitDB>
    ) {
      console.log(this);
      if (process.env.NODE_ENV === 'development') debugger;
      return Promise.resolve(true);
    },
  }, // use the default access control
  swarmMessageConstructorFabric: undefined, // use the default swarm message constructor fabric
  connectorBasicFabric: connectorBasicFabricOrbitDBWithEntriesCount,
  connectorMainFabric: undefined,
  getMainConnectorFabric: undefined,
  swarmStoreDatabasesPersistentListFabric: connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault,
  provider: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
  directory: CONNECT_TO_SWARM_DATABASE_PREFIX,
  databases: [],
  swarmMessageStoreInstanceFabric: swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer as any, // TODO,
};

export const CONNECT_TO_SWARM_CONNECTION_STORAGE_WITH_STORE_META_OPTIONS: IConnectionBridgeOptionsDefault<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  false,
  TSwarmStoreDatabaseOptions<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
  >,
  ISwarmMessageInstanceDecrypted | TSwarmMessageSerialized,
  any,
  any,
  any,
  ISwarmStoreConnectorBasicWithEntriesCount<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
    TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
    >
  >,
  TSwarmStoreConnectorBasicFabric<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
    TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
    >,
    ISwarmStoreConnectorBasicWithEntriesCount<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
      TSwarmStoreDatabaseOptions<
        ESwarmStoreConnector.OrbitDB,
        TSwarmMessageSerialized,
        TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
      >
    >
  >,
  any,
  any,
  ISwarmStoreConnectorWithEntriesCount<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
    TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
    >,
    ISwarmStoreConnectorBasicWithEntriesCount<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
      TSwarmStoreDatabaseOptions<
        ESwarmStoreConnector.OrbitDB,
        TSwarmMessageSerialized,
        TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
      >
    >,
    any
  >
>['storage'] = {
  accessControl: {
    grantAccess: function grandAccess(
      message: unknown,
      userId: TCentralAuthorityUserIdentity,
      dbName: string,
      key?: TSwarmStoreDatabaseEntityKey<ESwarmStoreConnector.OrbitDB>,
      // operation on the database
      op?: TSwarmStoreDatabaseEntryOperation<ESwarmStoreConnector.OrbitDB>
    ) {
      console.log(this);
      return Promise.resolve(true);
    },
  }, // use the default access control
  swarmMessageConstructorFabric: undefined, // use the default swarm message constructor fabric
  connectorBasicFabric: connectorBasicFabricOrbitDBWithEntriesCount,
  connectorMainFabric: undefined,
  // this is special fabric creates fabric for creation of the MainConnector instance
  getMainConnectorFabric: getMainConnectorFabricWithEntriesCountDefault,
  provider: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
  directory: CONNECT_TO_SWARM_DATABASE_PREFIX,
  databases: [],
  swarmStoreDatabasesPersistentListFabric: connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault,
  swarmMessageStoreInstanceFabric: swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer,
};

export const CONNECT_TO_SWARM_CONNECTION_AUTH_OPTIONS: IConnectionBridgeOptionsAuth<false> = {
  providerUrl: CONNECT_TO_SWARM_AUTH_PROVIDERS.FIREBASE_WATCHA,
  // use session persistance
  session: {},
  credentials: undefined,
};

export const CONNECT_TO_SWARM_CONNECTION_NATIVE_CONNECTION_OPTIONS: TNativeConnectionOptions<ESwarmStoreConnector.OrbitDB> = {};

export const CONNECT_TO_SWARM_CONNECTION_OPTIONS: IConnectionBridgeOptionsDefault<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  false
> = {
  serializer: new SerializerClass(),
  jsonSchemaValidator: asyncValidateVerboseBySchemaWithVoidResult,
  swarmStoreConnectorType: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
  user: CONNECT_TO_SWARM_CONNECTION_USER_OPTIONS,
  auth: CONNECT_TO_SWARM_CONNECTION_AUTH_OPTIONS,
  storage: CONNECT_TO_SWARM_CONNECTION_STORAGE_OPTIONS,
  nativeConnection: CONNECT_TO_SWARM_CONNECTION_NATIVE_CONNECTION_OPTIONS, // use the default value
};

export const CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS: IConnectionBridgeOptionsByStorageOptions<
  typeof CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
  TSwarmMessageSerialized,
  false,
  InstanceType<typeof SerializerClass>,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  TSwarmStoreDatabaseOptions<
    typeof CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  >,
  typeof CONNECT_TO_SWARM_CONNECTION_STORAGE_WITH_STORE_META_OPTIONS
> = {
  swarmStoreConnectorType: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
  user: CONNECT_TO_SWARM_CONNECTION_USER_OPTIONS,
  auth: CONNECT_TO_SWARM_CONNECTION_AUTH_OPTIONS,
  storage: CONNECT_TO_SWARM_CONNECTION_STORAGE_WITH_STORE_META_OPTIONS,
  nativeConnection: CONNECT_TO_SWARM_CONNECTION_NATIVE_CONNECTION_OPTIONS, // use the default value
  serializer: new SerializerClass(),
  jsonSchemaValidator: asyncValidateVerboseBySchemaWithVoidResult,
};

const SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_INSTANCE = SwarmMessagesDatabaseCache as ISwarmMessagesDatabaseCacheConstructor<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  TSwarmStoreDatabaseOptions<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  >,
  ISwarmMessageInstanceDecrypted,
  ISwarmMessagesDatabaseMessagesCollector<
    ESwarmStoreConnector.OrbitDB,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    ISwarmMessageInstanceDecrypted
  >,
  ConstructorArgumentType<typeof SwarmMessagesDatabaseCache>,
  InstanceType<typeof SwarmMessagesDatabaseCache>
>;

export const CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_OPTIONS: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  TSwarmStoreDatabaseOptions<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  >,
  ISwarmMessageInstanceDecrypted,
  ISwarmMessagesDatabaseMessagesCollector<
    ESwarmStoreConnector.OrbitDB,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    ISwarmMessageInstanceDecrypted
  >,
  ConstructorArgumentType<typeof SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_INSTANCE>,
  InstanceType<typeof SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_INSTANCE>
> = {
  cacheConstructor: SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_INSTANCE,
};

const SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_WITH_STORE_META_INSTANCE = SwarmMessagesDatabaseCacheWithEntitiesCount;

export const CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_WITH_STORE_META_OPTIONS: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  TSwarmStoreDatabaseOptions<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  >,
  ISwarmMessageInstanceDecrypted,
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    ISwarmMessageInstanceDecrypted,
    ISwarmMessagesStoreMeta
  >,
  ConstructorArgumentType<typeof SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_WITH_STORE_META_INSTANCE>,
  InstanceType<typeof SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_WITH_STORE_META_INSTANCE>
> = {
  cacheConstructor: SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_WITH_STORE_META_INSTANCE,
};
