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
  SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT,
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
import { filterMap } from 'utils/common-utils/common-utils-maps';
import { SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_FAILED_RETRY_DELAY_MS } from './swarm-messages-database-cache.const';
import { delay } from 'utils/common-utils/common-utils-timer';

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
          ...messagesAddedToCache,
          ...messagesCached,
        ]) as TSwarmMessageDatabaseMessagesCached<P, DbType>;
      }
      return new Map() as TSwarmMessageDatabaseMessagesCached<P, DbType>;
    }
  );

  protected _filterMessagesCached = memoizeLastReturnedValue(
    (
      messagesCached: TSwarmMessageDatabaseMessagesCached<P, DbType>,
      messagesAddressesAndKeysMarkedAsRemoved?: Set<
        DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED
          ? TSwarmStoreDatabaseEntityAddress<P>
          : TSwarmStoreDatabaseEntityKey<P>
      >
    ): TSwarmMessageDatabaseMessagesCached<P, DbType> => {
      if (!messagesAddressesAndKeysMarkedAsRemoved) {
        return messagesCached;
      }
      return filterMap(
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
        | Set<
            DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED
              ? TSwarmStoreDatabaseEntityAddress<P>
              : TSwarmStoreDatabaseEntityKey<P>
          >
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
    return this._messagesCachedComposedWithAddedAndRemoved;
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

  protected _dbType: DbType;

  protected _dbInstance?: ISwarmMessagesDatabaseCacheOptionsDbInstance<
    P,
    DbType
  >;

  protected _emitter = getEventEmitterInstance<
    ISwarmMessageDatabaseEvents<P, DbType>
  >();

  protected _messagesCached?: TSwarmMessageDatabaseMessagesCached<P, DbType>;

  /**
   * Messages added by the 'addMessage' method.
   *
   * @protected
   * @type {ISwarmMessageStoreMessagingRequestWithMetaResult<P>}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _messagesAddedToCache?: TSwarmMessageDatabaseMessagesCached<
    P,
    DbType
  >;

  /**
   * Messages removed by the 'deleteMessage' method.
   *
   * @protected
   * @type {Set<
   *     DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED
   *     ? TSwarmStoreDatabaseEntityAddress<P>
   *     : TSwarmStoreDatabaseEntityKey<P>
   *   >}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _messagesRemovedFromCache?: Set<
    DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED
      ? TSwarmStoreDatabaseEntityAddress<P>
      : TSwarmStoreDatabaseEntityKey<P>
  >;

  /**
   * Returns messages cached, which updated from the databse
   * composed with messages added before with the 'addMessage'
   * method
   *
   * @readonly
   * @protected
   * @memberof SwarmMessagesDatabaseCache
   */
  protected get _messagesCachedComposedWithAddedAndRemoved(): TSwarmMessageDatabaseMessagesCached<
    P,
    DbType
  > {
    return this._composeRemovedAddedMessagesWithCache(
      this._messagesCached,
      this._messagesAddedToCache,
      this._messagesRemovedFromCache
    );
  }
  protected get _isKeyValueDatabase(): boolean {
    return this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
  }

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

  constructor(options: ISwarmMessagesDatabaseCacheOptions<P, DbType>) {
    this._dbType = options.dbType;
    this._dbInstance = options.dbInstance;
    this._resetMessagesAddedAndRemovedStores();
  }

  start = async (): Promise<void> => {
    if (this._isReady) {
      return;
    }
    this._resetTheInstance();
    this._isReady = true;
  };

  close = async () => {
    this._isReady = false;
    this._clearEventEmitter();
    this._resetTheInstance();
    this._unsetDbInstance();
  };

  update = () => {
    return this._updateMessagesCache();
  };

  addMessage = async (
    swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P>
  ) => {
    if (!this._checkIsReady()) {
      return;
    }

    this._createNewMessagesAddedStoreIfNotExists();
    if (!this._messagesAddedToCache) {
      throw new Error(
        'A storage for messages added to the cache from the outside is not exists'
      );
    }
    this.__addMessageWithMetaToCache(
      this._messagesAddedToCache,
      swarmMessageWithMeta
    );
    this._planResetAddedAndDeletedMessages();
    this._emitDbMessagesWithAddedMessagesCaheUpdated();
  };

  deleteMessage = async (
    // for a non key-value stores
    messageUniqAddressOrKey: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED
      ? TSwarmStoreDatabaseEntityAddress<P>
      : TSwarmStoreDatabaseEntityKey<P>
  ): Promise<void> => {
    if (!this._checkIsReady()) {
      return;
    }
    this._createMessagesRemovedStoreIfNotExists();
    this._addMessageAddressOrKeyToRemoved(messageUniqAddressOrKey);
    this._planResetAddedAndDeletedMessages();
    this._emitDbMessagesWithAddedMessagesCaheUpdated();
  };

  protected _checkIsReady(): this is {
    _isReady: true;
    _dbInstance: ISwarmMessagesDatabaseCacheOptionsDbInstance<P, DbType>;
  } {
    if (!this._isReady) {
      throw new Error('The instance is not ready to use');
    }
    if (!this._dbInstance) {
      throw new Error('A database instance is not set');
    }
    return true;
  }

  protected _createNewMessagesAddedStore(): void {
    this._messagesAddedToCache = (new Map() as unknown) as TSwarmMessageDatabaseMessagesCached<
      P,
      DbType
    >;
  }

  protected _createNewMessagesAddedStoreIfNotExists(): void {
    if (!this._messagesAddedToCache) {
      this._createNewMessagesAddedStore();
    }
  }

  protected _createMessagesRemovedStore(): void {
    this._messagesRemovedFromCache = new Set();
  }

  protected _createMessagesRemovedStoreIfNotExists(): void {
    if (!this._messagesRemovedFromCache) {
      this._createMessagesRemovedStore();
    }
  }

  protected _resetMessagesAddedAndRemovedStores() {
    this._messagesAddedToCache = undefined;
    this._messagesRemovedFromCache = undefined;
  }

  protected _resetTheInstance() {
    this._resetMessagesAddedAndRemovedStores();
    this._messagesCached = undefined;
    this._pendingMessagesUpdatePromise = undefined;
    this._isSwarmMessagesCacheUpdateRequested = false;
    this._whetherMessagesListContainsAllMessages = false;
  }

  protected _unsetDbInstance() {
    this._dbInstance = undefined;
  }

  protected _clearEventEmitter() {
    this._emitter.removeAllListeners();
  }

  protected _addMessageInKeyValueStoreCache = (
    messageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>,
    // for key-value store it will be the key
    key: TSwarmStoreDatabaseEntityKey<P>,
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ) => {
    (messagesCachedStore as TSwarmMessageDatabaseMessagesCached<
      ESwarmStoreConnector.OrbitDB,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >)?.set(key, messageWithMeta);
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

  protected _removeKeyValueFromKVStoreCache = (
    messagesCache: TSwarmMessageDatabaseMessagesCached<P, DbType>,
    key: TSwarmStoreDatabaseEntityKey<P>
  ) => {
    (this._messagesCached as TSwarmMessageDatabaseMessagesCached<
      ESwarmStoreConnector.OrbitDB,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >)?.delete(key);
  };

  protected _removeMessageFromFeedStoreCache = (
    messagesCache: TSwarmMessageDatabaseMessagesCached<P, DbType>,
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>
  ) => {
    (this._messagesCached as TSwarmMessageDatabaseMessagesCached<
      ESwarmStoreConnector.OrbitDB,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >)?.delete(messageAddress);
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
    this._emitCacheUpdated(this._messagesCachedComposedWithAddedAndRemoved);
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
      limit: messagesCountToQuery,
      neq: messagesReadAddressesOrKeysToExclude,
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
    debugger;
    if (didTimeout) {
      return 0;
    }
    // time browser decide it will be idle.
    return (
      timeRemaining || THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS
    );
  };
  /**
   * how many items can be read during
   * the current idle time of the browser
   *
   * @param {number} timeAvailToRun
   * @returns {number}
   */
  protected _getItemsCountToRead = (timeAvailToRun: number): number => {
    // the maximum messages to read for max time remaining THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS
    // is equal to SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT. We need to calculate
    // messages to read for timeAvailToRun.
    const percentAcordingToFreeTime = round(
      timeAvailToRun / THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS,
      2
    );

    return (
      SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT *
      percentAcordingToFreeTime
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
    messagesWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]
  ): TSwarmMessageDatabaseMessagesCached<P, DbType> => {
    if (this._isKeyValueDatabase) {
      return this._mapMessagesDescriptionsToFeedStoreSet(
        messagesWithMeta
      ) as TSwarmMessageDatabaseMessagesCached<P, DbType>;
    }
    return this._mapMessagesDescriptionsToKVStoreMap(
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
   * Create message's description and add it to the
   * cache.
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

  protected __addMessageWithMetaToCache(
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

  protected _removeMessageFromCache(
    messagesCache: TSwarmMessageDatabaseMessagesCached<P, DbType>,
    messageUniqAddressOrKey: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED
      ? TSwarmStoreDatabaseEntityAddress<P>
      : TSwarmStoreDatabaseEntityKey<P>
  ) {
    if (this._isKeyValueDatabase) {
      if (!messageUniqAddressOrKey) {
        throw new Error(
          "Key should be provided to remove it's value from the key-value store"
        );
      }
      this._removeKeyValueFromKVStoreCache(
        messagesCache,
        (messageUniqAddressOrKey as unknown) as TSwarmStoreDatabaseEntityKey<P>
      );
    } else {
      if (!messageUniqAddressOrKey) {
        throw new Error(
          'A message address should be provided to remove message from the feed store messages cache'
        );
      }
      this._removeMessageFromFeedStoreCache(
        messagesCache,
        (messageUniqAddressOrKey as unknown) as TSwarmStoreDatabaseEntityAddress<
          P
        >
      );
    }
  }

  protected _addMessageAddressOrKeyToRemoved(
    messageUniqAddressOrKey: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED
      ? TSwarmStoreDatabaseEntityAddress<P>
      : TSwarmStoreDatabaseEntityKey<P>
  ): void {
    if (!this._messagesRemovedFromCache) {
      throw new Error(
        'A storage for messages removed from the cache from the outside is not exists'
      );
    }
    this._messagesRemovedFromCache.add(messageUniqAddressOrKey);
  }

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
  ): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P>>> {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready');
    }
    debugger;

    let queryAttempt = 0;
    let messages:
      | Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P>>
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
    messagesWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]
  ): TSwarmMessageDatabaseMessagesCached<
    ESwarmStoreConnector.OrbitDB,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
  > {
    const messagesMap = new Map<
      string,
      ISwarmMessageStoreMessagingRequestWithMetaResult<P>
    >();

    messagesWithMeta.forEach((messageDescription) => {
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
  protected _mapMessagesDescriptionsToFeedStoreSet(
    messagesWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P>[]
  ): TSwarmMessageDatabaseMessagesCached<
    ESwarmStoreConnector.OrbitDB,
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  > {
    const messagesMap = new Map<
      string,
      ISwarmMessageStoreMessagingRequestWithMetaResult<P>
    >();

    messagesWithMeta.forEach((messageDescription) => {
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
  protected async _performMessagesReadingToUpdateCache(): Promise<
    TSwarmMessageDatabaseMessagesCached<P, DbType>
  > {
    debugger;
    // current page
    let pageToQueryIndex = 0;
    // count messages to read from the database.
    let messagesToReadAtTheBatch = 0;
    // limit of messages count in the cached was reached
    let whetherMessagesLimitToReadReached = false;
    // whether all messages were read from the databse
    let whetherFullMessagesRead = false;
    let messagesRead = (this._isKeyValueDatabase
      ? new Map<
          TSwarmStoreDatabaseEntityKey<P>,
          ISwarmMessageStoreMessagingRequestWithMetaResult<P>
        >()
      : new Map<
          TSwarmStoreDatabaseEntityAddress<P>,
          ISwarmMessageStoreMessagingRequestWithMetaResult<P>
        >()) as TSwarmMessageDatabaseMessagesCached<P, DbType>;

    while (!whetherMessagesLimitToReadReached && !whetherFullMessagesRead) {
      this._checkIsReady();
      // time browser decide it will be idle.
      const timeAvailToRun = await this._requestTimeBrowserIdle();
      debugger;
      if (!timeAvailToRun) {
        // if there is no free time to run
        // waiting for the time
        continue;
      }

      // the maximum messages to read for max time remaining THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS
      // is equal to SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT. We need to calculate
      // messages to read for timeAvailToRun.
      const currentPageItemsToRead = this._getItemsCountToRead(timeAvailToRun);
      debugger;
      if (!currentPageItemsToRead) {
        // nothing to read at this iteration
        continue;
      }
      pageToQueryIndex = pageToQueryIndex + 1;
      messagesToReadAtTheBatch =
        getItemsCount(messagesRead) + currentPageItemsToRead;
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

      messagesRead = this._mapMessagesWithMetaToStorageRelatedStructure(
        messagesBatch
      );
      if (
        whetherMessagesLimitToReadReached &&
        !this._whetherMessagesLimitReached(getItemsCount(messagesRead))
      ) {
        // if tried to read more messages than the limit
        // but got some less. So decide that all
        // messages read from the database.
        whetherFullMessagesRead = true;
      }
    }
    if (whetherFullMessagesRead) {
      this._setFullMessagesReadFromDatabaseToCache();
    } else {
      this._unsetFullMessagesReadFromDatabaseToCache();
    }
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
      this._unsetNewCacheUpdatePlanned();
      this._runNewCacheUpdate();
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
      const promiseMessagesUpdating = this._performMessagesReadingToUpdateCache();

      this._setMessagesCacheUpdateInProgress(promiseMessagesUpdating);
      messages = await promiseMessagesUpdating;
      this._updateCacheWithMessages(messages);
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
        this._resetMessagesAddedAndRemovedStores();
        res();
      };
    });

    // waiting till the next cache update
    await waitFor(() => {
      this._checkIsReady();
      return this._pendingMessagesUpdatePromise;
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
  protected _planResetAddedAndDeletedMessages = async () => {
    if (this._pendingMessagesUpdatePromise) {
      await this._pendingMessagesUpdatePromise;
    }
    if (!this._pendingResetAddedAndDeletedMessagesPromise) {
      // if already a next update planned
      await this._createResetMessagesAddedAndDeletedPromise();
    }
  };
}
