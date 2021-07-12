import { __awaiter } from "tslib";
import assert from 'assert';
import { isDeepEqual } from "../../../../../../utils";
import { ESwarmStoreConnector } from "../../../../../swarm-store-class/swarm-store-class.const";
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from "../../../../../swarm-message/swarm-message-constructor.types";
import { ISwarmStoreConnector, ISwarmStoreConnectorBasic, ISwarmStoreOptionsConnectorFabric, ISwarmStoreProviderOptions, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType, } from "../../../../../swarm-store-class/swarm-store-class.types";
import { ISwarmMessageStore, ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreOptionsWithConnectorFabric, TSwarmMessagesStoreGrantAccessCallback, } from "../../../../../swarm-message-store/types/swarm-message-store.types";
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from "../../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types";
import { ISwarmMessagesDatabaseCache, ISwarmMessagesDatabaseCacheOptions, ISwarmMessagesDatabaseConnectOptions, } from "../../../../../swarm-messages-database/swarm-messages-database.types";
import { ISwarmMessagesDatabaseMessagesCollector } from "../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types";
import { swarmMessagesChannelValidationDescriptionFormatV1 } from '../../../../swarm-messages-channels-utils/swarm-messages-channel-utils/swarm-messages-channel-validation-utils/swarm-messages-channel-validation-description-utils/swarm-messages-channel-validation-description-format-v1/swarm-messages-channel-validation-description-format-v1';
import { validateVerboseBySchemaWithVoidResult } from "../../../../../../utils/validation-utils/validation-utils";
import swarmMessagesChannelDescriptionJSONSchema from '../../../../const/validation/swarm-messages-channel/swarm-messages-channel-description/schemas/swarm-message-channel-description-v1-format-schema.json';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../../../../const/swarm-messages-channels-main.const';
import { getOptionsForChannelsListHandlerByContstructorOptions } from '../utils/swarm-messages-channel-v1-class-common.utils';
import { ESwarmMessagesChannelsListEventName } from '../../../../types/swarm-messages-channels-list-events.types';
import { ESwarmStoreEventNames } from '../../../../../swarm-store-class/swarm-store-class.const';
import { ESwarmMessagesChannelEventName, } from '../../../../types/swarm-messages-channel-events.types';
export class SwarmMessagesChannelV1Class {
    constructor(__options, __swarmMessagesChannelV1ClassChannelsListHandlerConstructor, __swarmMessagesChannelV1DatabaseHandlerConstructor) {
        this.__options = __options;
        this.__swarmMessagesChannelV1ClassChannelsListHandlerConstructor = __swarmMessagesChannelV1ClassChannelsListHandlerConstructor;
        this.__swarmMessagesChannelV1DatabaseHandlerConstructor = __swarmMessagesChannelV1DatabaseHandlerConstructor;
        this.__markedAsRemoved = false;
        this.__isClosed = false;
        this.handleChannelsListHandlerEventChannelDescriptionUpdate = (channelDescriptionUpdated) => __awaiter(this, void 0, void 0, function* () {
            if (!isDeepEqual(channelDescriptionUpdated, this.__swarmMessagesChannelDescriptionActual)) {
                this._setChannelDescriptionActual(channelDescriptionUpdated);
                try {
                    yield this._restartChannelDatabaseConnectorWithDatabaseHandler();
                }
                catch (err) {
                    this._setChannelInactiveReasonError(err);
                    return;
                }
            }
            this._unsetChannelMarkedAsRemoved();
        });
        this.__handleChannelsListHandlerEventChannelDescriptionRemoved = () => {
            this._setChannelInactiveReasonError(new Error('Channel description has been removed from the channels list'));
            this._setChannelMarkedAsRemoved();
            this.__emitChannelClosed();
        };
        this.__handleChannelDatabaseHandlerEventDatabaseReady = () => {
            if (this.isReady) {
                this.__emitChannelOpened();
            }
        };
        this.__handleChannelDatabaseHandlerEventDatabaseClosed = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.__closeChannelWithReasonError(new Error('Channel database closed unexpectedly'));
            }
            catch (err) {
                console.error('__handleChannelDatabaseHandlerEventDatabaseClosed', err);
                throw err;
            }
        });
        this.__handleChannelDatabaseHandlerEventDatabaseDropped = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.__closeChannelWithReasonError(new Error('Channel database dropped unexpectedly'));
            }
            catch (err) {
                console.error('__handleChannelDatabaseHandlerEventDatabaseDropped', err);
                throw err;
            }
        });
        this._validateOptions(__options);
        this.__swarmMessagesChannelDescriptionActual = __options.swarmMessagesChannelDescription;
        const swarmMessagesChannelsListHandler = this._createSwarmMessagesChannelsListHandlerInstance();
        this.__swarmMessagesChannelsListHandlerInstance = swarmMessagesChannelsListHandler;
        this._setListenersSwarmMessagesChannelsListHandlerInstance(swarmMessagesChannelsListHandler);
        const swarmMessagesChannelDatabaseHandler = this._createSwarmMessagesChannelDatabaseHandler();
        this.__swarmMessagesChannelDatabaseHandlerInstance = swarmMessagesChannelDatabaseHandler;
        this._setListenersSwarmMessagesChannelDatabaseHandlerInstance(swarmMessagesChannelDatabaseHandler);
    }
    get id() {
        return this._swarmMessagesChannelDescriptionWODatabaseOptions.id;
    }
    get version() {
        return this._swarmMessagesChannelDescriptionWODatabaseOptions.version;
    }
    get name() {
        return this._swarmMessagesChannelDescriptionWODatabaseOptions.name;
    }
    get description() {
        return this._swarmMessagesChannelDescriptionWODatabaseOptions.description;
    }
    get tags() {
        return this._swarmMessagesChannelDescriptionWODatabaseOptions.tags;
    }
    get dbType() {
        return this._swarmMessagesChannelDescriptionWODatabaseOptions.dbType;
    }
    get messageEncryption() {
        return this._swarmMessagesChannelDescriptionWODatabaseOptions.messageEncryption;
    }
    get admins() {
        return this._swarmMessagesChannelDescriptionWODatabaseOptions.admins;
    }
    get channelInactiveReasonError() {
        return this.__channelInactiveReasonError;
    }
    get emitterChannelState() {
        return this.__swarmMessagesChannelsListHandlerInstance.emitter;
    }
    get emitterChannelMessagesDatabase() {
        return this.__swarmMessagesChannelDatabaseHandlerInstance.emitter;
    }
    get markedAsRemoved() {
        return this.__markedAsRemoved;
    }
    get isReady() {
        return (!this.__isClosed &&
            !this.__markedAsRemoved &&
            this._whetherChannelIsActive &&
            Boolean(this.__swarmMessagesChannelDatabaseHandlerInstance.isDatabaseReady));
    }
    get cachedMessages() {
        return this.__swarmMessagesChannelDatabaseHandlerInstance.cachedMessages;
    }
    get _swarmMessagesChannelDescriptionWODatabaseOptions() {
        return this._swarmMessagesChannelDescriptionActual;
    }
    get _swarmMessagesChannelDescriptionActual() {
        return this.__swarmMessagesChannelDescriptionActual;
    }
    get _constructorOptionsUtils() {
        return this.__options.utils;
    }
    get _whetherChannelIsActive() {
        return !this.__channelInactiveReasonError;
    }
    get _actualSwarmMessagesIssuer() {
        const { getSwarmMessageIssuerByChannelDescription } = this._constructorOptionsUtils;
        const messagesIssuer = getSwarmMessageIssuerByChannelDescription(this.__swarmMessagesChannelDescriptionActual);
        if (!messagesIssuer) {
            throw new Error('An issuer for swarm messages which sent throught the channel is not defined');
        }
        return messagesIssuer;
    }
    addMessage(message, key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._getActiveSwarmMessagesChannelDatabaseHandlerInstance().addMessage(message, key);
        });
    }
    deleteMessage(messageAddressOrKey) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._getActiveSwarmMessagesChannelDatabaseHandlerInstance().deleteMessage(messageAddressOrKey);
        });
    }
    collect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collectedMessagesResult = yield this._getActiveSwarmMessagesChannelDatabaseHandlerInstance().collect(options);
            return collectedMessagesResult;
        });
    }
    collectWithMeta(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const swarmMessagesWithMetaCollected = yield this._getActiveSwarmMessagesChannelDatabaseHandlerInstance().collectWithMeta(options);
            return swarmMessagesWithMetaCollected;
        });
    }
    updateChannelDescription(channelRawDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            this._verifyChannelIsReadyForChannelListOperations();
            yield this._getActiveSwarmMessagesChannelsListHandlerInstance().updateChannelDescription(channelRawDescription);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.__isClosed) {
                return;
            }
            this._setChannelClosed();
            this._unsetAllListenersOfInstancesRelated();
            yield this._closeChannelDatabaseHandlerInstance();
            this.__emitChannelClosed();
            this._resetState();
        });
    }
    deleteLocally() {
        return __awaiter(this, void 0, void 0, function* () {
            this._unsetListenersSwarmMessagesChannelDatabaseHandlerInstance();
            const activeSwarmMessagesChannelDatabaseHandlerInstance = this._getActiveSwarmMessagesChannelDatabaseHandlerInstance();
            try {
                yield activeSwarmMessagesChannelDatabaseHandlerInstance.dropDatabaseLocally();
            }
            finally {
                yield this.close();
            }
        });
    }
    dropDescriptionAndDeleteRemotely() {
        return __awaiter(this, void 0, void 0, function* () {
            this._unsetAllListenersOfInstancesRelated();
            const activeSwarmMessagesChannelDatabaseHandlerInstance = this._getActiveSwarmMessagesChannelDatabaseHandlerInstance();
            const activeSwarmMessagesChannelsListHandlerInstance = this._getActiveSwarmMessagesChannelsListHandlerInstance();
            try {
                yield activeSwarmMessagesChannelsListHandlerInstance.dropChannelDescriptionFromList();
                yield activeSwarmMessagesChannelDatabaseHandlerInstance.dropDatabaseLocally();
            }
            finally {
                yield this.close();
            }
        });
    }
    _validateSwarmMessagesChannelsListInstance(swarmMessagesChannelsListInstance) {
        assert(swarmMessagesChannelsListInstance, 'swarmMessagesChannelsListInstance must not be empty');
        assert(typeof swarmMessagesChannelsListInstance === 'object', 'swarmMessagesChannelsListInstance must be an object');
        assert(typeof swarmMessagesChannelsListInstance.upsertChannel === 'function', 'swarmMessagesChannelsListInstance have an unknown implementation because the method "upsertChannel" is not a function');
        assert(typeof swarmMessagesChannelsListInstance.removeChannelById === 'function', 'swarmMessagesChannelsListInstance have an unknown implementation because the method "removeChannelById" is not a function');
    }
    _validateSwarmChannelDescription(swarmMessagesChannelDescription) {
        validateVerboseBySchemaWithVoidResult(swarmMessagesChannelDescriptionJSONSchema, swarmMessagesChannelDescription);
        swarmMessagesChannelValidationDescriptionFormatV1(swarmMessagesChannelDescription);
    }
    _validateOptions(options) {
        assert(options, 'Options must be provided');
        assert(typeof options === 'object', 'Options must be an object');
        const { swarmMessagesChannelDescription, swarmMessagesChannelsListInstance, passwordEncryptedChannelEncryptionQueue } = options;
        this._validateSwarmMessagesChannelsListInstance(swarmMessagesChannelsListInstance);
        this._validateSwarmChannelDescription(swarmMessagesChannelDescription);
        if (swarmMessagesChannelDescription.messageEncryption === SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD) {
            assert(passwordEncryptedChannelEncryptionQueue, 'Encryption queue must be provided in constructor options for channel with password encryption');
        }
    }
    _getOptionsForSwarmMessagesChannelsListConstructor() {
        return getOptionsForChannelsListHandlerByContstructorOptions(this.__options);
    }
    _createSwarmMessagesChannelsListHandlerInstance() {
        const SwarmMessagesChannelV1ClassChannelsListHandlerConstructor = this.__swarmMessagesChannelV1ClassChannelsListHandlerConstructor;
        const constructorOptions = this._getOptionsForSwarmMessagesChannelsListConstructor();
        const swarmMessagesChannelsListInstance = new SwarmMessagesChannelV1ClassChannelsListHandlerConstructor(constructorOptions);
        return swarmMessagesChannelsListInstance;
    }
    _setChannelInactiveReasonError(channelInactivityResonError) {
        this.__channelInactiveReasonError = channelInactivityResonError;
    }
    _unsetChannelInactiveReasonError() {
        this.__channelInactiveReasonError = undefined;
    }
    _setChannelClosed() {
        this.__isClosed = true;
    }
    _setChannelMarkedAsRemoved() {
        this.__markedAsRemoved = true;
    }
    _unsetChannelMarkedAsRemoved() {
        this.__markedAsRemoved = false;
    }
    _unsetInstancesRelated() {
        this.__swarmMessagesChannelsListHandlerInstance = undefined;
        this.__swarmMessagesChannelDatabaseHandlerInstance = undefined;
    }
    _setListenersSwarmMessagesChannelsListHandlerInstance(swarmMessagesChannelsListInstance, isAddListeners = true) {
        const emitter = swarmMessagesChannelsListInstance.emitter;
        const methodName = isAddListeners ? 'addListener' : 'removeListener';
        emitter[methodName](ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE, this.handleChannelsListHandlerEventChannelDescriptionUpdate);
        emitter[methodName](ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED, this.__handleChannelsListHandlerEventChannelDescriptionRemoved);
    }
    _setChannelDescriptionActual(channelDescriptionUpdated) {
        this.__swarmMessagesChannelDescriptionActual = channelDescriptionUpdated;
    }
    _restartActualSwarmMessagesChannelDatabaseHandlerInstanceByActualChannelDescription() {
        return __awaiter(this, void 0, void 0, function* () {
            const swarmMessagesChannelDatabaseHandlerActive = this._getActiveSwarmMessagesChannelDatabaseHandlerInstance();
            const channelDatabaseOptionsActual = this._getChannelDatabaseOptionsByChannelDescriptionActual();
            yield swarmMessagesChannelDatabaseHandlerActive.restartDatabaseConnectorInstanceWithDbOptions(channelDatabaseOptionsActual);
        });
    }
    _restartChannelDatabaseConnectorWithDatabaseHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._restartActualSwarmMessagesChannelDatabaseHandlerInstanceByActualChannelDescription();
        });
    }
    _getChannelDatabaseOptionsByChannelDescriptionActual() {
        const { swarmMessagesChannelDescription } = this.__options;
        const { getDatabaseNameByChannelDescription } = this._constructorOptionsUtils;
        const channelDatabaseOptionsPartial = this._swarmMessagesChannelDescriptionActual.dbOptions;
        const dbName = getDatabaseNameByChannelDescription(swarmMessagesChannelDescription);
        return Object.assign({ dbName, dbType: swarmMessagesChannelDescription.dbType }, channelDatabaseOptionsPartial);
    }
    _getMessagesEncryptionQueueOrUndefinedIfChannelNotEncryptedByPassword(messageEncryption) {
        if (messageEncryption === SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD) {
            const { passwordEncryptedChannelEncryptionQueue } = this.__options;
            if (!passwordEncryptedChannelEncryptionQueue) {
                throw new Error('An encryption queue instance should be set');
            }
            return passwordEncryptedChannelEncryptionQueue;
        }
        return undefined;
    }
    _getOptionsForChannelDatabaseHandlerConstructor() {
        const messagesIssuer = this._actualSwarmMessagesIssuer;
        const messageEncryptionType = this._swarmMessagesChannelDescriptionActual.messageEncryption;
        const databaseOptions = this._getChannelDatabaseOptionsByChannelDescriptionActual();
        const messagesEncryptionQueue = this._getMessagesEncryptionQueueOrUndefinedIfChannelNotEncryptedByPassword(messageEncryptionType);
        const swarmMessagesDatabaseConnectorInstanceByDBOFabric = this.__options.utils.swarmMessagesDatabaseConnectorInstanceByDBOFabric;
        return {
            databaseOptions,
            messagesEncryptionQueue,
            messageEncryptionType,
            messagesIssuer,
            swarmMessagesDatabaseConnectorInstanceByDBOFabric,
        };
    }
    _createSwarmMessagesChannelDatabaseHandler() {
        const ChannelDatabaseHandlerConstructor = this.__swarmMessagesChannelV1DatabaseHandlerConstructor;
        const constructorOptions = this._getOptionsForChannelDatabaseHandlerConstructor();
        const channelDatabaseHandlerInstance = new ChannelDatabaseHandlerConstructor(constructorOptions);
        return channelDatabaseHandlerInstance;
    }
    _setListenersSwarmMessagesChannelDatabaseHandlerInstance(swarmMessagesChannelDatabaseHandlerInstance, isAddListeners = true) {
        const emitter = swarmMessagesChannelDatabaseHandlerInstance.emitter;
        const methodName = isAddListeners ? 'addListener' : 'removeListener';
        emitter[methodName](ESwarmStoreEventNames.READY, this.__handleChannelDatabaseHandlerEventDatabaseReady);
        emitter[methodName](ESwarmStoreEventNames.CLOSE_DATABASE, this.__handleChannelDatabaseHandlerEventDatabaseClosed);
        emitter[methodName](ESwarmStoreEventNames.DROP_DATABASE, this.__handleChannelDatabaseHandlerEventDatabaseDropped);
    }
    _unsetListenersSwarmMessagesChannelDatabaseHandlerInstance() {
        this._setListenersSwarmMessagesChannelDatabaseHandlerInstance(this.__swarmMessagesChannelDatabaseHandlerInstance, false);
    }
    _unsetListenersSwarmMessagesChannelsListHandlerInstance() {
        this._setListenersSwarmMessagesChannelsListHandlerInstance(this.__swarmMessagesChannelsListHandlerInstance, false);
    }
    _unsetAllListenersOfInstancesRelated() {
        this._unsetListenersSwarmMessagesChannelsListHandlerInstance();
        this._unsetListenersSwarmMessagesChannelDatabaseHandlerInstance();
    }
    _closeChannelDatabaseHandlerInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.__swarmMessagesChannelDatabaseHandlerInstance.close();
        });
    }
    _resetState() {
        this._unsetChannelMarkedAsRemoved();
        this._unsetChannelInactiveReasonError();
        this._unsetInstancesRelated();
    }
    _verifyChannelIsNotClosed() {
        assert(!this.__isClosed, 'The channel has already been closed');
    }
    _verifyChannelIsReadyForMessaging() {
        this._verifyChannelIsNotClosed();
        assert(!this.__markedAsRemoved, 'The channel has already been marked as removed');
    }
    _verifyChannelIsReadyForChannelListOperations() {
        this._verifyChannelIsNotClosed();
        if (this.__markedAsRemoved) {
            console.warn('The channel is closed, better not to update its description');
        }
    }
    _getActiveSwarmMessagesChannelDatabaseHandlerInstance() {
        this._verifyChannelIsReadyForMessaging();
        return this.__swarmMessagesChannelDatabaseHandlerInstance;
    }
    __closeChannelWithReasonError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            this._setChannelInactiveReasonError(new Error('Channel database dropped unexpectedly'));
            this.__emitChannelClosed();
            yield this.close();
        });
    }
    _getActiveSwarmMessagesChannelsListHandlerInstance() {
        this._verifyChannelIsReadyForChannelListOperations();
        return this.__swarmMessagesChannelsListHandlerInstance;
    }
    __emitChannelOpened() {
        this.emitterChannelState.emit(ESwarmMessagesChannelEventName.CHANNEL_OPEN, this.id);
    }
    __emitChannelClosed() {
        this.emitterChannelState.emit(ESwarmMessagesChannelEventName.CHANNEL_CLOSED, this.id);
    }
}
//# sourceMappingURL=swarm-messages-channel-v1-class.js.map