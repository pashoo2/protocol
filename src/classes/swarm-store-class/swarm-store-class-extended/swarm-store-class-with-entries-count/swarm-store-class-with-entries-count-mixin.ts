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
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>,
  BC extends ConstructorType<
    ISwarmStore<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O> &
      ISwarmStoreWithConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO, ConnectorMain>
  >
>(
  BaseClass: BC
): ConstructorType<
  InstanceType<BC> & ISwarmStoreWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O>
> {
  return (class SwarmStoreWithEntriesCount extends BaseClass {
    async getCountEntriesLoaded(dbName: TSwarmStoreDatabaseOptions<P, ItemType, DbType>['dbName']): Promise<number | Error> {
      const connector = this.getConnectorOrError();

      if (checkIsError(connector)) {
        return new Error('Connector is not exists');
      }
      return await connector.getCountEntriesLoaded(dbName);
    }

    async getCountEntriesAllExists(dbName: TSwarmStoreDatabaseOptions<P, ItemType, DbType>['dbName']): Promise<number | Error> {
      const connector = this.getConnectorOrError();

      if (checkIsError(connector)) {
        return new Error('Connector is not exists');
      }
      return await connector.getCountEntriesAllExists(dbName);
    }
  } as unknown) as ConstructorType<
    InstanceType<typeof BaseClass> &
      ISwarmStoreWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O>
  >;
}
