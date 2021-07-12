import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseCache, ISwarmMessagesDatabaseCacheOptions } from '../../swarm-messages-database.types';
import { SwarmMessagesDatabaseCache } from '../swarm-messages-database-cache/swarm-messages-database-cache';
import { ISwarmMessagesDatabaseCacheWithEntitiesCountOptions } from './swarm-messages-database-cache-with-entities-count.types';
import { ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta, ISwarmMessagesStoreMeta } from '../../swarm-messages-database.messages-collector.types';
export declare class SwarmMessagesDatabaseCacheWithEntitiesCount<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted, SMSMeta extends ISwarmMessagesStoreMeta, SMC extends ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, SMSMeta>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMC>> extends SwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMC, DCO> implements ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMC> {
    protected __itemsToReadCountFault: number;
    constructor(_options: Partial<ISwarmMessagesDatabaseCacheWithEntitiesCountOptions> & DCO);
    protected _setReadItemsCountFault(opts: Partial<ISwarmMessagesDatabaseCacheWithEntitiesCountOptions>): void;
    protected _getMessagesStoreMeta(): Promise<SMSMeta>;
    protected _getOverallMessagesInStoreCount(): Promise<number>;
    protected _checkWheterTheCountHasReadMoreThanEntitiesStoredCount(messagesInStoreCount: number, expectedMessagesOverallToReadAtTheBatchCount: number): boolean;
    protected _whetherToStopMessagesReading: (expectedMessagesOverallToReadAtTheBatchCount: number, expectedNewMessagesToReadAtTheBatchCount: number, resultedNewMessagesReadAtTheBatchCount: number) => Promise<boolean>;
}
//# sourceMappingURL=swarm-messages-database-cache-with-entities-count.d.ts.map