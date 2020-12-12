import { SwarmStoreConnectorOrbitDB } from '../../swarm-store-connector-orbit-db';
import { ESwarmStoreConnector } from '../../../../swarm-store-class.const';
import { TSwarmStoreConnectorConnectionOptions, ISwarmStoreConnector } from '../../../../swarm-store-class.types';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorConstructorOptions,
} from '../../../../swarm-store-class.types';
import { swarmStoreConnectorOrbitDBWithEntriesCountMixin } from './swarm-store-connector-orbit-db-with-entries-count-mixin';
import { ConstructorType } from '../../../../../../types/helper.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../../../swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';

// TODO - implement this and add new class for options storing

export function swarmStoreConnectorOrbitDBWithEntriesCountConstructorFabric<
  ItemType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO, ConnectorBasic>
>(
  BaseClass?: ConstructorType<
    ISwarmStoreConnector<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO, ConnectorBasic, PO> & {
      getDbConnectionExists(dbName: string): ConnectorBasic | undefined;
    }
  >
): ConstructorType<
  ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO, ConnectorBasic, PO>
> {
  const ConstructorToUse = (BaseClass || SwarmStoreConnectorOrbitDB) as ConstructorType<
    ISwarmStoreConnector<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO, ConnectorBasic, PO> & {
      getDbConnectionExists(dbName: string): ConnectorBasic | undefined;
    }
  >;

  return swarmStoreConnectorOrbitDBWithEntriesCountMixin<ItemType, DbType, DBO, ConnectorBasic, PO>(ConstructorToUse);
}

export function swarmStoreConnectorOrbitDBWithEntriesCountInstanceFabric<
  ItemType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO, ConnectorBasic>,
  CCO extends TSwarmStoreConnectorConstructorOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>
>(
  options: CCO,
  BaseClass?: new (options: CCO) => ISwarmStoreConnector<
    ESwarmStoreConnector.OrbitDB,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    PO
  > & {
    getDbConnectionExists(dbName: string): ConnectorBasic | undefined;
  }
): ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO, ConnectorBasic, PO> {
  const ConstructorToUse = swarmStoreConnectorOrbitDBWithEntriesCountConstructorFabric<ItemType, DbType, DBO, ConnectorBasic, PO>(
    BaseClass
  );

  return new ConstructorToUse(options);
}
