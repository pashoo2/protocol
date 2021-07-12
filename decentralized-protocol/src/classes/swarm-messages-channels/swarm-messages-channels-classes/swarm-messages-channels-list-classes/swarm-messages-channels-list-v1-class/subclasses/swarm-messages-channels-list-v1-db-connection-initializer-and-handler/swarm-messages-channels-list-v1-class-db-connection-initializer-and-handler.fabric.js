import { __awaiter, __decorate, __metadata } from "tslib";
import assert from 'assert';
import { isNonNativeFunction, isDefined, mergeMaps, createRejectablePromiseByNativePromise, whetherTwoMapsSimilar, } from "../../../../../../../utils/common-utils";
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../../../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from "../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types";
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { createImmutableObjectClone } from '../../../../../../../utils/data-immutability-utils/data-immutability-key-value-structure-utils';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { SwarmMessagesChannelDescriptionWithMeta } from '../../../../../swarm-messages-channels-subclasses/swarm-messages-channel-description-with-meta/swarm-messages-channel-description-with-meta';
import { getEventEmitterInstance } from '../../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from '../../../../../../swarm-message-store/swarm-message-store.const';
import { ESwarmMessagesChannelsListEventName, } from '../../../../../types/swarm-messages-channels-list-events.types';
import { ESwarmMessagesDatabaseCacheEventsNames } from '../../../../../../swarm-messages-database/swarm-messages-database.const';
import { debounce } from "../../../../../../../utils/throttling-utils";
import { EMIT_CHANNELS_DESCRIPTIONS_MAP_CACHE_UPDATE_EVENT_DEBOUNCE_MS } from './swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.fabric.const';
import { compareTwoSwarmMessageStoreMessagingRequestWithMetaResults } from '../../../../../../swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-cache/swarm-messages-database-cache.utils';
import { dataCachingUtilsCachingDecoratorGlobalCachePerClass } from "../../../../../../../utils/data-cache-utils";
import { getSwarmMessageUniqueHash } from '../../../../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
export function getRequestResultMessageUniqueIdOrUndefined(requestResult) {
    if (requestResult.message instanceof Error) {
        return undefined;
    }
    return getSwarmMessageUniqueHash(requestResult.message);
}
export function getSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandlerClass(ClassSwarmMessagesChannelsListVersionOneOptionsSetUp, additionalUtils) {
    class SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler extends ClassSwarmMessagesChannelsListVersionOneOptionsSetUp {
        constructor(constructorArguments) {
            super(constructorArguments);
            this.__emitter = getEventEmitterInstance();
            this.__swarmChannelsDescriptionsCachedMap = new Map();
            this.__emitChannelsDescriptionsMapCacheUpdateEvent = debounce(() => {
                this._emitEventDbHandler(ESwarmMessagesChannelsListEventName.CHANNELS_CACHE_UPDATED, this.__swarmChannelsDescriptionsCachedMap);
            }, EMIT_CHANNELS_DESCRIPTIONS_MAP_CACHE_UPDATE_EVENT_DEBOUNCE_MS);
            this.__setCurrentSwarmMessagesChannelsDescriptiopnsCachedMapAndEmitCacheUpdateEvent = (swarmChannelsDescriptionsMap) => {
                this.__setCurrentSwarmMessagesChannelsDescriptiopnsCachedMap(swarmChannelsDescriptionsMap);
                this.__emitChannelsDescriptionsMapCacheUpdateEvent();
            };
            this.__getChannelDescriptionBySwarmMessageDecrypted = (swarmMessageDecrypted) => __awaiter(this, void 0, void 0, function* () {
                return yield this._getValidSwarmMessagesChannelDescriptionFromSwarmMessageBody(swarmMessageDecrypted.bdy);
            });
            this._getSwarmChannelDescriptionRawOrErrorBySwarmDbRequestResult = (requestResult) => __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield this._getSwarmChannelDescriptionRawBySwarmDbRequestResult(requestResult);
                }
                catch (err) {
                    return err;
                }
            });
            this._getSwarmChannelDescriptionWithMetadataBySwarmDbRequestResultWithMetadata = (requestResult) => __awaiter(this, void 0, void 0, function* () {
                const channelDescriptionOrError = yield this._getSwarmChannelDescriptionRawOrErrorBySwarmDbRequestResult(requestResult);
                return new SwarmMessagesChannelDescriptionWithMeta(requestResult, channelDescriptionOrError);
            });
            this.__handleDatabaseReadyToUse = () => {
                this.__emitDatabaseConnectorIsReady();
                this.__updateChannelsDescriptionsMapCachedByCurrentDatabaseConnection();
            };
            this.__handleDatabaseCachedListUpdated = (messagesCached) => {
                if (messagesCached) {
                    this.__updateChannelsMapCachedByCachedMessages(messagesCached);
                }
            };
            this.__handleDatabaseClosedUnexpected = () => {
                this.__unsetCurrentDatabaseConnectionListeners();
                this.__unsetDatabaseConnection();
                this._restartDatabaseConnection();
            };
            this.__handleDatabaseDroppedUnexpected = () => {
                this.__handleDatabaseClosedUnexpected();
            };
            this.__handleMessageAddedInDatabase = (dbName, message, messageAddress, key) => __awaiter(this, void 0, void 0, function* () {
                if (!key) {
                    throw new Error('A database key must be defined for a message with swarm channel description');
                }
                yield this.__addSwarmChannelDescriptionToTheChannelsDescriptionsMapCached(message, key);
                try {
                    const channelDescription = yield this.__getChannelDescriptionBySwarmMessageDecrypted(message);
                    this._emitEventDbHandler(ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE, channelDescription);
                }
                catch (err) {
                    console.error(`__handleMessageAddedInDatabase`, err);
                    throw err;
                }
            });
            this.__handleMessageRemovedFromDatabase = (dbName, userId, messageAddress, messageDeletedAddress, key) => __awaiter(this, void 0, void 0, function* () {
                yield this.__deleteSwarmChannelDescriptionFromTheChannelsDescriptionsMapCached(key);
                this._emitEventDbHandler(ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED, this._getChannelIdByDatabaseKey(key));
            });
            this._validateAdditionalUtils(additionalUtils);
            this.__fabricSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache =
                constructorArguments.utilities.getSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache;
            this.__additionalUtils = createImmutableObjectClone(additionalUtils);
            this.__swarmMessagesKeyValueDatabaseConnectionPending = createRejectablePromiseByNativePromise(this._createActiveConnectionToChannelsListDatabase());
            this.__waitDatabaseWillBeOpenedSetListenersAndOpenedStatus();
        }
        get _emitterDatabaseHandler() {
            return this.__emitter;
        }
        get _databaseConnection() {
            const databaseConnection = this.__databaseConnectionOrUndefined;
            if (!databaseConnection) {
                throw new Error('There is no active database connection instance');
            }
            return databaseConnection;
        }
        get _isDatabaseReady() {
            var _a;
            return Boolean((_a = this.__databaseConnectionOrUndefined) === null || _a === void 0 ? void 0 : _a.isReady);
        }
        get _swarmChannelsDescriptionsCachedMap() {
            return this.__swarmChannelsDescriptionsCachedMap;
        }
        get _additionalUtils() {
            const additionalUtils = this.__additionalUtils;
            if (!additionalUtils) {
                throw new Error('Additional utilities for the instance are not exists');
            }
            return additionalUtils;
        }
        _closeDatabase() {
            return __awaiter(this, void 0, void 0, function* () {
                this.__unsetCurrentDatabaseConnectionListeners();
                this.__stopConnectionPendingToACurrentDatabase();
                const promiseCloseCurrentDatabaseConnection = this.__closeCurrentDatabaseConnection();
                this.__resetInstanceOnDatabaseClosedExpectedly();
                yield promiseCloseCurrentDatabaseConnection;
            });
        }
        _dropDatabase() {
            return __awaiter(this, void 0, void 0, function* () {
                this.__unsetCurrentDatabaseConnectionListeners();
                const databaseConnection = yield this._getSwarmMessagesKeyValueDatabaseConnection();
                this.__stopConnectionPendingToACurrentDatabase();
                this.__resetInstanceOnDatabaseClosedExpectedly();
                yield databaseConnection.drop();
            });
        }
        _readSwarmMessagesChannelDescriptionOrUndefinedForDbKey(dbbKey, additionalRequestOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const requestResultForDbKey = yield this._readValueStoredInDatabaseByDbKey(dbbKey, additionalRequestOptions);
                if (!requestResultForDbKey) {
                    return undefined;
                }
                const messageForDbKey = yield this._getSwarmChannelDescriptionRawBySwarmDbRequestResult(requestResultForDbKey);
                return messageForDbKey;
            });
        }
        _readAllChannelsDescriptionsWithMeta() {
            return __awaiter(this, void 0, void 0, function* () {
                const optionsForReadingAllValuesStored = this._createOptionsForCollectingAllDatabaseValues();
                const messagesReadFromDatabase = yield this.__requestDatabase(optionsForReadingAllValuesStored);
                const swarmMessagesChannelsDescriptionsOrErrors = yield this._convertDatabaseRequestResultIntoSwarmChannelsDescriptionsWithMeta(messagesReadFromDatabase);
                return swarmMessagesChannelsDescriptionsOrErrors;
            });
        }
        _addSwarmMessageBodyInDatabase(dbKey, messageBody) {
            return __awaiter(this, void 0, void 0, function* () {
                const dbConnection = yield this._getSwarmMessagesKeyValueDatabaseConnection();
                const swarmMessageAddress = yield dbConnection.addMessage(messageBody, dbKey);
                return swarmMessageAddress;
            });
        }
        _removeValueForDbKey(dbKey) {
            return __awaiter(this, void 0, void 0, function* () {
                const dbConnection = yield this._getSwarmMessagesKeyValueDatabaseConnection();
                const argumentForDeleteValueForKeyFromDb = this._getArgumentForDeleteFromDbSwarmDbMethodByDbKey(dbKey);
                yield dbConnection.deleteMessage(argumentForDeleteValueForKeyFromDb);
            });
        }
        _createActiveConnectionToChannelsListDatabase() {
            return __awaiter(this, void 0, void 0, function* () {
                const optionsForDatabase = this._getChannelsListDatabaseOptions();
                const { databaseConnectionFabric } = this._getUtilities();
                const connectionToDatabase = yield databaseConnectionFabric(optionsForDatabase);
                return connectionToDatabase;
            });
        }
        _convertDatabaseRequestResultIntoSwarmChannelsDescriptionsWithMeta(swarmMessagesFromDatabase) {
            return __awaiter(this, void 0, void 0, function* () {
                const nonNullableSwarmMessagesFromDatabase = swarmMessagesFromDatabase.filter(isDefined);
                return yield Promise.all(nonNullableSwarmMessagesFromDatabase.map(this._getSwarmChannelDescriptionWithMetadataBySwarmDbRequestResultWithMetadata));
            });
        }
        _getErrorForRejectingSwarmMessagesKeyValueDatabaseConnectionPendingOnCloseInstance() {
            return new Error('The instance has been closed');
        }
        _validateAdditionalUtils(additionalUtils) {
            assert(additionalUtils, 'Additional utils should be provided for the SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler constructor');
            assert(typeof additionalUtils === 'object', 'Additional utils should have an object type');
            const { createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator, getArgumentsForSwarmMessageWithChannelDescriptionValidator, getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator, } = additionalUtils;
            assert(isNonNativeFunction(createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator), 'createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator function should be provided in the "additionalUtils" constructor argument');
            assert(isNonNativeFunction(getArgumentsForSwarmMessageWithChannelDescriptionValidator), 'getArgumentsForSwarmMessageWithChannelDescriptionValidator function should be provided in the "additionalUtils" constructor argument');
            assert(isNonNativeFunction(getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator), 'getArgumentsForSwarmMessageWithChannelDescriptionValidator function should be provided in the "additionalUtils" constructor argument');
        }
        _restartDatabaseConnection() {
            this.__swarmMessagesKeyValueDatabaseConnectionPending = createRejectablePromiseByNativePromise(this._createActiveConnectionToChannelsListDatabase());
            this.__waitDatabaseWillBeOpenedSetListenersAndOpenedStatus();
        }
        _emitEventDbHandler(eventName, ...args) {
            this.__emitter.emit(eventName, ...args);
        }
        _getChannelIdByDatabaseKey(key) {
            const { getChannelIdByDatabaseKey } = this._getUtilities();
            return getChannelIdByDatabaseKey(key);
        }
        __waitDatabaseWillBeOpenedSetListenersAndOpenedStatus() {
            void this.__swarmMessagesKeyValueDatabaseConnectionPending.then((swarmMessagesDatabaseConnector) => {
                this.__setDatabaseConnection(swarmMessagesDatabaseConnector);
                this.__setCurrentDatabaseConnectionListeners();
                this.__emitDatabaseIsOpenedIfCurrentDatabaseConnectorIsReady();
            });
        }
        __rejectWithErrorSwarmMessagesKeyValueDatabaseConnectionPending(error) {
            this.__swarmMessagesKeyValueDatabaseConnectionPending.reject(error);
        }
        __closeCurrentDatabaseConnection() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this._databaseConnection.close();
            });
        }
        __setDatabaseConnection(databaseConnection) {
            this.__databaseConnectionOrUndefined = databaseConnection;
        }
        __unsetDatabaseConnection() {
            this.__databaseConnectionOrUndefined = undefined;
        }
        __setCurrentDatabaseConnectionListeners() {
            this.__setOrUnsetDatabaseEventsListeners(this._databaseConnection, true);
        }
        __unsetCurrentDatabaseConnectionListeners() {
            this.__setOrUnsetDatabaseEventsListeners(this._databaseConnection, false);
        }
        __stopConnectionPendingToACurrentDatabase() {
            this.__rejectWithErrorSwarmMessagesKeyValueDatabaseConnectionPending(this._getErrorForRejectingSwarmMessagesKeyValueDatabaseConnectionPendingOnCloseInstance());
        }
        __emitDatabaseConnectorIsReady() {
            this._emitEventDbHandler(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_DATABASE_READY);
        }
        __emitDatabaseIsOpenedIfCurrentDatabaseConnectorIsReady() {
            var _a;
            if ((_a = this.__databaseConnectionOrUndefined) === null || _a === void 0 ? void 0 : _a.isReady) {
                this.__emitDatabaseConnectorIsReady();
            }
        }
        __setSwarmMessagesForCurrentUpdateOfDescriptionsCachedMap(cachedMessages) {
            this.__swarmMessagesForCurrentUpdateOfDescriptionsCachedMap = cachedMessages;
        }
        __unsetSwarmMessagesForCurrentUpdateOfDescriptionsCachedMap() {
            this.__swarmMessagesForCurrentUpdateOfDescriptionsCachedMap = undefined;
        }
        __whetherCurrentSwarmMessagesForCurrentUpdateOfDescriptionsCachedMapIfEqualsTo(cachedMessages) {
            const swarmMessagesForCurrentUpdateOfDescriptionsCachedMapCurrentList = this.__swarmMessagesForCurrentUpdateOfDescriptionsCachedMap;
            if (!swarmMessagesForCurrentUpdateOfDescriptionsCachedMapCurrentList) {
                return false;
            }
            return whetherTwoMapsSimilar(swarmMessagesForCurrentUpdateOfDescriptionsCachedMapCurrentList, cachedMessages, compareTwoSwarmMessageStoreMessagingRequestWithMetaResults);
        }
        __unsetSwarmMessagesForCurrentUpdateOfDescriptionsCachedMapIfEqualsTo(cachedMessages) {
            if (this.__whetherCurrentSwarmMessagesForCurrentUpdateOfDescriptionsCachedMapIfEqualsTo(cachedMessages)) {
                this.__unsetSwarmMessagesForCurrentUpdateOfDescriptionsCachedMap();
            }
        }
        __setCurrentSwarmMessagesChannelsDescriptiopnsCachedMap(swarmChannelsDescriptionsMap) {
            this.__swarmChannelsDescriptionsCachedMap = swarmChannelsDescriptionsMap;
        }
        __clearCurrentSwarmMessagesChannelsDescriptiopnsCachedMap() {
            this.__swarmChannelsDescriptionsCachedMap.clear();
        }
        __mergeAndSetSwarmMessagesChannelsDescriptiopnsCachedMap(swarmChannelsDescriptionsMapToMerge) {
            const copyCachedMerged = mergeMaps(this.__getCopyCurrentSwarmMessagesChannelsDescriptionsCachedMap(), swarmChannelsDescriptionsMapToMerge);
            this.__setCurrentSwarmMessagesChannelsDescriptiopnsCachedMap(copyCachedMerged);
        }
        __mergeSetAndEmitSwarmMessagesChannelsDescriptionsCachedMapUpdateEvent(swarmChannelsDescriptionsMapToMerge) {
            this.__mergeAndSetSwarmMessagesChannelsDescriptiopnsCachedMap(swarmChannelsDescriptionsMapToMerge);
            this.__emitChannelsDescriptionsMapCacheUpdateEvent();
        }
        __setCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseAndReturnCancellable(promiseChannelsDescriptionsMapUpdate) {
            const promisePendingRejectable = createRejectablePromiseByNativePromise(promiseChannelsDescriptionsMapUpdate);
            this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise = promisePendingRejectable;
            return promisePendingRejectable;
        }
        __unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise() {
            this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise = undefined;
        }
        __unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseIfEqualsTo(promiseCancellableWaitingFor) {
            if (this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise === promiseCancellableWaitingFor) {
                this.__unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise();
            }
        }
        __setCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseReturnItAndUnsetOnFinish(promiseChannelsDescriptionsMapUpdate) {
            const promiseCancellableWaitingFor = this.__setCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseAndReturnCancellable(promiseChannelsDescriptionsMapUpdate);
            promiseCancellableWaitingFor.finally(() => {
                this.__unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseIfEqualsTo(promiseCancellableWaitingFor);
            });
            return promiseCancellableWaitingFor;
        }
        __rejectCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise(error) {
            const swarmChannelsDescriptionsCachedMapActiveUpdatePromise = this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise;
            if (swarmChannelsDescriptionsCachedMapActiveUpdatePromise) {
                swarmChannelsDescriptionsCachedMapActiveUpdatePromise.reject(error || new Error('Rejected by unknown reason'));
            }
            this.__unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise();
        }
        __waitTillCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdating() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise;
            });
        }
        __resetInstanceOnDatabaseClosedExpectedly() {
            this.__unsetDatabaseConnection();
            this.__clearCurrentSwarmMessagesChannelsDescriptiopnsCachedMap();
            this.__rejectWithErrorSwarmMessagesKeyValueDatabaseConnectionPending(new Error('Database connection is closed'));
            this.__unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise();
        }
        _getSwarmMessagesKeyValueDatabaseConnection() {
            return __awaiter(this, void 0, void 0, function* () {
                const swarmMessagesKeyValueDatabaseConnection = this.__swarmMessagesKeyValueDatabaseConnectionPending;
                if (!swarmMessagesKeyValueDatabaseConnection) {
                    throw new Error('There is no an active connection with the swarm messages databse');
                }
                return yield swarmMessagesKeyValueDatabaseConnection;
            });
        }
        _createOptionsForCollectingDbKey(dbbKey) {
            if (this._connectorType === ESwarmStoreConnector.OrbitDB) {
                return {
                    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: dbbKey,
                    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: 1,
                };
            }
            throw new Error('Swarm connector type is not supported');
        }
        _createOptionsForCollectingAllDatabaseValues() {
            if (this._connectorType === ESwarmStoreConnector.OrbitDB) {
                return {
                    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: -1,
                };
            }
            throw new Error('Swarm connector type is not supported');
        }
        _getValidSwarmMessagesChannelDescriptionFromSwarmMessageBody(swarmMessageBody) {
            return __awaiter(this, void 0, void 0, function* () {
                const { pld, typ, iss } = swarmMessageBody;
                const swarmMessagesChannelDescriptionSerialized = pld;
                const swarmMessagesChannelDescriptionDeserialized = this._deserializeChannelDescriptionRaw(swarmMessagesChannelDescriptionSerialized);
                yield this._validateChannelDescriptionFormat(swarmMessagesChannelDescriptionDeserialized);
                assert(this._createChannelDescriptionMessageIssuer() === iss, '"Issuer" of the swarm message with the swarm messages channel description is not valid');
                assert(this._createChannelDescriptionMessageTyp() === typ, '"Typ" of the swarm message with the swarm messages channel description is not valid');
                return swarmMessagesChannelDescriptionDeserialized;
            });
        }
        _getSwarmChannelDescriptionRawBySwarmDbRequestResult(requestResult) {
            return __awaiter(this, void 0, void 0, function* () {
                const messageDecryptedOrError = requestResult.message;
                if (messageDecryptedOrError instanceof Error) {
                    throw new Error(`${messageDecryptedOrError.message}`);
                }
                const swarmMessagesChannelDescriptionDeserialized = yield this.__getChannelDescriptionBySwarmMessageDecrypted(messageDecryptedOrError);
                return swarmMessagesChannelDescriptionDeserialized;
            });
        }
        _getRequestResultFromAllRequestResultsOnASingleDatabaseKeyRead(requestResults) {
            if (Array.isArray(requestResults) && requestResults.length) {
                assert(requestResults.length === 1, 'Request result for one datbase key should be an array with the lenght of 1');
                return requestResults[0];
            }
            return undefined;
        }
        __requestDatabase(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const dbConnection = yield this._getSwarmMessagesKeyValueDatabaseConnection();
                return yield dbConnection.collectWithMeta(options);
            });
        }
        _requestDatabaseForDbKey(dbbKey, additionalRequestOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const optionsForReadingKeyValue = this._createOptionsForCollectingDbKey(dbbKey);
                const optionsWithAdditional = Object.assign(Object.assign({}, optionsForReadingKeyValue), additionalRequestOptions);
                return yield this.__requestDatabase(optionsWithAdditional);
            });
        }
        _readValueStoredInDatabaseByDbKey(dbbKey, additionalRequestOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const requestResults = yield this._requestDatabaseForDbKey(dbbKey, additionalRequestOptions);
                const requestResultForDbKey = this._getRequestResultFromAllRequestResultsOnASingleDatabaseKeyRead(requestResults);
                return requestResultForDbKey;
            });
        }
        _getArgumentForDeleteFromDbSwarmDbMethodByDbKey(dbKey) {
            if (this._connectorType === ESwarmStoreConnector.OrbitDB) {
                return dbKey;
            }
            throw new Error('Swarm connector type is not supported');
        }
        _getChannelsListDatabaseName() {
            const channelListDescription = this._getChannelsListDescription();
            const { databaseNameGenerator } = this._getUtilities();
            return databaseNameGenerator(channelListDescription);
        }
        _getConstantArgumentsForGrantAccessCallbackValidator() {
            const channelsListDescription = this._getChannelsListDescription();
            const { dbOptions: { grantAccess }, } = this._getConnectionOptions();
            const { getDatabaseKeyForChannelDescription, getTypeForSwarmMessageWithChannelDescriptionByChannelDescription, getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription, } = this._getUtilities();
            const { swarmMessagesChannelDescriptionFormatValidator: swarmMessagesChannelDescriptionValidator } = this._getValidators();
            const getIsDatabaseOpened = () => this._isDatabaseReady;
            return {
                get isDatabaseReady() {
                    return getIsDatabaseOpened();
                },
                channelsListDescription,
                grandAccessCallbackFromDbOptions: grantAccess,
                getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription: getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription,
                getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription: getTypeForSwarmMessageWithChannelDescriptionByChannelDescription,
                getDatabaseKeyForChannelDescription,
                channelDescriptionFormatValidator: swarmMessagesChannelDescriptionValidator,
                parseChannelDescription: this._deserializeChannelDescriptionRaw.bind(this),
            };
        }
        __getArgumentsForFabricSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache() {
            return {
                getChannelDescriptionBySwarmMessage: this.__getChannelDescriptionBySwarmMessageDecrypted,
            };
        }
        __createSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache() {
            const swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache = this.__fabricSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache(this.__getArgumentsForFabricSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache());
            return swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache;
        }
        _createGrantAccessCallbackForChannelsListDatabase() {
            const argumentsConstant = this._getConstantArgumentsForGrantAccessCallbackValidator();
            const { channelDescriptionSwarmMessageValidator } = this._getValidators();
            const { createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator, getArgumentsForSwarmMessageWithChannelDescriptionValidator, getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator, } = this._additionalUtils;
            const swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache = this.__createSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache();
            const params = {
                constantArguments: argumentsConstant,
                swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache,
                channelDescriptionSwarmMessageValidator,
                getArgumentsForSwarmMessageWithChannelDescriptionValidator,
                getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator,
            };
            return createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator(params);
        }
        _getChannelsListDatabaseOptions() {
            const databaseName = this._getChannelsListDatabaseName();
            const { dbOptions } = this._getConnectionOptions();
            const databaseGrantAccessCallback = this._createGrantAccessCallbackForChannelsListDatabase();
            return Object.assign(Object.assign({}, dbOptions), { dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, dbName: databaseName, grantAccess: databaseGrantAccessCallback, preloadCount: -1 });
        }
        __getNewSwarmMessagesChannelsDescriptiopnsCachedMap() {
            return new Map();
        }
        __getCopyCurrentSwarmMessagesChannelsDescriptionsCachedMap() {
            return new Map(this.__swarmChannelsDescriptionsCachedMap);
        }
        __addSwarmChannelDescriptionToSwarmChannelsDescriptionsMapBySwarmMessage(swarmChannelsDescriptionsMap, swarmMessage, swarmMessageDatabaseKey) {
            return __awaiter(this, void 0, void 0, function* () {
                const swarmChannelDescription = yield this.__getChannelDescriptionBySwarmMessageDecrypted(swarmMessage);
                const swarmChannelId = this._getChannelIdByDatabaseKey(swarmMessageDatabaseKey);
                swarmChannelsDescriptionsMap.set(swarmChannelId, swarmChannelDescription);
            });
        }
        __addErrorToSwarmChannelsDescriptionsMap(swarmChannelsDescriptionsMap, error, swarmMessageDatabaseKey) {
            const swarmChannelId = this._getChannelIdByDatabaseKey(swarmMessageDatabaseKey);
            swarmChannelsDescriptionsMap.set(swarmChannelId, error);
        }
        __addSwarmChannelDescriptionOrErrorIfRejectedToSwarmChannelsDescriptionsMapBySwarmMessage(swarmChannelsDescriptionsMap, swarmMessage, swarmMessageDatabaseKey) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.__addSwarmChannelDescriptionToSwarmChannelsDescriptionsMapBySwarmMessage(swarmChannelsDescriptionsMap, swarmMessage, swarmMessageDatabaseKey).catch((errorOccurred) => this.__addErrorToSwarmChannelsDescriptionsMap(swarmChannelsDescriptionsMap, errorOccurred, swarmMessageDatabaseKey));
            });
        }
        __deleteSwarmChannelDescriptionFromSwarmChannelsDescriptionsMapCachedBySwarmMessage(swarmChannelsDescriptionsMap, swarmMessageDatabaseKey) {
            const swarmChannelId = this._getChannelIdByDatabaseKey(swarmMessageDatabaseKey);
            swarmChannelsDescriptionsMap.delete(swarmChannelId);
        }
        __updateCachedChannelsListByCachedMessages(cachedMessages) {
            return __awaiter(this, void 0, void 0, function* () {
                const updatedChannelsListDescriptionsCached = this.__getNewSwarmMessagesChannelsDescriptiopnsCachedMap();
                const swarmMessagesConvertationsToChannelsDescriptionsAndAddingToCachePending = [];
                cachedMessages.forEach((swarmMessageWithDescription, swarmMessageKeyInKVDatabase) => {
                    const swarmMessageOrError = swarmMessageWithDescription.message;
                    if (swarmMessageOrError instanceof Error) {
                        this.__addErrorToSwarmChannelsDescriptionsMap(updatedChannelsListDescriptionsCached, swarmMessageOrError, swarmMessageKeyInKVDatabase);
                        return;
                    }
                    const pendingAddChannelDescription = this.__addSwarmChannelDescriptionOrErrorIfRejectedToSwarmChannelsDescriptionsMapBySwarmMessage(updatedChannelsListDescriptionsCached, swarmMessageOrError, swarmMessageKeyInKVDatabase);
                    swarmMessagesConvertationsToChannelsDescriptionsAndAddingToCachePending.push(pendingAddChannelDescription);
                });
                yield Promise.all(swarmMessagesConvertationsToChannelsDescriptionsAndAddingToCachePending);
                return updatedChannelsListDescriptionsCached;
            });
        }
        __updateChannelsMapCachedByPromisePendingResultOrHandleRejection(cachedMessages, promisePendingRejectable) {
            void promisePendingRejectable
                .then(this.__setCurrentSwarmMessagesChannelsDescriptiopnsCachedMapAndEmitCacheUpdateEvent)
                .catch(((instance, cachedMessagesClosure) => function __updateChannelsMapCachedByPromiseHandleRejection() {
                instance.__unsetSwarmMessagesForCurrentUpdateOfDescriptionsCachedMapIfEqualsTo(cachedMessagesClosure);
            })(this, cachedMessages));
        }
        __updateChannelsMapCachedByCachedMessages(cachedMessages) {
            if (this.__whetherCurrentSwarmMessagesForCurrentUpdateOfDescriptionsCachedMapIfEqualsTo(cachedMessages)) {
                return;
            }
            this.__rejectCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise(new Error('Rejected by new inconming update'));
            const updateChannelsDescriptionPromiseNative = this.__updateCachedChannelsListByCachedMessages(cachedMessages);
            const promisePendingRejectable = this.__setCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseReturnItAndUnsetOnFinish(updateChannelsDescriptionPromiseNative);
            this.__updateChannelsMapCachedByPromisePendingResultOrHandleRejection(cachedMessages, promisePendingRejectable);
            this.__setSwarmMessagesForCurrentUpdateOfDescriptionsCachedMap(cachedMessages);
        }
        __updateChannelsDescriptionsMapCachedByCurrentDatabaseConnection() {
            var _a;
            const cachedMessages = (_a = this.__databaseConnectionOrUndefined) === null || _a === void 0 ? void 0 : _a.cachedMessages;
            if (cachedMessages) {
                this.__updateChannelsMapCachedByCachedMessages(cachedMessages);
            }
        }
        __addSwarmChannelDescriptionToTheChannelsDescriptionsMapCached(message, key) {
            return __awaiter(this, void 0, void 0, function* () {
                while (this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise) {
                    yield this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise;
                }
                const temporaryMap = new Map();
                const cahceUpdatingPromise = this.__addSwarmChannelDescriptionOrErrorIfRejectedToSwarmChannelsDescriptionsMapBySwarmMessage(temporaryMap, message, key);
                const cahceUpdatingPromisePendingCancellable = this.__setCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseReturnItAndUnsetOnFinish(cahceUpdatingPromise);
                yield cahceUpdatingPromisePendingCancellable;
                this.__mergeSetAndEmitSwarmMessagesChannelsDescriptionsCachedMapUpdateEvent(temporaryMap);
            });
        }
        __deleteSwarmChannelDescriptionFromTheChannelsDescriptionsMapCached(key) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.__waitTillCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdating();
                const copyChannelsDescriptionsCachedMap = this.__getCopyCurrentSwarmMessagesChannelsDescriptionsCachedMap();
                this.__deleteSwarmChannelDescriptionFromSwarmChannelsDescriptionsMapCachedBySwarmMessage(copyChannelsDescriptionsCachedMap, key);
                this.__setCurrentSwarmMessagesChannelsDescriptiopnsCachedMapAndEmitCacheUpdateEvent(copyChannelsDescriptionsCachedMap);
            });
        }
        __setOrUnsetDatabaseEventsListeners(databaseConnection, isSetListeners) {
            const eventEmitterMethodName = isSetListeners ? 'addListener' : 'removeListener';
            databaseConnection.emitter[eventEmitterMethodName](ESwarmStoreEventNames.READY, this.__handleDatabaseReadyToUse);
            databaseConnection.emitter[eventEmitterMethodName](ESwarmStoreEventNames.CLOSE_DATABASE, this.__handleDatabaseClosedUnexpected);
            databaseConnection.emitter[eventEmitterMethodName](ESwarmStoreEventNames.DROP_DATABASE, this.__handleDatabaseDroppedUnexpected);
            databaseConnection.emitter[eventEmitterMethodName](ESwarmMessageStoreEventNames.DELETE_MESSAGE, this.__handleMessageRemovedFromDatabase);
            databaseConnection.emitter[eventEmitterMethodName](ESwarmMessageStoreEventNames.NEW_MESSAGE, this.__handleMessageAddedInDatabase);
            databaseConnection.emitter[eventEmitterMethodName](ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, this.__handleDatabaseCachedListUpdated);
        }
    }
    __decorate([
        dataCachingUtilsCachingDecoratorGlobalCachePerClass(2, getRequestResultMessageUniqueIdOrUndefined),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler.prototype, "_getSwarmChannelDescriptionRawBySwarmDbRequestResult", null);
    return SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler;
}
//# sourceMappingURL=swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.fabric.js.map