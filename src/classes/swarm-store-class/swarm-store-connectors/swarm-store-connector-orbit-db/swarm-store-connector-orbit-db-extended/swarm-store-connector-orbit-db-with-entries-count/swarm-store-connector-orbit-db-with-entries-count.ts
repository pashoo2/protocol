import { SwarmStoreConnectorOrbitDB } from '../../swarm-store-connector-orbit-db';
import { ESwarmStoreConnector } from '../../../../swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
  TSwarmStoreDatabaseOptions,
} from '../../../../swarm-store-class.types';

export class SwarmStoreConnectorOrbitDBWithEntriesCount<
  ISwarmDatabaseValueTypes extends TSwarmStoreValueTypes<
    ESwarmStoreConnector.OrbitDB
  >,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<
    ESwarmStoreConnector.OrbitDB,
    ISwarmDatabaseValueTypes,
    DbType
  >
>
  extends SwarmStoreConnectorOrbitDB<
    ISwarmDatabaseValueTypes,
    DbType,
    ConnectorBasic
  >
  implements
    ISwarmStoreConnectorWithEntriesCount<
      ESwarmStoreConnector.OrbitDB,
      ISwarmDatabaseValueTypes,
      DbType,
      ConnectorBasic
    > {
  async getCountEntriesLoaded(
    dbName: TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      ISwarmDatabaseValueTypes
    >['dbName']
  ): Promise<number | Error> {
    const connector = this.getDbConnectionExists(dbName);

    if (!connector) {
      return new Error('Basic connector is not exists');
    }
    return connector.countEntriesLoaded;
  }

  async getCountEntriesAllExists(
    dbName: TSwarmStoreDatabaseOptions<
      ESwarmStoreConnector.OrbitDB,
      ISwarmDatabaseValueTypes
    >['dbName']
  ): Promise<number | Error> {
    const connector = this.getDbConnectionExists(dbName);

    if (!connector) {
      return new Error('Basic connector is not exists');
    }
    return connector.countEntriesAllExists;
  }
}
