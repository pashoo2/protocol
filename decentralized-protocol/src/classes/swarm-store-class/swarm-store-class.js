import { __awaiter } from "tslib";
import assert from 'assert';
import { checkIsError } from "../../utils";
import { ESwarmStoreConnector, ESwarmStoreEventNames, ESwarmStoreDbStatus, SWARM_STORE_CONNECTORS, SWARM_STORE_DATABASES_STATUSES_EMPTY, } from './swarm-store-class.const';
import { calculateHash } from '@pashoo2/crypto-utilities';
import { getEventEmitterClass } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
export class SwarmStore extends getEventEmitterClass() {
    constructor() {
        super(...arguments);
        this.dbStatusesExisting = SWARM_STORE_DATABASES_STATUSES_EMPTY;
        this.databasesOpenedList = {};
        this.setEmptyStatusForDb = (dbName) => {
            const { dbStatusesExisting } = this;
            if (!dbStatusesExisting[dbName]) {
                dbStatusesExisting[dbName] = ESwarmStoreDbStatus.EMPTY;
            }
        };
        this.setClosedStatusForDb = (dbName) => {
            this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.CLOSE;
        };
        this.dbReadyListener = (dbName) => {
            this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.READY;
        };
        this.dbUpdateListener = (dbName) => (this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.UPDATE);
        this.dbCloseListener = (dbName) => (this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.CLOSE);
        this.dbLoadingListener = ([dbName, percent]) => {
            if (percent < 100) {
                this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.LOADING;
            }
            else {
                this.dbStatusesExisting[dbName] = ESwarmStoreDbStatus.LOADED;
            }
        };
    }
    get isReady() {
        return !!this.connector && this.connector.isReady;
    }
    get isClosed() {
        return !!this.connector && this.connector.isClosed;
    }
    get dbStatuses() {
        if (this.isReady && !this.isClosed) {
            return this.dbStatusesExisting;
        }
        return SWARM_STORE_DATABASES_STATUSES_EMPTY;
    }
    get databases() {
        const { databasesKnownOptionsList, databasesOpenedList } = this;
        return {
            get options() {
                return databasesKnownOptionsList;
            },
            get opened() {
                return databasesOpenedList;
            },
        };
    }
    get databasesKnownOptionsList() {
        var _a;
        return (_a = this.persistentDatbasesList) === null || _a === void 0 ? void 0 : _a.databasesKnownOptionsList;
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let connectionWithConnector;
            try {
                this.validateOptions(options);
                if (options.persistentDatbasesList) {
                    yield this.setDatabasePersistentListAndPreloadDatabasesList(options.persistentDatbasesList);
                }
                connectionWithConnector = this.createConnectionWithStorageConnector(options);
                this.createStatusTable(options);
                this.subscribeOnConnector(connectionWithConnector);
                yield this.startConnectionWithConnector(connectionWithConnector, options);
            }
            catch (err) {
                if (connectionWithConnector) {
                    this.unSubscribeFromConnector(connectionWithConnector);
                }
                return err;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            let error;
            const { connector } = this;
            try {
                yield this.closeConnector();
            }
            catch (err) {
                error = err;
            }
            this.reset();
            if (connector) {
                this.unSubscribeFromConnector(connector);
            }
            return error;
        });
    }
    openDatabase(dbOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const connector = this.getConnectorOrError();
            if (checkIsError(connector)) {
                return new Error('Connector is not exists');
            }
            this.setEmptyStatusForDb(dbOptions.dbName);
            const result = yield connector.openDatabase(dbOptions);
            if (!(result instanceof Error)) {
                yield this.handleDatabaseOpened(dbOptions);
            }
            else {
                yield this.handleDatabaseClosed(dbOptions);
            }
            return result;
        });
    }
    closeDatabase(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            const connector = this.getConnectorOrError();
            if (checkIsError(connector)) {
                return new Error('Connector is not exists');
            }
            this.setClosedStatusForDb(dbName);
            const result = connector.closeDatabase(dbName);
            if (!(result instanceof Error)) {
                const dbOptions = yield this.getDatabaseOptions(dbName);
                if (dbOptions) {
                    yield this.handleDatabaseClosed(dbOptions);
                }
            }
            return yield result;
        });
    }
    dropDatabase(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            const connector = this.getConnectorOrError();
            if (checkIsError(connector)) {
                return new Error('Connector is not exists');
            }
            this.setClosedStatusForDb(dbName);
            const dropDatabaseResult = yield connector.dropDatabase(dbName);
            if (dropDatabaseResult instanceof Error) {
                return dropDatabaseResult;
            }
            const dbOptions = yield this.getDatabaseOptions(dbName);
            if (dbOptions) {
                yield this.handleDatabaseDropped(dbOptions);
            }
        });
    }
    request(dbName, dbMethod, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const connector = this.getConnectorOrError();
            if (checkIsError(connector)) {
                return new Error('Connector is not exists');
            }
            return yield connector.request(dbName, dbMethod, arg);
        });
    }
    validateOptions(options) {
        assert(options, 'An options must be specified');
        assert(typeof options === 'object', 'The options specified is not an object');
        assert(options.databases instanceof Array, 'The options for databases must be an array');
        options.databases.forEach((optionsDb) => {
            assert(optionsDb, 'Database options must be specified');
            assert(typeof optionsDb === 'object', 'Database options must be an object');
            assert(typeof optionsDb.dbName === 'string', 'Database name must be a string');
        });
        assert(typeof options.directory === 'string', 'Directory must be a string if specified');
        assert(options.provider, 'Provider must be specified');
        assert(options.connectorFabric, 'Connector fabric must be specified');
        assert(Object.values(ESwarmStoreConnector).includes(options.provider), `There is unknown provider specified "${options.provider}"`);
        assert(options.providerConnectionOptions && typeof options.providerConnectionOptions === 'object', 'Options specifically for the provider must be set and be an object');
        assert(options.userId, 'The user identity must be provided');
        assert(typeof options.userId === 'string', 'The user identity must be a string');
        assert(options.credentials, 'A credentials must be provided');
        assert(typeof options.credentials === 'object', 'Credentials must be an object');
    }
    getDatabasesListKey(directory) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield calculateHash(`${directory || ''}/databases_opened_list`);
            if (hash instanceof Error) {
                throw hash;
            }
            return `${hash}/`;
        });
    }
    getStorageConnector(connectorName) {
        return SWARM_STORE_CONNECTORS[connectorName];
    }
    getDatabaseOptions(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.persistentDatbasesList) {
                return undefined;
            }
            return yield this.persistentDatbasesList.getDatabaseOptions(dbName);
        });
    }
    getConnectorOrError() {
        const { connector } = this;
        if (!connector) {
            return new Error('Connector is not exists');
        }
        return connector;
    }
    setDatabasePersistentListAndPreloadDatabasesList(persistentDatbasesList) {
        return __awaiter(this, void 0, void 0, function* () {
            yield persistentDatbasesList.loadDatabasesListFromPersistentStorage();
            this.persistentDatbasesList = persistentDatbasesList;
        });
    }
    emitDatabasesListUpdated() {
        this.emit(ESwarmStoreEventNames.DATABASES_LIST_UPDATED, this.databases);
    }
    setDatabaseHasBeenOpened(dbName) {
        this.databasesOpenedList[dbName] = true;
    }
    deleteDatabaseFromOpenedList(dbName) {
        delete this.databasesOpenedList[dbName];
    }
    handleDatabaseOpened(dbOpenedOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setDatabaseHasBeenOpened(dbOpenedOptions.dbName);
            yield this.addDatabaseOpenedOptions(dbOpenedOptions);
            this.emitDatabasesListUpdated();
        });
    }
    handleDatabaseClosed(dbOpenedOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this.deleteDatabaseFromOpenedList(dbOpenedOptions.dbName);
            this.emitDatabasesListUpdated();
        });
    }
    emitDatbaseDropped(dbName) {
        this.emit(ESwarmStoreEventNames.DROP_DATABASE, dbName);
    }
    handleDatabaseDropped(dbOpenedOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dbName } = dbOpenedOptions;
            this.deleteDatabaseFromOpenedList(dbOpenedOptions.dbName);
            yield this.removeDatabaseOpenedOptions(dbOpenedOptions);
            this.emitDatbaseDropped(dbName);
            this.emitDatabasesListUpdated();
        });
    }
    addDatabaseOpenedOptions(dbOpenedOptions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.persistentDatbasesList) === null || _a === void 0 ? void 0 : _a.addDatabase(dbOpenedOptions.dbName, dbOpenedOptions));
        });
    }
    removeDatabaseOpenedOptions(dbOpenedOptions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.persistentDatbasesList) === null || _a === void 0 ? void 0 : _a.removeDatabase(dbOpenedOptions.dbName));
        });
    }
    getOptionsForConnectorFabric(options) {
        return {
            provider: options.provider,
            providerConnectionOptions: options.providerConnectionOptions,
        };
    }
    createConnectionWithStorageConnector(options) {
        const { connectorFabric } = options;
        const connectorFabricOptions = this.getOptionsForConnectorFabric(options);
        const connection = connectorFabric(connectorFabricOptions);
        assert(connection, `Failed to create connection with the provider`);
        return connection;
    }
    startConnectionWithConnector(connector, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionResult = yield connector.connect(options.providerConnectionOptions);
            assert(!(connectionResult instanceof Error), `Failed to connect through the provider ${options.provider}`);
            this.connector = connector;
        });
    }
    createStatusTable(options) {
        const { databases } = options;
        databases.forEach((dbOptions) => {
            this.setEmptyStatusForDb(dbOptions.dbName);
        });
    }
    subscribeOnDbEvents(connector, isSubscribe = true) {
        if (!connector) {
            if (isSubscribe) {
                throw new Error('There is no connection to a connector');
            }
            return;
        }
        const methodName = isSubscribe ? 'addListener' : 'removeListener';
        connector[methodName](ESwarmStoreEventNames.READY, this.dbReadyListener);
        connector[methodName](ESwarmStoreEventNames.UPDATE, this.dbUpdateListener);
        connector[methodName](ESwarmStoreEventNames.CLOSE_DATABASE, this.dbCloseListener);
        connector[methodName](ESwarmStoreEventNames.DB_LOADING, this.dbLoadingListener);
    }
    unsubscribeFromDbEvents(connector) {
        this.subscribeOnDbEvents(connector, false);
    }
    subscribeConnectorAllEvents(connector) {
        if (!connector) {
            throw new Error('There is no swarm connector');
        }
        const storeConnectorEventsHandlers = {};
        Object.values(ESwarmStoreEventNames).forEach((eventName) => {
            storeConnectorEventsHandlers[eventName] = this.emit.bind(this, eventName);
            connector.addListener(eventName, storeConnectorEventsHandlers[eventName]);
        });
        this.storeConnectorEventsHandlers = storeConnectorEventsHandlers;
    }
    unSubscribeConnectorAllEvents(connector) {
        const { storeConnectorEventsHandlers } = this;
        if (storeConnectorEventsHandlers && connector) {
            Object.values(ESwarmStoreEventNames).forEach((eventName) => {
                connector.removeListener(eventName, storeConnectorEventsHandlers[eventName]);
            });
        }
    }
    subscribeOnConnector(connector) {
        this.subscribeOnDbEvents(connector);
        this.subscribeConnectorAllEvents(connector);
    }
    unSubscribeFromConnector(connector) {
        this.unsubscribeFromDbEvents(connector);
        this.unSubscribeConnectorAllEvents(connector);
    }
    closeConnector() {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector } = this;
            if (connector) {
                const result = yield connector.close();
                if (result instanceof Error) {
                    throw new Error('Failed to close the connection with the connector');
                }
            }
        });
    }
    reset() {
        Object.keys(this.dbStatusesExisting).forEach(this.setClosedStatusForDb);
    }
}
//# sourceMappingURL=swarm-store-class.js.map