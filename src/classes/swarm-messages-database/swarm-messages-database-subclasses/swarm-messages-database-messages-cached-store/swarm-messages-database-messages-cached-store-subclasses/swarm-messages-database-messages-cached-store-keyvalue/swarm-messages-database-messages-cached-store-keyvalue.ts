import { SwarmMessagesDatabaseMessagesCachedStoreCore } from '../swarm-messages-database-messages-cached-store-core/swarm-messages-database-messages-cached-store-core';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash } from '../../swarm-messages-database-messages-cached-store.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';

export class SwarmMessagesDatabaseMessagesCachedStoreFeed<
  P extends ESwarmStoreConnector
> extends SwarmMessagesDatabaseMessagesCachedStoreCore<
  P,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
  TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash
> {}
