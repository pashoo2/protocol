import { SwarmMessagesDatabaseMessagesCachedStoreCore } from '../swarm-messages-database-messages-cached-store-core/swarm-messages-database-messages-cached-store-core';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash, ISwarmMessagesDatabaseMessagesCachedStoreCore } from '../../swarm-messages-database-messages-cached-store.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessagesDatabaseMessagesCacheMessageDescription } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ISwarmMessagesDatabaseMesssageMeta, TSwarmMessageDatabaseMessagesCached } from '../../../../swarm-messages-database.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageInstanceDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
export declare class SwarmMessagesDatabaseMessagesCachedStoreFeed<P extends ESwarmStoreConnector, MD extends ISwarmMessageInstanceDecrypted, IsTemp extends boolean> extends SwarmMessagesDatabaseMessagesCachedStoreCore<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD, IsTemp, TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash> implements ISwarmMessagesDatabaseMessagesCachedStoreCore<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD, IsTemp> {
    get entriesCached(): TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD>;
    protected _entriesCached: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD>;
    get: (meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>) => ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined;
    set: (entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>) => void;
    unset: (meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>) => void;
    updateWithEntries(entries: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD>): boolean;
    clear(): void;
    protected _whetherEntryIsExistsInCache(entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>): boolean;
    protected _getMessageCachedByMeta: (meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>) => ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined;
    protected _getMessageInfo(entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>): Omit<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>, 'key'>;
    protected _unsetMessageInEntriesCached(meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>): void;
    protected _setMessageInEntriesCached(entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>): void;
    protected _checkMeta(meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>): void;
}
//# sourceMappingURL=swarm-messages-database-messages-cached-store-feed.d.ts.map