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
import {
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
  TSwarmStoreOptionsOfDatabasesKnownList,
} from '../../swarm-store-class.types';

export class SwarmStoreWithEntriesCount<
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
  >
  extends SwarmStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, O, E, DBL>
  implements ISwarmStoreWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, O> {
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
}
