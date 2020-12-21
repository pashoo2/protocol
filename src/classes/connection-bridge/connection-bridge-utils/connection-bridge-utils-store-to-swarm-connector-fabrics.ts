import { TSwarmMessageSerialized } from '../../swarm-message';
import {
  ESwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorOrbitDbConnecectionBasicFabric,
  ISwarmStoreConnectorOrbitDbDatabaseOptions,
  TSwarmStoreConnectorBasicFabric,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../swarm-store-class';
import OrbitDB from 'orbit-db';
import { SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database-classes-extended/swarm-store-connector-orbit-db-subclass-database-queued-items-counted';
import { IConnectionBridgeSwarmConnection, TNativeConnectionType } from '../connection-bridge.types';
import { IPFS } from '../../../types';

export const connectorBasicFabricOrbitDBDefault = <
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T, DbType>
>(
  dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<T, DbType>,
  orbitDb: OrbitDB
): ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType, DBO> => {
  return new SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted(dbOptions, orbitDb);
};
export const connectorBasicFabricOrbitDBWithEntriesCount = <
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T, DbType>
>(
  dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<T, DbType>,
  orbitDb: OrbitDB
): ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector.OrbitDB, T, DbType, DBO> => {
  return new SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted(dbOptions, orbitDb);
};
export const getSwarmStoreConnectionProviderOptionsForOrbitDb = <
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType, DBO>,
  NC extends IPFS,
  SC extends IConnectionBridgeSwarmConnection<ESwarmStoreConnector.OrbitDB, NC>
>(
  swarmConnection: SC,
  connectorBasicFabric: ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<T, DbType, DBO, ConnectorBasic>
): TSwarmStoreConnectorConnectionOptions<ESwarmStoreConnector.OrbitDB, T, DbType, DBO, ConnectorBasic> => {
  return {
    ipfs: swarmConnection.getNativeConnection(),
    connectorBasicFabric,
  };
};
export const getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  NC extends TNativeConnectionType<P>,
  SC extends IConnectionBridgeSwarmConnection<P, NC>
>(
  swarmStoreConnectorType: P,
  swarmConnection: SC,
  connectorBasicFabric: TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic>
): TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic> => {
  if (swarmStoreConnectorType === ESwarmStoreConnector.OrbitDB) {
    const orbitDbOptions = getSwarmStoreConnectionProviderOptionsForOrbitDb<T, DbType, DBO, ConnectorBasic, NC, SC>(
      swarmConnection,
      connectorBasicFabric
    );
    return orbitDbOptions as TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>;
  }
  throw new Error('This swarm store connector type is not supported');
};
