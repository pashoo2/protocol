import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  ISwarmStoreEvents,
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreWithEntriesCount,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorWithEntriesCount,
  ISwarmStoreOptionsWithConnectorFabric,
} from '../../swarm-store-class.types';
import { SwarmStore } from '../../swarm-store-class';
import { checkIsError } from 'utils/common-utils/common-utils-check-value';
import { ISwarmStore } from '../../swarm-store-class.types';
import {
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
  TSwarmStoreOptionsOfDatabasesKnownList,
} from '../../swarm-store-class.types';

export interface ISwarmStoreWithConnector<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO>
> {
  getConnectorOrError(): ConnectorMain | Error;
}

export function createSwarmStoreWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO>
>(
  BaseClass: new () => ISwarmStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, O> &
    ISwarmStoreWithConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO, ConnectorMain>
): new () => ISwarmStoreWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, O> &
  ISwarmStoreWithConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO, ConnectorMain> {
  return class SwarmStoreWithEntriesCount extends BaseClass {
    async getCountEntriesLoaded(dbName: TSwarmStoreDatabaseOptions<P, ItemType>['dbName']): Promise<number | Error> {
      const connector = this.getConnectorOrError();

      if (checkIsError(connector)) {
        return new Error('Connector is not exists');
      }
      return connector.getCountEntriesLoaded(dbName);
    }

    async getCountEntriesAllExists(dbName: TSwarmStoreDatabaseOptions<P, ItemType>['dbName']): Promise<number | Error> {
      const connector = this.getConnectorOrError();

      if (checkIsError(connector)) {
        return new Error('Connector is not exists');
      }
      return connector.getCountEntriesAllExists(dbName);
    }
  };
}

export function fabricSwarmStoreWithEntriesCount<
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
  return createSwarmStoreWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, O>(
    class BC extends SwarmStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, O, E, DBL> {}
  );
}
