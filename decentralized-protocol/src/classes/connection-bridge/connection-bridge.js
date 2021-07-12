import { __awaiter } from "tslib";
import assert from 'assert';
import { extend } from "../../utils";
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import { CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL, CONNECTION_BRIDGE_SESSION_STORAGE_KEYS, CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX, CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT, } from './connection-bridge.const';
import { CentralAuthority } from '../central-authority-class/central-authority-class';
import { ISensitiveDataSessionStorage } from "../sensitive-data-session-storage/sensitive-data-session-storage.types";
import { SensitiveDataSessionStorage } from "../sensitive-data-session-storage";
import { CONNECTION_BRIDGE_STORAGE_DATABASE_NAME, CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE as CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE_OPTIONS, } from './connection-bridge.const';
import { getSwarmMessageEncryptedCacheFabric, getSwarmMessageConstructorWithCacheFabric, } from '../swarm-message-encrypted-cache/swarm-message-encrypted-cache.utils';
import { SecretStorage } from '../secret-storage-class/secret-storage-class';
import { createNativeConnection } from './connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-native-connection-fabrics';
import { calculateHash } from '@pashoo2/crypto-utilities';
import { connectorBasicFabricOrbitDBDefault, getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector, } from './connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-to-swarm-database-fabrics';
import { getMainConnectorFabricDefault } from './connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-to-swarm-connector-fabrics';
export class ConnectionBridge {
    constructor() {
        this.getSwarmStoreConnectorConstructorOptionsByConnectionBridgeOptions = (userId, credentials) => {
            const options = this._getOptions();
            switch (options.swarmStoreConnectorType) {
                case ESwarmStoreConnector.OrbitDB:
                    return this.getSwarmStoreOrbitDbConnectorConstructorOptionsByConnectionBridgeOptions(userId, credentials, options.storage);
                default:
                    throw new Error('Unsupported connector type');
            }
        };
        this._getPersistentEncryptedStorageForStoreDatabasesListPersistentStorage = (storagePrefix) => {
            return this.startEncryptedCache(storagePrefix);
        };
        this.createNativeConnection = () => {
            var _a;
            if (!this.swarmStoreConnectorType) {
                throw new Error('Swarm store connector type should be defined');
            }
            if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.nativeConnection)) {
                throw new Error('There is no options for the native connection');
            }
            return createNativeConnection(this.swarmStoreConnectorType, this.options.nativeConnection);
        };
        this.setCurrentSwarmConnection = (swarmConnection) => {
            this.swarmConnection = swarmConnection;
        };
        this.connectToSwarmMessageStore = (swarmMessageStorage) => __awaiter(this, void 0, void 0, function* () {
            const swarmMessageStorageOptions = yield this.getOptionsMessageStorage();
            const result = yield swarmMessageStorage.connect(swarmMessageStorageOptions);
            if (result instanceof Error) {
                throw result;
            }
        });
        this.setCurrentSwarmMessageStorage = (swarmMessageStorage) => {
            this._swarmMessageStore = swarmMessageStorage;
        };
    }
    static joinKeyPartsUsedForStorageValue(...parts) {
        return parts.join(CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT);
    }
    get swarmMessageStore() {
        return this._swarmMessageStore;
    }
    get centralAuthorityConnection() {
        return this._centralAuthorityConnection;
    }
    get secretStorage() {
        return this._secretStorage;
    }
    get swarmStoreConnectorType() {
        var _a;
        return (_a = this.options) === null || _a === void 0 ? void 0 : _a.swarmStoreConnectorType;
    }
    get sensitiveDataStorageOptions() {
        var _a;
        return (_a = this.options) === null || _a === void 0 ? void 0 : _a.auth.session;
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createAndSetSessionSensitiveDataStoreForConnectionBridgeSessionIfNotExists();
            try {
                yield this.validateAndSetOptions(options);
                const { sensitiveDataStorageOptions } = this;
                if (sensitiveDataStorageOptions) {
                    yield this.createAndSetSensitiveDataStorageForMainSession(sensitiveDataStorageOptions);
                }
                yield this.createAndSetSequentlyDependenciesInstances();
                if (sensitiveDataStorageOptions) {
                    yield this.markSessionAsStartedInStorageForSession();
                }
                this.setCurrentSecretStorageInstance(yield this.createAndAutorizeInSecretStorage());
            }
            catch (err) {
                console.error('connection to the swarm failed', err);
                yield this.close();
                throw err;
            }
        });
    }
    checkSessionAvailable(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionParams = this.getSessionParamsOrUndefinedFromConnectionBridgeOrSensitiveDataSessionStorageOptions(options);
            if (!sessionParams) {
                return false;
            }
            const connectionBridgeSessionDataStore = yield this.createSessionSensitiveDataStoreForConnectionBridgeSession(this.getOptionsForSensitiveDataStoreDuringCheckSessionAvailable());
            const userLogin = yield this.readUserLoginKeyValueFromConnectionBridgeSessionDataStore(connectionBridgeSessionDataStore);
            if (!this.isUserLogin(userLogin)) {
                return false;
            }
            yield connectionBridgeSessionDataStore.close();
            const mainSessionDataStore = yield this.createMainSensitiveDataStorageForSession(Object.assign(Object.assign({}, sessionParams), { clearStorageAfterConnect: false }));
            const sessionDataIsExists = yield this.whetherAnySessionDataExistsInSensitiveDataSessionStorage(mainSessionDataStore);
            yield mainSessionDataStore.close();
            return sessionDataIsExists;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.closeSwarmConnection();
            yield this.closeCurrentCentralAuthorityConnection();
            yield this._closeSwarmDatabasesListPersistentStorage();
            this.closeSwarmMessageEncryptedCacheFabric();
            this.closeSwarmMessageConstructorFabric();
            yield this.closeSensitiveDataStorages();
            yield this.closeStorage();
            this.closeMessageConstructor();
            this._unsetSerializer();
        });
    }
    isUserLogin(userLogin) {
        return Boolean(userLogin) && typeof userLogin === 'string';
    }
    checkCurrentOptionsIsDefined() {
        if (!this.options) {
            throw new Error('Options should be defined');
        }
        return true;
    }
    _getOptions() {
        if (this.checkCurrentOptionsIsDefined()) {
            return this.options;
        }
        throw new Error('Current options are not defined');
    }
    _getStorageOptions() {
        const storageOptions = this._getOptions().storage;
        assert(storageOptions, 'There is no storage options exists');
        return storageOptions;
    }
    _getCentralAuthorityConnection() {
        const centralAuthorityConnection = this._centralAuthorityConnection;
        if (!centralAuthorityConnection) {
            throw new Error('There is no connection with the central authority');
        }
        return centralAuthorityConnection;
    }
    _setSerializer(serializer) {
        this._serializer = serializer;
    }
    _validateSerializerInstance(serializer) {
        assert(typeof serializer === 'object', 'Serializer should be an object');
        assert(typeof serializer.parse === 'function', 'Serializer should have the "parse" method');
        assert(typeof serializer.stringify === 'function', 'Serializer should have the "stringify" method');
    }
    _getSerializerCurrentInstance() {
        const serializer = this._serializer;
        if (!serializer) {
            throw new Error('A serializer instance is not defined');
        }
        return serializer;
    }
    _setSerializerInstanceFromOptionsOrDefault(options) {
        const { serializer } = options;
        this._validateSerializerInstance(serializer);
        this._setSerializer(serializer);
    }
    _getSerializer() {
        const serializer = this._serializer;
        if (!serializer) {
            throw new Error('Thre is no an active serializer instance');
        }
        return serializer;
    }
    _unsetSerializer() {
        this._serializer = undefined;
    }
    validatetCurrentUserOptions() {
        const { user: userOptions } = this._getOptions();
        assert(userOptions, 'User options must be defined');
        assert(typeof userOptions === 'object', 'User options must be an object');
    }
    getOptionsForSensitiveDataStoreDuringCheckSessionAvailable() {
        return Object.assign(Object.assign({}, CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE_OPTIONS), { clearStorageAfterConnect: false });
    }
    createOptionsForCentralAuthority(authOptions, userOptions) {
        const authProvidersPool = extend(authOptions.authProvidersPool, CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL);
        return {
            user: {
                profile: userOptions.profile,
                authProviderUrl: authOptions.providerUrl,
                credentials: this.getCredentialsWithSession(),
            },
            authProvidersPool,
        };
    }
    setOptionsCentralAuthority(optionsCentralAuthority) {
        this.optionsCentralAuthority = optionsCentralAuthority;
    }
    createOptionsForCentralAuthorityWithCurrentConnectionBridgeOptions() {
        const { auth: authOptions, user: userOptions } = this._getOptions();
        return this.createOptionsForCentralAuthority(authOptions, userOptions);
    }
    createOptionsCentralAuthority() {
        if (!this.checkCurrentOptionsIsDefined()) {
            throw new Error('Options must be defined');
        }
        this.validatetCurrentUserOptions();
        const optionsCentralAuthority = this.createOptionsForCentralAuthorityWithCurrentConnectionBridgeOptions();
        return optionsCentralAuthority;
    }
    createOptionsMessageConstructor() {
        const caConnection = this._getCentralAuthorityConnection();
        return {
            caConnection,
            instances: {
                encryptedCache: this.swarmMessageEncryptedCache,
            },
        };
    }
    getConnectorBasicFabricToUseInSwarmStoreConnectionProviderOptionsForSwarmStoreConnector() {
        var _a, _b;
        return ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.storage.connectorBasicFabric) !== null && _b !== void 0 ? _b : connectorBasicFabricOrbitDBDefault);
    }
    getSwarmStoreConnectionProviderOptions(swarmConnection) {
        const { swarmStoreConnectorType } = this;
        if (!swarmStoreConnectorType) {
            throw new Error('Uknown connector type');
        }
        const connectorBasicFabric = this.getConnectorBasicFabricToUseInSwarmStoreConnectionProviderOptionsForSwarmStoreConnector();
        const swarmStoreConnectionProviderOptions = getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector(swarmStoreConnectorType, swarmConnection, connectorBasicFabric);
        return swarmStoreConnectionProviderOptions;
    }
    getCurrentUserIdentityFromCurrentConnectionToCentralAuthority() {
        const caConnection = this._getCentralAuthorityConnection();
        const userId = caConnection.getUserIdentity();
        if (userId instanceof Error) {
            throw userId;
        }
        return userId;
    }
    getSwarmStoreConnectionProviderOptionsFromCurrentOptions() {
        const { swarmConnection } = this;
        if (!swarmConnection) {
            throw new Error('There is no swarm connection provider');
        }
        return this.getSwarmStoreConnectionProviderOptions(swarmConnection);
    }
    _getDefaultSwarmMessageConstructor() {
        const { messageConstructor } = this;
        if (!messageConstructor) {
            throw new Error('There is no message constructor defined');
        }
        return messageConstructor;
    }
    getMessageConstructorOptionsForMessageStoreFromCurrentOptions() {
        return {
            default: this._getDefaultSwarmMessageConstructor(),
        };
    }
    getSecretStoreCredentialsOptionsForMessageStoreFromCurrentOptions() {
        return this.getCredentialsWithSession();
    }
    getSwarmStoreOrbitDbConnectorConstructorOptionsByConnectionBridgeOptions(userId, credentials, storageOptions) {
        return {
            userId,
            credentials,
            databases: storageOptions.databases,
            directory: storageOptions.directory,
        };
    }
    getConnectorMainFabricFromCurrentOptionsIfExists() {
        return this._getStorageOptions().connectorMainFabric;
    }
    getMainConnectorFabricUtilFromCurrentOptionsIfExists() {
        return this._getStorageOptions().getMainConnectorFabric;
    }
    _getSwarmDatabasesListPersistentStorageFabricFromCurrentOptions() {
        const swarmStorageDatabasesPersistentListFabricFromOptions = this._getStorageOptions().swarmStoreDatabasesPersistentListFabric;
        if (!swarmStorageDatabasesPersistentListFabricFromOptions) {
            throw new Error('There is no swarm storage databases persistent list fabric is provided in the options');
        }
        return swarmStorageDatabasesPersistentListFabricFromOptions;
    }
    getUtilGetMainConnectorFabricForMessageStore() {
        return this.getMainConnectorFabricUtilFromCurrentOptionsIfExists() || getMainConnectorFabricDefault;
    }
    createMainConnectorFabricForMessageStoreByCurrentOptions(userId, credentials) {
        if (!this.swarmStoreConnectorType) {
            throw new Error('Swarm store connector type should be defined');
        }
        const swarmStoreConnectorOptions = this.getSwarmStoreConnectorConstructorOptionsByConnectionBridgeOptions(userId, credentials);
        return this.getUtilGetMainConnectorFabricForMessageStore()(swarmStoreConnectorOptions);
    }
    getMainConnectorFabricForSwarmMessageStore(userId, credentials) {
        return (this.getConnectorMainFabricFromCurrentOptionsIfExists() ||
            this.createMainConnectorFabricForMessageStoreByCurrentOptions(userId, credentials));
    }
    _getKeyPrefixForDatabasesLisInPersistentStorageForCurrentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const jointStoragePrefix = ConnectionBridge.joinKeyPartsUsedForStorageValue(CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.DATABASE_LIST_STORAGE, this.getCurrentUserIdentityFromCurrentConnectionToCentralAuthority());
            const jointStoragePrefixHashCalcResult = yield calculateHash(jointStoragePrefix);
            if (jointStoragePrefixHashCalcResult instanceof Error) {
                throw jointStoragePrefixHashCalcResult;
            }
            return jointStoragePrefixHashCalcResult;
        });
    }
    _getSwarmDatabasesListPersistentStorageFabricOptionsFromCurrentOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageKeyPrefix = yield this._getKeyPrefixForDatabasesLisInPersistentStorageForCurrentUser();
            const persistentStorageForDatabasesList = yield this._getPersistentEncryptedStorageForStoreDatabasesListPersistentStorage(storageKeyPrefix);
            return {
                persistentStorage: persistentStorageForDatabasesList,
                serializer: this._getSerializer(),
                keyPrefixForDatabasesLisInPersistentStorage: storageKeyPrefix,
            };
        });
    }
    _setCurrentSwarmDatabasesListPersistentStorage(swarmDatabasesListPersistentStorage) {
        this._swarmConnectorDatabasesPeristentList = swarmDatabasesListPersistentStorage;
    }
    _createSwarmDatabasesListPersistentStorageByCurrentOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const swarmDatabasesListPersistentStorageFabric = this._getSwarmDatabasesListPersistentStorageFabricFromCurrentOptions();
            const swarmDatabasesListPersistentStorageFabricOptions = yield this._getSwarmDatabasesListPersistentStorageFabricOptionsFromCurrentOptions();
            return (yield swarmDatabasesListPersistentStorageFabric(swarmDatabasesListPersistentStorageFabricOptions));
        });
    }
    _createSwarmDatabasesListPersistentStorageByCurrentOptionsAndSetAsCurrent() {
        return __awaiter(this, void 0, void 0, function* () {
            const databasesPersistentListStorage = yield this._createSwarmDatabasesListPersistentStorageByCurrentOptions();
            this._setCurrentSwarmDatabasesListPersistentStorage(databasesPersistentListStorage);
            return databasesPersistentListStorage;
        });
    }
    _getCurrentSwarmDatabasesListPersistentStorageOrCreateNew() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return ((_a = this._swarmConnectorDatabasesPeristentList) !== null && _a !== void 0 ? _a : (yield this._createSwarmDatabasesListPersistentStorageByCurrentOptionsAndSetAsCurrent()));
        });
    }
    _closeSwarmDatabasesListPersistentStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentSwarmDatabasesListPersistentStorage = this._swarmConnectorDatabasesPeristentList;
            if (currentSwarmDatabasesListPersistentStorage) {
                yield currentSwarmDatabasesListPersistentStorage.close();
            }
        });
    }
    getAccessControlOptionsToUse() {
        const { storage: storageOptions } = this._getOptions();
        const { accessControl } = storageOptions;
        return accessControl;
    }
    getSwarmMessageStoreOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const { swarmStoreConnectorType } = this;
            if (!swarmStoreConnectorType) {
                throw new Error('Connector type is not defined');
            }
            const swarmMessageConstructorFabric = this.swarmMessageConstructorFabric;
            if (!swarmMessageConstructorFabric) {
                throw new Error('Swarm messages constructor fabric should be defined');
            }
            const { storage: storageOptions } = this._getOptions();
            const { directory, databases } = storageOptions;
            const credentials = this.getSecretStoreCredentialsOptionsForMessageStoreFromCurrentOptions();
            const userId = this.getCurrentUserIdentityFromCurrentConnectionToCentralAuthority();
            const persistentDatbasesList = yield this._getCurrentSwarmDatabasesListPersistentStorageOrCreateNew();
            return {
                provider: swarmStoreConnectorType,
                directory,
                databases,
                credentials,
                userId,
                persistentDatbasesList,
                swarmMessageConstructorFabric,
                accessControl: this.getAccessControlOptionsToUse(),
                messageConstructors: this.getMessageConstructorOptionsForMessageStoreFromCurrentOptions(),
                providerConnectionOptions: this.getSwarmStoreConnectionProviderOptionsFromCurrentOptions(),
                connectorFabric: this.getMainConnectorFabricForSwarmMessageStore(userId, credentials),
            };
        });
    }
    getOptionsMessageStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsStorage = yield this.getSwarmMessageStoreOptions();
            return optionsStorage;
        });
    }
    createSensitiveDataStorageInstance() {
        return new SensitiveDataSessionStorage();
    }
    connectSensitiveDataStoreConnectionBridgeSession(dataStore, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dataStore.connect(options);
        });
    }
    createSessionSensitiveDataStoreForConnectionBridgeSession(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionBridgeSessoinSensitiveDataStore = this.createSensitiveDataStorageInstance();
            yield this.connectSensitiveDataStoreConnectionBridgeSession(connectionBridgeSessoinSensitiveDataStore, options);
            return connectionBridgeSessoinSensitiveDataStore;
        });
    }
    createAndSetSessionSensitiveDataStoreForConnectionBridgeSessionIfNotExists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connectionBridgeSessionDataStore) {
                this.connectionBridgeSessionDataStore = yield this.createSessionSensitiveDataStoreForConnectionBridgeSession(CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE_OPTIONS);
            }
        });
    }
    setOptions(options) {
        this.options = options;
    }
    checkConnectionBridgeSessionDataStoreIsReady() {
        const { connectionBridgeSessionDataStore: userDataStore } = this;
        if (!userDataStore) {
            throw new Error('User data store is not initialized');
        }
        return true;
    }
    getAcitveConnectionBridgeSessionDataStore() {
        if (this.checkConnectionBridgeSessionDataStoreIsReady()) {
            return this.connectionBridgeSessionDataStore;
        }
        throw new Error('User sensitive data store is not initialized');
    }
    setValueInConnectionBridgeSessionDataStore(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAcitveConnectionBridgeSessionDataStore().setItem(key, value);
        });
    }
    readUserLoginKeyValueFromConnectionBridgeSessionDataStore(connectionBridgeSessionActiveDataStore) {
        return connectionBridgeSessionActiveDataStore.getItem(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN);
    }
    readUserLoginFromConnectionBridgeSessionStore() {
        return __awaiter(this, void 0, void 0, function* () {
            const userLogin = yield this.readUserLoginKeyValueFromConnectionBridgeSessionDataStore(this.getAcitveConnectionBridgeSessionDataStore());
            if (!this.isUserLogin(userLogin)) {
                return;
            }
            return userLogin;
        });
    }
    getUserLoginFromConnectionBridgeSessionDataStore() {
        return __awaiter(this, void 0, void 0, function* () {
            const login = yield this.readUserLoginFromConnectionBridgeSessionStore();
            if (!login) {
                throw new Error('There is no login provided in options and no session data found to get it');
            }
            return login;
        });
    }
    validateOptions(options) {
        assert(options, 'Options must be provided');
        assert(typeof options === 'object', 'Options must be an object');
        assert(options.swarmStoreConnectorType, 'swarmStoreConnectorType should be defined');
        return true;
    }
    isOptionsWithCredentials(options) {
        var _a;
        return !!((_a = options.auth.credentials) === null || _a === void 0 ? void 0 : _a.login);
    }
    setUserLoginFromOptionsInConnectionBridgeSessionDataStore(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return void (yield this.setValueInConnectionBridgeSessionDataStore(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN, options.auth.credentials.login));
        });
    }
    setOptionsWithUserCredentialsProvided(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setUserLoginFromOptionsInConnectionBridgeSessionDataStore(options);
            this.setOptions(options);
        });
    }
    setCurrentOptionsWithoutUserCredentials(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            assert(options.auth.session, 'A session must be started if there is no credentials provided');
            const login = yield this.getUserLoginFromConnectionBridgeSessionDataStore();
            if (!login) {
                throw new Error('There is no login provided in options and no session data found to get it');
            }
            this.options = Object.assign(Object.assign({}, options), { auth: Object.assign(Object.assign({}, options.auth), { credentials: Object.assign(Object.assign({}, ((_a = options.auth.credentials) !== null && _a !== void 0 ? _a : {})), { login }) }) });
        });
    }
    validateAndSetOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateOptions(options);
            this._setSerializerInstanceFromOptionsOrDefault(options);
            if (this.isOptionsWithCredentials(options)) {
                yield this.setOptionsWithUserCredentialsProvided(options);
            }
            else {
                yield this.setCurrentOptionsWithoutUserCredentials(options);
            }
        });
    }
    getSensitiveDataStoragePrefixForSession(sessionParams) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield calculateHash(`${(_a = sessionParams.storagePrefix) !== null && _a !== void 0 ? _a : ''}${CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT}`);
            if (hash instanceof Error) {
                throw hash;
            }
            return hash;
        });
    }
    connectToSensitiveDataStorage(sensitiveDataStorageParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionDataStorage = this.createSensitiveDataStorageInstance();
            yield sessionDataStorage.connect(Object.assign(Object.assign({}, sensitiveDataStorageParams), { storagePrefix: yield this.getSensitiveDataStoragePrefixForSession(sensitiveDataStorageParams) }));
            return sessionDataStorage;
        });
    }
    setCurrentSessionSensitiveDataStorage(sessionSensitiveStorage) {
        this.sessionSensitiveStorage = sessionSensitiveStorage;
    }
    createMainSensitiveDataStorageForSession(sensitiveDataStorageOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sensitiveDataStorageOptions) {
                throw new Error('Params for the sensitive data storage should be defined to start the session');
            }
            return yield this.connectToSensitiveDataStorage(sensitiveDataStorageOptions);
        });
    }
    createAndSetSensitiveDataStorageForMainSession(sensitiveDataStorageOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setCurrentSessionSensitiveDataStorage(yield this.createMainSensitiveDataStorageForSession(sensitiveDataStorageOptions));
        });
    }
    createCentralAuthorityInstnace(optionsCentralAuthority) {
        return __awaiter(this, void 0, void 0, function* () {
            const centralAuthority = new CentralAuthority();
            const connectionResult = yield centralAuthority.connect(optionsCentralAuthority);
            if (connectionResult instanceof Error) {
                throw connectionResult;
            }
            return centralAuthority;
        });
    }
    setCurrentCentralAuthorityConnection(centralAuthority) {
        this._centralAuthorityConnection = centralAuthority;
    }
    createAndStartConnectionWithCentralAuthority() {
        return __awaiter(this, void 0, void 0, function* () {
            const optioinsCA = this.createOptionsCentralAuthority();
            this.setOptionsCentralAuthority(optioinsCA);
            return yield this.createCentralAuthorityInstnace(optioinsCA);
        });
    }
    setCurrentSwarmMessageConstructor(swarmMessageConstructor) {
        this.messageConstructor = swarmMessageConstructor;
    }
    createSwarmMessageConstructor() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.swarmMessageConstructorFabric) {
                throw new Error('Swarm message constructor fabric must be created before');
            }
            return yield this.swarmMessageConstructorFabric(this.createOptionsMessageConstructor());
        });
    }
    createSwarmConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeConnection = yield this.createNativeConnection();
            return {
                getNativeConnection() {
                    return nativeConnection;
                },
            };
        });
    }
    getCredentialsWithSession() {
        const { auth: { credentials }, } = this._getOptions();
        const sessionDataStorage = this.sessionSensitiveStorage;
        if (!credentials) {
            throw new Error('Credentials should be specified');
        }
        const { login, password } = credentials;
        if (!login) {
            throw new Error('Login should be specified');
        }
        if (password) {
            return {
                login,
                password,
                session: sessionDataStorage,
            };
        }
        if (!sessionDataStorage) {
            throw new Error('Password or session should be defined');
        }
        return {
            login,
            password,
            session: sessionDataStorage,
        };
    }
    getDatabaseNamePrefixForEncryptedCahce(userLogin) {
        return `__${CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.MESSAGE_CACHE_STORAGE}${CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT}${userLogin}`;
    }
    setCurrentSwarmMessageEncryptedCacheFabric(swarmMessageEncryptedCacheFabric) {
        this.swarmMessageEncryptedCacheFabric = swarmMessageEncryptedCacheFabric;
    }
    createSwarmMessageEncryptedCacheFabric() {
        return __awaiter(this, void 0, void 0, function* () {
            const authOptions = this.getCredentialsWithSession();
            return yield getSwarmMessageEncryptedCacheFabric(this.getCredentialsWithSession(), this.getDatabaseNamePrefixForEncryptedCahce(authOptions.login));
        });
    }
    getSwarmMessageConstructorOptions() {
        return {
            caConnection: this._getCentralAuthorityConnection(),
            instances: {},
        };
    }
    setCurrentSwarmMessageConstructorFabric(swarmMessageConstructorFabric) {
        this.swarmMessageConstructorFabric = swarmMessageConstructorFabric;
    }
    getSwarmMessageConstructorFabricFromOptions() {
        return this._getOptions().storage.swarmMessageConstructorFabric;
    }
    createSwarmMessageConstructorFabric() {
        return __awaiter(this, void 0, void 0, function* () {
            const authOptions = this.getCredentialsWithSession();
            return yield getSwarmMessageConstructorWithCacheFabric(authOptions, this.getSwarmMessageConstructorOptions(), this.getDatabaseNamePrefixForEncryptedCahce(authOptions.login));
        });
    }
    getSwarmMessageConstructorFabric() {
        return __awaiter(this, void 0, void 0, function* () {
            const swarmMessageConstructorFabricFromOptions = this.getSwarmMessageConstructorFabricFromOptions();
            if (swarmMessageConstructorFabricFromOptions) {
                return swarmMessageConstructorFabricFromOptions;
            }
            return yield this.createSwarmMessageConstructorFabric();
        });
    }
    getDatabaseNameForEncryptedCacheInstance(dbNamePrefix) {
        const userLogin = this.getCredentialsWithSession().login;
        return `${dbNamePrefix}${CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT}${userLogin}`;
    }
    getOptionsForSwarmMessageEncryptedFabric(dbNamePrefix) {
        return {
            dbName: this.getDatabaseNameForEncryptedCacheInstance(dbNamePrefix),
        };
    }
    startEncryptedCache(dbNamePrefix) {
        if (!this.swarmMessageEncryptedCacheFabric) {
            throw new Error('Encrypted cache fabric must be started before');
        }
        const optionsForSwarmMessageEncryptedCacheFabric = this.getOptionsForSwarmMessageEncryptedFabric(dbNamePrefix);
        return this.swarmMessageEncryptedCacheFabric(optionsForSwarmMessageEncryptedCacheFabric);
    }
    setCurrentSwarmMessageEncryptedCache(swarmMessageEncryptedCache) {
        this.swarmMessageEncryptedCache = swarmMessageEncryptedCache;
    }
    createSwarmMessageEncryptedCache() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.swarmMessageEncryptedCacheFabric) {
                throw new Error('Encrypted cache fabric must be started before');
            }
            return yield this.startEncryptedCache(CONNECTION_BRIDGE_STORAGE_DATABASE_NAME.MESSAGE_CACHE_STORAGE);
        });
    }
    createSwarmMessageStoreInstanceByOptionsFabric() {
        const { swarmMessageStoreInstanceFabric } = this._getStorageOptions();
        assert(swarmMessageStoreInstanceFabric, 'swarmMessageStoreInstanceFabric should be defined in the storage options');
        return swarmMessageStoreInstanceFabric();
    }
    createSwarmMessageStoreInstance() {
        return this.createSwarmMessageStoreInstanceByOptionsFabric();
    }
    createAndStartSwarmMessageStorageConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const swarmMessageStorage = this.createSwarmMessageStoreInstance();
            yield this.connectToSwarmMessageStore(swarmMessageStorage);
            return swarmMessageStorage;
        });
    }
    closeStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const { swarmMessageStore: storage } = this;
            if (storage) {
                try {
                    yield storage.close();
                }
                catch (err) {
                    console.error('Failed to close the connection to the swarm message storage', err);
                }
            }
            else {
                console.warn('closeSwarmMessageStorage - there is no connection');
            }
            this.setCurrentSwarmMessageStorage(undefined);
            this.optionsMessageStorage = undefined;
        });
    }
    closeMessageConstructor() {
        this.messageConstructor = undefined;
    }
    closeSwarmConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const { swarmConnection } = this;
            if (swarmConnection) {
                const nativeConnection = swarmConnection.getNativeConnection();
                try {
                    yield nativeConnection.stop();
                }
                catch (error) {
                    console.error('closeSwarmConnection failed to stop the ipfs node!', error);
                }
            }
            this.swarmConnection = undefined;
            this.optionsSwarmConnection = undefined;
        });
    }
    closeSwarmMessageEncryptedCacheFabric() {
        this.swarmMessageEncryptedCacheFabric = undefined;
    }
    closeSwarmMessageConstructorFabric() {
        this.swarmMessageConstructorFabric = undefined;
    }
    closeCurrentCentralAuthorityConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const { _centralAuthorityConnection: caConnection } = this;
            if (caConnection) {
                try {
                    yield caConnection.disconnect();
                }
                catch (err) {
                    console.error('closeCentralAuthorityConnection failed to close the connection to the central authority', err);
                }
            }
            this._centralAuthorityConnection = undefined;
            this.optionsCentralAuthority = undefined;
        });
    }
    setFlagInSessionStorageSessionDataIsExists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sessionSensitiveStorage) {
                throw new Error('Session sensitive storage is not exists for the current session');
            }
            yield this.sessionSensitiveStorage.setItem(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.SESSION_DATA_AVAILABLE, true);
        });
    }
    markSessionAsStartedInStorageForSession() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setFlagInSessionStorageSessionDataIsExists();
        });
    }
    getSecretStorageDBName() {
        const userLogin = this.getCredentialsWithSession().login;
        return `${CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.SECRET_STORAGE}${CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT}${userLogin}`;
    }
    getSecretStorageDBOptions() {
        return {
            dbName: this.getSecretStorageDBName(),
        };
    }
    createSecretStorageInstance() {
        return new SecretStorage();
    }
    authorizeInSecretStorage(secretStorage) {
        return __awaiter(this, void 0, void 0, function* () {
            const authResult = yield secretStorage.authorize(this.getCredentialsWithSession(), this.getSecretStorageDBOptions());
            if (authResult !== true) {
                throw authResult === false ? new Error('Conntection to the secret storage failed') : authResult;
            }
        });
    }
    setCurrentSecretStorageInstance(secretStorage) {
        this._secretStorage = secretStorage;
    }
    createAndAutorizeInSecretStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const secretStorage = this.createSecretStorageInstance();
            yield this.authorizeInSecretStorage(secretStorage);
            return secretStorage;
        });
    }
    isConnectionBridgeOptionsWithSession(options) {
        var _a;
        return !!((_a = options.auth) === null || _a === void 0 ? void 0 : _a.session);
    }
    getSessionParamsOrUndefinedFromConnectionBridgeOrSensitiveDataSessionStorageOptions(options) {
        if (!options) {
            return undefined;
        }
        return this.isConnectionBridgeOptionsWithSession(options) ? options.auth.session : options;
    }
    whetherAnySessionDataExistsInSensitiveDataSessionStorage(sensitiveDataStorage) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield sensitiveDataStorage.getItem(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.SESSION_DATA_AVAILABLE));
        });
    }
    createAndSetSequentlyDependenciesInstances() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setCurrentCentralAuthorityConnection(yield this.createAndStartConnectionWithCentralAuthority());
            this.setCurrentSwarmMessageEncryptedCacheFabric(yield this.createSwarmMessageEncryptedCacheFabric());
            this.setCurrentSwarmMessageConstructorFabric(yield this.getSwarmMessageConstructorFabric());
            this.setCurrentSwarmMessageEncryptedCache(yield this.createSwarmMessageEncryptedCache());
            this.setCurrentSwarmMessageConstructor(yield this.createSwarmMessageConstructor());
            this.setCurrentSwarmConnection(yield this.createSwarmConnection());
            this.setCurrentSwarmMessageStorage(yield this.createAndStartSwarmMessageStorageConnection());
        });
    }
    closeAndUnsetCurrentSessionSensitiveStorage() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.sessionSensitiveStorage) === null || _a === void 0 ? void 0 : _a.close());
            this.sessionSensitiveStorage = undefined;
        });
    }
    closeAndUnsetConnectionBridgeSessionDataStore() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.connectionBridgeSessionDataStore) === null || _a === void 0 ? void 0 : _a.close());
            this.connectionBridgeSessionDataStore = undefined;
        });
    }
    closeSensitiveDataStorages() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([this.closeAndUnsetCurrentSessionSensitiveStorage(), this.closeAndUnsetConnectionBridgeSessionDataStore()]);
        });
    }
}
//# sourceMappingURL=connection-bridge.js.map