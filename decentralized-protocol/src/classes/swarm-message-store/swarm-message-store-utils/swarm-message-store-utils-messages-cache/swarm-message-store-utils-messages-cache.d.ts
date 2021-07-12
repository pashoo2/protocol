import { StorageProvider } from '../../../storage-providers/storage-providers.types';
import { ISwarmMessageDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreUtilsMessagesCache, ISwarmMessageStoreUtilsMessagesCacheOptions, ISwarmMessageStoreUtilsMessageCacheReady } from './swarm-message-store-utils-messages-cache.types';
import { TSwarmStoreDatabaseEntityAddress, TSwarmStoreDatabaseEntityKey } from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
export declare class SwarmMessageStoreUtilsMessagesCache<P extends ESwarmStoreConnector, MD extends ISwarmMessageDecrypted> implements ISwarmMessageStoreUtilsMessagesCache<P, MD> {
    protected _isReady: boolean;
    protected _cache?: StorageProvider<MD | TSwarmStoreDatabaseEntityKey<P> | TSwarmStoreDatabaseEntityAddress<P>>;
    protected _dbName?: string;
    connect(options: ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>): Promise<void>;
    getMessageByAddress: (messageAddress: TSwarmStoreDatabaseEntityAddress<P>) => Promise<MD | undefined>;
    setMessageByAddress: (messageAddress: TSwarmStoreDatabaseEntityAddress<P>, message: MD) => Promise<void>;
    unsetMessageByAddress: (messageAddress: TSwarmStoreDatabaseEntityAddress<P>) => Promise<void>;
    getMessageAddressByKey: (dbKey: TSwarmStoreDatabaseEntityKey<P>) => Promise<TSwarmStoreDatabaseEntityAddress<P> | undefined>;
    setMessageAddressForKey: (dbKey: TSwarmStoreDatabaseEntityKey<P>, messageAddress: TSwarmStoreDatabaseEntityAddress<P>) => Promise<void>;
    unsetMessageAddressForKey: (dbKey: TSwarmStoreDatabaseEntityKey<P>) => Promise<void>;
    getMessageByKey: (dbKey: TSwarmStoreDatabaseEntityKey<P>) => Promise<MD | undefined>;
    clear: () => Promise<void>;
    protected _validateOptions(options: ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>): void;
    protected _validateAndSetOptions(options: ISwarmMessageStoreUtilsMessagesCacheOptions<P, MD>): void;
    protected _checkIsReady(): this is ISwarmMessageStoreUtilsMessageCacheReady<P, MD>;
    protected getCacheKeyForMessageAddressAndDbName(messageAddress: TSwarmStoreDatabaseEntityAddress<P>): string;
    protected getCacheKeyForDbKeyAndDbName(messageKey: TSwarmStoreDatabaseEntityKey<P>): string;
    protected clearCache(): Promise<void>;
}
//# sourceMappingURL=swarm-message-store-utils-messages-cache.d.ts.map