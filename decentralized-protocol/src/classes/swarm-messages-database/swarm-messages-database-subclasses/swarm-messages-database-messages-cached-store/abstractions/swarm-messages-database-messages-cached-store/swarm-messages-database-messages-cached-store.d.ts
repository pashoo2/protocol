import { ISwarmMessagesDatabaseMessagesCachedStoreCore } from '../../swarm-messages-database-messages-cached-store.types';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods } from '../../swarm-messages-database-messages-cached-store.types';
import { SwarmMessagesDatabaseMessagesCachedStoreTemp } from '../swarm-messages-database-messages-cached-store-temp/swarm-messages-database-messages-cached-store-temp';
import { ISwarmMessagesDatabaseMesssageMeta, TSwarmMessageDatabaseMessagesCached } from '../../../../swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCacheMessageDescription, ISwarmMessagesDatabaseMessagesCacheStoreTemp } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageInstanceDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
export declare class SwarmMessagesDatabaseMessagesCachedStore<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted> extends SwarmMessagesDatabaseMessagesCachedStoreTemp<P, DbType, MD, false> implements ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<P, DbType, MD> {
    protected _dbType: DbType;
    protected _dbName: string;
    protected _listMessagesMetaForDefferedReadAfterCurrentCacheUpdateBatch: Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>;
    protected _listMessagesMetaForDefferedRead: Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>;
    protected _tempMessagesCachedStoreLinked?: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>;
    constructor(_dbType: DbType, _dbName: string);
    addToDeffered(description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): boolean;
    remove: (messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>) => void;
    linkWithTempStore(tempCacheStore: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>): void;
    updateByTempStore: () => boolean;
    unlinkWithTempStore(): void;
    getDefferedReadAfterCurrentCacheUpdateBatch(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>;
    resetDefferedAfterCurrentCacheUpdateBatch(): void;
    getDefferedRead(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>;
    resetDeffered(): void;
    _addToDefferedUpdate: (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>) => void;
    _addToDefferedReadAfterCurrentCacheUpdateBatch: (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>) => void;
    protected _createNewListMessagesMetaForDefferedReadFull(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>;
    protected _createNewListMessagesMetaForDefferedReadPartial(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>;
    protected _checkIsReady(): this is {
        _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, false>;
    };
    protected _throwIfNotReady(): this is {
        _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, false>;
    };
    protected _mapCachedStoreItemsToMessagesWithMeta(): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
    protected _getEntryFromTempStoreLinked(messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined;
    protected _getMessageDecryptedFromTempStoreLinked(messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): ISwarmMessageInstanceDecrypted | undefined;
    protected _checkIfMessageInTempStore(description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): boolean;
    protected _whetherSameKeysBetweenTempStorageLinkedEntriesAndMain(): boolean;
    protected _validateTempCacheStore(tempCacheStore: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>): void;
    protected _linkWithTempCacheStore(tempCacheStore: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>): void;
}
//# sourceMappingURL=swarm-messages-database-messages-cached-store.d.ts.map