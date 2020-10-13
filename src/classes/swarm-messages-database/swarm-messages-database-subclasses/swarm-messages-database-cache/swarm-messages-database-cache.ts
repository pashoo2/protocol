import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntityUniqueIndex,
  TSwarmStoreDatabaseIteratorMethodArgument,
  TSwarmStoreDatabaseType,
} from '../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageDatabaseEvents,
  ISwarmMessagesDatabaseCache,
  TSwarmMessageDatabaseMessagesCached,
} from '../../swarm-messages-database.types';
import { ISwarmMessageInstanceDecrypted } from '../../../swarm-message';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../swarm-message-store';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database';
import {
  ESwarmMessagesDatabaseCacheEventsNames,
  SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_LIMIT_DEFAULT,
  SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_IDLE_PERIOD_OF_50_MS,
  SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_MAX_PAGE_QUERY_ATTEMPTS_DEFAULT,
} from '../../swarm-messages-database.const';
import {
  resolveOnIdleCallback,
  THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS,
} from '../../../../utils/throttling-utils/throttling-utils-idle-callback';
import { getItemsCount, round } from '../../../../utils/common-utils';
import { TTypedEmitter } from '../../../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { getEventEmitterInstance } from '../../../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ISwarmMessageStoreMessageWithMeta } from '../../../swarm-message-store/swarm-message-store.types';
import { validateSwarmMessageWithMeta } from '../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-message-with-meta';
import { waitFor } from '../../../../utils/common-utils/common-utils-main';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCacheOptionsDbInstance,
} from '../../swarm-messages-database.types';
import { memoizeLastReturnedValue } from 'utils/data-cache-utils/data-cache-utils-memoization';
import { filterMapKeys } from 'utils/common-utils/common-utils-maps';
import {
  SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_FAILED_RETRY_DELAY_MS,
  SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_BATCH_TIMEOUT_MS,
} from './swarm-messages-database-cache.const';
import { delay } from 'utils/common-utils/common-utils-timer';
import { concatMaps } from '../../../../utils/common-utils/common-utils-maps';
import { timeout } from '../../../../utils/common-utils/common-utils-timer';
import { debounce } from 'utils/throttling-utils';
import { SWARM_MESSAGES_DATABASE_CACHE_ADD_TO_CACHE_MESSAGES_PENDING_DEBOUNCE_MS } from './swarm-messages-database-cache.const';
import {
  TSwarmMessagesDatabaseCacheMessagesRemovedFromCache,
  TSwarmMessagesDatabaseMessagesCacheStore,
  ISwarmMessagesDatabaseMessagesCacheStoreNonTemp,
  ISwarmMessagesDatabaseMessagesCacheStoreTemp,
} from './swarm-messages-database-cache.types';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { constructCacheStoreFabric } from '../swarm-messages-database-messages-cached-store/swarm-messages-database-messages-cached-store';
import {
  getMessageDescriptionForMessageWithMeta,
  getMessageMetaForMessageWithMeta,
  createMessagesMetaByAddressAndKey,
} from './swarm-messages-database-cache.utils';
import { concatSets } from '../../../../utils/common-utils/common-utils-sets';

export class SwarmMessagesDatabaseCache<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> implements ISwarmMessagesDatabaseCache<P, DbType> {
  protected _composeMessagesCachedWithAddedToCache = memoizeLastReturnedValue(
    (
      messagesCached?: TSwarmMessageDatabaseMessagesCached<P, DbType>,
      messagesAddedToCache?: TSwarmMessageDatabaseMessagesCached<P, DbType>
    ): TSwarmMessageDatabaseMessagesCached<P, DbType> => {
      if (!messagesCached && messagesAddedToCache) {
        return messagesAddedToCache;
      }
      if (!messagesAddedToCache && messagesCached) {
        return messagesCached;
      }
      if (messagesAddedToCache && messagesCached) {
        return new Map([
          ...messagesCached,
          ...messagesAddedToCache,
        ]) as TSwarmMessageDatabaseMessagesCached<P, DbType>;
      }
      return new Map() as TSwarmMessageDatabaseMessagesCached<P, DbType>;
    }
  );

  protected _filterMessagesCachedFeedStore = memoizeLastReturnedValue(
    (
      messagesCached: TSwarmMessageDatabaseMessagesCached<P, DbType>,
      messagesAddressesMarkedAsRemoved: TSwarmStoreDatabaseEntityAddress<P>[]
    ): TSwarmMessageDatabaseMessagesCached<P, DbType> => {
      return filterMapKeys(messagesCached, messagesAddressesMarkedAsRemoved);
    }
  );

  protected _filterMessagesCached = memoizeLastReturnedValue(
    (
      messagesCached: TSwarmMessageDatabaseMessagesCached<P, DbType>,
      messagesAddressesAndKeysMarkedAsRemoved?: TSwarmMessagesDatabaseCacheMessagesRemovedFromCache<
        P,
        DbType
      >
    ): TSwarmMessageDatabaseMessagesCached<P, DbType> => {
      if (!messagesAddressesAndKeysMarkedAsRemoved) {
        return messagesCached;
      }
      if (this._isKeyValueDatabase) {
        return messagesCached;
      }
      return filterMapKeys(
        messagesCached,
        Array.from(messagesAddressesAndKeysMarkedAsRemoved.values())
      );
    }
  );

  protected _composeRemovedAddedMessagesWithCache = memoizeLastReturnedValue(
    (
      messagesCached:
        | TSwarmMessageDatabaseMessagesCached<P, DbType>
        | undefined,
      messagesAddedToCache:
        | TSwarmMessageDatabaseMessagesCached<P, DbType>
        | undefined,
      messagesAddressesAndKeysMarkedAsRemoved:
        | TSwarmMessagesDatabaseCacheMessagesRemovedFromCache<P, DbType>
        | undefined
    ) =>
      this._filterMessagesCached(
        this._composeMessagesCachedWithAddedToCache(
          messagesCached,
          messagesAddedToCache
        ),
        messagesAddressesAndKeysMarkedAsRemoved
      )
  );

