import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreDatabaseEntityAddress, TSwarmStoreDatabaseEntityKey, TSwarmStoreDatabaseType } from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessagesDatabaseMesssageMeta, TSwarmMessageDatabaseMessagesCached } from '../../swarm-messages-database.types';
import { ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../swarm-message-store/types/swarm-message-store.types';
export declare type TSwarmMessagesDatabaseCacheMessagesRemovedFromCache<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>> = DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED ? Set<TSwarmStoreDatabaseEntityAddress<P>> : Set<TSwarmStoreDatabaseEntityKey<P>>;
export interface ISwarmMessagesDatabaseMessagesCacheMessageDescription<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>> {
    messageMeta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>;
    messageEntry: ISwarmMessageInstanceDecrypted;
}
export interface ISwarmMessagesDatabaseMessagesCacheStoreTemp<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, IsTemp extends boolean> {
    readonly isTemp: IsTemp;
    readonly entries: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
    get(messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined | undefined;
    set(description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): void;
    unset(messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
    update(entries: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>): boolean;
}
export interface ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted> extends ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, false> {
    readonly isTemp: false;
    getDefferedReadAfterCurrentCacheUpdateBatch(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>;
    resetDefferedAfterCurrentCacheUpdateBatch(): void;
    getDefferedRead(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>;
    resetDeffered(): void;
    addToDeffered(description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): boolean;
    remove(messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void;
    linkWithTempStore(tempCacheStore: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>): void;
    updateByTempStore(): boolean;
    unlinkWithTempStore(): void;
}
export declare type TSwarmMessagesDatabaseMessagesCacheStore<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, IsTemp extends boolean> = IsTemp extends true ? ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, IsTemp> : ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DbType, MD>;
export interface ISwarmMessagesDatabaseMessagesCacheStoreFabric<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, IsTemp extends boolean> {
    (dbType: DbType, dbName: string, isTemp: IsTemp): TSwarmMessagesDatabaseMessagesCacheStore<P, DbType, MD, IsTemp>;
}
//# sourceMappingURL=swarm-messages-database-cache.types.d.ts.map