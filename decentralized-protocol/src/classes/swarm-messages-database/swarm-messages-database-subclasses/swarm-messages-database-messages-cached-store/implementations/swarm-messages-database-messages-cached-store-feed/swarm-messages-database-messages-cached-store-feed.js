import { SwarmMessagesDatabaseMessagesCachedStoreCore } from '../swarm-messages-database-messages-cached-store-core/swarm-messages-database-messages-cached-store-core';
import assert from 'assert';
export class SwarmMessagesDatabaseMessagesCachedStoreFeed extends SwarmMessagesDatabaseMessagesCachedStoreCore {
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
        };
        this.unset = (meta) => {
            this._beforeUnset(meta);
            this._unsetMessageInEntriesCached(meta);
        };
        this._getMessageCachedByMeta = (meta) => {
            const messageAddress = this._getMessageAddressFromMeta(meta);
            if (!messageAddress) {
                console.warn('Failed to get message address by meta');
                return;
            }
            return this._entriesCached.get(messageAddress);
        };
    }
    get entriesCached() {
        return this._entriesCached;
    }
    updateWithEntries(entries) {
        const hasUpdatedMessages = this._updateCacheWithEntries(entries, this._entriesCached);
        if (hasUpdatedMessages) {
            this._incMessagesInCacheVersion();
        }
        return hasUpdatedMessages;
    }
    clear() {
        this._entriesCached.clear();
    }
    _whetherEntryIsExistsInCache(entry) {
        return !!this._getMessageCachedByMeta(entry.messageMeta);
    }
    _getMessageInfo(entry) {
        const { messageMeta: meta, messageEntry: message } = entry;
        const address = this._getMessageAddressFromMeta(meta);
        if (!address) {
            throw new Error('A message add must be defined');
        }
        const messageDecrypted = message;
        return {
            dbName: this._dbName,
            message: messageDecrypted,
            messageAddress: address,
        };
    }
    _unsetMessageInEntriesCached(meta) {
        const address = this._getMessageAddressFromMeta(meta);
        if (!address) {
            throw new Error('A message add must be defined');
        }
        this.entriesCached.delete(address);
    }
    _setMessageInEntriesCached(entry) {
        const { messageMeta } = entry;
        const address = this._getMessageAddressFromMeta(messageMeta);
        if (!address) {
            throw new Error('An address must not be empty');
        }
        this._entriesCached.set(address, this._getMessageInfo(entry));
    }
    _checkMeta(meta) {
        super._checkMeta(meta);
        assert(meta.messageUniqAddress, 'The meta information must includes message address');
    }
}
//# sourceMappingURL=swarm-messages-database-messages-cached-store-feed.js.map