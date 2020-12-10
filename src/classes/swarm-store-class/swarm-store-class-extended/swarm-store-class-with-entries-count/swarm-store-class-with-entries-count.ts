import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import {
  ISwarmStoreEvents,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreOptionsWithConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
  TSwarmStoreOptionsOfDatabasesKnownList,
  TSwarmStoreValueTypes,
} from '../../swarm-store-class.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from './swarm-store-class-with-entries-count.types';
import { SwarmStore } from '../../swarm-store-class';
import { extendClassSwarmStoreWithEntriesCount } from './swarm-store-class-with-entries-count-mixin';
import { ISwarmStore, ISwarmStoreWithConnector } from '../../swarm-store-class.types';
import { ConstructorType } from '../../../../types/helper.types';

export function getClassSwarmStoreWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>,
  E extends ISwarmStoreEvents<P, ItemType, DbType, DBO>,
  DBL extends TSwarmStoreOptionsOfDatabasesKnownList<P, ItemType, DbType, DBO>
>(
  SwarmStoreConstructorImplementation?: ConstructorType<
    ISwarmStore<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O> &
      ISwarmStoreWithConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO, ConnectorMain>
  >
) {
  // TODO - implement SwarmStore with custom serializer
  const BaseClass =
    SwarmStoreConstructorImplementation ||
    class BC extends SwarmStore<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O, E, DBL> {};
  return extendClassSwarmStoreWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O>(
    BaseClass
  );
}
