import {
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseType,
  ISwarmStoreConnectorBasicWithEntriesCount,
} from '../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../swarm-message/swarm-message-constructor.types';
import { IConnectionBridgeSwarmConnection } from './connection-bridge.types';
import { IPFS } from 'types/ipfs.types';
import { ISwarmStoreConnectorOrbitDbConnecectionBasicFabric } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import OrbitDB from 'orbit-db';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database-classes-extended/swarm-store-connector-orbit-db-subclass-database-queued-items-counted/swarm-store-connector-orbit-db-subclass-database-queued-items-counted';

const connectorBasicFabricDefault = <
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
>(
  dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<
    TSwarmMessageSerialized
  >,
  orbitDb: OrbitDB
): ISwarmStoreConnectorBasicWithEntriesCount<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  DbType
> => {
  return new SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted(
    dbOptions,
    orbitDb
  );
};

export const getSwarmStoreConnectionProviderOptionsForOrbitDb = <
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
>(
  swarmConnection: IConnectionBridgeSwarmConnection<IPFS>,
  connectorBasicFabric: ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<
    TSwarmMessageSerialized,
    DbType,
    ISwarmStoreConnectorBasicWithEntriesCount<
      ESwarmStoreConnector.OrbitDB,
      TSwarmMessageSerialized,
      DbType
    >
  > = connectorBasicFabricDefault
): TSwarmStoreConnectorConnectionOptions<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  DbType,
  ISwarmStoreConnectorBasicWithEntriesCount<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    DbType
  >
> => {
  // TODO - refactor it
  return {
    ipfs: swarmConnection.getNativeConnection(),
    connectorFabric: connectorBasicFabric,
  };
};
