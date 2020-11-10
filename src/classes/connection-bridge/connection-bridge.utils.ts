import { TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseType } from '../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../swarm-message/swarm-message-constructor.types';
import { IConnectionBridgeSwarmConnection, TNativeConnectionType } from './connection-bridge.types';
import { IPFS } from 'types/ipfs.types';
import { ISwarmStoreConnectorOrbitDbConnecectionBasicFabric } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import OrbitDB from 'orbit-db';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database-classes-extended/swarm-store-connector-orbit-db-subclass-database-queued-items-counted/swarm-store-connector-orbit-db-subclass-database-queued-items-counted';
import { ISwarmStoreConnectorBasicWithEntriesCount } from '../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';

const connectorBasicFabricOrbitDBDefault = <
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
>(
  dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<T>,
  orbitDb: OrbitDB
): ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector.OrbitDB, T, DbType> => {
  return new SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted(dbOptions, orbitDb);
};

export const getSwarmStoreConnectionProviderOptionsForOrbitDb = <
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  NC extends IPFS,
  SC extends IConnectionBridgeSwarmConnection<ESwarmStoreConnector.OrbitDB, NC>
>(
  swarmConnection: SC,
  connectorBasicFabric: ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<
    T,
    DbType,
    ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector.OrbitDB, T, DbType>
  > = connectorBasicFabricOrbitDBDefault
): TSwarmStoreConnectorConnectionOptions<
  ESwarmStoreConnector.OrbitDB,
  T,
  DbType,
  ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector.OrbitDB, T, DbType>
> => {
  // TODO - refactor it
  return {
    ipfs: swarmConnection.getNativeConnection(),
    connectorFabric: connectorBasicFabric,
  };
};

export const getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  NC extends TNativeConnectionType<P>,
  SC extends IConnectionBridgeSwarmConnection<P, NC>
>(
  swarmStoreConnectorType: P,
  swarmConnection: SC,
  connectorBasicFabric?: ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<
    T,
    DbType,
    ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType>
  >
) => {
  if (swarmStoreConnectorType === ESwarmStoreConnector.OrbitDB) {
    return getSwarmStoreConnectionProviderOptionsForOrbitDb<T, DbType, NC, SC>(swarmConnection, connectorBasicFabric);
  }
  throw new Error('This swarm store connector type is not supported');
};
