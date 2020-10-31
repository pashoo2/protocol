import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  ISwarmStoreConnectorBasicWithItemsCount,
} from '../../../../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class.const';
import { SwarmStoreConnectorOrbitDBDatabaseQueued } from '../swarm-store-connector-orbit-db-subclass-database-queued';

export class swarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted<
  TStoreValue extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
> extends SwarmStoreConnectorOrbitDBDatabaseQueued<TStoreValue, DbType>
  implements
    ISwarmStoreConnectorBasicWithItemsCount<
      ESwarmStoreConnector.OrbitDB,
      TStoreValue,
      DbType
    > {
  get countItemsLoaded(): number {
    return this.itemsCurrentlyLoaded;
  }

  get countItemsOverall(): number {
    return this.itemsOverallCount;
  }
}
