import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessagesDatabaseMessagesCachedStoreCore, TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash } from '../../swarm-messages-database-messages-cached-store.types';
import { ISwarmMessagesDatabaseMessagesCacheMessageDescription } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ISwarmMessagesDatabaseMesssageMeta, TSwarmMessageDatabaseMessagesCached } from '../../../../swarm-messages-database.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseEntityKey, TSwarmStoreDatabaseEntityAddress } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageInstanceDecrypted, ISwarmMessageDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmMessagesDatabaseMessagesCacheStore } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods } from '../../swarm-messages-database-messages-cached-store.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { TSwarmStoreDatabaseEntityUniqueIndex } from '../../../../../swarm-store-class/swarm-store-class.types';
export declare abstract class SwarmMessagesDatabaseMessagesCachedStoreCore<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageDecrypted, IsTemp extends boolean, MetaHash extends TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash> implements Omit<ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>, 'entriesCached' | 'get' | 'set' | 'unset' | 'updateWithEntries' | 'clear'> {
    protected _cachedStore: TSwarmMessagesDatabaseMessagesCacheStore<P, DbType, MD, IsTemp>;
    protected _isTemp: IsTemp;
    protected _dbType: DbType;
    protected _dbName: string;
    get isTemp(): IsTemp;
    get storeVersion(): number;
    protected _messagesCachedVersion: number;
    protected get _isInitialized(): boolean;
    constructor(_cachedStore: TSwarmMessagesDatabaseMessagesCacheStore<P, DbType, MD, IsTemp>, _isTemp: IsTemp, _dbType: DbType, _dbName: string);
    addToDeffered: IsTemp extends false ? (entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>) => boolean : undefined;
    remove: IsTemp extends false ? (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>) => void : undefined;
    protected _beforeGet: (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>) => void;
    protected _beforeSet: (entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>) => void;
    protected _beforeUnset: (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>) => void;
    protected _checkIsInitialized(): this is {
        _cachedStore: ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<P, DbType, MD>;
    };
    protected _getMessageAddressFromMeta(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): TSwarmStoreDatabaseEntityAddress<P> | undefined;
    protected _getMessageKeyFromMeta(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): TSwarmStoreDatabaseEntityKey<P> | undefined;
    protected _checkMeta(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
    protected _checkMessageEntry(message: ISwarmMessageInstanceDecrypted): void;
    protected _checkEntryWithMeta(entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): void;
    protected _getMetaHash(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): MetaHash;
    protected _incMessagesInCacheVersion(): void;
    protected _incMessagesInCacheVersionIfMessagesNotEquals(entryFirst: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType> | undefined, entrySecond: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType> | undefined): void;
    protected _addDefferedReadEntryAfterCurrentBatchOfCacheUpdate(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
    protected _addDefferedReadEntryAfterOverallCaheUpdate(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
    protected _canUpdateWithEmptyValue(): boolean;
    protected _checkWhetherToUpdateValue<T extends ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>>(source: T | undefined, target: T | undefined): boolean;
    protected _checkWhetherUpdateKey(key: TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>, value: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>, entriesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>): boolean;
    protected _clearEntriesCached(entriesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>): void;
    protected _updateCacheWithEntries(entries: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>, entriesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>): boolean;
    protected abstract _whetherEntryIsExistsInCache(entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): boolean;
}
//# sourceMappingURL=swarm-messages-database-messages-cached-store-core.d.ts.map