import { ISwarmMessagesDatabaseMessagesCachedStoreCore } from '../../swarm-messages-database-messages-cached-store.types';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessagesDatabaseMesssageMeta, TSwarmMessageDatabaseMessagesCached } from '../../../../swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCacheMessageDescription, ISwarmMessagesDatabaseMessagesCacheStoreTemp } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
export declare class SwarmMessagesDatabaseMessagesCachedStoreTemp<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageDecrypted, IsTemp extends boolean> implements ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, IsTemp> {
    protected _dbType: DbType;
    protected _dbName: string;
    protected _isTemp: IsTemp;
    get isTemp(): IsTemp;
    get entries(): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
    protected _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>;
    protected get _isReady(): boolean;
    constructor(_dbType: DbType, _dbName: string, _isTemp: IsTemp);
    get(messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined;
    set(description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): void;
    unset(messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
    update(entries: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>): boolean;
    protected _createCachedStoreImplementationFeed(): ISwarmMessagesDatabaseMessagesCachedStoreCore<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD, IsTemp>;
    protected _createCachedStoreImplementationKeyValue(): ISwarmMessagesDatabaseMessagesCachedStoreCore<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD, IsTemp>;
    protected _createCachedStoreImplementation(): ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>;
    protected _checkIsReady(): this is {
        _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>;
    };
    protected _throwIfNotReady(): this is {
        _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>;
    };
    protected _mapCachedStoreItemsToMessagesWithMeta(): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
}
//# sourceMappingURL=swarm-messages-database-messages-cached-store-temp.d.ts.map