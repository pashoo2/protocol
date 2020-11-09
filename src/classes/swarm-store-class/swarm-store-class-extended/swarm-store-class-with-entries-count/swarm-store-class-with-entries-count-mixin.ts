import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import {
  ISwarmStore,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreOptionsWithConnectorFabric,
  ISwarmStoreProviderOptions,
  ISwarmStoreWithConnector,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
} from '../../swarm-store-class.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
  ISwarmStoreWithEntriesCount,
} from './swarm-store-class-with-entries-count.types';
import { checkIsError } from '../../../../utils/common-utils';
import { ConstructorType } from '../../../../types/helper.types';

export function extendClassSwarmStoreWithEntriesCount<
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
  BaseClass: ConstructorType<
    ISwarmStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, O> &
      ISwarmStoreWithConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO, ConnectorMain>
  >
): ConstructorType<
  InstanceType<typeof BaseClass> &
    ISwarmStoreWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, O>
> {
  return (class SwarmStoreWithEntriesCount extends BaseClass {
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
  } as unknown) as ConstructorType<
    InstanceType<typeof BaseClass> &
      ISwarmStoreWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, O>
  >;
}
