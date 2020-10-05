import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseType,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';

export type TMessagesRemovedFromCache<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> = DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  ? Set<TSwarmStoreDatabaseEntityAddress<P>>
  : Set<TSwarmStoreDatabaseEntityKey<P>>;
