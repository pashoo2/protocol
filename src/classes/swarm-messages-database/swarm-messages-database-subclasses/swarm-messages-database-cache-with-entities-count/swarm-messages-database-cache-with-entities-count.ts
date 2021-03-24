import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseCache, ISwarmMessagesDatabaseCacheOptions } from '../../swarm-messages-database.types';
import { SwarmMessagesDatabaseCache } from '../swarm-messages-database-cache/swarm-messages-database-cache';
import { ISwarmMessagesDatabaseCacheWithEntitiesCountOptions } from './swarm-messages-database-cache-with-entities-count.types';
import { SWARM_MESSAGES_DATABASE_CACHE_WITH_ENTITIES_COUNT_READ_COUNT_FAULT_DEFAULT } from './swarm-messages-database-cache-with-entities-count.const';
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
  protected __itemsToReadCountFault: number = SWARM_MESSAGES_DATABASE_CACHE_WITH_ENTITIES_COUNT_READ_COUNT_FAULT_DEFAULT;

  constructor(_options: Partial<ISwarmMessagesDatabaseCacheWithEntitiesCountOptions> & DCO) {
    super(_options);
    this._setReadItemsCountFault(_options);
  }

  protected _setReadItemsCountFault(opts: Partial<ISwarmMessagesDatabaseCacheWithEntitiesCountOptions>) {
    if (opts.itemsToReadCountFault) {
      this.__itemsToReadCountFault = opts.itemsToReadCountFault;
    }
  }

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

  protected _checkWheterTheCountHasReadMoreThanEntitiesStoredCount(
    messagesInStoreCount: number,
    expectedMessagesOverallToReadAtTheBatchCount: number
  ) {
    return expectedMessagesOverallToReadAtTheBatchCount > messagesInStoreCount + this.__itemsToReadCountFault;
  }

  protected _whetherToStopMessagesReading = async (
    expectedMessagesOverallToReadAtTheBatchCount: number,
    expectedNewMessagesToReadAtTheBatchCount: number,
    resultedNewMessagesReadAtTheBatchCount: number
  ): Promise<boolean> => {
    // this count includes delete messages also, so the resultedNewMessagesReadAtTheBatchCount value
    // is always less or equal to the messagesInStoreCount
    const messagesInStoreCount = await this._getOverallMessagesInStoreCount();

    return (
      messagesInStoreCount <= resultedNewMessagesReadAtTheBatchCount ||
      this._checkWheterTheCountHasReadMoreThanEntitiesStoredCount(
        messagesInStoreCount,
        expectedMessagesOverallToReadAtTheBatchCount
      )
    );
  };
}
