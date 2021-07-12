import assert from 'assert';
import { SwarmMessagesDatabaseMessagesCachedStoreCore } from '../swarm-messages-database-messages-cached-store-core/swarm-messages-database-messages-cached-store-core';
import { ifSwarmMessagesDecryptedEqual } from '../../../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
import { isValidSwarmMessageDecryptedFormat } from '../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
export class SwarmMessagesDatabaseMessagesCachedStoreKeyValue extends SwarmMessagesDatabaseMessagesCachedStoreCore {
    constructor() {
        super(...arguments);
        this._entriesCached = new Map();
        this.get = (meta) => {
            this._beforeGet(meta);
            return this._getMessageCachedByMeta(meta);
        };
        this.set = (entry) => {
            this._beforeSet(entry);
            this._setMessageInEntriesCached(entry);
            this._incMessagesInCacheVersion();
        };
        this.unset = (meta) => {
            this._beforeUnset(meta);
            this._unsetMessageInEntriesCached(meta);
            this._incMessagesInCacheVersion();
        };
    }
    get entriesCached() {
        return this._entriesCached;
    }
    get _entrieCachedCount() {
        return this._entriesCached.size;
    }
    updateWithEntries(entries) {
        const entriesSizeDiffers = entries.size !== this._entrieCachedCount;
        const cachedEntries = new Map(this._entriesCached);
        const hasUpdatedMessages = this._updateCacheWithEntries(entries, cachedEntries);
        if (hasUpdatedMessages) {
            console.log('SwarmMessagesDatabaseMessagesCachedStoreKeyvalue::updateWithEntries');
            console.dir([...cachedEntries.values()].map((v) => (Object.assign({}, v))));
            this._entriesCached = cachedEntries;
            this._incMessagesInCacheVersion();
        }
        return entriesSizeDiffers || hasUpdatedMessages;
    }
    clear() {
        this._entriesCached.clear();
    }
    _whetherEntryIsExistsInCache(entry) {
        const messageByMeta = this._getMessageCachedByMeta(entry.messageMeta);
        if (!messageByMeta || !isValidSwarmMessageDecryptedFormat(messageByMeta.message)) {
            return false;
        }
        return ifSwarmMessagesDecryptedEqual(entry.messageEntry, messageByMeta.message);
    }
    _checkMeta(meta) {
        super._checkMeta(meta);
        assert(meta.key, 'Key must be defined in meta information');
    }
    _getMessageCachedByMeta(meta) {
        this._checkMeta(meta);
        const messageKey = this._getMessageKeyFromMeta(meta);
        if (!messageKey) {
            console.warn('Message key is absent in meta information');
            return;
        }
        return this._entriesCached.get(messageKey);
    }
    _getMessageInfo(entry) {
        const { messageMeta: meta, messageEntry: message } = entry;
        const key = this._getMessageKeyFromMeta(meta);
        const address = this._getMessageAddressFromMeta(meta);
        if (!key) {
            throw new Error('A key must be defined');
        }
        if (!address) {
            throw new Error('A message add must be defined');
        }
        const messageDecrypted = message;
        return {
            dbName: this._dbName,
            message: messageDecrypted,
            key,
            messageAddress: address,
        };
    }
    _unsetMessageInEntriesCached(meta) {
        const key = this._getMessageKeyFromMeta(meta);
        if (!key) {
            throw new Error('A key is not defined');
        }
        this.entriesCached.delete(key);
    }
    _setMessageInEntriesCached(entry) {
        const { messageMeta } = entry;
        const key = this._getMessageKeyFromMeta(messageMeta);
        if (!key) {
            throw new Error('A key is not defined');
        }
        this.entriesCached.set(key, this._getMessageInfo(entry));
    }
    _checkWhetherUpdateKey(key, value) {
        return this._checkWhetherToUpdateValue(this._entriesCached.get(key), value);
    }
}
//# sourceMappingURL=swarm-messages-database-messages-cached-store-keyvalue.js.map