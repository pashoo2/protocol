import {
  TSwarmStoreConnectorBasicFabric,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseType,
} from '../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../swarm-message/swarm-message-constructor.types';
import { IConnectionBridgeSwarmConnection, TNativeConnectionType, TNativeConnectionOptions } from './connection-bridge.types';
import { IPFS } from 'types/ipfs.types';
import { ISwarmStoreConnectorOrbitDbConnecectionBasicFabric } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import OrbitDB from 'orbit-db';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database-classes-extended/swarm-store-connector-orbit-db-subclass-database-queued-items-counted/swarm-store-connector-orbit-db-subclass-database-queued-items-counted';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreProviderOptions,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreOptionsConnectorFabric,
  TSwarmStoreConnectorConstructorOptions,
} from '../swarm-store-class/swarm-store-class.types';
import { ipfsUtilsConnectBasic } from '../../utils/ipfs-utils/ipfs-utils';
import {
  ISwarmStoreConnectorWithEntriesCount,
  ISwarmStoreConnectorBasicWithEntriesCount,
} from '../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import { swarmStoreConnectorOrbitDBWithEntriesCountInstanceFabric } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-extended/swarm-store-connector-orbit-db-with-entries-count/swarm-store-connector-orbit-db-with-entries-count-fabric';
import { ISwarmStoreConnector } from '../swarm-store-class/swarm-store-class.types';
import { SwarmStoreConnectorOrbitDB } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db';

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

export const createNativeConnectionForOrbitDB = (
  nativeConnectionOptions: TNativeConnectionOptions<ESwarmStoreConnector.OrbitDB>
): Promise<TNativeConnectionType<ESwarmStoreConnector.OrbitDB>> => {
  return ipfsUtilsConnectBasic(nativeConnectionOptions);
};

export const createNativeConnection = async <P extends ESwarmStoreConnector>(
  swarmStoreConnectorType: P,
  nativeConnectionOptions: TNativeConnectionOptions<P>
): Promise<TNativeConnectionType<P>> => {
  switch (swarmStoreConnectorType) {
    case ESwarmStoreConnector.OrbitDB:
      return createNativeConnectionForOrbitDB(nativeConnectionOptions) as Promise<TNativeConnectionType<P>>;
    default:
      throw new Error('Unsupported swarm connector type');
  }
};

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
