import {
  ESwarmStoreConnector,
  ISwarmStoreConnectorDatabasesPersistentList,
  ISwarmStoreConnectorDatabasesPersistentListConstructorParams,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../swarm-store-class';
import { TSwarmMessageSerialized } from '../../../swarm-message';
import { SwarmStoreConnectorPersistentList } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-databases-persistent-list';

export const connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault = async <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
>(
  persistentListOptions: ISwarmStoreConnectorDatabasesPersistentListConstructorParams
): Promise<ISwarmStoreConnectorDatabasesPersistentList<P, T, DbType, DBO, Record<DBO['dbName'], DBO>>> => {
  return new SwarmStoreConnectorPersistentList<P, T, DbType, DBO, Record<DBO['dbName'], DBO>>(persistentListOptions);
};
