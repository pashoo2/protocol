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

export function getClassSwarmStoreWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO>,
  E extends ISwarmStoreEvents<P, ItemType, DBO>,
  DBL extends TSwarmStoreOptionsOfDatabasesKnownList<P, ItemType, DBO>
>() {
  return extendClassSwarmStoreWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO, O>(
    class BC extends SwarmStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, O, E, DBL> {}
  );
}
