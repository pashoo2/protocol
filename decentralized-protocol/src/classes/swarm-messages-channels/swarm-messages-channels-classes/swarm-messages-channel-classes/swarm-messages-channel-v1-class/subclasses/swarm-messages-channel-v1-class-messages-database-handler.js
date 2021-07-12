import { __awaiter } from "tslib";
import { isDeepEqual, createCancellablePromiseByNativePromise } from "../../../../../../utils";
import { ESwarmStoreEventNames } from '../../../../../swarm-store-class/swarm-store-class.const';
import assert from 'assert';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../../../../const/swarm-messages-channels-main.const';
import { isCryptoKeyDataEncryption } from '@pashoo2/crypto-utilities';
import { getEventEmitterInstance, EventEmitter } from "../../../../../basic-classes/event-emitter-class-base";
import { isValidSwarmMessageDecryptedFormat } from '../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import { stopForwardEvents, forwardEvents, } from '../../../../../basic-classes/event-emitter-class-base/event-emitter-class-with-forwarding.utils';
export class SwarmMessagesChannelV1DatabaseHandler {
    constructor(___options) {
        this.___options = ___options;
        this.__emitter = getEventEmitterInstance();
        this.__hasDatabaseBeenDropped = false;
        this._handleDatabaseConnectorDatabaseClosed = () => __awaiter(this, void 0, void 0, function* () {
            console.log('Database for the channel was suddenly closed');
            yield this._close();
        });
        this._handleDatabaseConnectorDatabaseDropped = () => __awaiter(this, void 0, void 0, function* () {
            console.log('Database for the channel was suddenly dropped');
            this._setDatabaseHasBeenDropped();
            yield this._close();
        });
        this.__replaceMessageEncryptedWithError = (collectedResult) => this._whetherMessageDecryptedOrError(collectedResult)
            ? collectedResult
            : new Error('An encrypted message has been collected');
        this.__decryptPasswordEncryptedMessageCollectedOrReturnError = (swarmMessageOrError) => __awaiter(this, void 0, void 0, function* () {
            if (swarmMessageOrError instanceof Error) {
                return swarmMessageOrError;
            }
            try {
                return yield this._decryptSwarmMessageByPassword(swarmMessageOrError);
            }
            catch (err) {
                return err;
            }
        });
        this.__decryptPasswordEncryptedMessageWithMetaCollected = (encryptedMessageWithMeta) => __awaiter(this, void 0, void 0, function* () {
            if (!encryptedMessageWithMeta) {
                return undefined;
            }
            return yield this._decryptSwarmMessageWithMeta(encryptedMessageWithMeta);
        });
        this._validateConstructorOptions(___options);
        this.__swarmMessagesDatabaseConnectorConnectingPromise = this._createNewActualDatabaseConnectorAndSetCancellablePromise(___options.databaseOptions);
    }
    get emitter() {
        return this.__emitter;
    }
    get isDatabaseReady() {
        var _a;
        return Boolean((_a = this.__actualSwarmMessagesDatabaseConnector) === null || _a === void 0 ? void 0 : _a.isReady);
    }
    get cachedMessages() {
        var _a;
        return (_a = this.__actualSwarmMessagesDatabaseConnector) === null || _a === void 0 ? void 0 : _a.cachedMessages;
    }
    get _messagesEncryptionQueueOrUndefined() {
        return this.___options.messagesEncryptionQueue;
    }
    get _isPasswordEncryptedChannel() {
        return this.___options.messageEncryptionType === SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD;
    }
    restartDatabaseConnectorInstanceWithDbOptions(databaseOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this._makeSureDatabseIsNotDropped();
            if (this._whetherActualDatabaseConnectorHaveTheSameOptions(databaseOptions)) {
                return yield this._waitDatabaseCreationPromise();
            }
            let errorOccuredOnClosingPreviousDatabaseConenctor;
            try {
                this._unsetActualSwarmMessagesDatabaseOptions();
                this._cancelPreviousDatabaseCreationPromise();
                yield this._closeAndUnsetActualInstanceOfDatabaseConnector();
            }
            catch (err) {
                errorOccuredOnClosingPreviousDatabaseConenctor = new Error(`Failed to close the previous instance of database connector. ${err.message}`);
            }
            yield this._createNewActualDatabaseConnectorAndSetCancellablePromise(databaseOptions);
            if (errorOccuredOnClosingPreviousDatabaseConenctor) {
                throw errorOccuredOnClosingPreviousDatabaseConenctor;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._close();
        });
    }
    dropDatabaseLocally() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.__dropDatabaseLocally();
            yield this._close();
        });
    }
    addMessage(message, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'development')
                debugger;
            const databaseConnector = yield this._getActiveDatabaseConnector();
            const swarmMessageBody = yield this._prepareSwarmMessageBodyBeforeSending(message);
            yield databaseConnector.addMessage(swarmMessageBody, key);
        });
    }
    deleteMessage(messageAddressOrKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseConnector = yield this._getActiveDatabaseConnector();
            yield databaseConnector.deleteMessage(messageAddressOrKey);
        });
    }
    collect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseConnector = yield this._getActiveDatabaseConnector();
            const messagesCollected = yield databaseConnector.collect(options);
            const messagesCollectedFiltered = this._replaceMessagesEncryptedWithErrors(messagesCollected);
            if (this._isPasswordEncryptedChannel) {
                return yield this._decryptPasswordEncryptedMessagesCollected(messagesCollectedFiltered);
            }
            return messagesCollectedFiltered;
        });
    }
    collectWithMeta(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const databaseConnector = yield this._getActiveDatabaseConnector();
            const messagesCollected = yield databaseConnector.collectWithMeta(options);
            if (this._isPasswordEncryptedChannel) {
                return yield this._decryptPasswordEncryptedMessagesCollectedWithMeta(messagesCollected);
            }
            return messagesCollected;
        });
    }
    _validateConstructorOptions(options) {
        assert(options, 'Options must be provided for constructor');
        assert(typeof options === 'object', 'Constructor options must be an object');
        if (options.messageEncryptionType === SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD) {
            assert(isCryptoKeyDataEncryption(options.messagesEncryptionQueue), 'A messagesEncryptionQueue must be provided in options for the channel, because it uses a password encryption');
        }
        assert(typeof options.messagesIssuer === 'string', 'A swarm message issuer string should be provided in the constructor options');
        assert(typeof options.swarmMessagesDatabaseConnectorInstanceByDBOFabric === 'function', 'Database connector instance fabric must be provided in the constructor options swarmMessagesDatabaseConnectorInstanceByDBOFabric');
        assert(options.databaseOptions, 'A database options must be provided for creation of the database');
        assert(typeof options.databaseOptions === 'object', 'A database options must be an object');
    }
    _makeSureDatabseIsNotDropped() {
        if (this.__hasDatabaseBeenDropped) {
            throw new Error('Database for the channel has been dropped, therefore the swam messages channel cannot be used for performing any operations');
        }
    }
    _setDatabaseHasBeenDropped() {
        this.__hasDatabaseBeenDropped = true;
    }
    _whetherActualDatabaseConnectorHaveTheSameOptions(databaseOptions) {
        const actualSwarmMessagesDatabaseConnector = this.__actualSwarmMessagesDatabaseConnector;
        if (actualSwarmMessagesDatabaseConnector &&
            this.__actualSwarmMessagesDatabaseOptions &&
            isDeepEqual(databaseOptions, this.__actualSwarmMessagesDatabaseOptions)) {
            return false;
        }
        return true;
    }
    _getActualSwarmMessagesDatabaseConnector() {
        const actualSwarmMessagesDatabaseConnector = this.__actualSwarmMessagesDatabaseConnector;
        if (!actualSwarmMessagesDatabaseConnector) {
            throw new Error('Database connector instance ');
        }
        return actualSwarmMessagesDatabaseConnector;
    }
    _setActualSwarmMessagesDatabaseConnector(databaseConenctor) {
        this.__actualSwarmMessagesDatabaseConnector = databaseConenctor;
    }
    _setDatabaseActualOptions(databaseOptions) {
        this.__actualSwarmMessagesDatabaseOptions = databaseOptions;
    }
    _unsetActualSwarmMessagesDatabaseConnector() {
        this.__actualSwarmMessagesDatabaseConnector = undefined;
    }
    _unsetActualSwarmMessagesDatabaseOptions() {
        this.__actualSwarmMessagesDatabaseOptions = undefined;
    }
    _createNewSwarmMessagesDatabaseConenctorByDatabaseOptions(databaseOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.___options.swarmMessagesDatabaseConnectorInstanceByDBOFabric(databaseOptions);
        });
    }
    _createAndHandleActualSwarmMessagesDatabaseConenctor(databaseOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this._setDatabaseActualOptions(databaseOptions);
            const newDatabaseConnector = yield this._createNewSwarmMessagesDatabaseConenctorByDatabaseOptions(databaseOptions);
            this._setActualSwarmMessagesDatabaseConnector(newDatabaseConnector);
            this._startForwardingDatabaseConnectorEvents(newDatabaseConnector);
            this._startListeningDatabaseConnectorEvents(newDatabaseConnector);
            this._emitReadyEventIfDatatbaseConnector(newDatabaseConnector);
        });
    }
    _cancelPreviousDatabaseCreationPromise() {
        var _a;
        (_a = this.__swarmMessagesDatabaseConnectorConnectingPromise) === null || _a === void 0 ? void 0 : _a.cancel();
        this._unsetPreviousDatabaseCreationPromise();
    }
    _unsetPreviousDatabaseCreationPromise() {
        this.__swarmMessagesDatabaseConnectorConnectingPromise = undefined;
    }
    _waitDatabaseCreationPromise() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.__swarmMessagesDatabaseConnectorConnectingPromise;
            if (result instanceof Error) {
                throw result;
            }
        });
    }
    _createNewActualDatabaseConnectorAndSetCancellablePromise(databaseOptions) {
        const creationOfNewDatabaseConnectorInstanceCancellablePromise = createCancellablePromiseByNativePromise(this._createAndHandleActualSwarmMessagesDatabaseConenctor(databaseOptions));
        this.__swarmMessagesDatabaseConnectorConnectingPromise = creationOfNewDatabaseConnectorInstanceCancellablePromise;
        return creationOfNewDatabaseConnectorInstanceCancellablePromise;
    }
    _startForwardingDatabaseConnectorEvents(swarmMessagesDatabaseConnector) {
        forwardEvents(swarmMessagesDatabaseConnector.emitter, this.__emitter);
    }
    _startOrStopListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector, isAddListeners) {
        const methodName = isAddListeners ? 'addListener' : 'removeListener';
        const { emitter } = swarmMessagesDatabaseConnector;
        emitter[methodName](ESwarmStoreEventNames.CLOSE_DATABASE, this._handleDatabaseConnectorDatabaseClosed);
        emitter[methodName](ESwarmStoreEventNames.DROP_DATABASE, this._handleDatabaseConnectorDatabaseDropped);
    }
    _startListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector) {
        this._startOrStopListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector, true);
    }
    _emitReadyEvent() {
        var _a;
        const databaseName = (_a = this.__actualSwarmMessagesDatabaseOptions) === null || _a === void 0 ? void 0 : _a.dbName;
        if (!databaseName) {
            throw new Error('A database name should be defined');
        }
        this.__emitter.emit(ESwarmStoreEventNames.READY, databaseName);
    }
    _emitReadyEventIfDatatbaseConnector(swarmMessagesDatabaseConnector) {
        if (swarmMessagesDatabaseConnector.isReady) {
            this._emitReadyEvent();
        }
    }
    _stopListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector) {
        this._startOrStopListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector, false);
    }
    _stopForwardingDatabaseConnectorEvents(swarmMessagesDatabaseConnector) {
        this._stopListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector);
        stopForwardEvents(swarmMessagesDatabaseConnector.emitter, this.__emitter);
    }
    _closeAndUnsetActualInstanceOfDatabaseConnector() {
        return __awaiter(this, void 0, void 0, function* () {
            const actualSwarmMessagesDatabaseConnector = this.__actualSwarmMessagesDatabaseConnector;
            if (actualSwarmMessagesDatabaseConnector) {
                this._unsetActualSwarmMessagesDatabaseConnector();
                this._stopForwardingDatabaseConnectorEvents(actualSwarmMessagesDatabaseConnector);
                yield actualSwarmMessagesDatabaseConnector.close();
            }
        });
    }
    _close() {
        return __awaiter(this, void 0, void 0, function* () {
            this._cancelPreviousDatabaseCreationPromise();
            this._unsetActualSwarmMessagesDatabaseOptions();
            yield this._closeAndUnsetActualInstanceOfDatabaseConnector();
        });
    }
    __dropDatabaseLocally() {
        return __awaiter(this, void 0, void 0, function* () {
            const actualSwarmMessagesDatabaseConnector = this.__actualSwarmMessagesDatabaseConnector;
            if (actualSwarmMessagesDatabaseConnector) {
                this._stopForwardingDatabaseConnectorEvents(actualSwarmMessagesDatabaseConnector);
                return yield actualSwarmMessagesDatabaseConnector.drop();
            }
            throw new Error('There is no an instance of the database connector that can be used to drop the database locally');
        });
    }
    _getActiveDatabaseConnector() {
        return __awaiter(this, void 0, void 0, function* () {
            this._makeSureDatabseIsNotDropped();
            yield this._waitDatabaseCreationPromise();
            return this._getActualSwarmMessagesDatabaseConnector();
        });
    }
    _getMessagesEncryptionQueue() {
        const { messagesEncryptionQueue } = this.___options;
        if (messagesEncryptionQueue) {
            return messagesEncryptionQueue;
        }
        throw new Error('An encryption queue is not exists');
    }
    _decryptMessageBodyIfEncryptedChannel(messageBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const decryptedMessagePayload = yield this._getMessagesEncryptionQueue().decryptData(messageBody.pld);
            return Object.assign(Object.assign({}, messageBody), { pld: decryptedMessagePayload });
        });
    }
    _encryptMessageBodyIfEncryptedChannel(messageBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptedMessagePayload = yield this._getMessagesEncryptionQueue().encryptData(messageBody.pld);
            return Object.assign(Object.assign({}, messageBody), { pld: encryptedMessagePayload });
        });
    }
    _prepareSwarmMessageBodyBeforeSending(messageBodyWithoutIssuer) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageIssuer = this.___options.messagesIssuer;
            const messageBodyWithIssuer = Object.assign(Object.assign({}, messageBodyWithoutIssuer), { iss: messageIssuer });
            if (this._isPasswordEncryptedChannel) {
                return yield this._encryptMessageBodyIfEncryptedChannel(messageBodyWithIssuer);
            }
            return messageBodyWithIssuer;
        });
    }
    _whetherMessageDecryptedOrError(collectedResult) {
        return collectedResult instanceof Error || isValidSwarmMessageDecryptedFormat(collectedResult);
    }
    _replaceMessagesEncryptedWithErrors(resultCollected) {
        return resultCollected.map(this.__replaceMessageEncryptedWithError);
    }
    _decryptSwarmMessageByPassword(swarmMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const swarmMessagePayloadDecrypted = yield this._getMessagesEncryptionQueue().decryptData(swarmMessage.bdy.pld);
            return Object.assign(Object.assign({}, swarmMessage), { bdy: Object.assign(Object.assign({}, swarmMessage.bdy), { pld: swarmMessagePayloadDecrypted }) });
        });
    }
    _decryptPasswordEncryptedMessagesCollected(swarmMessagesAndErrors) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = swarmMessagesAndErrors.map(this.__decryptPasswordEncryptedMessageCollectedOrReturnError);
            return yield Promise.all(promises);
        });
    }
    _decryptSwarmMessageWithMeta(swarmMessageWithMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            const swarmMessageOrError = swarmMessageWithMeta.message;
            const swarmMessageDecryptedOrError = yield this.__decryptPasswordEncryptedMessageCollectedOrReturnError(swarmMessageOrError);
            return Object.assign(Object.assign({}, swarmMessageWithMeta), { message: swarmMessageDecryptedOrError });
        });
    }
    _decryptPasswordEncryptedMessagesCollectedWithMeta(collectMessagesWithMetaResult) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = collectMessagesWithMetaResult.map(this.__decryptPasswordEncryptedMessageWithMetaCollected);
            return yield Promise.all(promises);
        });
    }
}
//# sourceMappingURL=swarm-messages-channel-v1-class-messages-database-handler.js.map