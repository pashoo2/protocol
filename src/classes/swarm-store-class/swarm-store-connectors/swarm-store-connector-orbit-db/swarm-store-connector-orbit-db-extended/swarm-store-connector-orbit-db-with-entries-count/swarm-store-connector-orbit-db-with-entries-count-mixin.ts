import { ESwarmStoreConnector } from '../../../../swarm-store-class.const';
import { TSwarmStoreConnectorConnectionOptions, ISwarmStoreConnector } from '../../../../swarm-store-class.types';
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../../swarm-store-class.types';
import { ConstructorType } from '../../../../../../types/helper.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../../../swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';

export function swarmStoreConnectorOrbitDBWithEntriesCountMixin<
  ItemType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO, ConnectorBasic>
>(
  BaseClass: ConstructorType<
    ISwarmStoreConnector<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO, ConnectorBasic, PO> & {
      getDbConnectionExists(dbName: string): ConnectorBasic | undefined;
    }
  >
): ConstructorType<
  ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO, ConnectorBasic, PO>
> {
  return class SwarmStoreConnectorOrbitDBWithEntriesCount
    extends BaseClass
    implements ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO, ConnectorBasic, PO> {
    async getCountEntriesLoaded(
      dbName: TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>['dbName']
    ): Promise<number | Error> {
      const connector = this.getDbConnectionExists(dbName);

      if (!connector) {
        return new Error('Basic connector is not exists');
      }
      return connector.countEntriesLoaded;
    }

    async getCountEntriesAllExists(
      dbName: TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>['dbName']
    ): Promise<number | Error> {
      const connector = this.getDbConnectionExists(dbName);

      if (!connector) {
        return new Error('Basic connector is not exists');
      }
      return connector.countEntriesAllExists;
    }
  };
}
