import { __awaiter } from "tslib";
import OrbitDB from 'orbit-db';
import Identities from 'orbit-db-identity-provider';
import AccessControllers from 'orbit-db-access-controllers';
import { getEventEmitterClass } from "../../../basic-classes/event-emitter-class-base/event-emitter-class-base";
import { SWARM_STORE_CONNECTOR_ORBITDB_CONNECTION_TIMEOUT_MS, SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_RECONNECTION_ATTEMPTS_MAX, SWARM_STORE_CONNECTOR_ORBITDB_IDENTITY_TYPE, SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DBNAME, SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DIRECTORY, } from './const/swarm-store-connector-orbit-db.const';
import { SwarmStoreConnectorOrbitDBSubclassIdentityProvider } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-identity-provider/swarm-store-connector-orbit-db-subclass-identity-provider';
import { SwarmStoreConnectorOrbitDBSubclassAccessController } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller';
import { timeout, delay } from "../../../../utils";
import { commonUtilsArrayDeleteFromArray } from "../../../../utils/common-utils";
import { COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON, COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_OFF, COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_UNSET_ALL_LISTENERS, } from "../../../../const/common-values/common-values";
import { SwarmStorageConnectorOrbitDBSublassKeyStore } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-keystore/swarm-store-connector-orbit-db-subclass-keystore';
import { SwarmStoreConnectorOrbitDBSubclassStorageFabric } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-storage-fabric/swarm-store-connector-orbit-db-subclass-storage-fabric';
import { swarmStoreConnectorOrbitDbUtilsAddressCreateRootPath } from './swarm-store-connector-orbit-db-utils/swarm-store-connector-orbit-db-utils-address/swarm-store-connector-orbit-db-utils-address';
import assert from 'assert';
import { ESwarmStoreEventNames } from '../../swarm-store-class.const';
export class SwarmStoreConnectorOrbitDB extends getEventEmitterClass() {
    constructor(options) {
        super();
        this.isReady = false;
        this.isClosed = false;
        this.userId = '';
        this.directory = SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DIRECTORY;
        this.databases = [];
        this.dbCloseListeners = [];
        this.request = (dbName, dbMethod, arg) => __awaiter(this, void 0, void 0, function* () {
            const { isClosed } = this;
            if (isClosed) {
                return new Error('The Swarm connection was closed');
            }
            const dbConnection = yield this.waitingDbOpened(dbName);
            if (dbConnection instanceof Error) {
                console.error(dbConnection);
                return this.emitError(new Error('Failed to get an opened connection to the database'));
            }
            return yield dbConnection[dbMethod](arg);
        });
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            this.setIsClosed();
            const closeAllDatabasesResult = yield this.closeDatabases();
            const stopOrbitDBResult = yield this.stopOrbitDBInsance();
            let err;
            if (closeAllDatabasesResult instanceof Error) {
                err = true;
                console.error(closeAllDatabasesResult);
                this.emitError('Failed to close all databases connections');
            }
            if (stopOrbitDBResult instanceof Error) {
                err = true;
                console.error(closeAllDatabasesResult);
                this.emitError('Failed to close the current instanceof OrbitDB');
            }
            this.unsetAllListenersForEvents();
            if (err) {
                return this.emitError('Failed to close normally the connection to the swarm store');
            }
        });
        this.setIsClosed = () => {
            this.setNotReady();
            this.isClosed = true;
            this.emit(ESwarmStoreEventNames.CLOSE, true);
        };
        this.getDbConnection = (dbName, checkIsOpen = true) => {
            const { databases } = this;
            return databases.find((db) => {
                return db && db.dbName === dbName && (!checkIsOpen || (!db.isClosed && !!db.isReady));
            });
        };
        this.unsetAllListenersForEvents = () => {
            Object.values(ESwarmStoreEventNames).forEach(this[COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_UNSET_ALL_LISTENERS].bind(this));
        };
        this.unsetInitializationPromise = () => {
            this.initializationPromise = undefined;
        };
        this.handleDatabaseStoreClosed = (database, error) => __awaiter(this, void 0, void 0, function* () {
            if (database) {
                const { dbName } = database;
                this.emitError(`Database closed unexpected: ${error.message}`, `handleDatabaseStoreClosed::${dbName}`);
                yield this.handleDbClose(database);
                yield this.restartDbConnection(dbName, database);
            }
        });
        this.handleLoadingProgress = (dbName, progress) => {
            const { databases, options } = this;
            let currentProgressInPercent = 0;
            if (options) {
                const { databases: overallDatabases } = options;
                const overallProgressToReach = overallDatabases.length * 100;
                const currentProgress = (databases ? databases.length : 0) * 100 + progress;
                currentProgressInPercent = currentProgress ? (overallProgressToReach / currentProgress) * 100 : 0;
            }
            console.log(`Swarm store connector::handleLoadingProgress::${dbName}::progress::${progress}`);
            this.emit(ESwarmStoreEventNames.LOADING, currentProgressInPercent);
            this.emit(ESwarmStoreEventNames.DB_LOADING, [dbName, progress]);
        };
        this.handleDatabaseUpdated = (dbName) => {
            this.emit(ESwarmStoreEventNames.UPDATE, dbName);
        };
        this.handleNewEntryAddedToDatabase = ([dbName, entry, address, heads, dbType]) => {
            console.log(`SwarmStoreConnectorOrbitDB::handleNewEntryAddedToDatabase:emit NEW_ENTRY`, {
                dbName,
                entry,
                address,
                heads,
            });
            this.emit(ESwarmStoreEventNames.NEW_ENTRY, [dbName, entry, address, heads, dbType]);
        };
        SwarmStoreConnectorOrbitDB.loadCustomIdentityProvider();
        SwarmStoreConnectorOrbitDB.loadCustomAccessController();
        this.applyOptions(options);
        this.createInitializationPromise(options);
    }
    static loadCustomIdentityProvider() {
        if (!SwarmStoreConnectorOrbitDB.isLoadedCustomIdentityProvider) {
            Identities.addIdentityProvider(SwarmStoreConnectorOrbitDBSubclassIdentityProvider);
            SwarmStoreConnectorOrbitDB.isLoadedCustomIdentityProvider = true;
        }
    }
    static loadCustomAccessController() {
        if (!SwarmStoreConnectorOrbitDB.isLoadedCustomAccessController) {
            AccessControllers.addAccessController({
                AccessController: SwarmStoreConnectorOrbitDBSubclassAccessController,
            });
            SwarmStoreConnectorOrbitDB.isLoadedCustomAccessController = true;
        }
    }
    connect(connectionOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializationPromise;
            const resultCreateIdentity = yield this.createIdentity();
            if (resultCreateIdentity instanceof Error) {
                console.error(resultCreateIdentity);
                return this.emitError('Failed to create an identity');
            }
            const disconnectFromSwarmResult = yield this.disconnectFromSwarm();
            if (disconnectFromSwarmResult instanceof Error) {
                return disconnectFromSwarmResult;
            }
            const setConnectionOptionsResult = this.setConnectionOptions(connectionOptions);
            if (setConnectionOptionsResult instanceof Error) {
                return setConnectionOptionsResult;
            }
            const connectToSwarmResult = yield this.connectToSwarm();
            if (connectToSwarmResult instanceof Error) {
                return connectToSwarmResult;
            }
            const closeExistingDatabaseesOpened = yield this.closeDatabases();
            if (closeExistingDatabaseesOpened instanceof Error) {
                return this.emitError(closeExistingDatabaseesOpened, 'openDatabases');
            }
            const stopOrbitDBResult = yield this.stopOrbitDBInsance();
            if (stopOrbitDBResult instanceof Error) {
                return stopOrbitDBResult;
            }
            const createOrbitDbResult = yield this.createOrbitDBInstance();
            if (createOrbitDbResult instanceof Error) {
                return createOrbitDbResult;
            }
            const createDatabases = yield this.openDatabases();
            if (createDatabases instanceof Error) {
                return createDatabases;
            }
            this._setConnectorBasicFabric(connectionOptions);
            this.setReady();
        });
    }
    openDatabase(dbOptions, openAttempt = 0, checkOptionsIsExists = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orbitDb, isClosed } = this;
            if (!orbitDb) {
                return new Error('There is no instance of OrbitDB');
            }
            if (isClosed) {
                return new Error("Can't open a database for the connection opened");
            }
            const checkDbOptionsResult = checkOptionsIsExists ? this.setDbOptionsIfNotExists(dbOptions) : this.setDbOptions(dbOptions);
            if (checkDbOptionsResult instanceof Error) {
                return checkDbOptionsResult;
            }
            const { dbName, useEncryptedStorage } = dbOptions;
            const db = this.getDbConnectionExists(dbName);
            if (db) {
                this.unsetOptionsForDatabase(dbName);
                return new Error(`A database named as ${dbName} is already exists`);
            }
            if (useEncryptedStorage) {
                yield this.addDatabaseNameToListOfUsingSecretStorage(dbName);
            }
            const database = yield this.createDatabaseConnectorImplementation(dbOptions, dbName, orbitDb);
            yield this.setListenersDatabaseEvents(database);
            const databaseOpenResult = yield this.waitDatabaseOpened(database);
            if (databaseOpenResult instanceof Error) {
                try {
                    yield this.closeDb(database, false);
                    yield delay(300);
                    if (openAttempt > SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_RECONNECTION_ATTEMPTS_MAX) {
                        return yield this.handleErrorOnDbOpen(database, 'The max nunmber of connection attempts has reached');
                    }
                    const openDatabaseResult = yield this.openDatabase(dbOptions, (openAttempt += 1));
                    if (openDatabaseResult instanceof Error) {
                        return yield this.handleErrorOnDbOpen(database, openDatabaseResult);
                    }
                }
                catch (err) {
                    return yield this.handleErrorOnDbOpen(database, err);
                }
            }
            this.databases.push(database);
            this.emit(ESwarmStoreEventNames.READY, dbOptions.dbName);
        });
    }
    dropDatabase(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getDbConnection(dbName);
            if (!db) {
                return new Error(`The database named ${dbName} was not found`);
            }
            try {
                yield this.unsetListenersDatabaseEvents(db);
                yield db.drop();
                yield this.closeDb(db);
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
    }
    closeDatabase(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getDbConnection(dbName);
            if (db) {
                return yield this.closeDb(db);
            }
            return new Error(`The database named ${dbName} was not found`);
        });
    }
    getDbConnectionExists(dbName) {
        return this.getDbConnection(dbName, false);
    }
    handleDbClose(database) {
        return __awaiter(this, void 0, void 0, function* () {
            if (database) {
                const { dbName } = database;
                yield this.unsetListenersDatabaseEvents(database);
                this.unsetOptionsForDatabase(dbName);
                this.deleteDatabaseFromList(database);
            }
        });
    }
    handleErrorOnDbOpen(database, error) {
        return __awaiter(this, void 0, void 0, function* () {
            if (database) {
                const { dbName } = database;
                yield this.handleDbClose(database);
                console.error(`An error has occurred while database named ${dbName} opening`);
                console.error(error);
            }
            return this.emitError(error);
        });
    }
    waitingDbOpened(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { getDbConnection } = this;
            const db = getDbConnection(dbName);
            const dbOptsIdx = this.getIdxDbOptions(dbName);
            if (db) {
                return db;
            }
            else if (dbOptsIdx === -1) {
                return new Error(`A database with the name ${dbName} was not found`);
            }
            else {
                const removeListener = this.removeListener.bind(this);
                return yield new Promise((res) => {
                    let timeout;
                    function removeListners() {
                        if (timeout) {
                            clearTimeout(timeout);
                            timeout = undefined;
                        }
                        removeListener(ESwarmStoreEventNames.READY, onReady);
                        removeListener(ESwarmStoreEventNames.CLOSE, onClose);
                    }
                    function onReady(dbNameReady) {
                        if (dbNameReady === dbName) {
                            const db = getDbConnection(dbName);
                            if (db) {
                                removeListners();
                                res(db);
                            }
                        }
                    }
                    function onClose() {
                        removeListners();
                        res(new Error('The Swarm store was closed'));
                    }
                    timeout = setTimeout(() => {
                        removeListners();
                        res(new Error());
                    }, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS);
                    this.once(ESwarmStoreEventNames.READY, onReady);
                    this.once(ESwarmStoreEventNames.CLOSE, onClose);
                });
            }
        });
    }
    emitDatabaseClose(database) {
        if (database) {
            const { dbName } = database;
            console.warn(`Database named ${dbName} was closed`);
            this.emit(ESwarmStoreEventNames.CLOSE_DATABASE, dbName, database);
        }
    }
    emitError(error, mehodName) {
        const err = typeof error === 'string' ? new Error(error) : error;
        console.error(`${SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX}::error${mehodName ? `::${mehodName}` : ''}`, err);
        this.emit(ESwarmStoreEventNames.ERROR, err);
        return err;
    }
    setIsReady(isReady = false) {
        this.isReady = isReady;
        this.emit(ESwarmStoreEventNames.STATE_CHANGE, isReady);
    }
    setReady() {
        this.setIsReady(true);
    }
    setNotReady() {
        this.setIsReady(false);
    }
    deleteDatabaseFromList(database) {
        const { databases } = this;
        if (databases && databases instanceof Array) {
            commonUtilsArrayDeleteFromArray(databases, database);
        }
    }
    checkDbOptions(options) {
        if (options != null && typeof options === 'object') {
            const { dbName } = options;
            return !!dbName && typeof dbName === 'string';
        }
        return false;
    }
    applyOptions(options) {
        if (!options || typeof options !== 'object') {
            throw new Error('The options must be an object');
        }
        this.options = options;
        const { userId, directory } = options;
        if (!userId) {
            console.warn(new Error('The user id is not provided'));
        }
        else {
            this.userId = userId;
        }
        if (typeof directory === 'string') {
            this.directory = directory;
        }
    }
    createStorages(credentials) {
        if (credentials) {
            this.createIdentityKeystores(credentials);
        }
        this.createStorageFabric(credentials);
    }
    getParamsForStoreRootPath() {
        return {
            directory: this.directory,
            userId: String(this.userId),
        };
    }
    createStoreRootPath() {
        return __awaiter(this, void 0, void 0, function* () {
            const rootPathParams = this.getParamsForStoreRootPath();
            this.rootPath = yield swarmStoreConnectorOrbitDbUtilsAddressCreateRootPath(rootPathParams);
        });
    }
    initialize(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createStoreRootPath();
            this.createStorages(credentials);
        });
    }
    createInitializationPromise(options) {
        this.initializationPromise = this.initialize(options.credentials).finally(this.unsetInitializationPromise);
    }
    createIdentityKeystores(credentials) {
        const { directory, userId } = this;
        const identityKeystorePrefix = `${directory}/${userId}`;
        const identityKeystore = this.createKeystore(credentials, identityKeystorePrefix);
        if (identityKeystore instanceof Error) {
            console.error(identityKeystore);
            throw new Error('Failed on create identity keystore');
        }
        this.identityKeystore = identityKeystore;
    }
    getOptionsForSwarmStoreConnectorOrbitDBSubclassStorageFabric(credentials) {
        const { rootPath } = this;
        if (typeof rootPath !== 'string') {
            throw new Error('createIdentityKeystores::rootPath must be a string');
        }
        return {
            rootPath,
            credentials,
        };
    }
    createStorageFabric(credentials) {
        const options = this.getOptionsForSwarmStoreConnectorOrbitDBSubclassStorageFabric(credentials);
        this.storage = new SwarmStoreConnectorOrbitDBSubclassStorageFabric(options);
    }
    createKeystore(credentials, keystoreNamePrefix) {
        const keystoreName = `${keystoreNamePrefix || ''}${SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DBNAME}`;
        if (!credentials) {
            return this.emitError('createKeystore::A Credentials must be provided');
        }
        return new SwarmStorageConnectorOrbitDBSublassKeyStore({
            credentials,
            store: keystoreName,
        });
    }
    createIdentity() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = this;
            try {
                const identity = yield Identities.createIdentity({
                    type: SWARM_STORE_CONNECTOR_ORBITDB_IDENTITY_TYPE,
                    id: userId ? userId : undefined,
                    keystore: this.identityKeystore,
                });
                if (!userId) {
                    this.userId = identity.id;
                    console.warn(`The user id created automatically is ${userId}`);
                }
                if (identity instanceof Error) {
                    return identity;
                }
                this.identity = identity;
            }
            catch (err) {
                return err;
            }
        });
    }
    getIdxDbOptions(dbName) {
        const { options } = this;
        if (options) {
            const { databases } = options;
            if (databases instanceof Array) {
                return databases.findIndex((db) => !!db && typeof db === 'object' && db.dbName === dbName);
            }
        }
        return -1;
    }
    unsetOptionsForDatabase(dbName) {
        const { options } = this;
        if (options) {
            const { databases } = options;
            if (databases instanceof Array) {
                const idx = this.getIdxDbOptions(dbName);
                databases.splice(idx, 1);
            }
        }
    }
    setDbOptions(dbOptions, checkIfExists = false) {
        if (!this.checkDbOptions(dbOptions)) {
            return new Error('The database options have a wrong format');
        }
        if (checkIfExists) {
            const { dbName } = dbOptions;
            const idxExisting = this.getIdxDbOptions(dbName);
            if (idxExisting !== -1) {
                return new Error(`
          Options for the database ${dbName} is already exists.
          May be the database was opened but still not be in ready state
        `);
            }
        }
        const { options } = this;
        if (!options) {
            this.applyOptions(Object.assign(Object.assign({}, this.options), { userId: '', databases: [dbOptions] }));
            return;
        }
        const { databases } = options;
        if (databases instanceof Array) {
            const { dbName } = dbOptions;
            this.unsetOptionsForDatabase(dbName);
            databases.push(dbOptions);
        }
        else {
            options.databases = [dbOptions];
        }
    }
    setDbOptionsIfNotExists(dbOptions) {
        return this.setDbOptions(dbOptions, true);
    }
    closeDb(database, flEmit = true) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.unsetListenersDatabaseEvents(database);
            const { dbName } = database;
            this.unsetOptionsForDatabase(dbName);
            this.deleteDatabaseFromList(database);
            const closeDatabaseResult = yield database.close();
            if (closeDatabaseResult instanceof Error) {
                if (flEmit) {
                    return this.emitError(closeDatabaseResult);
                }
                return closeDatabaseResult;
            }
            if (flEmit) {
                this.emitDatabaseClose(database);
            }
        });
    }
    setConnectionOptions(connectionOptions) {
        if (!connectionOptions) {
            return this.emitError('Connection options must be specified');
        }
        const { ipfs } = connectionOptions;
        if (!ipfs) {
            return this.emitError('An instance of ipfs must be specified in the connection options');
        }
        this.ipfs = ipfs;
    }
    unsetSwarmConnectionOptions() {
        this.ipfs = undefined;
        this.connectionOptions = undefined;
    }
    disconnectFromSwarm() {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn(`${SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX}::disconnectFromTheSwarm`);
            this.unsetSwarmConnectionOptions();
            this.setNotReady();
        });
    }
    connectToSwarm() {
        return __awaiter(this, void 0, void 0, function* () {
            const { ipfs } = this;
            if (!ipfs) {
                return this.emitError('An instance of the IPFS must be specified');
            }
            try {
                yield Promise.race([ipfs.ready, timeout(SWARM_STORE_CONNECTOR_ORBITDB_CONNECTION_TIMEOUT_MS)]);
            }
            catch (err) {
                return this.emitError(err);
            }
        });
    }
    stopOrbitDBInsance() {
        return __awaiter(this, void 0, void 0, function* () {
            const { orbitDb } = this;
            if (orbitDb) {
                try {
                    yield orbitDb.stop();
                    this.setNotReady();
                    this.orbitDb = undefined;
                }
                catch (err) {
                    return this.emitError(err, 'stopOrbitDBInsance');
                }
            }
        });
    }
    createOrbitDBInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            const { ipfs, identity, storage } = this;
            if (!ipfs) {
                return this.emitError('An instance of IPFS must exists', 'createOrbitDBInstance');
            }
            try {
                if (!OrbitDB) {
                    return this.emitError('A constructor of the OrbitDb is not provided');
                }
                if (!identity) {
                    return this.emitError('An identity must be specified');
                }
                const instanceOfOrbitDB = yield OrbitDB.createInstance(ipfs, {
                    identity,
                    storage,
                });
                if (instanceOfOrbitDB instanceof Error) {
                    return this.emitError(instanceOfOrbitDB, 'createOrbitDBInstance::error has occurred in the "createInstance" method');
                }
                this.orbitDb = instanceOfOrbitDB;
            }
            catch (err) {
                return this.emitError(err, 'createOrbitDBInstance::failed to create the instance of OrbitDB');
            }
        });
    }
    getDbOptions(dbName) {
        const { options } = this;
        if (!options) {
            return this.emitError('An options is not specified for the database', `getDbOptions::${dbName}`);
        }
        const { databases } = options;
        return databases.find((option) => option && option.dbName === dbName);
    }
    stop() {
        this.setNotReady();
        return this.closeDatabases();
    }
    openDatabaseNotCheckOptionsExists(optionsForDb) {
        return this.openDatabase(optionsForDb, 0, false);
    }
    restartDbConnection(dbName, database) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsForDb = this.getDbOptions(dbName);
            yield this.unsetListenersDatabaseEvents(database);
            if (optionsForDb instanceof Error || !optionsForDb) {
                this.emitError('Failed to get options to open a new db store', `restartDbConnection::${dbName}`);
                return yield this.stop();
            }
            const startDbResult = yield this.openDatabaseNotCheckOptionsExists(optionsForDb);
            if (startDbResult instanceof Error) {
                this.emitError('Failed to open a new db store', `restartDbConnection::${dbName}`);
                return yield this.stop();
            }
        });
    }
    removeDbFromList(database) {
        if (this.databases instanceof Array) {
            commonUtilsArrayDeleteFromArray(this.databases, database);
        }
    }
    setListenersDatabaseEvents(database, isSet = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const methodName = isSet ? COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON : COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_OFF;
            if (isSet) {
                const dbCloseHandler = (err) => {
                    void this.handleDatabaseStoreClosed(database, err);
                };
                database[methodName](ESwarmStoreEventNames.CLOSE, dbCloseHandler);
                database[methodName](ESwarmStoreEventNames.FATAL, dbCloseHandler);
                this.dbCloseListeners.push(dbCloseHandler);
            }
            else {
                this.dbCloseListeners.forEach((dbCloseHandler) => {
                    database[methodName](ESwarmStoreEventNames.CLOSE, dbCloseHandler);
                    database[methodName](ESwarmStoreEventNames.FATAL, dbCloseHandler);
                });
            }
            database[methodName](ESwarmStoreEventNames.LOADING, this.handleLoadingProgress);
            database[methodName](ESwarmStoreEventNames.UPDATE, this.handleDatabaseUpdated);
            database[methodName](ESwarmStoreEventNames.NEW_ENTRY, this.handleNewEntryAddedToDatabase);
        });
    }
    unsetListenersDatabaseEvents(database) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setListenersDatabaseEvents(database, false);
        });
    }
    closeDatabases() {
        return __awaiter(this, void 0, void 0, function* () {
            const { databases } = this;
            this.setNotReady();
            if (!databases || !databases.length) {
                return;
            }
            try {
                let idx = 0;
                const databasesToClose = [...databases];
                const len = databasesToClose.length;
                for (; idx < len; idx += 1) {
                    const db = databasesToClose[idx];
                    const dbCloseResult = yield this.closeDb(db);
                    if (dbCloseResult instanceof Error) {
                        console.error(this.emitError(dbCloseResult));
                        this.emitError('An error has occurred on closing the database', 'closeDatabases');
                    }
                }
                this.databases = [];
            }
            catch (err) {
                return err;
            }
        });
    }
    waitDatabaseOpened(database) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let timeout = undefined;
            let unsetListenersFunction = undefined;
            const promiseWaitingReadyEvent = new Promise((res) => {
                function usetListeners() {
                    database.removeListener(ESwarmStoreEventNames.READY, res);
                    database.removeListener(ESwarmStoreEventNames.CLOSE, res);
                    database.removeListener(ESwarmStoreEventNames.FATAL, res);
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    timeout = undefined;
                }
                unsetListenersFunction = usetListeners;
                timeout = setTimeout(() => {
                    usetListeners();
                    res(new Error('Failed to open the database cause the timeout has reached'));
                }, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS);
                database.once(ESwarmStoreEventNames.CLOSE, () => {
                    usetListeners();
                    res(new Error('Database was closed'));
                });
                database.once(ESwarmStoreEventNames.FATAL, () => {
                    usetListeners();
                    res(new Error('A fatal error has occurred while open the database'));
                });
                database.once(ESwarmStoreEventNames.READY, () => {
                    usetListeners();
                    res(true);
                });
            });
            try {
                const [connectResult] = yield Promise.all([database.connect(), promiseWaitingReadyEvent]);
                if (connectResult instanceof Error) {
                    console.error(connectResult);
                    return this.emitError('The database.connect method was failed');
                }
            }
            catch (err) {
                console.error(err);
                return this.emitError(`Failed to connect with the database: ${err.message}`);
            }
            finally {
                (_a = unsetListenersFunction) === null || _a === void 0 ? void 0 : _a();
            }
            return true;
        });
    }
    openDatabases() {
        return __awaiter(this, void 0, void 0, function* () {
            const { options } = this;
            if (!options) {
                return this.emitError('The options must be specified to open the databases');
            }
            const { databases } = options;
            const databasesOptions = [...databases];
            if (!(databasesOptions instanceof Array)) {
                return this.emitError('The options for databases must be specified');
            }
            if (!databasesOptions.length) {
                return;
            }
            try {
                let idx = 0;
                const len = databasesOptions.length;
                for (; idx < len; idx += 1) {
                    const options = databasesOptions[idx];
                    const startResultStatus = yield this.openDatabaseNotCheckOptionsExists(options);
                    if (startResultStatus instanceof Error) {
                        console.error(startResultStatus);
                        yield this.closeDatabases();
                        return new Error('Failed to open the database');
                    }
                }
            }
            catch (err) {
                yield this.closeDatabases();
                return this.emitError(err);
            }
        });
    }
    extendDatabaseOptionsWithCache(dbOptions, dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storage } = this;
            if (!storage) {
                throw new Error('Storage is not exists in the connector');
            }
            return Object.assign(Object.assign({}, dbOptions), { cache: yield storage.createStoreForDb(dbName) });
        });
    }
    createDatabaseConnectorImplementation(dbOptions, dbName, orbitDb) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsWithCachestore = yield this.extendDatabaseOptionsWithCache(dbOptions, dbName);
            const { _connectorBasicFabric: _connectorFabric } = this;
            if (!_connectorFabric) {
                throw new Error('Connector to the swarm storage is not defined');
            }
            return _connectorFabric(optionsWithCachestore, orbitDb);
        });
    }
    addDatabaseNameToListOfUsingSecretStorage(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.storage) {
                throw new Error('There is no storage instance');
            }
            yield this.storage.addSecretDatabaseName(dbName);
        });
    }
    _setConnectorBasicFabric(connectionOptions) {
        const { connectorBasicFabric: connectorFabric } = connectionOptions;
        assert(connectorFabric, 'Basic connector for OrbitDb must be defined in the options');
        this._connectorBasicFabric = connectorFabric;
    }
}
SwarmStoreConnectorOrbitDB.isLoadedCustomIdentityProvider = false;
SwarmStoreConnectorOrbitDB.isLoadedCustomAccessController = false;
//# sourceMappingURL=swarm-store-connector-orbit-db.js.map