import assert from 'assert';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { SwarmMessagesDatabaseMessagesCachedStoreKeyValue } from '../../implementations/swarm-messages-database-messages-cached-store-keyvalue/swarm-messages-database-messages-cached-store-keyvalue';
import { SwarmMessagesDatabaseMessagesCachedStoreFeed } from '../../implementations/swarm-messages-database-messages-cached-store-feed/index';
export class SwarmMessagesDatabaseMessagesCachedStoreTemp {
    constructor(_dbType, _dbName, _isTemp) {
        this._dbType = _dbType;
        this._dbName = _dbName;
        this._isTemp = _isTemp;
        this._cachedStoreImplementation = this._createCachedStoreImplementation();
    }
    get isTemp() {
        return this._isTemp;
    }
    get entries() {
        return this._mapCachedStoreItemsToMessagesWithMeta();
    }
    get _isReady() {
        return !!this._cachedStoreImplementation;
    }
    get(messageCharacteristic) {
        return this._cachedStoreImplementation.get(messageCharacteristic);
    }
    set(description) {
        return this._cachedStoreImplementation.set(description);
    }
    unset(messageCharacteristic) {
        return this._cachedStoreImplementation.unset(messageCharacteristic);
    }
    update(entries) {
        return this._cachedStoreImplementation.updateWithEntries(entries);
    }
    _createCachedStoreImplementationFeed() {
        return new SwarmMessagesDatabaseMessagesCachedStoreFeed(this, this._isTemp, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, this._dbName);
    }
    _createCachedStoreImplementationKeyValue() {
        return new SwarmMessagesDatabaseMessagesCachedStoreKeyValue(this, this._isTemp, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, this._dbName);
    }
    _createCachedStoreImplementation() {
        if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
            return this._createCachedStoreImplementationFeed();
        }
        if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
            return this._createCachedStoreImplementationKeyValue();
        }
        throw new Error('Failed to create cache store implementation for a given store type');
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
}
//# sourceMappingURL=swarm-messages-database-messages-cached-store-temp.js.map