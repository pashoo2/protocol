import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageBodyDeserialized,
  TSwarmMessageSerialized,
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
import { TSwarmStoreConnectorBasicFabric } from '../../classes/swarm-store-class/swarm-store-class.types';
import { getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer } from '../../classes/swarm-message-store/swarm-message-store-extended/swarm-message-store-with-entries-count-and-options-serializer';
import { connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-database-list-storage-fabrics';
import {
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntryOperation,
} from '../../classes/swarm-store-class/swarm-store-class.types';
import { connectorBasicFabricOrbitDBWithEntriesCount } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-to-swarm-database-fabrics';
import { SerializerClass } from '../../classes/basic-classes/serializer-class';
import { swarmStoreOptionsClassFabric } from '../../classes/swarm-store-class/swarm-store-class-helpers/swarm-store-options-helpers/swarm-store-options-class-fabric/swarm-store-options-class-fabric';
import { swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-swarm-store-fabrics';
import { asyncValidateVerboseBySchemaWithVoidResult } from 'utils';

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

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1 = '02https://watcha3-191815.firebaseio.com|sgFtcpibSAaMUwNZwR88jLD7uF82';

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_2 = {
  login: 'cecaye9745@emailhost99.com',
  password: 'sdfwmfgjk12kH',
};

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2 = '02https://watcha3-191815.firebaseio.com|c2wDISuQVBaVANDrTdTWGVi5F0C3';

export enum CONNECT_TO_SWARM_AUTH_PROVIDERS {
  FIREBASE_DEFAULT = 'https://protocol-firebase-default-rtdb.firebaseio.com',
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
    grantAccess: function grandAccess(
      this: unknown,
      message: unknown,
      userId: TCentralAuthorityUserIdentity,
      dbName: string,
      key: TSwarmStoreDatabaseEntityKey<ESwarmStoreConnector.OrbitDB> | undefined,
      // operation on the database
      op: TSwarmStoreDatabaseEntryOperation<ESwarmStoreConnector.OrbitDB> | undefined,
      time: number
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
  provider: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
  directory: CONNECT_TO_SWARM_DATABASE_PREFIX,
  databases: [],
  swarmStoreDatabasesPersistentListFabric: connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault,
  swarmMessageStoreInstanceFabric: swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer as any, // TODO
};

export const CONNECT_TO_SWARM_CONNECTION_STORAGE_WITH_STORE_META_OPTIONS: IConnectionBridgeOptionsDefault<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  false,
  TSwarmStoreDatabaseOptions<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  >,
  ISwarmMessageInstanceDecrypted | TSwarmMessageSerialized,
  any,
  any,
  any,
  ISwarmStoreConnectorBasicWithEntriesCount<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  >,
  TSwarmStoreConnectorBasicFabric<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >,
    ISwarmStoreConnectorBasicWithEntriesCount<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
      TSwarmStoreDatabaseOptions<
        ESwarmStoreConnector.OrbitDB,
        TSwarmMessageSerialized,
        ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
      >
    >
  >,
  any,
  any,
  ISwarmStoreConnectorWithEntriesCount<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >,
    ISwarmStoreConnectorBasicWithEntriesCount<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
      TSwarmStoreDatabaseOptions<
        ESwarmStoreConnector.OrbitDB,
        TSwarmMessageSerialized,
        ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
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
      if (process.env.NODE_ENV === 'development') debugger;
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
  swarmMessageStoreInstanceFabric() {
    const SwarmStoreOptionsClass = swarmStoreOptionsClassFabric();
    const SwarmMessageStoreWithEntriesCount = getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer(
      SwarmStoreOptionsClass as any // TODO
    );
    return new SwarmMessageStoreWithEntriesCount();
  },
  swarmStoreDatabasesPersistentListFabric: connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault,
};

export const CONNECT_TO_SWARM_CONNECTION_AUTH_OPTOINS: IConnectionBridgeOptionsAuth<false> = {
  providerUrl: CONNECT_TO_SWARM_AUTH_PROVIDERS.FIREBASE_DEFAULT,
  // use session persistanse
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
  swarmStoreConnectorType: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
  user: CONNECT_TO_SWARM_CONNECTION_USER_OPTIONS,
  auth: CONNECT_TO_SWARM_CONNECTION_AUTH_OPTOINS,
  storage: CONNECT_TO_SWARM_CONNECTION_STORAGE_OPTIONS,
  nativeConnection: CONNECT_TO_SWARM_CONNECTION_NATIVE_CONNECTION_OPTIONS, // use the default value
  jsonSchemaValidator: asyncValidateVerboseBySchemaWithVoidResult,
};

export const CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS: IConnectionBridgeOptionsDefault<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  false,
  TSwarmStoreDatabaseOptions<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  >,
  ISwarmMessageInstanceDecrypted | TSwarmMessageSerialized,
  any,
  any,
  any,
  ISwarmStoreConnectorBasicWithEntriesCount<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  >,
  TSwarmStoreConnectorBasicFabric<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >,
    ISwarmStoreConnectorBasicWithEntriesCount<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
      TSwarmStoreDatabaseOptions<
        ESwarmStoreConnector.OrbitDB,
        TSwarmMessageSerialized,
        ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
      >
    >
  >,
  any,
  any,
  ISwarmStoreConnectorWithEntriesCount<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >,
    ISwarmStoreConnectorBasicWithEntriesCount<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
      TSwarmStoreDatabaseOptions<
        ESwarmStoreConnector.OrbitDB,
        TSwarmMessageSerialized,
        ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
      >
    >,
    any
  >
> = {
  serializer: new SerializerClass(),
  swarmStoreConnectorType: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
  user: CONNECT_TO_SWARM_CONNECTION_USER_OPTIONS,
  auth: CONNECT_TO_SWARM_CONNECTION_AUTH_OPTOINS,
  storage: CONNECT_TO_SWARM_CONNECTION_STORAGE_WITH_STORE_META_OPTIONS,
  nativeConnection: CONNECT_TO_SWARM_CONNECTION_NATIVE_CONNECTION_OPTIONS, // use the default value
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
