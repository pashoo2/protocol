import assert from 'assert';
import { isArraysSwallowEqual } from "../../../../../../utils";
import { SwarmMessagesDatabaseMessagesCachedStoreTemp } from '../swarm-messages-database-messages-cached-store-temp/swarm-messages-database-messages-cached-store-temp';
import { ifSwarmMessagesDecryptedEqual } from '../../../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
import { isValidSwarmMessageDecryptedFormat } from '../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
export class SwarmMessagesDatabaseMessagesCachedStore extends SwarmMessagesDatabaseMessagesCachedStoreTemp {
    constructor(_dbType, _dbName) {
        super(_dbType, _dbName, false);
        this._dbType = _dbType;
        this._dbName = _dbName;
        this._listMessagesMetaForDefferedReadAfterCurrentCacheUpdateBatch = this._createNewListMessagesMetaForDefferedReadPartial();
        this._listMessagesMetaForDefferedRead = this._createNewListMessagesMetaForDefferedReadFull();
        this.remove = (messageCharacteristic) => {
            return this._cachedStoreImplementation.remove(messageCharacteristic);
        };
        this.updateByTempStore = () => {
            const { _tempMessagesCachedStoreLinked } = this;
            if (!_tempMessagesCachedStoreLinked || !_tempMessagesCachedStoreLinked.entries) {
                return false;
            }
            const whetherSameKeysInTempAndMainStorage = this._whetherSameKeysBetweenTempStorageLinkedEntriesAndMain();
            if (!whetherSameKeysInTempAndMainStorage) {
                this._cachedStoreImplementation.clear();
            }
            return this._cachedStoreImplementation.updateWithEntries(_tempMessagesCachedStoreLinked.entries);
        };
        this._addToDefferedUpdate = (meta) => {
            this._listMessagesMetaForDefferedRead.add(meta);
        };
        this._addToDefferedReadAfterCurrentCacheUpdateBatch = (meta) => {
            this._listMessagesMetaForDefferedReadAfterCurrentCacheUpdateBatch.add(meta);
        };
    }
    addToDeffered(description) {
        if (this._checkIfMessageInTempStore(description)) {
            return true;
        }
        return this._cachedStoreImplementation.addToDeffered(description);
    }
    linkWithTempStore(tempCacheStore) {
        this._validateTempCacheStore(tempCacheStore);
        this._linkWithTempCacheStore(tempCacheStore);
    }
    unlinkWithTempStore() {
        this._tempMessagesCachedStoreLinked = undefined;
    }
    getDefferedReadAfterCurrentCacheUpdateBatch() {
        return this._listMessagesMetaForDefferedReadAfterCurrentCacheUpdateBatch;
    }
    resetDefferedAfterCurrentCacheUpdateBatch() {
        this._listMessagesMetaForDefferedReadAfterCurrentCacheUpdateBatch = this._createNewListMessagesMetaForDefferedReadPartial();
    }
    getDefferedRead() {
        return this._listMessagesMetaForDefferedRead;
    }
    resetDeffered() {
        this._listMessagesMetaForDefferedRead = this._createNewListMessagesMetaForDefferedReadFull();
    }
    _createNewListMessagesMetaForDefferedReadFull() {
        return new Set();
    }
    _createNewListMessagesMetaForDefferedReadPartial() {
        return this._createNewListMessagesMetaForDefferedReadFull();
    }
    _checkIsReady() {
        return this._isReady;
    }
    _throwIfNotReady() {
        assert(this._checkIsReady(), 'The instance is not ready');
        return true;
    }
    _mapCachedStoreItemsToMessagesWithMeta() {
        if (!this._checkIsReady()) {
            return undefined;
        }
        return this._cachedStoreImplementation.entriesCached;
    }
    _getEntryFromTempStoreLinked(messageCharacteristic) {
        const { _cachedStoreImplementation } = this;
        if (!_cachedStoreImplementation) {
            return;
        }
        return _cachedStoreImplementation.get(messageCharacteristic);
    }
    _getMessageDecryptedFromTempStoreLinked(messageCharacteristic) {
        const entry = this._getEntryFromTempStoreLinked(messageCharacteristic);
        if (!entry || entry instanceof Error) {
            return undefined;
        }
        const { message } = entry;
        if (!isValidSwarmMessageDecryptedFormat(message)) {
            return undefined;
        }
        return message;
    }
    _checkIfMessageInTempStore(description) {
        const messageInTempStore = this._getMessageDecryptedFromTempStoreLinked(description.messageMeta);
        if (!messageInTempStore) {
            return false;
        }
        return !!messageInTempStore && ifSwarmMessagesDecryptedEqual(messageInTempStore, description.messageEntry);
    }
    _whetherSameKeysBetweenTempStorageLinkedEntriesAndMain() {
        var _a, _b;
        const linkedStorageKeys = (_b = (_a = this._tempMessagesCachedStoreLinked) === null || _a === void 0 ? void 0 : _a.entries) === null || _b === void 0 ? void 0 : _b.keys();
        const mainStorageKeys = this._cachedStoreImplementation.entriesCached.keys();
        if (!mainStorageKeys !== !linkedStorageKeys) {
            return false;
        }
        if (!linkedStorageKeys) {
            return false;
        }
        return isArraysSwallowEqual(Array.from(mainStorageKeys), Array.from(linkedStorageKeys));
    }
    _validateTempCacheStore(tempCacheStore) {
        assert(tempCacheStore.isTemp, 'The storage should be temporary');
    }
    _linkWithTempCacheStore(tempCacheStore) {
        if (this._tempMessagesCachedStoreLinked) {
            throw new Error('A temp cache store has already linked to this storage');
        }
        this._tempMessagesCachedStoreLinked = tempCacheStore;
    }
}
//# sourceMappingURL=swarm-messages-database-messages-cached-store.js.map