import { SwarmMessagesDatabaseMessagesCachedStoreTemp } from './abstractions/swarm-messages-database-messages-cached-store-temp/swarm-messages-database-messages-cached-store-temp';
import { SwarmMessagesDatabaseMessagesCachedStore } from './abstractions/swarm-messages-database-messages-cached-store/swarm-messages-database-messages-cached-store';
export function constructCacheStore(dbType, dbName, isTemp) {
    if (isTemp) {
        return new SwarmMessagesDatabaseMessagesCachedStoreTemp(dbType, dbName, true);
    }
    return new SwarmMessagesDatabaseMessagesCachedStore(dbType, dbName);
}
export const constructCacheStoreFabric = (function () {
    return constructCacheStore;
})();
//# sourceMappingURL=swarm-messages-database-messages-cached-store.js.map