import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
  ISwarmMessageInstanceEncrypted,
} from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorBasic,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreConnector,
  ISwarmStoreOptionsConnectorFabric,
} from '../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreMessagingRequestWithMetaResult,
} from '../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../swarm-messages-database.messages-collector.types';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseConnectOptions,
} from '../../swarm-messages-database.types';
import { SwarmMessagesDatabase } from '../../swarm-messages-database';
import { ISwarmMessagesDatabaseConnector } from '../../swarm-messages-database.types';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { TSwarmStoreDatabaseIteratorMethodArgument } from '../../../swarm-store-class/swarm-store-class.types';
import { SWARM_MESSAGES_DATABASE_WITH_KV_CACHE_UPDATE_QUEUE_INTERVAL_UPDATING_DEFFERED_KEYS_IN_CACHE_MS } from './swarm-messages-database-with-kv-cache-update-queue.const';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmMessageUserIdentifierSerialized } from '../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';

// TODO - use this instance
/**
 * This class resolves issue with KV database.
 * When NEW_MESSAGE and DELETE_MESSAGE events are got
 * cache is updated by adding/removing of a message stored
 * in the key. But the message added or delet message event
 * might be older than the curent value stored in the cache.
 * So, we need to update KEY by an actual value. Therefore
 * we need to read value for the KEY and put the result
 * into the cache.
 */
