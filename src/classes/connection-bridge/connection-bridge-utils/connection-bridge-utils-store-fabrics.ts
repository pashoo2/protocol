import {
  ESwarmStoreConnector,
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  SwarmStoreConnectorOrbitDB,
  swarmStoreConnectorOrbitDBWithEntriesCountInstanceFabric,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreConnectorConstructorOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../swarm-store-class';
import { TSwarmMessageSerialized } from '../../swarm-message';

const getMainConnectorFabricForOrbitDBWithEntriesCount = <
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>
>(
  swarmStoreConnectorOrbitDBConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, ItemType, DbType>,
  options: CO
): ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, PO> => {
  return swarmStoreConnectorOrbitDBWithEntriesCountInstanceFabric<
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    TSwarmStoreConnectorConstructorOptions<P, ItemType, DbType>
  >(swarmStoreConnectorOrbitDBConstructorOptions);
};
const getMainConnectorFabricForOrbitDB = <
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>
>(
  swarmStoreConnectorOrbitDBConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, ItemType, DbType>,
  options: CO
): ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO> => {
  const swarmMessageStoreWithEntriesCount = new SwarmStoreConnectorOrbitDB(swarmStoreConnectorOrbitDBConstructorOptions);
  return swarmMessageStoreWithEntriesCount as ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>;
};
export const getMainConnectorFabricDefault = <
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>
>(
  swarmStoreConnectorConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, ItemType, DbType>
): ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> => {
  return (storeProviderOptions: CO): ConnectorMain => {
    const { provider: swarmStoreConnectorType } = storeProviderOptions;
    switch (swarmStoreConnectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return getMainConnectorFabricForOrbitDB<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO>(
          swarmStoreConnectorConstructorOptions,
          storeProviderOptions
        ) as ConnectorMain;
      default:
        throw new Error('Unsupported swarm connector type');
    }
  };
};
export const getMainConnectorFabricWithEntriesCountDefault = <
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, PO>
>(
  swarmStoreConnectorConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, ItemType, DbType>
): ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> => {
  return (storeProviderOptions: CO): ConnectorMain => {
    const { provider: swarmStoreConnectorType } = storeProviderOptions;
    switch (swarmStoreConnectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return getMainConnectorFabricForOrbitDBWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO>(
          swarmStoreConnectorConstructorOptions,
          storeProviderOptions
        ) as ConnectorMain;
      default:
        throw new Error('Unsupported swarm connector type');
    }
  };
};
