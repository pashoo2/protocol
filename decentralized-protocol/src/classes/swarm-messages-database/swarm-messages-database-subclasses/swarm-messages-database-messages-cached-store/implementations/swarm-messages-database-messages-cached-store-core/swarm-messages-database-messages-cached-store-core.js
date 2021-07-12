import assert from 'assert';
import { isValidSwarmMessageDecryptedFormat } from '../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import { SWARM_MESSGES_DATABASE_SWARM_MESSAGES_CACHED_SWARM_MESSAGES_META_HASH_DELIMETER } from "../../swarm-messages-database-messages-cached-store.const";
import { ifSwarmMessagesDecryptedEqual } from '../../../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
import { compareTwoSwarmMessageStoreMessagingRequestWithMetaResults, } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.utils';
export class SwarmMessagesDatabaseMessagesCachedStoreCore {
    constructor(_cachedStore, _isTemp, _dbType, _dbName) {
        this._cachedStore = _cachedStore;
        this._isTemp = _isTemp;
        this._dbType = _dbType;
        this._dbName = _dbName;
        this._messagesCachedVersion = 0;
        this.addToDeffered = (this._isTemp === true
            ? undefined
            : (entry) => {
                this._checkIsInitialized();
                this._checkEntryWithMeta(entry);
                if (this._whetherEntryIsExistsInCache(entry)) {
                    return false;
                }
                this._addDefferedReadEntryAfterCurrentBatchOfCacheUpdate(entry.messageMeta);
                this._addDefferedReadEntryAfterOverallCaheUpdate(entry.messageMeta);
                return true;
            });
        this.remove = (this._isTemp === true
            ? undefined
            : (meta) => {
                this._checkIsInitialized();
                this._checkMeta(meta);
                this._addDefferedReadEntryAfterCurrentBatchOfCacheUpdate(meta);
                this._addDefferedReadEntryAfterOverallCaheUpdate(meta);
            });
        this._beforeGet = (meta) => {
            this._checkIsInitialized();
            this._checkMeta(meta);
        };
        this._beforeSet = (entry) => {
            this._checkIsInitialized();
            this._checkEntryWithMeta(entry);
        };
        this._beforeUnset = (meta) => {
            this._checkIsInitialized();
            this._checkMeta(meta);
        };
    }
    get isTemp() {
        return this._isTemp;
    }
    get storeVersion() {
        return this._messagesCachedVersion;
    }
    get _isInitialized() {
        return !!this._cachedStore;
    }
    _checkIsInitialized() {
        var _a, _b;
        assert(this._cachedStore, 'The isnstance is not initialized');
        assert(typeof ((_a = this._cachedStore) === null || _a === void 0 ? void 0 : _a._addToDefferedReadAfterCurrentCacheUpdateBatch) === 'function', 'The cached store should have the "_addToDefferedReadAfterCurrentCacheUpdateBatch" method');
        assert(typeof ((_b = this._cachedStore) === null || _b === void 0 ? void 0 : _b._addToDefferedUpdate) === 'function', 'The cached store should have the "_addToDefferedUpdate" method');
        return true;
    }
    _getMessageAddressFromMeta(meta) {
        return meta.messageUniqAddress;
    }
    _getMessageKeyFromMeta(meta) {
        return meta.key;
    }
    _checkMeta(meta) {
        assert(meta, 'The meta information must be defined');
        assert(typeof meta === 'object', 'The meta must be an object');
    }
    _checkMessageEntry(message) {
        isValidSwarmMessageDecryptedFormat(message);
    }
    _checkEntryWithMeta(entry) {
        assert(entry, 'The enty must be defined');
        assert(typeof entry === 'object', 'The enty must be an object');
        assert(entry.messageMeta, 'A meta information must be defined');
        assert(entry.messageEntry, 'A message must be defined');
        this._checkMeta(entry.messageMeta);
        this._checkMessageEntry(entry.messageEntry);
    }
    _getMetaHash(meta) {
        return `${meta.messageUniqAddress}${SWARM_MESSGES_DATABASE_SWARM_MESSAGES_CACHED_SWARM_MESSAGES_META_HASH_DELIMETER}${meta.key}`;
    }
    _incMessagesInCacheVersion() {
        this._messagesCachedVersion += 1;
    }
    _incMessagesInCacheVersionIfMessagesNotEquals(entryFirst, entrySecond) {
        if (entryFirst === entrySecond) {
            return;
        }
        if ((entryFirst && this._getMetaHash(entryFirst.messageMeta)) !== (entrySecond && this._getMetaHash(entrySecond.messageMeta))) {
            this._incMessagesInCacheVersion();
        }
        if (ifSwarmMessagesDecryptedEqual(entryFirst === null || entryFirst === void 0 ? void 0 : entryFirst.messageEntry, entrySecond === null || entrySecond === void 0 ? void 0 : entrySecond.messageEntry)) {
            this._incMessagesInCacheVersion();
        }
    }
    _addDefferedReadEntryAfterCurrentBatchOfCacheUpdate(meta) {
        if (this._checkIsInitialized()) {
            this._cachedStore._addToDefferedReadAfterCurrentCacheUpdateBatch(meta);
        }
    }
    _addDefferedReadEntryAfterOverallCaheUpdate(meta) {
        if (this._checkIsInitialized()) {
            this._cachedStore._addToDefferedUpdate(meta);
        }
    }
    _canUpdateWithEmptyValue() {
        return false;
    }
    _checkWhetherToUpdateValue(source, target) {
        return !compareTwoSwarmMessageStoreMessagingRequestWithMetaResults(source, target);
    }
    _checkWhetherUpdateKey(key, value, entriesCached) {
        return this._checkWhetherToUpdateValue(entriesCached.get(key), value);
    }
    _clearEntriesCached(entriesCached) {
        entriesCached.clear();
    }
    _updateCacheWithEntries(entries, entriesCached) {
        let hasMessagesUpdated = false;
        const wetherToCheckUpdateIsNeccessary = !!entriesCached.size;
        entries.forEach((value, key) => {
            if (wetherToCheckUpdateIsNeccessary || this._checkWhetherUpdateKey(key, value, entriesCached)) {
                entriesCached.set(key, value);
                hasMessagesUpdated = true;
            }
            else {
                console.error(new Error('_updateCacheWithEntries'));
            }
        });
        return hasMessagesUpdated;
    }
}
//# sourceMappingURL=swarm-messages-database-messages-cached-store-core.js.map