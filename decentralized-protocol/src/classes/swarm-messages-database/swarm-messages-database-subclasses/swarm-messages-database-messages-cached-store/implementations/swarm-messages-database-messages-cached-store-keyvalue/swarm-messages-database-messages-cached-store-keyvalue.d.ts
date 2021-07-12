import { SwarmMessagesDatabaseMessagesCachedStoreCore } from '../swarm-messages-database-messages-cached-store-core/swarm-messages-database-messages-cached-store-core';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash, ISwarmMessagesDatabaseMessagesCachedStoreCore } from '../../swarm-messages-database-messages-cached-store.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessagesDatabaseMesssageMeta, TSwarmMessageDatabaseMessagesCached } from '../../../../swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCacheMessageDescription } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageInstanceDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey } from '../../../../../swarm-store-class/swarm-store-class.types';
export declare class SwarmMessagesDatabaseMessagesCachedStoreKeyValue<P extends ESwarmStoreConnector, MD extends ISwarmMessageInstanceDecrypted, IsTemp extends boolean> extends SwarmMessagesDatabaseMessagesCachedStoreCore<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD, IsTemp, TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash> implements ISwarmMessagesDatabaseMessagesCachedStoreCore<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD, IsTemp> {
    get entriesCached(): TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>;
    protected _entriesCached: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>;
    protected get _entrieCachedCount(): number;
    get: (meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>) => ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined;
    set: (entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>) => void;
    unset: (meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>) => void;
    updateWithEntries(entries: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>): boolean;
    clear(): void;
    protected _whetherEntryIsExistsInCache(entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>): boolean;
    protected _checkMeta(meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>): void;
    protected _getMessageCachedByMeta(meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined;
    protected _getMessageInfo(entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>): Required<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>>;
    protected _unsetMessageInEntriesCached(meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>): void;
    protected _setMessageInEntriesCached(entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>): void;
    protected _checkWhetherUpdateKey(key: TSwarmStoreDatabaseEntityKey<P>, value: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>): boolean;
}
//# sourceMappingURL=swarm-messages-database-messages-cached-store-keyvalue.d.ts.map