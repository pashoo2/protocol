import { ESwarmStoreConnector } from "../../classes/swarm-store-class/swarm-store-class.const";
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TNativeConnectionOptions } from "../../classes/connection-bridge/types/connection-bridge.types";
import { TSwarmStoreDatabaseOptions } from "../../classes/swarm-store-class/index";
import { SwarmMessagesDatabaseCache } from '../../classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-cache/swarm-messages-database-cache';
import { getMainConnectorFabricWithEntriesCountDefault } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-to-swarm-connector-fabrics';
import { SwarmMessagesDatabaseCacheWithEntitiesCount } from '../../classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-cache-with-entities-count/swarm-messages-database-cache-with-entities-count';
import { connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-database-list-storage-fabrics';
import { SerializerClass } from '../../classes/basic-classes/serializer-class';
import { connectorBasicFabricOrbitDBWithEntriesCount } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-to-swarm-database-fabrics';
import { swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer } from '../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-swarm-store-fabrics';
import { asyncValidateVerboseBySchemaWithVoidResult } from '../../utils/validation-utils/validation-utils';
export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY = 'key';
export const CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY = {
    iss: 'test connection',
    typ: 1,
    pld: 'Hello',
    ts: 0,
};
export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_1 = {
    login: 'tebar13028@hrandod.com',
    password: 'qwdfrerwd',
};
export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1 = '02https://protocol-firebase-default-rtdb.firebaseio.com|dlGUW2tKOjZDYYjE4U25CMbaNCF3';
export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_2 = {
    login: 'kerzucolta@nedoz.com',
    password: 'sdfsdf4r',
};
export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2 = '02https://protocol-firebase-default-rtdb.firebaseio.com|f7Yy0au1vuM2e7c9PJSwmrliHyz2';
export var CONNECT_TO_SWARM_AUTH_PROVIDERS;
(function (CONNECT_TO_SWARM_AUTH_PROVIDERS) {
    CONNECT_TO_SWARM_AUTH_PROVIDERS["FIREBASE_WATCHA"] = "https://protocol-firebase-default-rtdb.firebaseio.com";
    CONNECT_TO_SWARM_AUTH_PROVIDERS["FIREBASE_PRTOCOL"] = "https://protocol-firebase-central-default-rtdb.firebaseio.com";
})(CONNECT_TO_SWARM_AUTH_PROVIDERS || (CONNECT_TO_SWARM_AUTH_PROVIDERS = {}));
export const CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT = ESwarmStoreConnector.OrbitDB;
const CONNECT_TO_SWARM_DATABASE_PREFIX = 'chat/test';
export const CONNECT_TO_SWARM_DATABASE_MAIN_NAME = `${CONNECT_TO_SWARM_DATABASE_PREFIX}/database_main`;
export const CONNECT_TO_SWARM_DATABASE_MAIN = {
    dbName: CONNECT_TO_SWARM_DATABASE_MAIN_NAME,
    isPublic: true,
    useEncryptedStorage: true,
    preloadCount: 10,
    dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
};
export const CONNECT_TO_SWARM_DATABASE_MAIN_2 = {
    dbName: CONNECT_TO_SWARM_DATABASE_MAIN_NAME,
    isPublic: true,
    useEncryptedStorage: true,
    preloadCount: 10,
    dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
};
export const CONNECT_TO_SWARM_DATABASES_DEFAULT = [CONNECT_TO_SWARM_DATABASE_MAIN];
export const CONNECT_TO_SWARM_CONNECTION_USER_OPTIONS = {
    profile: {},
};
export const CONNECT_TO_SWARM_CONNECTION_STORAGE_OPTIONS = {
    accessControl: {
        grantAccess: function grantAccess(message, userId, dbName, key, op) {
            console.log(this);
            if (process.env.NODE_ENV === 'development')
                debugger;
            return Promise.resolve(true);
        },
    },
    swarmMessageConstructorFabric: undefined,
    connectorBasicFabric: connectorBasicFabricOrbitDBWithEntriesCount,
    connectorMainFabric: undefined,
    getMainConnectorFabric: undefined,
    swarmStoreDatabasesPersistentListFabric: connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault,
    provider: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
    directory: CONNECT_TO_SWARM_DATABASE_PREFIX,
    databases: [],
    swarmMessageStoreInstanceFabric: swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer,
};
export const CONNECT_TO_SWARM_CONNECTION_STORAGE_WITH_STORE_META_OPTIONS = {
    accessControl: {
        grantAccess: function grandAccess(message, userId, dbName, key, op) {
            console.log(this);
            return Promise.resolve(true);
        },
    },
    swarmMessageConstructorFabric: undefined,
    connectorBasicFabric: connectorBasicFabricOrbitDBWithEntriesCount,
    connectorMainFabric: undefined,
    getMainConnectorFabric: getMainConnectorFabricWithEntriesCountDefault,
    provider: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
    directory: CONNECT_TO_SWARM_DATABASE_PREFIX,
    databases: [],
    swarmStoreDatabasesPersistentListFabric: connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault,
    swarmMessageStoreInstanceFabric: swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer,
};
export const CONNECT_TO_SWARM_CONNECTION_AUTH_OPTOINS = {
    providerUrl: CONNECT_TO_SWARM_AUTH_PROVIDERS.FIREBASE_WATCHA,
    session: {},
    credentials: undefined,
};
export const CONNECT_TO_SWARM_CONNECTION_NATIVE_CONNECTION_OPTIONS = {};
export const CONNECT_TO_SWARM_CONNECTION_OPTIONS = {
    serializer: new SerializerClass(),
    jsonSchemaValidator: asyncValidateVerboseBySchemaWithVoidResult,
    swarmStoreConnectorType: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
    user: CONNECT_TO_SWARM_CONNECTION_USER_OPTIONS,
    auth: CONNECT_TO_SWARM_CONNECTION_AUTH_OPTOINS,
    storage: CONNECT_TO_SWARM_CONNECTION_STORAGE_OPTIONS,
    nativeConnection: CONNECT_TO_SWARM_CONNECTION_NATIVE_CONNECTION_OPTIONS,
};
export const CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS = {
    swarmStoreConnectorType: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
    user: CONNECT_TO_SWARM_CONNECTION_USER_OPTIONS,
    auth: CONNECT_TO_SWARM_CONNECTION_AUTH_OPTOINS,
    storage: CONNECT_TO_SWARM_CONNECTION_STORAGE_WITH_STORE_META_OPTIONS,
    nativeConnection: CONNECT_TO_SWARM_CONNECTION_NATIVE_CONNECTION_OPTIONS,
    serializer: new SerializerClass(),
    jsonSchemaValidator: asyncValidateVerboseBySchemaWithVoidResult,
};
const SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_INSTANCE = SwarmMessagesDatabaseCache;
export const CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_OPTIONS = {
    cacheConstructor: SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_INSTANCE,
};
const SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_WITH_STORE_META_INSTANCE = SwarmMessagesDatabaseCacheWithEntitiesCount;
export const CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_WITH_STORE_META_OPTIONS = {
    cacheConstructor: SWARM_MESSAGES_DATABASE_CACHE_CONSTRUCTOR_WITH_STORE_META_INSTANCE,
};
//# sourceMappingURL=connect-to-swarm.const.js.map