import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType } from '../../../../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class.const';
import { SwarmStoreConnectorOrbitDBDatabaseQueued } from '../swarm-store-connector-orbit-db-subclass-database-queued';
import { ISwarmStoreConnectorBasicWithEntriesCount } from '../../../../../../swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';

export class SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted<
    TStoreValue extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
    DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
  >
  extends SwarmStoreConnectorOrbitDBDatabaseQueued<TStoreValue, DbType>
  implements ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector.OrbitDB, TStoreValue, DbType> {
  get countEntriesLoaded(): number {
    return this.itemsCurrentlyLoaded;
  }

  get countEntriesAllExists(): number {
    return this.itemsOverallCount;
  }
}
