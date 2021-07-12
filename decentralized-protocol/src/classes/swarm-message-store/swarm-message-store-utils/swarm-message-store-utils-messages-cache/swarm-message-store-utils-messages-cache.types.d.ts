import { ISwarmMessageDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { StorageProvider } from '../../../storage-providers/storage-providers.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseEntityAddress, TSwarmStoreDatabaseEntityKey } from '../../../swarm-store-class/swarm-store-class.types';
export interface ISwarmMessageStoreUtilsMessagesCacheOptions<P extends ESwarmStoreConnector, MD extends ISwarmMessageDecrypted> {
    dbName: string;
    cache: StorageProvider<MD | TSwarmStoreDatabaseEntityKey<P> | TSwarmStoreDatabaseEntityAddress<P>>;
}
export interface ISwarmMessageStoreUtilsMessageCacheReady<P extends ESwarmStoreConnector, MD extends ISwarmMessageDecrypted> extends Partial<ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>> {
    _cache: NonNullable<ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>['cache']>;
    _dbName: NonNullable<ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>['dbName']>;
}
export interface ISwarmMessageStoreUtilsMessagesCache<P extends ESwarmStoreConnector, MD extends ISwarmMessageDecrypted> {
    connect(options: ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>): Promise<void>;
    getMessageByAddress(messageAddress: TSwarmStoreDatabaseEntityAddress<P>): Promise<MD | undefined>;
    setMessageByAddress(messageAddress: TSwarmStoreDatabaseEntityAddress<P>, message: MD): Promise<void>;
    unsetMessageByAddress(messageAddress: TSwarmStoreDatabaseEntityAddress<P>): Promise<void>;
    getMessageAddressByKey(dbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<TSwarmStoreDatabaseEntityAddress<P> | undefined>;
    setMessageAddressForKey(dbKey: TSwarmStoreDatabaseEntityKey<P>, messageAddress: TSwarmStoreDatabaseEntityAddress<P>): Promise<void>;
    unsetMessageAddressForKey(dbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<void>;
    getMessageByKey(dbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<MD | undefined>;
    clear(): Promise<void>;
}
//# sourceMappingURL=swarm-message-store-utils-messages-cache.types.d.ts.map