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
  ISwarmMessagesDatabaseMessagesCacheStoreNonTemp,
  ISwarmMessagesDatabaseMessagesCacheStoreTemp,
} from './swarm-messages-database-cache.types';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { constructCacheStoreFabric } from '../swarm-messages-database-messages-cached-store/swarm-messages-database-messages-cached-store';
import {
  getMessageDescriptionForMessageWithMeta,
  createMessagesMetaByAddressAndKey,
} from './swarm-messages-database-cache.utils';
import { ISwarmMessagesDatabaseMesssageMeta } from '../../swarm-messages-database.types';
import { getMessagesUniqIndexesByMeta } from './swarm-messages-database-cache.utils';
import { TSwarmMessagesDatabaseMessagesCacheStore } from './swarm-messages-database-cache.types';

export class SwarmMessagesDatabaseCache<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> implements ISwarmMessagesDatabaseCache<P, DbType> {
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
  protected _pendingMessagesUpdatePromise: Promise<void> | undefined;

  /**
   * Promise with partial cache update of a messages meta
   * which are marked as a necessary to be updated in cache.
   *
   * @protected
   * @type {(Promise<void>
   *     | undefined)}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _defferedPartialCacheUpdatePromise: Promise<void> | undefined;

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

  /**
   * Is a cache update process is active
   *
   * @readonly
   * @protected
   * @type {boolean}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected get _isCacheUpdateActive(): boolean {
    return !!this._pendingMessagesUpdatePromise;
  }

  /**
   * Is a deffered messages update is active
   *
   * @readonly
   * @protected
   * @type {boolean}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected get _isDefferedMessagesUpdateActive(): boolean {
    return !!this._defferedPartialCacheUpdatePromise;
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

  protected _createMessagesCachedStorage<IsTemp extends boolean>(
    isTemp: IsTemp
  ): TSwarmMessagesDatabaseMessagesCacheStore<P, DbType, IsTemp> {
    if (!this._dbType) {
      throw new Error('Database type should be defined');
    }
    if (!this._dbName) {
      throw new Error('Database name should be defined');
    }
    return constructCacheStoreFabric(
      this._dbType,
      this._dbName,
      isTemp
    ) as TSwarmMessagesDatabaseMessagesCacheStore<P, DbType, IsTemp>;
  }

  protected _initializeCacheStore(): void {
    this._messagesCachedStore = this._createMessagesCachedStorage(false);
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

  protected _setMessagesCacheUpdateInProgress = (
    promisePending: Promise<void>
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
    messagesCachedStoreTemp: ISwarmMessagesDatabaseMessagesCacheStoreTemp<
      P,
      DbType,
      true
    >
  ): Promise<void> {
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

      const messagesReadAtBatch = await this._performMessagesCacheCollectPageRequest(
        messagesToReadAtTheBatch,
        // TODO
        this._getMessagesReadKeysOrAddresses(messagesCachedStoreTemp)
      );
      const messagesReadAtBatchMapped = this._mapMessagesWithMetaToStorageRelatedStructure(
        messagesReadAtBatch
      );
      debugger;
      const whetherMessagesReadLessThanRequested =
        messagesToReadAtTheBatch > 50 &&
        currentPageItemsToRead > 6 &&
        !getItemsCount(messagesReadAtBatchMapped);
      // TODO - ORBIT DB counts also removed items, so we can request more than
      // it will return
      // getItemsCount(messagesReadAtBatch) < currentPageItemsToRead;

      if (whetherMessagesReadLessThanRequested) {
        // if read less than requested it means that
        // all messages were read
        whetherFullMessagesRead = true;
      }
      messagesCachedStoreTemp.update(messagesReadAtBatchMapped);
      debugger;
      console.log(messagesCachedStoreTemp);
      resolveMessagesUpatingBatchPromise();
      messagesReadCount = messagesToReadAtTheBatch;
    }
    debugger;
    if (whetherFullMessagesRead) {
      this._setFullMessagesReadFromDatabaseToCache();
    } else {
      this._unsetFullMessagesReadFromDatabaseToCache();
    }
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

  /**
   * Link a temporary cached messages store to the current
   * cached messages store.
   *
   * @protected
   * @param {ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, true>} messagesTempStore
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _linkTempStoreToMessagesCachedStore(
    messagesTempStore: ISwarmMessagesDatabaseMessagesCacheStoreTemp<
      P,
      DbType,
      true
    >
  ): void {
    if (this._checkIsReady()) {
      this._messagesCachedStore.linkWithTempStore(messagesTempStore);
    }
  }

  /**
   * Update messages in messages cached store with messages in
   * the linked temp store.
   *
   * @protected
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _updateMessagesCachedStoreByLinkedTempStoreMessages(): void {
    if (this._checkIsReady()) {
      debugger;
      this._messagesCachedStore.updateByTempStore();
      this._messagesCachedStore.unlinkWithTempStore();
    }
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
      const messagesCachedTempStore = this._createMessagesCachedStorage(true);

      this._linkTempStoreToMessagesCachedStore(messagesCachedTempStore);

      const promiseMessagesUpdating = this._performMessagesReadingToUpdateCache(
        messagesCachedTempStore
      );

      this._setMessagesCacheUpdateInProgress(promiseMessagesUpdating);
      await promiseMessagesUpdating;
      this._updateMessagesCachedStoreByLinkedTempStoreMessages();
      await this._runDefferedPartialCacheUpdate();
      this._emitDbMessagesWithAddedMessagesCaheUpdated();
    } catch (err) {
      console.error(`Failed to update messages cache: ${err.message}`, err);
      debugger;
      throw err;
    } finally {
      this._unsetCacheUpdateInProgress();
      this._runNextCacheUpdateIterationIfNecessary();
      return messages;
    }
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

    this._runDefferedPartialCacheUpdateDebounced();
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

    this._runDefferedPartialCacheUpdateDebounced();
    return result;
  };

  protected _getMessagesDefferedUpdateWithinCacheUpdateBatch() {
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

  protected _getAndResetMessagesDefferedUpdateWithinCaheUpdateBatch():
    | Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>
    | undefined {
    const messagesMetaToUpdate = this._getMessagesDefferedUpdateWithinCacheUpdateBatch();

    this._resetMessagesDefferedWithinBatch();
    return messagesMetaToUpdate;
  }

  protected _getAndResetDefferedUpdateAfterCacheUpdateProcess():
    | Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>
    | undefined {
    const messagesMetaToUpdate:
      | Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>
      | undefined = this._getDefferedUpdateAfterCacheUpdateProcess();

    this._resetMessagesDeffered();
    this._resetMessagesDefferedWithinBatch();
    return messagesMetaToUpdate;
  }

  /**
   * Get an actual list with messages waiting for update
   * from the database to the cache.
   *
   * @protected
   * @returns {(Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>> | undefined)}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _getAndResetMessagesDeffered():
    | Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>
    | undefined {
    return this._isCacheUpdateActive
      ? // if cache update process is active handle just a small part of messages waiting for update
        this._getAndResetMessagesDefferedUpdateWithinCaheUpdateBatch()
      : // if there is no cache update process is active handle all messages pending
        this._getAndResetDefferedUpdateAfterCacheUpdateProcess();
  }

  protected async _runDefferedMessagesUpdateInCache(
    messagesForUpdateMeta: Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>,
    cacheStore: ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DbType>,
    dbType: DbType
  ): Promise<void> {
    const messagesMetaToRead = getMessagesUniqIndexesByMeta(
      messagesForUpdateMeta,
      dbType
    );
    let idx = 0;

    while (idx < messagesMetaToRead.length) {
      const messagesCountToRead = await this._getItemsCountCanBeReadForCurrentIdlePeriod();

      if (!messagesCountToRead) {
        continue;
      }

      const messagesReadAtBatch = this._mapMessagesWithMetaToStorageRelatedStructure(
        await this._performMessagesCacheCollectPageRequest(
          messagesCountToRead,
          messagesMetaToRead.slice(idx, idx + messagesCountToRead)
        )
      );

      cacheStore.update(messagesReadAtBatch);
      idx += messagesCountToRead;
    }
  }

  protected _setActiveDefferedPartialCacheUpdate(
    activeUpdate: Promise<void>
  ): void {
    this._defferedPartialCacheUpdatePromise = activeUpdate;
  }

  protected _unsetActiveDefferedPartialCacheUpdate(): void {
    this._defferedPartialCacheUpdatePromise = undefined;
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
  protected _runDefferedPartialCacheUpdate = async () => {
    const messagesMetaToUpdate:
      | Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>
      | undefined = this._getAndResetMessagesDefferedUpdateWithinCaheUpdateBatch();

    if (messagesMetaToUpdate?.size && this._checkIsReady()) {
      await this._waitTillMessagesCacheUpateBatchOver();

      const activeCahePartialUpdate = this._runDefferedMessagesUpdateInCache(
        messagesMetaToUpdate,
        this._messagesCachedStore,
        this._dbType
      );

      this._setActiveDefferedPartialCacheUpdate(activeCahePartialUpdate);
      await activeCahePartialUpdate;
      this._unsetActiveDefferedPartialCacheUpdate();
    }
  };

  protected _runDefferedPartialCacheUpdateAfterCacheUpdate(): Promise<void> {
    const pendingResetAddedAndDeletedMessagesPromise = this
      ._defferedPartialCacheUpdatePromise;

    if (pendingResetAddedAndDeletedMessagesPromise) {
      return pendingResetAddedAndDeletedMessagesPromise;
    }
    return this._runDefferedPartialCacheUpdate();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected _runDefferedPartialCacheUpdateDebounced = debounce(async () => {
    if (this._isDefferedMessagesUpdateActive) {
      // if it's already in progress
      return;
    }
    await this._runDefferedPartialCacheUpdate();
    this._emitDbMessagesWithAddedMessagesCaheUpdated();
    this._runDefferedPartialCacheUpdateDebounced();
  }, SWARM_MESSAGES_DATABASE_CACHE_ADD_TO_CACHE_MESSAGES_PENDING_DEBOUNCE_MS);
}
