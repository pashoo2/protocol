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
import { SwarmStoreConnectorOrbitDBWithEntriesCount } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-extended/swarm-store-connector-orbit-db-with-entries-count/swarm-store-connector-orbit-db-with-entries-count';

export const connectorBasicFabricOrbitDBDefault = <
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
>(
  dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<T, DbType>,
  orbitDb: OrbitDB
): ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType> => {
  return new SwarmStoreConnectorOrbitDbSubclassDatabaseQueuedItemsCounted(dbOptions, orbitDb);
};

export const getSwarmStoreConnectionProviderOptionsForOrbitDb = <
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType>,
  NC extends IPFS,
  SC extends IConnectionBridgeSwarmConnection<ESwarmStoreConnector.OrbitDB, NC>
>(
  swarmConnection: SC,
  connectorBasicFabric: ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<T, DbType, ConnectorBasic>
): TSwarmStoreConnectorConnectionOptions<ESwarmStoreConnector.OrbitDB, T, DbType, ConnectorBasic> => {
  return {
    ipfs: swarmConnection.getNativeConnection(),
    connectorFabric: connectorBasicFabric,
  };
};

export const getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType>,
  NC extends TNativeConnectionType<P>,
  SC extends IConnectionBridgeSwarmConnection<P, NC>
>(
  swarmStoreConnectorType: P,
  swarmConnection: SC,
  connectorBasicFabric: TSwarmStoreConnectorBasicFabric<P, T, DbType, ConnectorBasic>
): TSwarmStoreConnectorConnectionOptions<P, T, DbType, ConnectorBasic> => {
  if (swarmStoreConnectorType === ESwarmStoreConnector.OrbitDB) {
    const orbitDbOptions = getSwarmStoreConnectionProviderOptionsForOrbitDb<T, DbType, ConnectorBasic, NC, SC>(
      swarmConnection,
      connectorBasicFabric
    );
    return orbitDbOptions;
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

const getMainConnectorFabricForOrbitDB = <
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO>
>(
  swarmStoreConnectorOrbitDBConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, DbType>
): ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain> => {
  const swarmStoreConnectorFabric = (
    options: CO
  ): ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO> => {
    const swarmMessageStoreWithEntriesCount = new SwarmStoreConnectorOrbitDBWithEntriesCount(
      swarmStoreConnectorOrbitDBConstructorOptions
    );
    return swarmMessageStoreWithEntriesCount as ISwarmStoreConnectorWithEntriesCount<
      P,
      ItemType,
      DbType,
      ConnectorBasic,
      PO,
      DBO
    >;
  };
  return swarmStoreConnectorFabric as ISwarmStoreOptionsConnectorFabric<
    P,
    ItemType,
    DbType,
    ConnectorBasic,
    PO,
    CO,
    DBO,
    ConnectorMain
  >;
};

export const getMainConnectorFabricDefault = <
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO>
>(
  swarmStoreConnectorType: P,
  swarmStoreConnectorConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, DbType>
): ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain> => {
  switch (swarmStoreConnectorType) {
    case ESwarmStoreConnector.OrbitDB:
      return getMainConnectorFabricForOrbitDB<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain>(
        swarmStoreConnectorConstructorOptions
      );
    default:
      throw new Error('Unsupported swarm connector type');
  }
};
