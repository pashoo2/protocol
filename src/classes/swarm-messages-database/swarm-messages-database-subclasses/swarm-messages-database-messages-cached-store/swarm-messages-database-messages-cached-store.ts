import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../../swarm-store-class/swarm-store-class.types';
import { SwarmMessagesDatabaseMessagesCachedStoreTemp } from './abstractions/swarm-messages-database-messages-cached-store-temp/swarm-messages-database-messages-cached-store-temp';
import { SwarmMessagesDatabaseMessagesCachedStore } from './abstractions/swarm-messages-database-messages-cached-store/swarm-messages-database-messages-cached-store';
import { ISwarmMessagesDatabaseMessagesCacheStoreFabric } from '../swarm-messages-database-cache/swarm-messages-database-cache.types';

export function constructCacheStore<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  IsTemp extends boolean
>(dbType: DbType, dbName: string, isTemp: IsTemp) {
  if (isTemp) {
    return new SwarmMessagesDatabaseMessagesCachedStoreTemp(
      dbType,
      dbName,
      true
    );
  }
  return new SwarmMessagesDatabaseMessagesCachedStore(dbType, dbName);
}

export const constructCacheStoreFabric = (function<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  IsTemp extends boolean
>(): ISwarmMessagesDatabaseMessagesCacheStoreFabric<P, DbType, IsTemp> {
  return (constructCacheStore as unknown) as ISwarmMessagesDatabaseMessagesCacheStoreFabric<
    P,
    DbType,
    IsTemp
  >;
})();