export class SwarmMessagesDatabaseWithKVCacheUpdateQueue<
    P extends ESwarmStoreConnector,
    T extends TSwarmMessageSerialized,
    DbType extends TSwarmStoreDatabaseType<P>,
    DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
    ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
    PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
    CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
    ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
    CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
    GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
    MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
    ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
    O extends ISwarmMessageStoreOptionsWithConnectorFabric<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      CFO,
      MD | T,
      GAC,
      MCF,
      ACO
    >,
    SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
    MD extends ISwarmMessageInstanceDecrypted,
    SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
    DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
    DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
    OPT extends ISwarmMessagesDatabaseConnectOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT
    >
  >
  extends SwarmMessagesDatabase<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    GAC,
    MCF,
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT,
    OPT
  >
  implements
    ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    > {
  protected get __dbKeysForDefferedValuesUpdateInCacheQueue(): Array<TSwarmStoreDatabaseEntityKey<P>> {
    return [...this.__dbKeysForDefferedValuesUpdateInCache.values()];
  }

  protected get _isMessagesCacheExists(): boolean {
    return Boolean(this._swarmMessagesCache);
  }

  private __dbKeysForDefferedValuesUpdateInCache: Readonly<Set<TSwarmStoreDatabaseEntityKey<P>>> = new Set<
    TSwarmStoreDatabaseEntityKey<P>
  >();

  /**
   * Interval deffered keys values updating in the cahce related
   *
   * @private
   * @memberof SwarmMessagesDatabaseWithKVCacheUpdateQueue
   */
  private __intervalDefferedKeysValuesUpdateInCacheRelatedToStorage = setInterval(
    () => this._readMessagesByDefferedKeysQueueKVStorage(),
    SWARM_MESSAGES_DATABASE_WITH_KV_CACHE_UPDATE_QUEUE_INTERVAL_UPDATING_DEFFERED_KEYS_IN_CACHE_MS
  );

  /**
   * Returns params for querying the database to read only
   * the one value for the key.
   *
   * @param {TSwarmStoreDatabaseEntityKey<P>} key - a key for the database value
   */
  protected _getQueryParamsToReadValueForDbKeys(
    keys: TSwarmStoreDatabaseEntityKey<P>[]
  ): TSwarmStoreDatabaseIteratorMethodArgument<P, DbType> {
    // TODO - make it universally for any database, not only for OrbitDb
    return ({
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: keys,
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: 1,
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.fromCache]: true,
    } as unknown) as TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>;
  }

  /**
   * Add a database key to update it later
   *
   * @protected
   * @param {TSwarmStoreDatabaseEntityKey<P>} key
   * @memberof SwarmMessagesDatabaseWithKVCacheUpdateQueue
   */
  protected _addKeyInCacheUpdateQueue(key: TSwarmStoreDatabaseEntityKey<P>): void {
    const dbKeysForDefferedUpdate = this.__dbKeysForDefferedValuesUpdateInCache;
    if (!dbKeysForDefferedUpdate.has(key)) {
      const dbKeysForDefferedUpdateUpdated = new Set<TSwarmStoreDatabaseEntityKey<P>>(dbKeysForDefferedUpdate.values());

      dbKeysForDefferedUpdateUpdated.add(key);
      this.__dbKeysForDefferedValuesUpdateInCache = dbKeysForDefferedUpdateUpdated;
    }
  }

  /**
   * Remove all values from the queue of keys which are waiting
   * for it's values update in the database's cache storage if it
   * exists.
   *
   * @protected
   * @memberof SwarmMessagesDatabaseWithKVCacheUpdateQueue
   */
  protected _resetKeysQueuedForDefferedCacheUpdate(): void {
    this.__dbKeysForDefferedValuesUpdateInCache = new Set();
  }

  protected _updateFeedStoreCacheByMessageAndMeta(
    dbName: DBO['dbName'],
    message: MD,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>
  ) {
    return this._addMessageToCache(dbName, message, messageAddress);
  }

  /**
   * Handle cache updating on a new message has been added.
   * Just add the key to the queue of keys which are waiting
   * for a deffered values update in the cache storage related;
   *
   * @protected
   * @param {string} dbName
   * @param {MD} message
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @returns {Promise<void>}
   * @memberof SwarmMessagesDatabase
   */
  protected async _handleCacheUpdateOnNewMessage(
    message: MD,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<void> {
    if (!this._isMessagesCacheExists || !this._checkIsReady()) {
      return;
    }
    if (this._isKeyValueDatabase) {
      if (!key) {
        throw new Error('Key should exists for a message in a KV database');
      }
      this._addKeyInCacheUpdateQueue(key);
      return;
    }
    return await super._handleCacheUpdateOnNewMessage(message, messageAddress);
  }

  /**
   * Handle cache updating on a message has been removed.
   * Just add the key to the queue of keys which are waiting
   * for a deffered values update in the cache storage related;
   *
   * @protected
   * @param {TSwarmMessageUserIdentifierSerialized} userID
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {(DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
   *       ? TSwarmStoreDatabaseEntityAddress<P> | undefined
   *       : TSwarmStoreDatabaseEntityAddress<P>)} messageDeletedAddress
   * @param {DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined} keyOrHash
   * @returns {Promise<void>}
   * @memberof SwarmMessagesDatabaseWithKVCacheUpdateQueue
   */
  protected async _handleCacheUpdateOnDeleteMessage(
    userID: TSwarmMessageUserIdentifierSerialized,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // deleted message address
    messageDeletedAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrHash: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<void> {
    if (!this._isMessagesCacheExists || !this._checkIsReady()) {
      return;
    }
    if (this._isKeyValueDatabase) {
      if (!keyOrHash) {
        throw new Error('Key should exists for a message in a KV database');
      }
      // TODO - resolve typecast
      this._addKeyInCacheUpdateQueue((keyOrHash as unknown) as TSwarmStoreDatabaseEntityKey<P>);
      return;
    }
    return await super._handleCacheUpdateOnDeleteMessage(userID, messageAddress, messageDeletedAddress, keyOrHash);
  }

  /**
   * Update message got from a database request in the cache related
   *
   * @protected
   * @param {((
   *       | ISwarmMessageStoreMessagingRequestWithMetaResult<
   *           P,
   *           Exclude<Exclude<T, T>, ISwarmMessageInstanceEncrypted> | Exclude<Exclude<MD, T>, ISwarmMessageInstanceEncrypted>
   *         >
   *       | undefined
   *     )[])} requestValuesWithMetadataForKeysResult
   * @returns {Promise<void>}
   * @memberof SwarmMessagesDatabaseWithKVCacheUpdateQueue
   */
  protected async __updateMessagesWithMetaInCacheByRequestResult(
    requestValuesWithMetadataForKeysResult: (
      | ISwarmMessageStoreMessagingRequestWithMetaResult<
          P,
          Exclude<Exclude<T, T>, ISwarmMessageInstanceEncrypted> | Exclude<Exclude<MD, T>, ISwarmMessageInstanceEncrypted>
        >
      | undefined
    )[],
    dbKeysMatches: TSwarmStoreDatabaseEntityKey<P>[]
  ): Promise<void> {
    await Promise.all(
      requestValuesWithMetadataForKeysResult.map(
        async (requestResult, idx): Promise<void> => {
          if (!requestResult) {
            const keyMatchesToRequest = dbKeysMatches[idx];
            if (!keyMatchesToRequest) {
              throw new Error(
                'Cannot remove message that is not exists anymore for the key, because key for the value has not been found'
              );
            }
            if (this._isKeyValueDatabase) {
              await this._removeMessageFromCache(
                undefined as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
                  ? TSwarmStoreDatabaseEntityAddress<P> | undefined
                  : TSwarmStoreDatabaseEntityAddress<P>,
                // TODO - resolve cast to the unknown type
                (keyMatchesToRequest as unknown) as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
                  ? TSwarmStoreDatabaseEntityKey<P>
                  : undefined
              );
            }
            return;
          }
          try {
            const { dbName, message, messageAddress, key } = requestResult;
            if (messageAddress instanceof Error) {
              throw new Error(`Swarm message addrress must be exist, but an error has been gotten: ${messageAddress.message}`);
            }
            if (key instanceof Error) {
              throw new Error(`Swarm message key must be exist, but an error has been gotten: ${key.message}`);
            }
            if (message instanceof Error) {
              throw new Error(`Swarm message must be exist, but an error has been gotten: ${message.message}`);
            }
            if (!messageAddress) {
              throw new Error('Address must be exists for a swarm message');
            }
            await this._createAndSddSwarmMessageWithMetaToMessagesCacheByMessageAndMetaRelated(
              dbName,
              message,
              messageAddress,
              key
            );
          } catch (err) {
            console.error('Failed to update value in cache');
            console.error(err);
          }
        }
      )
    );
  }

  protected async _readMessagesByDefferedKeysQueueKVStorage(): Promise<void> {
    if (!this._isMessagesCacheExists || !this._checkIsReady()) {
      return;
    }

    const keys = this.__dbKeysForDefferedValuesUpdateInCacheQueue;
    const databaseQueryForReadingKeys = this._getQueryParamsToReadValueForDbKeys(keys);

    this._resetKeysQueuedForDefferedCacheUpdate();
    try {
      const requestValuesWithMetadataForKeysResult = await this.collectWithMeta(databaseQueryForReadingKeys);

      await this.__updateMessagesWithMetaInCacheByRequestResult(requestValuesWithMetadataForKeysResult, keys);
    } catch (err) {
      console.error('The error has occurred during updating the cache');
      console.error(err);
      keys.forEach((key) => this._addKeyInCacheUpdateQueue(key));
    }
  }
}
