import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../../swarm-store-class/swarm-store-class.types';
import { SwarmMessagesDatabaseMessagesCachedStoreTemp } from './abstractions/swarm-messages-database-messages-cached-store-temp/swarm-messages-database-messages-cached-store-temp';
import { SwarmMessagesDatabaseMessagesCachedStore } from './abstractions/swarm-messages-database-messages-cached-store/swarm-messages-database-messages-cached-store';
import { ISwarmMessagesDatabaseMessagesCacheStoreFabric } from '../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ISwarmMessageEncrypted } from '../../../swarm-message/swarm-message-constructor.types';
export declare function constructCacheStore<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, IsTemp extends boolean>(dbType: DbType, dbName: string, isTemp: IsTemp): SwarmMessagesDatabaseMessagesCachedStoreTemp<ESwarmStoreConnector, DbType, import("../../../swarm-message/swarm-message-constructor.types").ISwarmMessageDecrypted, true> | SwarmMessagesDatabaseMessagesCachedStore<ESwarmStoreConnector, DbType, import("../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted>;
export declare const constructCacheStoreFabric: ISwarmMessagesDatabaseMessagesCacheStoreFabric<ESwarmStoreConnector, import("../../..").ESwarmStoreConnectorOrbitDbDatabaseType, ISwarmMessageEncrypted, boolean>;
//# sourceMappingURL=swarm-messages-database-messages-cached-store.d.ts.map