  get isReady(): boolean {
    return this._isReady;
  }

  get cache(): TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined {
    return this._messagesCached;
  }

  get isUpdating(): boolean {
    return !!this._pendingMessagesUpdatePromise;
  }

  get emitter(): TTypedEmitter<ISwarmMessageDatabaseEvents<P, DbType>> {
    return this._emitter;
  }

  get whetherMessagesListContainsAllMessages(): boolean {
    return this._whetherMessagesListContainsAllMessages;
  }

  protected _isReady: boolean = false;

  protected _dbType?: DbType;

  protected _dbName?: string;

  protected _dbInstance?: ISwarmMessagesDatabaseCacheOptionsDbInstance<
    P,
    DbType
  >;

  protected _emitter = getEventEmitterInstance<
    ISwarmMessageDatabaseEvents<P, DbType>
  >();

  /**
   * Storage which handling operations of cahe update.
   *
   * @protected
   * @type {ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DbType>}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _messagesCachedStore?: ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<
    P,
    DbType
  >;

  /**
   * A temporary store which is used during a batched cache update for temporary
   * storing messages read from the database during the batch.
   *
   * @protected
   * @type {ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, true>}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _messagesCachedStoreTemp?: ISwarmMessagesDatabaseMessagesCacheStoreTemp<
    P,
    DbType,
    true
  >;

  /**
   * Keys to update after the current cache update proccess will
   * be overed.
   *
   * @protected
   * @type {Set<TSwarmStoreDatabaseEntityKey<P>>}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _messagesKeysToUpdateAfterCurrentCacheUpdate?: Set<
    TSwarmStoreDatabaseEntityKey<P>
  >;

  /**
   * Whether the cache contains all messages from the databse
   *
   * @protected
   * @type {boolean}
   * @memberof SwarmMessagesDatabase
   */
  protected _whetherMessagesListContainsAllMessages: boolean = false;

  /**
   * Flag means that when the cureent cache update will be ended
   * it's necessary to update it from the start to the end once
   * again.
   * That may be caused by replication process ended or adding/removing
   * of a message to the database.
   *
   * @protected
   * @type {boolean}
   * @memberof SwarmMessagesDatabase
   */
  protected _isSwarmMessagesCacheUpdateRequested: boolean = false;

  /**
   * An active promise updating messages cache.
   *
   * @protected
   * @type {(Promise<TSwarmMessageDatabaseMessagesCached<P, DbType>> | undefined)}
   * @memberof SwarmMessagesDatabase
   */
  protected _pendingMessagesUpdatePromise:
    | Promise<TSwarmMessageDatabaseMessagesCached<P, DbType>>
    | undefined;

  protected _pendingResetAddedAndDeletedMessagesPromise:
    | Promise<void>
    | undefined;

