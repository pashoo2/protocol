import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
} from '../../../../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class.const';
import { SwarmStoreConnectorOrbitDBDatabaseQueued } from '../swarm-store-connector-orbit-db-subclass-database-queued';
import { ISwarmStoreConnectorBasicWithEntriesCount } from '../../../../../../swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';

export class SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted<
    ItemType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
    DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
    DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>
  >
  extends SwarmStoreConnectorOrbitDBDatabaseQueued<ItemType, DbType, DBO>
  implements ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO> {
  get countEntriesLoaded(): number {
    return this.itemsCurrentlyLoaded;
  }

  get countEntriesAllExists(): number {
    return this.itemsOverallCount;
  }
}
