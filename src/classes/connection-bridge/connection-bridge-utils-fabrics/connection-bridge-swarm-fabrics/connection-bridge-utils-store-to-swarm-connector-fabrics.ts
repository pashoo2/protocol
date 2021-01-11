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
} from '../../../swarm-store-class';
import { TSwarmMessageSerialized } from '../../../swarm-message';

const getMainConnectorFabricForOrbitDBWithEntriesCount = <
  P extends ESwarmStoreConnector.OrbitDB,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>
>(
  swarmStoreConnectorOrbitDBConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, T, DbType>,
  options: CO
): ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, PO> => {
  return swarmStoreConnectorOrbitDBWithEntriesCountInstanceFabric<
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    TSwarmStoreConnectorConstructorOptions<P, T, DbType>
  >(swarmStoreConnectorOrbitDBConstructorOptions);
};
const getMainConnectorFabricForOrbitDB = <
  P extends ESwarmStoreConnector.OrbitDB,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>
>(
  swarmStoreConnectorOrbitDBConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, T, DbType>,
  options: CO
): ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO> => {
  const swarmMessageStoreWithEntriesCount = new SwarmStoreConnectorOrbitDB(swarmStoreConnectorOrbitDBConstructorOptions);
  return swarmMessageStoreWithEntriesCount as ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>;
};
export const getMainConnectorFabricDefault = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>
>(
  swarmStoreConnectorConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, T, DbType>
): ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> => {
  return (storeProviderOptions: CO): ConnectorMain => {
    const { provider: swarmStoreConnectorType } = storeProviderOptions;
    switch (swarmStoreConnectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return getMainConnectorFabricForOrbitDB<P, T, DbType, DBO, ConnectorBasic, PO, CO>(
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
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, PO>
>(
  swarmStoreConnectorConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, T, DbType>
): ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> => {
  return (storeProviderOptions: CO): ConnectorMain => {
    const { provider: swarmStoreConnectorType } = storeProviderOptions;
    switch (swarmStoreConnectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return getMainConnectorFabricForOrbitDBWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, PO, CO>(
          swarmStoreConnectorConstructorOptions,
          storeProviderOptions
        ) as ConnectorMain;
      default:
        throw new Error('Unsupported swarm connector type');
    }
  };
};