  /**
   * Promise which will be resolved on next batch
   * of messages cache update will be overed.
   *
   * @protected
   * @type {(Promise<void> | undefined)}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _messagesCacheUpdatingBatch: Promise<void> | undefined = undefined;

  protected get _isKeyValueDatabase(): boolean {
    return this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
  }

  protected get _messagesCached():
    | TSwarmMessageDatabaseMessagesCached<P, DbType>
    | undefined {
    return this._messagesCachedStore?.entries;
  }

  constructor(options: ISwarmMessagesDatabaseCacheOptions<P, DbType>) {
    this._setOptions(options);
    this._initializeCacheStore();
  }

  public start = async (): Promise<void> => {
    if (this._isReady) {
      return;
    }
    this._resetTheInstance();
    this._unsetCacheStore();
    this._unsetTempCacheStore();
    this._isReady = true;
  };

  public close = async () => {
    this._isReady = false;
    this._clearEventEmitter();
    this._resetTheInstance();
    this._unsetCacheStore();
    this._unsetTempCacheStore();
    this._unsetDbInstance();
  };

  public update = () => {
    return this._updateMessagesCache();
  };

  public addMessage = async (
    swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P>
  ): Promise<boolean> => {
    if (!this._checkIsReady()) {
      return false;
    }
    // wait till the cache updating is in progress
    // because the message may be already in the cache
    await this._waitTillMessagesCacheUpateBatchOver();
    return this._addMessageToCachedStore(swarmMessageWithMeta);
  };

  public deleteMessage = async (
    messageUniqAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityKey<P>
      : undefined
  ): Promise<void> => {
    // TODO - doesnt work in the key-value store
    // if remove value from a key and then add
    // add a new value by the same key. The new value is still absent
    // it's necessary to remove a message only by it's address (not by key)
    // or request cache updated (moreconsistent)
    if (!this._checkIsReady()) {
      return;
    }
    await this._waitTillMessagesCacheUpateBatchOver();
    return this._removeMessageFromCachedStore(messageUniqAddress, key);
  };

  protected _checkIsReady(): this is {
    _isReady: true;
    _dbType: DbType;
    _dbInstance: ISwarmMessagesDatabaseCacheOptionsDbInstance<P, DbType>;
    _messagesCachedStore: ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<
      P,
      DbType
    >;
  } {
    if (!this._isReady) {
      throw new Error('The instance is not ready to use');
    }
    if (!this._dbInstance) {
      throw new Error('A database instance is not set');
    }
    if (!this._messagesCachedStore) {
      throw new Error('A messages cached instance is not exists');
    }
    if (!this._dbType) {
      throw new Error('A database type should not be empty');
    }
    return true;
  }

  protected _setOptions(
    options: ISwarmMessagesDatabaseCacheOptions<P, DbType>
  ): void {
    this._dbType = options.dbType;
    this._dbInstance = options.dbInstance;
    this._dbName = options.dbName;
  }

  protected _createMessagesCachedStorage(): ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<
    P,
    DbType
  > {
    if (!this._dbType) {
      throw new Error('Database type should be defined');
    }
    if (!this._dbName) {
      throw new Error('Database name should be defined');
    }
    return constructCacheStoreFabric(
      this._dbType,
      this._dbName,
      false
    ) as ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DbType>;
  }

  protected _initializeCacheStore(): void {
    this._messagesCachedStore = this._createMessagesCachedStorage();
  }

  protected _resetTheInstance() {
    this._pendingMessagesUpdatePromise = undefined;
    this._isSwarmMessagesCacheUpdateRequested = false;
    this._whetherMessagesListContainsAllMessages = false;
  }

  protected _unsetCacheStore() {
    this._messagesCachedStore = undefined;
  }

  protected _unsetTempCacheStore() {
    this._messagesCachedStoreTemp = undefined;
  }

  protected _unsetDbInstance() {
    this._dbInstance = undefined;
  }

  protected _clearEventEmitter() {
    this._emitter.removeAllListeners();
  }

  protected _checkMessagesEqual(
    messageFirst?: ISwarmMessageInstanceDecrypted,
    messageSecond?: ISwarmMessageInstanceDecrypted
  ) {
    return messageFirst?.sig === messageSecond?.sig;
  }

  protected async _waitTillMessagesCacheUpateBatchOver() {
    const { _messagesCacheUpdatingBatch } = this;

    if (_messagesCacheUpdatingBatch) {
      await Promise.race([
        _messagesCacheUpdatingBatch,
        timeout(
          SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_BATCH_TIMEOUT_MS
        ),
      ]).catch((err) => {
        console.log(err);
      });
    }
  }

  protected _addMessageInKeyValueStoreCache = (
    messageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>,
    // for key-value store it will be the key
    key: TSwarmStoreDatabaseEntityKey<P>,
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ): void => {
    (messagesCachedStore as TSwarmMessageDatabaseMessagesCached<
      ESwarmStoreConnector.OrbitDB,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >)?.set(key, messageWithMeta);
  };

  protected _checkMessageInKeyValueStoreCache = (
    messageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>,
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ): boolean => {
    const messageKey = messageWithMeta.key;

    return (
      !!messageKey &&
      !(messageKey instanceof Error) &&
      this._checkMessagesEqual(
        (messagesCachedStore as TSwarmMessageDatabaseMessagesCached<
          ESwarmStoreConnector.OrbitDB,
          ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
        >)?.get(messageKey)?.message as ISwarmMessageInstanceDecrypted,
        messageWithMeta.message as ISwarmMessageInstanceDecrypted
      )
    );
  };

  protected _addMessageInFeedStoreCache = (
    messageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>,
    // for key-value store it will be the key
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ) => {
    (messagesCachedStore as TSwarmMessageDatabaseMessagesCached<
      ESwarmStoreConnector.OrbitDB,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >)?.set(messageAddress, messageWithMeta);
  };

  protected _checkMessageInFeedStoreCache = (
    messageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>,
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ): boolean => {
    const { messageAddress } = messageWithMeta;

    return (
      !!messageAddress &&
      !(messageAddress instanceof Error) &&
      this._checkMessagesEqual(
        (messagesCachedStore as TSwarmMessageDatabaseMessagesCached<
          ESwarmStoreConnector.OrbitDB,
          ESwarmStoreConnectorOrbitDbDatabaseType.FEED
        >)?.get(messageAddress)?.message as ISwarmMessageInstanceDecrypted,
        messageWithMeta.message as ISwarmMessageInstanceDecrypted
      )
    );
  };

  protected _removeKeyValueFromKVStoreCache = (
    messagesCache: TSwarmMessageDatabaseMessagesCached<P, DbType>,
    key: TSwarmStoreDatabaseEntityKey<P>
  ) => {
    (messagesCache as TSwarmMessageDatabaseMessagesCached<
      ESwarmStoreConnector.OrbitDB,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >)?.delete(key);
  };

  protected _emitCacheUpdatingIsInProgress() {
    this._emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING);
  }

  protected _emitCacheUpdated(
    messages: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ) {
    this._emitter.emit(
      ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED,
      messages
    );
  }

  protected _emitDbMessagesWithAddedMessagesCaheUpdated() {
    debugger;
    if (this._messagesCached) {
      this._emitCacheUpdated(this._messagesCached);
    }
  }

  /**
   * When cache updated but a value was removed or writed
   * directly in this._messagesCache, the same reference
   * will be emitted.
   * And libraries which are related on immutability will fail.
   * So a new instance of Map must be emitted.
   *
   * @protected
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _emitDbMessagesWithAddedMessagesCaheUpdatedWithAddedOrDeletedFromTheCurrent() {
    debugger;
    const messagesCached = this._messagesCached;

    if (messagesCached) {
      this._emitCacheUpdated(
        new Map(messagesCached) as TSwarmMessageDatabaseMessagesCached<
          P,
          DbType
        >
      );
    }
  }

  protected _setMessagesCacheUpdateInProgress = (
    promisePending: Promise<TSwarmMessageDatabaseMessagesCached<P, DbType>>
  ) => {
    this._pendingMessagesUpdatePromise = promisePending;
    this._emitCacheUpdatingIsInProgress();
  };

  protected _unsetCacheUpdateInProgress = () => {
    this._pendingMessagesUpdatePromise = undefined;
  };

  protected _setNewCacheUpdatePlanned = () => {
    this._isSwarmMessagesCacheUpdateRequested = true;
  };

  protected _unsetNewCacheUpdatePlanned = () => {
    this._isSwarmMessagesCacheUpdateRequested = false;
  };

  /**
   * Whether the limit of failed attempts reached
   *
   * @param {number} queryAttemtNumber
   * @returns {boolean}
   */
  protected _whetherMaxDatabaseQueriesAttemptsFailed = (
    queryAttemtNumber: number
  ): boolean => {
    return (
      queryAttemtNumber >=
      SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_MAX_PAGE_QUERY_ATTEMPTS_DEFAULT
    );
  };

