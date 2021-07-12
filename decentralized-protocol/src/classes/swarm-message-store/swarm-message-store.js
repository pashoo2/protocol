import { __awaiter } from "tslib";
import assert from 'assert';
import { SwarmStore } from '../swarm-store-class/swarm-store-class';
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../swarm-store-class/swarm-store-class.const';
import { ESwarmMessageStoreEventNames, SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT, } from './swarm-message-store.const';
import { extend } from "../../utils";
import { getMessageConstructorForDatabase, getMessageValidator, } from './swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker/swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker';
import { extendSwarmMessageStoreConnectionOptionsWithAccessControlAndConnectorSpecificOptions } from './swarm-message-store-connection-options/swarm-message-store-connection-options-utils/swarm-message-store-connection-options-extender';
import { StorageProviderInMemory } from '../storage-providers/storage-in-memory-provider/storage-in-memory-provider';
import { SwarmMessageStoreUtilsMessagesCache } from './swarm-message-store-utils/swarm-message-store-utils-messages-cache/swarm-message-store-utils-messages-cache';
import { EOrbitDbStoreOperation, ESwarmStoreConnectorOrbitDbDatabaseType, } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ESwarmStoreConnectorOrbitDbDatabaseMethodNames, } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db';
import { createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControl } from './swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks';
export class SwarmMessageStore extends SwarmStore {
    constructor() {
        super(...arguments);
        this._dbTypes = {};
        this._cache = new StorageProviderInMemory();
        this._databasesMessagesCaches = {};
        this.emitMessageConstructionFails = (dbName, message, messageAddr, key, error) => {
            this.emit(ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR, dbName, message, error, messageAddr, key);
        };
        this.emitMessageNew = (dbName, message, messageAddr, messageKey) => {
            console.log('SwarmMessageStore::emitMessageNew', {
                dbName,
                message,
                messageAddr,
                messageKey,
            });
            this.emit(ESwarmMessageStoreEventNames.NEW_MESSAGE, dbName, message, messageAddr, messageKey);
        };
        this.emitMessageDelete = (dbName, userId, messageHash, messageDeletedHash, messageKey) => {
            console.log('SwarmMessageStore::emitMessageDelete', {
                dbName,
                userId,
                messageHash,
                messageKey,
            });
            this.emit(ESwarmMessageStoreEventNames.DELETE_MESSAGE, dbName, userId, messageHash, messageDeletedHash, messageKey);
        };
        this.constructNewSwarmMessageFromRawEntry = (dbName, dbType, message) => __awaiter(this, void 0, void 0, function* () {
            if (!dbName) {
                throw new Error('Databsae name should be defined');
            }
            if (!this.isValidDataMessageFormat(message, dbType)) {
                throw new Error('There is unknown message format');
            }
            const messageMetadata = this.getSwarmMessageMetadata(message, dbType);
            const swarmMessageInstance = yield this.constructMessage(dbName, message.payload.value, messageMetadata);
            if (swarmMessageInstance instanceof Error) {
                throw swarmMessageInstance;
            }
            return swarmMessageInstance;
        });
        this.handleNewDataMessage = (dbName, dbType, message) => __awaiter(this, void 0, void 0, function* () {
            let messageRawType;
            let key;
            let swarmMessageInstance;
            try {
                swarmMessageInstance = yield this.getSwarmMessageFromCacheByRawEntry(dbName, dbType, message);
            }
            catch (err) {
                console.error(new Error(`Failed to read a swarm message because the error: ${err.message}`));
            }
            if (!swarmMessageInstance) {
                try {
                    swarmMessageInstance = yield this.constructNewSwarmMessageFromRawEntry(dbName, dbType, message);
                }
                catch (err) {
                    return this.emitMessageConstructionFails(dbName, (messageRawType ? String(messageRawType) : ''), ((message === null || message === void 0 ? void 0 : message.hash) || ''), key, err);
                }
            }
            if (swarmMessageInstance) {
                const messageWithMeta = this.getSwarmMessageMetadata(message, dbType);
                if (!messageWithMeta) {
                    return;
                }
                const { messageAddress, key } = messageWithMeta;
                return this.emitMessageNew(dbName, swarmMessageInstance, messageAddress, key);
            }
        });
        this.handleNewMessage = ([dbName, message, messageAddress, heads, dbType]) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log('SwarmMessageStore::handleNewMessage', {
                dbName,
                message,
                messageAddress,
            });
            if (((_a = message === null || message === void 0 ? void 0 : message.payload) === null || _a === void 0 ? void 0 : _a.op) === EOrbitDbStoreOperation.DELETE) {
                return this.emitMessageDelete(dbName, message.identity.id, message.hash, message.payload.value, (dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
                    ? message.payload.key
                    : undefined));
            }
            return yield this.handleNewDataMessage(dbName, dbType, message);
        });
        this.openDatabaseMessagesCache = (dbName) => __awaiter(this, void 0, void 0, function* () {
            const messagesCache = new SwarmMessageStoreUtilsMessagesCache();
            const options = this.getOptionsForDatabaseMessagesCache(dbName);
            yield messagesCache.connect(options);
            this._databasesMessagesCaches[dbName] = messagesCache;
        });
        this.unsetDatabaseMessagesCache = (dbName) => __awaiter(this, void 0, void 0, function* () {
            const messagesCache = this._databasesMessagesCaches[dbName];
            if (messagesCache) {
                yield messagesCache.clear();
            }
        });
        this._getDatabaseType = (dbName) => this._dbTypes[dbName];
        this._startCacheStore = () => __awaiter(this, void 0, void 0, function* () {
            const { _cache: cacheStore } = this;
            if (!cacheStore) {
                throw new Error('There is no cache store');
            }
            const connectToCacheResult = yield cacheStore.connect();
            if (connectToCacheResult instanceof Error) {
                throw new Error(`Failed to connect to cache store: ${connectToCacheResult.message}`);
            }
        });
    }
    get dbMethodAddMessage() {
        const { connectorType } = this;
        switch (connectorType) {
            case ESwarmStoreConnector.OrbitDB:
                return ESwarmStoreConnectorOrbitDbDatabaseMethodNames.add;
            default:
                throw new Error('Failed to define the method for adding message');
        }
    }
    get dbMethodRemoveMessage() {
        const { connectorType } = this;
        switch (connectorType) {
            case ESwarmStoreConnector.OrbitDB:
                return ESwarmStoreConnectorOrbitDbDatabaseMethodNames.remove;
            default:
                throw new Error('Failed to define the method for adding message');
        }
    }
    get dbMethodIterator() {
        const { connectorType } = this;
        switch (connectorType) {
            case ESwarmStoreConnector.OrbitDB:
                return ESwarmStoreConnectorOrbitDbDatabaseMethodNames.iterator;
            default:
                throw new Error('Failed to define the method for adding message');
        }
    }
    connect(options) {
        const _super = Object.create(null, {
            connect: { get: () => super.connect }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const extenderWithAccessControl = this._createDatabaseOptionsExtender(options);
            const optionsSwarmStore = yield this._extendSwarmMessgeStoreOptions(options);
            this._setCurrentDatabaseOptionsExtenderWithAccessControl(extenderWithAccessControl);
            this._setOptions(optionsSwarmStore);
            const connectionResult = yield _super.connect.call(this, optionsSwarmStore);
            if (connectionResult instanceof Error) {
                throw connectionResult;
            }
            yield this._startCacheStore();
            this.setListeners();
        });
    }
    openDatabase(dbOptions) {
        const _super = Object.create(null, {
            openDatabase: { get: () => super.openDatabase }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { extendDBOWithAccessControl: extendsWithAccessControl } = this;
                if (!extendsWithAccessControl) {
                    throw new Error('There is no "extendsWithAccessControl" utility for the current instance');
                }
                const swarmMessageConstructorForDatabase = yield this._getSwarmMessageConstructorForDb(dbOptions.dbName);
                const optionsWithAcessControl = extendsWithAccessControl(dbOptions, swarmMessageConstructorForDatabase);
                const dbOpenResult = yield _super.openDatabase.call(this, optionsWithAcessControl);
                if (!(dbOpenResult instanceof Error)) {
                    yield this.openDatabaseMessagesCache(dbOptions.dbName);
                }
                const dbType = this.getDatabaseTypeByOptions(dbOptions);
                if (!dbType) {
                    throw new Error('Database type should ne defined');
                }
                this._setDatabaseType(dbOptions.dbName, dbType);
            }
            catch (err) {
                console.error(err);
                return new Error(`Swarm message store:failed to open the database ${dbOptions.dbName}: ${err.message}`);
            }
        });
    }
    dropDatabase(dbName) {
        const _super = Object.create(null, {
            dropDatabase: { get: () => super.dropDatabase }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const dropDbResult = yield _super.dropDatabase.call(this, dbName);
            if (dropDbResult instanceof Error) {
                return dropDbResult;
            }
            const messageConstructor = yield this.getMessageConstructor(dbName);
            try {
                if (messageConstructor === null || messageConstructor === void 0 ? void 0 : messageConstructor.encryptedCache) {
                    yield messageConstructor.encryptedCache.clearDb();
                }
                yield this.unsetDatabaseMessagesCache(dbName);
                this._unsetDatabaseType(dbName);
            }
            catch (err) {
                console.error(`Failed to clear messages encrypted cache for the database ${dbName}`);
                return err;
            }
        });
    }
    addMessage(dbName, msg, key) {
        return __awaiter(this, void 0, void 0, function* () {
            assert(dbName, 'Database name must be provided');
            const message = typeof msg === 'string' ? msg : (yield this.constructMessage(dbName, msg));
            this.validateMessageFormat(message);
            const requestAddArgument = {
                value: this.serializeMessage(message),
                key,
            };
            const response = (yield this.request(dbName, this.dbMethodAddMessage, requestAddArgument));
            if (response instanceof Error) {
                throw response;
            }
            const deserializedResponse = this.deserializeAddMessageResponse(response);
            if (!deserializedResponse) {
                throw new Error('Failed to deserialize the response');
            }
            return deserializedResponse;
        });
    }
    deleteMessage(dbName, messageAddressOrDbKey) {
        return __awaiter(this, void 0, void 0, function* () {
            assert(dbName, 'Database name must be provided');
            if (!messageAddressOrDbKey || typeof messageAddressOrDbKey !== 'string') {
                throw new Error('Message address must be a non empty string');
            }
            const result = yield this.request(dbName, this.dbMethodRemoveMessage, this.getArgRemoveMessage(messageAddressOrDbKey));
            if (result instanceof Error) {
                throw result;
            }
            try {
                yield this.removeSwarmMessageFromCacheByAddressOrKey(dbName, messageAddressOrDbKey);
            }
            catch (err) {
                console.error(new Error(`Failed to remove a message by address or key "${messageAddressOrDbKey}" from cache for database "${dbName}"`), err);
            }
        });
    }
    collect(dbName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            assert(dbName, 'Database name should be provided');
            const dbType = this._getDatabaseType(dbName);
            if (!dbType) {
                throw new Error("The database's type can't be defined");
            }
            const iterator = yield this.request(dbName, this.dbMethodIterator, this.getArgIterateDb(dbName, options));
            if (iterator instanceof Error) {
                throw iterator;
            }
            return yield this.collectMessages(dbName, iterator, dbType);
        });
    }
    collectWithMeta(dbName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            assert(dbName, 'Database name should be defined');
            const dbType = this._getDatabaseType(dbName);
            if (!dbType) {
                throw new Error("The database's type can't be defined");
            }
            const rawEntries = yield this.request(dbName, this.dbMethodIterator, this.getArgIterateDb(dbName, options));
            if (!this.checkIsRequestMethodReturnEntries(rawEntries)) {
                throw new Error('The request returns unexpected result');
            }
            const collectMessagesResult = yield this.collectMessages(dbName, rawEntries, dbType);
            return this.getMessagesWithMeta(collectMessagesResult, rawEntries, dbName, dbType);
        });
    }
    validateOpts(options) {
        super.validateOptions(options);
        const { messageConstructors } = options;
        assert(messageConstructors, 'messages constructors must be specified');
        assert(typeof messageConstructors === 'object', 'messages constructors must an object');
        const validateMessageConstructor = (mc) => {
            assert(typeof mc === 'object', 'the message constructor must be specified');
            assert(typeof mc.construct === 'function', 'the message constructor must have the "construct" method');
        };
        assert(typeof messageConstructors.default === 'object', 'the default message constructor must be cpecified');
        validateMessageConstructor(messageConstructors.default);
        Object.values(messageConstructors).forEach(validateMessageConstructor);
        if (options.cache) {
            assert(typeof options.cache === 'object', 'Cache option must be an object');
            assert(typeof options.cache.get === 'function', 'Cache option must implements StorageProvider and have a "get" method');
            assert(typeof options.cache.set === 'function', 'Cache option must implements StorageProvider and have a "set" method');
            assert(typeof options.cache.clearDb === 'function', 'Cache option must implements StorageProvider and have a "clearDb" method');
        }
    }
    _setOptions(options) {
        this.validateOpts(options);
        this.connectorType = options.provider;
        this.accessControl = options.accessControl;
        this.messageConstructors = options.messageConstructors;
        if (options.cache) {
            this._cache = options.cache;
        }
        this.swarmMessageConstructorFabric = options.swarmMessageConstructorFabric;
    }
    getOrbitDBDatabaseTypeByOptions(dbOptions) {
        return dbOptions.dbType || ESwarmStoreConnectorOrbitDbDatabaseType.FEED;
    }
    getDatabaseTypeByOptions(dbOptions) {
        const { connectorType } = this;
        switch (connectorType) {
            case ESwarmStoreConnector.OrbitDB:
                return this.getOrbitDBDatabaseTypeByOptions(dbOptions);
            default:
                return undefined;
        }
    }
    getMessageConstructor(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dbName) {
                return;
            }
            const messageConstructor = this.messageConstructors && getMessageConstructorForDatabase(dbName, this.messageConstructors);
            if (!messageConstructor) {
                return yield this.createMessageConstructorForDb(dbName);
            }
            return messageConstructor;
        });
    }
    _getDefaultSwarmMessageConstructor() {
        if (!this.messageConstructors) {
            throw new Error('There is no message constructors');
        }
        return this.messageConstructors.default;
    }
    _getSwarmMessageConstructorForDb(dbName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (yield this.getMessageConstructor(dbName))) !== null && _a !== void 0 ? _a : this._getDefaultSwarmMessageConstructor();
        });
    }
    getMessagesWithMeta(messages, rawEntriesIterator, dbName, dbType) {
        if (this.connectorType === ESwarmStoreConnector.OrbitDB) {
            return this.joinMessagesWithRawOrbitDBEntries(messages, rawEntriesIterator, dbName, dbType);
        }
        return [];
    }
    joinMessagesWithRawOrbitDBEntries(messages, rawEntriesIterator, dbName, dbType) {
        const messagesWithMeta = messages.map((messageInstance, idx) => {
            const entriesIterator = rawEntriesIterator instanceof Array ? rawEntriesIterator : [rawEntriesIterator];
            const logEntry = entriesIterator[idx];
            const messageMetadata = this.getSwarmMessageMetadata(logEntry, dbType);
            if (!messageMetadata) {
                return undefined;
            }
            return {
                dbName,
                message: messageInstance,
                messageAddress: messageMetadata.messageAddress,
                key: messageMetadata.key,
            };
        });
        return messagesWithMeta;
    }
    isValidDataMessageFormat(message, dbType) {
        return (typeof message === 'object' &&
            typeof message.payload === 'object' &&
            typeof message.hash === 'string' &&
            typeof message.payload.value === 'string' &&
            (dbType !== ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE || typeof message.payload.key === 'string'));
    }
    getSwarmMessageMetadataOrbitDb(message, dbType) {
        if (!message) {
            return;
        }
        return {
            messageAddress: message.hash,
            key: dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? message.payload.key : undefined,
        };
    }
    getSwarmMessageMetadata(message, dbType) {
        const { connectorType } = this;
        switch (connectorType) {
            case ESwarmStoreConnector.OrbitDB:
                return this.getSwarmMessageMetadataOrbitDb(message, dbType);
            default:
                throw new Error('Unsupported database connector');
        }
    }
    setListeners() {
        this.addListener(ESwarmStoreEventNames.NEW_ENTRY, this.handleNewMessage);
    }
    validateMessageFormat(message) {
        assert(message, 'Message must be provided');
        if (typeof message === 'object') {
            assert(typeof message.bdy === 'object', 'Message must be an object which has bdy property with an object value');
            assert(typeof message.uid === 'string', 'Message must be an object which has uid property with a string value');
            assert(typeof message.sig === 'string', 'Message must be an object which has sig property with a string value');
        }
        else {
            assert(typeof message === 'string', 'Message must be a string or an object');
        }
        return true;
    }
    serializeMessage(message) {
        const { connectorType } = this;
        switch (connectorType) {
            case ESwarmStoreConnector.OrbitDB:
                return String(message);
            default:
                throw new Error('Failed to serizlize the message to the store connector compatible format');
        }
    }
    getArgRemoveMessage(messageAddressOrKey) {
        const { connectorType } = this;
        switch (connectorType) {
            case ESwarmStoreConnector.OrbitDB:
                return messageAddressOrKey;
            default:
                throw new Error('Failed to define argument value for a swarm message removing');
        }
    }
    getArgIterateDb(dbName, options) {
        const { connectorType } = this;
        switch (connectorType) {
            case ESwarmStoreConnector.OrbitDB:
                assert(options, 'The iteratro opti');
                return (options
                    ? extend(options, SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT)
                    : SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT);
            default:
                throw new Error('Failed to define argument value for a swarm message collecting');
        }
    }
    collectMessagesFromOrbitDBIterator(dbName, rawEnties, dbType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (rawEnties instanceof Error) {
                throw rawEnties;
            }
            if (!rawEnties) {
                return [];
            }
            const arrayEntities = rawEnties instanceof Array ? rawEnties : [rawEnties];
            const promises = arrayEntities.map((logEntry) => __awaiter(this, void 0, void 0, function* () {
                if (logEntry instanceof Error) {
                    return logEntry;
                }
                if (!logEntry) {
                    return logEntry;
                }
                try {
                    const messageMetadata = this.getSwarmMessageMetadata(logEntry, dbType);
                    const message = yield this.constructMessage(dbName, logEntry.payload.value, messageMetadata);
                    return message;
                }
                catch (err) {
                    return err;
                }
            }));
            return yield Promise.all(promises);
        });
    }
    isSwarmStoreDatabaseLoadMethodAnswer(rawEntries) {
        if (typeof rawEntries === 'object') {
            if (typeof rawEntries.count === 'number' &&
                typeof rawEntries.loadedCount === 'number' &&
                typeof rawEntries.overallCount === 'number') {
                return true;
            }
        }
        return false;
    }
    isSwarmStoreDatabaseCloseMethodAnswer(rawEntries) {
        if (rawEntries === undefined) {
            return true;
        }
        return false;
    }
    checkIsRequestMethodReturnEntries(rawEntries) {
        if (rawEntries instanceof Error) {
            throw rawEntries;
        }
        if (this.isSwarmStoreDatabaseLoadMethodAnswer(rawEntries)) {
            throw new Error('The argument is TSwarmStoreDatabaseLoadMethodAnswer type');
        }
        if (this.isSwarmStoreDatabaseCloseMethodAnswer(rawEntries)) {
            throw new Error('The argument is TSwarmStoreDatabaseCloseMethodAnswer type');
        }
        return true;
    }
    collectMessages(dbName, rawEntries, dbType) {
        const { connectorType } = this;
        switch (connectorType) {
            case ESwarmStoreConnector.OrbitDB:
                return this.collectMessagesFromOrbitDBIterator(dbName, rawEntries, dbType);
            default:
                throw new Error('Failed to define argument value for a swarm message collecting');
        }
    }
    deserializeAddMessageResponse(addMessageResponse) {
        const { connectorType } = this;
        switch (connectorType) {
            case ESwarmStoreConnector.OrbitDB:
                if (typeof addMessageResponse !== 'string') {
                    throw new Error('There is a wrong responce on add message request');
                }
                return addMessageResponse;
            default:
                return undefined;
        }
    }
    createMessageConstructorForDb(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.swarmMessageConstructorFabric) {
                return;
            }
            return (yield this.swarmMessageConstructorFabric({}, { dbName }));
        });
    }
    constructMessage(dbName, message, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            if (metadata) {
                const { messageAddress } = metadata;
                const messageCached = yield this.getSwarmMessageInstanceFromCacheByAddress(dbName, messageAddress);
                if (messageCached) {
                    return messageCached;
                }
            }
            let swarmMessageInstance;
            if (message.bdy && message.sig) {
                if (typeof message.bdy === 'string') {
                    throw new Error('Swarm message should be decrypted');
                }
                swarmMessageInstance = message;
            }
            else {
                const messageConsturctor = yield this.getMessageConstructor(dbName);
                if (!messageConsturctor) {
                    throw new Error(`A message consturctor is not specified for the database ${dbName}`);
                }
                swarmMessageInstance = (yield messageConsturctor.construct(message));
            }
            if (swarmMessageInstance && metadata) {
                yield this.addMessageToCacheByMetadata(dbName, metadata, swarmMessageInstance);
            }
            return swarmMessageInstance;
        });
    }
    getOptionsForDatabaseMessagesCache(dbName) {
        if (!this._cache) {
            throw new Error('Instance of storage used as messages cache is not defined');
        }
        return {
            dbName,
            cache: this._cache,
        };
    }
    getMessagesCacheForDb(dbName) {
        return this._databasesMessagesCaches[dbName];
    }
    addMessageToCacheByMetadata(dbName, messageMetadata, messageInstance) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = this.getMessagesCacheForDb(dbName);
            if (cache) {
                const { messageAddress, key } = messageMetadata;
                const pending = [cache.setMessageByAddress(messageAddress, messageInstance)];
                if (key) {
                    pending.push(cache.setMessageAddressForKey(key, messageAddress));
                }
                yield Promise.all(pending);
            }
        });
    }
    removeSwarmMessageFromCacheByKey(dbName, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = this.getMessagesCacheForDb(dbName);
            if (cache) {
                yield cache.unsetMessageAddressForKey(key);
            }
        });
    }
    removeSwarmMessageFromCacheByAddress(dbName, messageAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = this.getMessagesCacheForDb(dbName);
            if (cache) {
                yield cache.unsetMessageByAddress(messageAddress);
            }
        });
    }
    removeSwarmMessageFromCacheByAddressOrKey(dbName, deleteMessageArg) {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseType = this._getDatabaseType(dbName);
            if (deleteMessageArg && databaseType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
                return yield this.removeSwarmMessageFromCacheByKey(dbName, deleteMessageArg);
            }
            else if (deleteMessageArg) {
                return yield this.removeSwarmMessageFromCacheByAddress(dbName, deleteMessageArg);
            }
            console.warn('The message address or key is not provided', dbName, deleteMessageArg);
        });
    }
    getSwarmMessageInstanceFromCacheByAddress(dbName, messageAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = this.getMessagesCacheForDb(dbName);
            if (cache) {
                return yield cache.getMessageByAddress(messageAddress);
            }
        });
    }
    getSwarmMessageFromCacheByRawEntry(dbName, dbType, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageMetadata = this.getSwarmMessageMetadata(message, dbType);
            if (!messageMetadata) {
                return;
            }
            return yield this.getSwarmMessageInstanceFromCacheByAddress(dbName, messageMetadata.messageAddress);
        });
    }
    _setDatabaseType(dbName, dbType) {
        this._dbTypes[dbName] = dbType;
    }
    _unsetDatabaseType(dbName) {
        delete this._dbTypes[dbName];
    }
    _createDatabaseOptionsExtender(options) {
        const swarmMessageValidatorFabric = getMessageValidator;
        return createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControl(options, swarmMessageValidatorFabric);
    }
    _setCurrentDatabaseOptionsExtenderWithAccessControl(extenderDbOptionsWithAccessControl) {
        this.extendDBOWithAccessControl = extenderDbOptionsWithAccessControl;
    }
    _extendSwarmMessgeStoreOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield extendSwarmMessageStoreConnectionOptionsWithAccessControlAndConnectorSpecificOptions(options);
        });
    }
}
//# sourceMappingURL=swarm-message-store.js.map