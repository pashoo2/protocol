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
    SMC extends ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, SMSMeta>,
    DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMC>
  >
  extends SwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMC, DCO>
  implements ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMC> {
  protected _getMessagesStoreMeta(): Promise<SMSMeta> {
    const dbName = this._options?.dbName;

    if (!dbName) {
      throw new Error('Database name should be defined in the options');
    }
    return this._getSwarmMessagesCollector().getStoreMeta(dbName);
  }

  protected async _getOverallMessagesInStoreCount(): Promise<number> {
    return (await this._getMessagesStoreMeta()).messagesStoredCount;
  }

  protected _whetherMessagesReadLessThanRequested = async (
    expectedMessagesOverallToReadAtTheBatchCount: number,
    expectedNewMessagesToReadAtTheBatchCount: number,
    resultedNewMessagesReadAtTheBatchCount: number
  ): Promise<boolean> => {
    const messagesInStoreCount = await this._getOverallMessagesInStoreCount();

    return messagesInStoreCount <= resultedNewMessagesReadAtTheBatchCount;
  };
}
