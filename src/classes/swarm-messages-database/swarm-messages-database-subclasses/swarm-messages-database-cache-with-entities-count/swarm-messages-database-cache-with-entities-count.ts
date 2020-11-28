import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseCache, ISwarmMessagesDatabaseCacheOptions } from '../../swarm-messages-database.types';
import { SwarmMessagesDatabaseCache } from '../swarm-messages-database-cache/swarm-messages-database-cache';
import {
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta,
  ISwarmMessagesStoreMeta,
} from '../../swarm-messages-database.messages-collector.types';

export class SwarmMessagesDatabaseCacheWithEntitiesCount<
    P extends ESwarmStoreConnector,
    T extends TSwarmMessageSerialized,
    DbType extends TSwarmStoreDatabaseType<P>,
    DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
    MD extends ISwarmMessageInstanceDecrypted,
    SMSMeta extends ISwarmMessagesStoreMeta,
    SMC extends ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, DbType, MD, SMSMeta>,
    DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMC>
  >
  extends SwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMC, DCO>
  implements ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMC> {
  protected _getMessagesStoreMeta(): Promise<SMSMeta> {
    return this._getSwarmMessagesCollector().getStoreMeta();
  }

  protected async _getOverallMessagesInStoreCount(): Promise<number> {
    return (await this._getMessagesStoreMeta()).messagesStoredCount;
  }

  protected _whetherMessagesReadLessThanRequested = async (
    expectedMessagesOverallToReadAtTheBatchCount: number
  ): Promise<boolean> => {
    const messagesInStoreCount = await this._getOverallMessagesInStoreCount();

    return messagesInStoreCount < expectedMessagesOverallToReadAtTheBatchCount;
  };
}
