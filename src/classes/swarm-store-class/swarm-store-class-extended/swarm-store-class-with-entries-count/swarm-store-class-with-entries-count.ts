import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  ISwarmStoreEvents,
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreWithEntriesCount,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreOptions,
  ISwarmStoreConnectorWithEntriesCount,
  ISwarmStoreOptionsWithConnectorFabric,
} from '../../swarm-store-class.types';
import { SwarmStore } from '../../swarm-store-class';
import { checkIsError } from 'utils/common-utils/common-utils-check-value';

export class SwarmStoreWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  E extends ISwarmStoreEvents = ISwarmStoreEvents,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<
    P,
    ItemType,
    DbType
  > = ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<
    P,
    ItemType,
    DbType,
    ConnectorBasic
  > = ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, ConnectorBasic>,
  Options extends ISwarmStoreOptionsWithConnectorFabric<
    P,
    ItemType,
    DbType,
    ConnectorBasic,
    ConnectorMain
  > = ISwarmStoreOptionsWithConnectorFabric<
    P,
    ItemType,
    DbType,
    ConnectorBasic,
    ConnectorMain
  >
> extends SwarmStore<P, ItemType, DbType, E, ConnectorBasic>
  implements
    ISwarmStoreWithEntriesCount<
      P,
      ItemType,
      DbType,
      ConnectorBasic,
      ConnectorMain,
      Options
    > {
  async getCountEntriesLoaded(
    dbName: TSwarmStoreDatabaseOptions<P, ItemType>['dbName']
  ): Promise<number | Error> {
    const connector = this.getConnectorOrError();

    if (checkIsError(connector)) {
      return new Error('Connector is not exists');
    }
    return (connector as ConnectorMain).getCountEntriesLoaded(dbName);
  }

  async getCountEntriesAllExists(
    dbName: TSwarmStoreDatabaseOptions<P, ItemType>['dbName']
  ): Promise<number | Error> {
    const connector = this.getConnectorOrError();

    if (checkIsError(connector)) {
      return new Error('Connector is not exists');
    }
    return (connector as ConnectorMain).getCountEntriesAllExists(dbName);
  }
}
