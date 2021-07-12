import { SwarmStoreConnectorOrbitDBDatabaseQueued } from '../swarm-store-connector-orbit-db-subclass-database-queued';
export class SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted extends SwarmStoreConnectorOrbitDBDatabaseQueued {
    get countEntriesLoaded() {
        return this.itemsCurrentlyLoaded;
    }
    get countEntriesAllExists() {
        return this.itemsOverallCount;
    }
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-database-queued-items-counted.js.map