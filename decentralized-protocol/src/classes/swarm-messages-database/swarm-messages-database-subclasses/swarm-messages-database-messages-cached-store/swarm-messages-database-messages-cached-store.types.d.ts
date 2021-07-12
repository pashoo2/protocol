import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessagesDatabaseMessagesCacheStoreTemp } from '../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ISwarmMessagesDatabaseMesssageMeta, TSwarmMessageDatabaseMessagesCached } from '../../swarm-messages-database.types';
import { ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessagesDatabaseMessagesCacheStoreNonTemp, ISwarmMessagesDatabaseMessagesCacheMessageDescription } from '../swarm-messages-database-cache/swarm-messages-database-cache.types';
export interface ISwarmMessagesDatabaseMessagesCachedStoreCore<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, IsTemp extends boolean = false> {
    readonly storeVersion: number;
    readonly entriesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>;
    readonly isTemp: IsTemp;
    get(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined | undefined;
    set: (entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>) => void;
    addToDeffered: IsTemp extends false ? (entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>) => boolean : undefined;
    unset(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
    updateWithEntries(entries: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>): boolean;
    remove: IsTemp extends false ? (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>) => void : undefined;
    clear(): void;
}
export declare type TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash = string;
export interface ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted> extends ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DbType, MD> {
    _addToDefferedReadAfterCurrentCacheUpdateBatch(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
    _addToDefferedUpdate(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
}
export interface ISwarmMessagesDatabaseMessagesCachedStoreCoreConstructor<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, IsTemp extends boolean = false> {
    constructor(cachedStore: IsTemp extends true ? ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, IsTemp> : ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<P, DbType, MD>, isTemp: IsTemp, dbType: DbType, dbName: string): ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>;
}
//# sourceMappingURL=swarm-messages-database-messages-cached-store.types.d.ts.map