  /**
   * Get options for query for a batch of messages
   *
   * @param {number} messagesCountToQuery
   * @param {string[]} messagesReadAddressesOrKeysToExclude
   * @returns {TSwarmStoreDatabaseIteratorMethodArgument<P>}
   */
  protected _getDatabaseMessagesQueryOptions = (
    messagesCountToQuery: number,
    messagesReadAddressesOrKeysToExclude: string[]
  ): TSwarmStoreDatabaseIteratorMethodArgument<P, DbType> => {
    return {
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: messagesCountToQuery,
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.neq]: messagesReadAddressesOrKeysToExclude,
    } as TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>;
  };

  /**
   * Request idle callback and resolves
   * with a time browser will be do nothing
   *
   * @returns {Promise<number>} - time browser decide it will be in idle state.
   */
  protected _requestTimeBrowserIdle = async (): Promise<number> => {
    const { timeRemaining, didTimeout } = await resolveOnIdleCallback();

    if (didTimeout) {
      return 0;
    }
    // time browser decide it will be idle.
    return timeRemaining;
  };
  /**
   * how many items can be read during
   * the current idle time of the browser
   *
   * @param {number} timeAvailToRun
   * @returns {number}
   */
  protected _getItemsCountToReadForIdlePeriod = (
    timeAvailToRun: number
  ): number => {
    // the maximum messages to read for max time remaining THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS
    // is equal to SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT. We need to calculate
    // messages to read for timeAvailToRun.
    const percentAcordingToFreeTime = round(
      timeAvailToRun / THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS,
      2
    );

    return round(
      SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_IDLE_PERIOD_OF_50_MS *
        percentAcordingToFreeTime,
      0
    );
  };
  /**
   * Returns a uniqiue global address for the message
   * by it's description
   *
   * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<P>} message
   * @returns {(TSwarmStoreDatabaseEntityUniqueAddress<P> | undefined)}
   */
  protected _getMessageAddressByDescription = (
    message: ISwarmMessageStoreMessagingRequestWithMetaResult<P>
  ): TSwarmStoreDatabaseEntityAddress<P> | undefined => {
    const { messageAddress } = message;

    if (!messageAddress || messageAddress instanceof Error) {
      return undefined;
    }
    return messageAddress;
  };
  /**
   * Returns message's key in Key-Value databse
   *
   * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<P>} message
   * @returns {(string | undefined)}
   */
  protected _getMessageKeyByDescription = (
    message: ISwarmMessageStoreMessagingRequestWithMetaResult<P>
  ): TSwarmStoreDatabaseEntityKey<P> | undefined => {
    const { key } = message;

    if (!key || key instanceof Error) {
      return undefined;
    }
    return key;
  };
  /**
   * Map messages with meta to a structure related to the current
   * store type.
   *
   * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]} messagesWithMeta
   * @returns {TSwarmMessageDatabaseMessagesCached<P, DbType>}
   */
  protected _mapMessagesWithMetaToStorageRelatedStructure = (
    messagesWithMeta: Array<
      ISwarmMessageStoreMessagingRequestWithMetaResult<P> | undefined
    >
  ): TSwarmMessageDatabaseMessagesCached<P, DbType> => {
    if (this._isKeyValueDatabase) {
      return this._mapMessagesDescriptionsToKVStoreMap(
        messagesWithMeta
      ) as TSwarmMessageDatabaseMessagesCached<P, DbType>;
    }
    return this._mapMessagesDescriptionsToFeedStore(
      messagesWithMeta
    ) as TSwarmMessageDatabaseMessagesCached<P, DbType>;
  };
  /**
   * Checks whether the count is more than the limit
   * of messages read.
   *
   * @param {number} messagesCount
   * @returns {boolean}
   */
  protected _whetherMessagesLimitReached = (messagesCount: number): boolean => {
    return (
      messagesCount >
      SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_LIMIT_DEFAULT
    );
  };
  /**
   * Updates messages in cache
   *
   * @param {TSwarmMessageDatabaseMessagesCached<P, DbType>} messages
   */
  protected _updateCacheWithMessages = (
    messages: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ) => {
    this._messagesCached = messages;
  };

  protected _getMessageWithMeta(
    dbName: string,
    message: ISwarmMessageInstanceDecrypted,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): ISwarmMessageStoreMessagingRequestWithMetaResult<P> {
    return {
      message,
      dbName,
      messageAddress,
      key,
    };
  }

  /**
   * Create message's description depending on the database
   * type(keyvalue or feed). Add the description created to the
   * cache unconditionally.
   *
   * @protected
   * @param {string} dbName
   * @param {ISwarmMessageInstanceDecrypted} message
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @memberof SwarmMessagesDatabase
   */
  protected _addMessageToCache(
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, DbType>,
    dbName: string,
    message: ISwarmMessageInstanceDecrypted,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): void {
    const messageDescription = this._getMessageWithMeta(
      dbName,
      message,
      messageAddress,
      key
    );

    if (this._isKeyValueDatabase) {
      if (!key) {
        throw new Error(
          'A key should be defined to add a message in the key-value store messages cache'
        );
      }
      this._addMessageInKeyValueStoreCache(
        messageDescription,
        key,
        messagesCachedStore
      );
    } else {
      this._addMessageInFeedStoreCache(
        messageDescription,
        messageAddress,
        messagesCachedStore
      );
    }
  }

  protected _checkMessageIsInStore(
    swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P>,
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ): boolean {
    if (this._isKeyValueDatabase) {
      return this._checkMessageInKeyValueStoreCache(
        swarmMessageWithMeta,
        messagesCachedStore
      );
    }
    return this._checkMessageInFeedStoreCache(
      swarmMessageWithMeta,
      messagesCachedStore
    );
  }

  /**
   * Validate and unconditionally add the message to the cache
   *
   * @protected
   * @param {TSwarmMessageDatabaseMessagesCached<P, DbType>} messagesCachedStore
   * @param {ISwarmMessageStoreMessageWithMeta<P>} swarmMessageWithMeta
   * @memberof SwarmMessagesDatabaseCache
   * @throws - throws if failed to add the message for any reason
   */
  protected _addMessageWithMetaToCache(
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, DbType>,
    swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P>
  ): void {
    validateSwarmMessageWithMeta(swarmMessageWithMeta);

    const { dbName, message, messageAddress, key } = swarmMessageWithMeta;

    this._addMessageToCache(
      messagesCachedStore,
      dbName,
      message,
      messageAddress,
      key
    );
  }

  protected _unsetKeyInCacheKVStore(
    key: TSwarmStoreDatabaseEntityKey<P>
  ): void {
    if (!this._messagesCached) {
      throw new Error('There is no messages in cache to unset the key');
    }
    this._messagesCached.delete(key);
  }

  protected _getOptionsToReadKeyFromKVDatabase = (
    key: TSwarmStoreDatabaseEntityKey<P>
  ): TSwarmStoreDatabaseIteratorMethodArgument<P, DbType> => {
    return {
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: 1,
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: String(key),
    } as TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>;
  };

  /**
   * Read a value for the key passed as the argument
   * and set the value got from the store in the cache.
   *
   * @protected
   * @param {TSwarmStoreDatabaseEntityKey<P>} key
   * @memberof SwarmMessagesDatabaseCache
   * @throws - throws an Error if this is not instance supported Key-Value store
   */
  protected async _updateCacheForKeyInKeyValueStore(
    key: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<void> {
    debugger;
    if (this._checkIsReady()) {
      if (!this._isKeyValueDatabase) {
        throw new Error('This operation available only for a key-value stores');
      }

      const result = await this._dbInstance.collectWithMeta(
        this._getOptionsToReadKeyFromKVDatabase(key)
      );
      const messagesCached = this._messagesCached;

      if (!messagesCached) {
        throw new Error('Messages cached');
      }
      if (result.length) {
        const [message] = result;

        if (message instanceof Error) {
          throw new Error(
            `Failed to read a messages stored for the key ${key}: ${message.message}`
          );
        }
        if (message && validateSwarmMessageWithMeta(message)) {
          this._addMessageWithMetaToCache(messagesCached, message);
          this._emitDbMessagesWithAddedMessagesCaheUpdatedWithAddedOrDeletedFromTheCurrent();
          return;
        }
      }
      this._removeKeyValueFromKVStoreCache(messagesCached, key);
      this._emitDbMessagesWithAddedMessagesCaheUpdatedWithAddedOrDeletedFromTheCurrent();
    }
  }

  protected _unsetKeysPlannedToUpdate() {
    if (!this._isKeyValueDatabase) {
      throw new Error('It should be a key value store to support this feature');
    }
    this._messagesKeysToUpdateAfterCurrentCacheUpdate = undefined;
  }

  protected _getStorageForKeysToRequestAfterTheCurrentCacheUpdate(): Set<
    TSwarmStoreDatabaseEntityKey<P>
  > {
    if (!this._isKeyValueDatabase) {
      throw new Error('It should be a key value store to support this feature');
    }

    const messagesKeysToUpdateStore = this
      ._messagesKeysToUpdateAfterCurrentCacheUpdate;

    if (!messagesKeysToUpdateStore) {
      throw new Error('There is no _messagesKeysToUpdateAfterCacheUpdate');
    }
    return messagesKeysToUpdateStore;
  }

  protected _createStorageForKeysToRequestAfterTheCurrentCacheUpdate() {
    this._messagesKeysToUpdateAfterCurrentCacheUpdate = new Set();
  }

  protected _addKeyToRequestAfterCurrentCacheUpdate(
    key: TSwarmStoreDatabaseEntityKey<P>
  ) {
    this._getStorageForKeysToRequestAfterTheCurrentCacheUpdate().add(key);
  }

  protected _planCacheUpdateForKey(key: TSwarmStoreDatabaseEntityKey<P>): void {
    this._checkIsReady();
    if (!this._messagesKeysToUpdateAfterCurrentCacheUpdate) {
      this._createStorageForKeysToRequestAfterTheCurrentCacheUpdate();
    }
    this._addKeyToRequestAfterCurrentCacheUpdate(key);
  }

  protected _planCacheUpdateForKeyIfCacheUpdateActive(
    key: TSwarmStoreDatabaseEntityKey<P>
  ): void {
    if (this._pendingMessagesUpdatePromise) {
      this._planCacheUpdateForKey(key);
    }
  }

  protected _updateCacheForKeyInKeyValueStoreIfCacheExists(
    key: TSwarmStoreDatabaseEntityKey<P>
  ): undefined | Promise<void> {
    if (this._messagesCached) {
      return this._updateCacheForKeyInKeyValueStore(key);
    }
  }

  protected _updateKeysPlannedToUpdate = async () => {
    this._checkIsReady();
    if (!this._messagesCached) {
      return;
    }

    const keysToUpdateList = Array.from(
      this._getStorageForKeysToRequestAfterTheCurrentCacheUpdate().values()
    );
    const countOverall = keysToUpdateList.length;
    let countReadFromStore = 0;

    while (countReadFromStore < countOverall) {
      const currentPageItemsToRead = await this._getItemsCountCanBeReadForCurrentIdlePeriod();
      const keysToRead = keysToUpdateList.slice(
        countReadFromStore - 1,
        Math.max(countReadFromStore - 1 + currentPageItemsToRead, countOverall)
      );

      debugger;
      countReadFromStore = countReadFromStore + currentPageItemsToRead;
      await Promise.all(
        keysToRead.map((key) =>
          this._updateCacheForKeyInKeyValueStore(key).catch((err) => {
            console.error(new Error(`Failed to read value for the key ${key}`));
            throw err;
          })
        )
      );
    }
  };

  protected _setFullMessagesReadFromDatabaseToCache() {
    this._whetherMessagesListContainsAllMessages = true;
  }

  protected _unsetFullMessagesReadFromDatabaseToCache() {
    this._whetherMessagesListContainsAllMessages = false;
  }

  /**
   * Perform query to collect messages from the database.
   *
   * @protected
   * @param {number} messagesCountToQuery
   * @param {string[]} messagesReadAddressesOrKeysToExclude
   * @memberof SwarmMessagesDatabase
   * @returns {Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P>>>}
   * @throws
   */
  protected async _performMessagesCacheCollectPageRequest(
    messagesCountToQuery: number,
    messagesReadAddressesOrKeysToExclude: Array<
      TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>
    >
  ): Promise<
    Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P> | undefined>
  > {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready');
    }
    debugger;

    let queryAttempt = 0;
    let messages:
      | Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P> | undefined>
      | undefined;
    const queryOptions = this._getDatabaseMessagesQueryOptions(
      messagesCountToQuery,
      messagesReadAddressesOrKeysToExclude
    );
    debugger;
    while (
      !messages &&
      !this._whetherMaxDatabaseQueriesAttemptsFailed(queryAttempt)
    ) {
      try {
        messages = await this._dbInstance.collectWithMeta(queryOptions);
        debugger;
      } catch (err) {
        debugger;
        console.error(
          new Error(
            `_performMessagesCachePageRequest::failed::attempt::${queryAttempt}`
          ),
          err
        );
        await this._requestTimeBrowserIdle();
      } finally {
        queryAttempt++;
      }
    }
    if (!messages) {
      throw new Error(
        'Failed to read a batch of messages from the database cause of unknown reason'
      );
    }
    return messages;
  }

  /**
   * Map messages with meta to the data structure related
   * to the KeyValue store.
   *
   * @protected
   * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]} messagesWithMeta
   * @returns {Map<string, ISwarmMessageStoreMessagingRequestWithMetaResult<P>>}
   * @memberof SwarmMessagesDatabase
   */
  protected _mapMessagesDescriptionsToKVStoreMap(
    messagesWithMeta: Array<
      ISwarmMessageStoreMessagingRequestWithMetaResult<P> | undefined
    >
  ): TSwarmMessageDatabaseMessagesCached<
    ESwarmStoreConnector.OrbitDB,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
  > {
    const messagesMap = new Map<
      string,
      ISwarmMessageStoreMessagingRequestWithMetaResult<P>
    >();

    messagesWithMeta.forEach((messageDescription) => {
      if (!messageDescription) {
        return messageDescription;
      }
      const key = this._getMessageKeyByDescription(messageDescription);

      if (key) {
        messagesMap.set(key, messageDescription);
      }
    });
    return messagesMap;
  }

  /**
   * Map messages with descriptions to a data structure related
   * to a Feed store.
   *
   * @protected
   * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]} messagesWithMeta
   * @returns {Set<ISwarmMessageStoreMessagingRequestWithMetaResult<P>>}
   * @memberof SwarmMessagesDatabase
   */
  protected _mapMessagesDescriptionsToFeedStore(
    messagesWithMeta: Array<
      ISwarmMessageStoreMessagingRequestWithMetaResult<P> | undefined
    >
  ): TSwarmMessageDatabaseMessagesCached<
    ESwarmStoreConnector.OrbitDB,
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  > {
    const messagesMap = new Map<
      string,
      ISwarmMessageStoreMessagingRequestWithMetaResult<P>
    >();

    messagesWithMeta.forEach((messageDescription) => {
      if (!messageDescription) {
        console.warn('Swarm message description is absent');
        return;
      }
      const messageAddress = this._getMessageAddressByDescription(
        messageDescription
      );

      if (messageAddress) {
        messagesMap.set(messageAddress, messageDescription);
      }
    });
    return messagesMap;
  }

  protected _getMessagesReadKeysOrAddresses(
    messagesCache: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ): Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>> {
    if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
      return (Array.from(messagesCache.keys()) as Array<
        TSwarmStoreDatabaseEntityKey<P>
      >) as Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>>;
    } else if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
      return (Array.from(messagesCache.keys()) as Array<
        TSwarmStoreDatabaseEntityAddress<P>
      >) as Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>>;
    }
    return [];
  }

  protected _createMessagesCacheUpdatingBatchPromise = () => {
    let resolve: () => void;
    this._messagesCacheUpdatingBatch = new Promise((res, rej) => {
      resolve = res;
      setTimeout(
        rej,
        SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_BATCH_TIMEOUT_MS
      );
    });
    return () => {
      resolve();
      this._messagesCacheUpdatingBatch = undefined;
    };
  };

  /**
   * Returns a count of items can be read from the store
   * during the current browser's idle period.
   *
   * @protected
   * @returns
   * @memberof SwarmMessagesDatabaseCache
   */
  protected async _getItemsCountCanBeReadForCurrentIdlePeriod(): Promise<
    number
  > {
    const timeAvailToRun = await this._requestTimeBrowserIdle();

    if (!timeAvailToRun) {
      // if there is no free time to run
      // waiting for the time
      return 0;
    }
    // the maximum messages to read for max time remaining THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS
    // is equal to SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT. We need to calculate
    // messages to read for timeAvailToRun.
    return this._getItemsCountToReadForIdlePeriod(timeAvailToRun);
  }

  /**
   * Performs swarm messages cache update by
   * quering database.
   * Query performed only when the brawser is
   * not busy per page.
   *
   * @protected
   * @memberof SwarmMessagesDatabase
   * @returns {Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P>>>}
   * @throws
   * @memberof SwarmMessagesDatabase
   */
  protected async _performMessagesReadingToUpdateCache(
    messagesRead: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ): Promise<TSwarmMessageDatabaseMessagesCached<P, DbType>> {
    // current page
    let pageToQueryIndex = 0;
    // overall messages read count
    let messagesReadCount = 0;
    // count messages to read from the database.
    let messagesToReadAtTheBatch = 0;
    // limit of messages count in the cached was reached
    let whetherMessagesLimitToReadReached = false;
    // whether all messages were read from the databse
    let whetherFullMessagesRead = false;

    while (!whetherMessagesLimitToReadReached && !whetherFullMessagesRead) {
      this._checkIsReady();

      const resolveMessagesUpatingBatchPromise = this._createMessagesCacheUpdatingBatchPromise();
      const currentPageItemsToRead = await this._getItemsCountCanBeReadForCurrentIdlePeriod();

      if (!currentPageItemsToRead) {
        // nothing to read at this iteration
        continue;
      }
      pageToQueryIndex = pageToQueryIndex + 1;
      messagesToReadAtTheBatch = messagesReadCount + currentPageItemsToRead;
      whetherMessagesLimitToReadReached = this._whetherMessagesLimitReached(
        messagesToReadAtTheBatch
      );

      if (whetherMessagesLimitToReadReached) {
        // add one more to define if the database
        // contains some more data
        messagesToReadAtTheBatch = messagesToReadAtTheBatch + 1;
      }

      const messagesBatch = await this._performMessagesCacheCollectPageRequest(
        messagesToReadAtTheBatch,
        this._getMessagesReadKeysOrAddresses(messagesRead)
      );
      const messagesReadAtBatch = this._mapMessagesWithMetaToStorageRelatedStructure(
        messagesBatch
      );
      debugger;
      const whetherMessagesReadLessThanRequested =
        messagesToReadAtTheBatch > 50 &&
        currentPageItemsToRead > 6 &&
        !getItemsCount(messagesReadAtBatch);
      // TODO - ORBIT DB counts also removed items, so we can request more than
      // it will return
      // getItemsCount(messagesReadAtBatch) < currentPageItemsToRead;

      if (whetherMessagesReadLessThanRequested) {
        // if read less than requested it means that
        // all messages were read
        whetherFullMessagesRead = true;
      }
      concatMaps(messagesRead, messagesReadAtBatch);
      debugger;
      console.log(messagesRead);
      resolveMessagesUpatingBatchPromise();
      messagesReadCount = messagesToReadAtTheBatch;
    }
    debugger;
    if (whetherFullMessagesRead) {
      this._setFullMessagesReadFromDatabaseToCache();
    } else {
      this._unsetFullMessagesReadFromDatabaseToCache();
    }
    debugger;
    return messagesRead;
  }

  /**
   * Wait till the current messages update process
   * will be ended.
   *
   * @protected
   * @returns
   * @memberof SwarmMessagesDatabase
   */
  protected async _waitForCurrentMessagesUpdate() {
    if (this._pendingMessagesUpdatePromise) {
      return await this._pendingMessagesUpdatePromise;
    }
  }

  /**
   * Plan a cache update which will be run after the current iteration
   * will be ended.
   *
   * @protected
   * @returns {(Promise<TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined>)}
   * @memberof SwarmMessagesDatabase
   */
  protected async _planNewCacheUpdate(): Promise<
    TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined
  > {
    debugger;
    this._setNewCacheUpdatePlanned();
    // await when the current iteration will be over
    await this._waitForCurrentMessagesUpdate();
    debugger;
    this._checkIsReady();
    if (!this._pendingMessagesUpdatePromise) {
      debugger;
      // start a new interaction if there is no one active
      this._unsetNewCacheUpdatePlanned();
      try {
        return await this._runNewCacheUpdate();
      } catch (err) {
        console.error(`Failed to plan a new cache update: ${err.message}`, err);
        await delay(
          SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_FAILED_RETRY_DELAY_MS
        );
        return await this._planNewCacheUpdate();
      }
    }
    debugger;
    // if another iteration was started just waiting for results
    return this._waitForCurrentMessagesUpdate();
  }

  /**
   * Check whether a next messages cache update
   * is planned and runs it.
   *
   * @protected
   * @memberof SwarmMessagesDatabase
   */
  protected _runNextCacheUpdateIterationIfNecessary() {
    if (this._isSwarmMessagesCacheUpdateRequested) {
      // uset that a cache update required
      this._unsetNewCacheUpdatePlanned();
      // and run the next cache update
      this._runNewCacheUpdate();
    }
  }

  protected _setCurrentCacheUpdateTempMessages(
    messages: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ) {
    this._messagesCacheUpdatingCurrentMessages = messages;
  }

  protected _unsetCurrentCacheUpdateTempMessages() {
    this._messagesCacheUpdatingCurrentMessages = undefined;
  }

  /**
   * Runs swarm messages cache update and the next iteration
   * if it's planned.
   *
   * @protected
   * @returns {(Promise<TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined>)}
   * @memberof SwarmMessagesDatabase
   */
  protected async _runNewCacheUpdate(): Promise<
    TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined
  > {
    let messages: TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined;
    debugger;
    try {
      const messagesRead = (this._isKeyValueDatabase
        ? new Map<
            TSwarmStoreDatabaseEntityKey<P>,
            ISwarmMessageStoreMessagingRequestWithMetaResult<P>
          >()
        : new Map<
            TSwarmStoreDatabaseEntityAddress<P>,
            ISwarmMessageStoreMessagingRequestWithMetaResult<P>
          >()) as TSwarmMessageDatabaseMessagesCached<P, DbType>;
      const promiseMessagesUpdating = this._performMessagesReadingToUpdateCache(
        messagesRead
      );

      this._setCurrentCacheUpdateTempMessages(messagesRead);
      this._setMessagesCacheUpdateInProgress(promiseMessagesUpdating);
      messages = await promiseMessagesUpdating;
      debugger;
      this._updateCacheWithMessages(messages);
      this._unsetCurrentCacheUpdateTempMessages();
      this._emitDbMessagesWithAddedMessagesCaheUpdated();
    } catch (err) {
      console.error(`Failed to update messages cache: ${err.message}`, err);
      debugger;
      throw err;
    }
    this._unsetCacheUpdateInProgress();
    this._runNextCacheUpdateIterationIfNecessary();
    return messages;
  }

  /**
   * Request database for all messages.
   *
   * @protected
   * @returns {Promise<TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined>}
   * @memberof SwarmMessagesDatabase
   */
  protected async _updateMessagesCache(): Promise<
    TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined
  > {
    debugger;
    this._checkIsReady();
    if (this._pendingMessagesUpdatePromise) {
      return this._planNewCacheUpdate();
    }
    this._unsetNewCacheUpdatePlanned();
    return this._runNewCacheUpdate();
  }

  /**
   * Create a promise which reset messages added after
   * the next cache update will over
   *
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _createResetMessagesAddedAndDeletedPromise = async () => {
    let resolvePromise: () => any = () => {
      throw new Error('Failed to resolve the promise');
    };

    this._pendingResetAddedAndDeletedMessagesPromise = new Promise((res) => {
      resolvePromise = () => {
        // reset the messages added and removed stores
        this._resetMessagesDeffered();
        res();
      };
    });

    if (resolvePromise) {
      // clear store with messages added
      resolvePromise();
    }
  };

  /**
   * Plan to clear messages added storage
   * when the next chache update will over.
   *
   * @protected
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _runDefferedMessagesUpdateInCache = async (): Promise<void> => {
    // check whether already a next update planned
    if (!this._pendingResetAddedAndDeletedMessagesPromise) {
      await this._createResetMessagesAddedAndDeletedPromise();
    }
  };

  // ----USING OF A SEPARATE STORAGE

  protected _addMessageToCachedStore(
    swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P>
  ): boolean {
    if (!this._checkIsReady()) {
      return false;
    }

    const result = this._messagesCachedStore.add(
      getMessageDescriptionForMessageWithMeta<P, DbType>(
        swarmMessageWithMeta,
        this._dbType
      )
    );

    this._runDefferedCachePartialUpdate();
    return result;
  }

  protected _removeMessageFromCachedStore = async (
    messageUniqAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityKey<P>
      : undefined
  ): Promise<void> => {
    if (!this._checkIsReady()) {
      return;
    }

    const result = this._messagesCachedStore.remove(
      createMessagesMetaByAddressAndKey<P, DbType>(
        messageUniqAddress,
        key,
        this._dbType
      )
    );
    this._runDefferedCachePartialUpdate();
    return result;
  };

  protected _getMessagesDefferedUpdateWithinBatch() {
    return this._messagesCachedStore?.getDefferedReadAfterCurrentCacheUpdateBatch();
  }

  protected _getDefferedUpdateAfterCacheUpdateProcess() {
    return this._messagesCachedStore?.getDefferedRead();
  }

  protected _resetMessagesDeffered() {
    this._messagesCachedStore?.resetDeffered();
  }

  protected _resetMessagesDefferedWithinBatch() {
    this._messagesCachedStore?.resetDefferedAfterCurrentCacheUpdateBatch();
  }

  protected _getAndResetTheListOfMessagesForDefferedPartialUpdate() {
    let messagesMetaToUpdate;
    if (this._pendingMessagesUpdatePromise) {
      // if cache update is in progress update only messages for the
      // current batch
      messagesMetaToUpdate = this._getMessagesDefferedUpdateWithinBatch();
      this._resetMessagesDefferedWithinBatch();
    } else {
      // if not messages in cache batch in progress then update all pending
      messagesMetaToUpdate = this._getDefferedUpdateAfterCacheUpdateProcess();
      this._resetMessagesDeffered();
      this._resetMessagesDefferedWithinBatch();
    }

    return messagesMetaToUpdate;
  }

  /**
   * Runs adding of messages to addedMessages store
   * from the queue of a pending for adding messages.
   * Plans a clearing of a messages added store.
   * Emits the cahce update event if any message was added
   * to the store.
   *
   * @protected
   * @memberof SwarmMessagesDatabaseCache
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected _runDefferedCachePartialUpdate = debounce(async () => {
    if (this._pendingResetAddedAndDeletedMessagesPromise) {
      // if it is already in progress
      return;
    }

    const messagesMetaToUpdate = this._getAndResetTheListOfMessagesForDefferedPartialUpdate();

    if (messagesMetaToUpdate?.size) {
      await this._runDefferedMessagesUpdateInCache(messagesMetaToUpdate);
      this._emitDbMessagesWithAddedMessagesCaheUpdatedWithAddedOrDeletedFromTheCurrent();
      this._runDefferedCachePartialUpdate();
    }
  }, SWARM_MESSAGES_DATABASE_CACHE_ADD_TO_CACHE_MESSAGES_PENDING_DEBOUNCE_MS);
}
