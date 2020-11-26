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
import {
  ISwarmMessageStoreMessageWithMeta,
  ISwarmMessageStoreMessagingMethods,
} from '../../../swarm-message-store/swarm-message-store.types';
import { ISwarmMessagesDatabaseCacheOptions, ISwarmMessagesDatabaseMessagesCollector } from '../../swarm-messages-database.types';
import {
  SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_FAILED_RETRY_DELAY_MS,
  SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_BATCH_TIMEOUT_MS,
} from './swarm-messages-database-cache.const';
import { delay } from 'utils/common-utils/common-utils-timer';
import { timeout } from '../../../../utils/common-utils/common-utils-timer';
import { debounce } from 'utils/throttling-utils';
import { SWARM_MESSAGES_DATABASE_CACHE_ADD_TO_CACHE_MESSAGES_PENDING_DEBOUNCE_MS } from './swarm-messages-database-cache.const';
import {
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
import { TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';

export class SwarmMessagesDatabaseCache<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessageStoreMessagingMethods<P, T, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>
> implements ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM> {
  get isReady(): boolean {
    return this._isReady;
  }

  get cache(): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined {
    return this._messagesCached;
  }

  get isUpdating(): boolean {
    return !!this._pendingMessagesUpdatePromise;
  }

  get emitter(): TTypedEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>> {
    return this._emitter;
  }

  get whetherMessagesListContainsAllMessages(): boolean {
    return this._whetherMessagesListContainsAllMessages;
  }

  protected _isReady: boolean = false;

  protected _dbType?: DbType;

  protected _dbName?: string;

  protected _options: DCO | undefined;

  protected get _dbInstance(): SMSM | undefined {
    return this._options?.dbInstance;
  }

  protected _emitter = getEventEmitterInstance<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>();

  /**
   * Storage which handling operations of cahe update.
   *
   * @protected
   * @type {ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DbType>}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _messagesCachedStore?: ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DbType, MD>;

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
  protected _defferedPartialCacheUpdatePromise:
    | ReturnType<SwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM, DCO>['_runDefferedMessagesUpdateInCache']>
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

  protected get _messagesCached(): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined {
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

  constructor(options: DCO) {
    this._setOptions(options);
  }

  public async start(): Promise<void> {
    if (this._isReady) {
      return;
    }
    this._resetTheInstance();
    this._initializeCacheStore();
    this._isReady = true;
  }

  public async close(): Promise<void> {
    this._isReady = false;
    this._clearEventEmitter();
    this._resetTheInstance();
    this._unsetCacheStore();
    this._unsetOptions();
  }

  public async update(): Promise<TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined> {
    // wait when the cache update process will be overed
    await this._updateMessagesCache();
    return this._messagesCached;
  }

  public async addMessage(swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P, MD>): Promise<boolean> {
    if (!this._checkIsReady()) {
      return false;
    }
    // wait till the cache updating is in progress
    // because the message may be already in the cache
    await this._waitTillMessagesCacheUpateBatchOver();
    return this._addMessageToCachedStore(swarmMessageWithMeta);
  }

  public async deleteMessage(
    messageUniqAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<void> {
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
  }

  protected _checkIsReady(): this is {
    _isReady: true;
    _dbName: DBO['dbName'];
    _dbType: DbType;
    _dbInstance: ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>;
    _messagesCachedStore: ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DbType, MD>;
  } {
    if (!this._isReady) {
      throw new Error('The instance is not ready to use');
    }
    if (!this._dbName) {
      throw new Error('Database name should be defined');
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

  protected _setOptions(options: DCO): void {
    this._dbType = options.dbType;
    this._dbName = options.dbName;
    this._options = options;
  }

  protected _createMessagesCachedStorage<IsTemp extends boolean>(
    isTemp: IsTemp
  ): TSwarmMessagesDatabaseMessagesCacheStore<P, DbType, MD, IsTemp> {
    if (!this._dbType) {
      throw new Error('Database type should be defined');
    }
    if (!this._dbName) {
      throw new Error('Database name should be defined');
    }
    return constructCacheStoreFabric(this._dbType, this._dbName, isTemp) as TSwarmMessagesDatabaseMessagesCacheStore<
      P,
      DbType,
      MD,
      IsTemp
    >;
  }

  protected _initializeCacheStore(): void {
    this._messagesCachedStore = this._createMessagesCachedStorage(false);
  }

  protected _resetTheInstance(): void {
    this._pendingMessagesUpdatePromise = undefined;
    this._isSwarmMessagesCacheUpdateRequested = false;
    this._whetherMessagesListContainsAllMessages = false;
  }

  protected _unsetCacheStore(): void {
    this._messagesCachedStore = undefined;
  }

  protected _unsetOptions(): void {
    this._options = undefined;
  }

  protected _clearEventEmitter(): void {
    this._emitter.removeAllListeners();
  }

  protected _checkMessagesEqual<MI extends MD>(messageFirst?: MI, messageSecond?: MI): boolean {
    return messageFirst?.sig === messageSecond?.sig;
  }

  protected _checkWhetherMessgeWithMetaInstancesEqual(
    messageWithMetaMetaInstanceFirst: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>['message'] | undefined,
    messageWithMetaMetaInstanceSecond: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>['message'] | undefined
  ): boolean {
    if (messageWithMetaMetaInstanceFirst === messageWithMetaMetaInstanceSecond) {
      return true;
    }
    if (!messageWithMetaMetaInstanceSecond) {
      return false;
    }
    if (messageWithMetaMetaInstanceSecond instanceof Error) {
      return false;
    }
    if (messageWithMetaMetaInstanceFirst instanceof Error) {
      return false;
    }
    return this._checkMessagesEqual(messageWithMetaMetaInstanceSecond, messageWithMetaMetaInstanceFirst);
  }

  protected async _waitTillMessagesCacheUpateBatchOver(): Promise<void> {
    const { _messagesCacheUpdatingBatch } = this;

    if (_messagesCacheUpdatingBatch) {
      await Promise.race([
        _messagesCacheUpdatingBatch,
        timeout(SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_BATCH_TIMEOUT_MS),
      ]).catch((err) => {
        console.error('_waitTillMessagesCacheUpateBatchOver', err);
        throw err;
      });
    }
  }

  protected _addMessageInKeyValueStoreCache = (
    messageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>,
    // for key-value store it will be the key
    key: TSwarmStoreDatabaseEntityKey<P>,
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>
  ): void => {
    messagesCachedStore?.set(key, messageWithMeta);
  };

  protected _checkMessageInKeyValueStoreCache = (
    messageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>,
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>
  ): boolean => {
    const messageKey = messageWithMeta.key;

    if (!messageKey) {
      return false;
    }
    if (messageKey instanceof Error) {
      return false;
    }

    const messageWithMetaCached = messagesCachedStore?.get(messageKey);

    return this._checkWhetherMessgeWithMetaInstancesEqual(messageWithMeta.message, messageWithMetaCached?.message);
  };

  protected _addMessageInFeedStoreCache = (
    messageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>,
    // for key-value store it will be the key
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD>
  ): void => {
    messagesCachedStore?.set(messageAddress, messageWithMeta);
  };

  protected _checkMessageInFeedStoreCache = (
    messageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>,
    messagesCachedStore: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD>
  ): boolean => {
    const { messageAddress } = messageWithMeta;

    if (!messageAddress) {
      return false;
    }
    if (messageAddress instanceof Error) {
      return false;
    }

    const messageWithMetaCached = messagesCachedStore.get(messageAddress);

    return this._checkWhetherMessgeWithMetaInstancesEqual(messageWithMeta.message, messageWithMetaCached?.message);
  };

  protected _removeKeyValueFromKVStoreCache = (
    messagesCache: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>,
    key: TSwarmStoreDatabaseEntityKey<P>
  ): void => {
    messagesCache?.delete(key);
  };

  protected _emitCacheUpdatingIsInProgress(): void {
    this._emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING);
  }

  protected _emitCacheUpdated(messages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>): void {
    this._emitter.emit(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, messages);
  }

  protected _emitDbMessagesWithAddedMessagesCaheUpdated(): void {
    if (this._messagesCached) {
      this._emitCacheUpdated(this._messagesCached);
    }
  }

  protected _setMessagesCacheUpdateInProgress = (promisePending: Promise<void>): void => {
    this._pendingMessagesUpdatePromise = promisePending;
    this._emitCacheUpdatingIsInProgress();
  };

  protected _unsetCacheUpdateInProgress = (): void => {
    this._pendingMessagesUpdatePromise = undefined;
  };

  protected _setNewCacheUpdatePlanned = (): void => {
    this._isSwarmMessagesCacheUpdateRequested = true;
  };

  protected _unsetNewCacheUpdatePlanned = (): void => {
    this._isSwarmMessagesCacheUpdateRequested = false;
  };

  /**
   * Whether the limit of failed attempts reached
   *
   * @param {number} queryAttemtNumber
   * @returns {boolean}
   */
  protected _whetherMaxDatabaseQueriesAttemptsFailed = (queryAttemtNumber: number): boolean => {
    return queryAttemtNumber >= SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_MAX_PAGE_QUERY_ATTEMPTS_DEFAULT;
  };

  /**
   * Get options for query for a batch of messages
   *
   * @param {number} messagesCountToQuery
   * @param {Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>>} messagesReadAddressesOrKeysToExclude - messages identifiers to exclude from the result
   * @returns {TSwarmStoreDatabaseIteratorMethodArgument<P>}
   */
  protected _getDatabaseMessagesToReadQueryOptionsWithMessagesToExclude = (
    messagesCountToQuery: number,
    messagesReadAddressesOrKeysToExclude: Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>>
  ): TSwarmStoreDatabaseIteratorMethodArgument<P, DbType> => {
    return {
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: messagesCountToQuery,
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.neq]: messagesReadAddressesOrKeysToExclude as string[],
    } as TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>;
  };

  /**
   * Returns options to query database and to include only messages with
   * identity passed in argument.
   *
   * @protected
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _getDatabaseMessagesToReadQueryOptionsWithMessagesToInclude = (
    messagesReadAddressesOrKeysToInclude: Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>>
  ): TSwarmStoreDatabaseIteratorMethodArgument<P, DbType> => {
    return {
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: messagesReadAddressesOrKeysToInclude as string[],
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
  protected _getItemsCountToReadForIdlePeriod = (timeAvailToRun: number): number => {
    // the maximum messages to read for max time remaining THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS
    // is equal to SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT. We need to calculate
    // messages to read for timeAvailToRun.
    const percentAcordingToFreeTime = round(timeAvailToRun / THROTTLING_UTILS_IDLE_CALLBACK_TIME_REMAINING_MAX_MS, 2);

    return round(SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_IDLE_PERIOD_OF_50_MS * percentAcordingToFreeTime, 0);
  };
  /**
   * Returns a uniqiue global address for the message
   * by it's description
   *
   * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<P>} message
   * @returns {(TSwarmStoreDatabaseEntityUniqueAddress<P> | undefined)}
   */
  protected _getMessageAddressByDescription = (
    message: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>
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
    message: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>
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
    messagesWithMeta: Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>
  ): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> => {
    if (this._isKeyValueDatabase) {
      return this._mapMessagesDescriptionsToKVStoreMap(messagesWithMeta) as TSwarmMessageDatabaseMessagesCached<P, DbType, MD>;
    }
    return this._mapMessagesDescriptionsToFeedStore(messagesWithMeta) as TSwarmMessageDatabaseMessagesCached<P, DbType, MD>;
  };

  /**
   * Checks whether the count is more than the limit
   * of messages read.
   *
   * @param {number} messagesCount
   * @returns {boolean}
   */
  protected _whetherMessagesLimitReached = (messagesCount: number): boolean => {
    return messagesCount > SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_LIMIT_DEFAULT;
  };

  protected _getMessageWithMeta(
    dbName: string,
    message: MD,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> {
    return {
      message,
      dbName,
      messageAddress,
      key,
    };
  }

  protected _unsetKeyInCacheKVStore(key: TSwarmStoreDatabaseEntityKey<P>): void {
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

  protected _setFullMessagesReadFromDatabaseToCache(): void {
    this._whetherMessagesListContainsAllMessages = true;
  }

  protected _unsetFullMessagesReadFromDatabaseToCache(): void {
    this._whetherMessagesListContainsAllMessages = false;
  }

  /**
   * Perform query to collect messages from the database.
   *
   * @protected
   * @param {TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>} queryOptions - options for querying the
   * @memberof SwarmMessagesDatabase
   * @returns {Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P>>>}
   * @throws
   */
  protected async _performMessagesCacheCollectPageRequest(
    queryOptions: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>> {
    if (!this._checkIsReady()) {
      throw new Error('The instance is not ready');
    }
    let queryAttempt = 0;
    let messages: Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined> | undefined;
    while (!messages && !this._whetherMaxDatabaseQueriesAttemptsFailed(queryAttempt)) {
      try {
        messages = (await this._dbInstance.collectWithMeta(this._dbName, queryOptions)) as Array<
          ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined
        >;
      } catch (err) {
        console.error(new Error(`_performMessagesCachePageRequest::failed::attempt::${queryAttempt}`), err);
        await this._requestTimeBrowserIdle();
      } finally {
        queryAttempt++;
      }
    }
    if (!messages) {
      throw new Error('Failed to read a batch of messages from the database cause of unknown reason');
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
  protected _mapMessagesDescriptionsToKVStoreMap<MWM extends ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>>(
    messagesWithMeta: Array<MWM | undefined>
  ): TSwarmMessageDatabaseMessagesCached<ESwarmStoreConnector.OrbitDB, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD> {
    const messagesMap = new Map<TSwarmStoreDatabaseEntityKey<P>, MWM>();

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
  protected _mapMessagesDescriptionsToFeedStore<MWM extends ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>>(
    messagesWithMeta: Array<MWM | undefined>
  ): TSwarmMessageDatabaseMessagesCached<ESwarmStoreConnector.OrbitDB, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD> {
    const messagesMap = new Map<TSwarmStoreDatabaseEntityAddress<P>, MWM>();

    messagesWithMeta.forEach((messageDescription) => {
      if (!messageDescription) {
        console.warn('Swarm message description is absent');
        return;
      }
      const messageAddress = this._getMessageAddressByDescription(messageDescription);

      if (messageAddress) {
        messagesMap.set(messageAddress, messageDescription);
      }
    });
    return messagesMap;
  }

  protected _getMessagesReadKeys(
    messagesCache: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>
  ): Array<TSwarmStoreDatabaseEntityKey<P>> {
    return Array.from(messagesCache.keys());
  }

  protected _getMessagesReadAddresses(
    messagesCache: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD>
  ): Array<TSwarmStoreDatabaseEntityKey<P>> {
    return Array.from(messagesCache.keys());
  }

  protected _getMessagesReadKeysOrAddresses(
    messagesCache: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>
  ): Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>> {
    if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
      return this._getMessagesReadKeys(messagesCache) as Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>>;
    } else if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
      return this._getMessagesReadAddresses(messagesCache) as Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>>;
    }
    return [];
  }

  protected _createMessagesCacheUpdatingBatchPromise = (): (() => void) => {
    let resolve: () => void;
    this._messagesCacheUpdatingBatch = new Promise((res, rej) => {
      resolve = res;
      setTimeout(rej, SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_BATCH_TIMEOUT_MS);
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
  protected async _getItemsCountCanBeReadForCurrentIdlePeriod(): Promise<number> {
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
   * Checks whether all items read from the database.
   * Because in OrbitDB's store there is no
   * way at now to know how many keys with non-empty
   * data are exist, than the only way is to read items
   * and check some conditions to understand whether all
   * items were read. Also when no items were returned, that
   * doesn't mean that there is no more messages in storage,
   * because an empty data returns also for "delete" messages.
   *
   * @param {number} expectedMessagesOverallToReadAtTheBatchCount -
   * @param {number} expectedNewMessagesCountToReadAtTheBatchCount -
   * @param {number} resultedNewMessagesCountReadAtTheBatchCount -
   * @returns {boolean}
   */
  protected _whetherMessagesReadLessThanRequested = (
    expectedMessagesOverallToReadAtTheBatchCount: number,
    expectedNewMessagesToReadAtTheBatchCount: number,
    resultedNewMessagesReadAtTheBatchCount: number
  ): boolean => {
    return (
      expectedMessagesOverallToReadAtTheBatchCount > 50 &&
      expectedNewMessagesToReadAtTheBatchCount > 6 &&
      !resultedNewMessagesReadAtTheBatchCount
    );
  };

  protected getMessagesIdentitiesToExcludeAtCacheUpdateBatch(
    messagesCachedStoreTemp: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>
  ): TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>[] {
    const entriesExists = (messagesCachedStoreTemp.entries || []) as TSwarmMessageDatabaseMessagesCached<P, DbType, MD>;
    return this._getMessagesReadKeysOrAddresses(entriesExists);
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
    messagesCachedStoreTemp: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>
  ): Promise<void> {
    // current page
    let pageToQueryIndex = 0;
    // overall messages read count
    let messagesReadCount = 0;
    // count messages to read from the database.
    let messagesCountToReadAtTheBatch = 0;
    // limit of messages count in the cached was reached
    let whetherMessagesLimitToReadReached = false;
    // whether all messages were read from the databse
    let whetherFullMessagesRead = false;
    const allMessagesRead = new Map();

    while (!whetherMessagesLimitToReadReached && !whetherFullMessagesRead) {
      this._checkIsReady();

      const resolveMessagesUpatingBatchPromise = this._createMessagesCacheUpdatingBatchPromise();
      const currentPageItemsToReadCount = await this._getItemsCountCanBeReadForCurrentIdlePeriod();

      if (!currentPageItemsToReadCount) {
        // nothing to read at this iteration
        continue;
      }
      pageToQueryIndex = pageToQueryIndex + 1;
      messagesCountToReadAtTheBatch = messagesReadCount + currentPageItemsToReadCount;
      whetherMessagesLimitToReadReached = this._whetherMessagesLimitReached(messagesCountToReadAtTheBatch);

      if (whetherMessagesLimitToReadReached) {
        // add one more to define if the database
        // contains some more data
        messagesCountToReadAtTheBatch = messagesCountToReadAtTheBatch + 1;
      }

      const messagesIdentitiesToExclude = this.getMessagesIdentitiesToExcludeAtCacheUpdateBatch(messagesCachedStoreTemp);
      const queryOptions = this._getDatabaseMessagesToReadQueryOptionsWithMessagesToExclude(
        messagesCountToReadAtTheBatch,
        messagesIdentitiesToExclude
      );
      const messagesReadAtBatch = await this._performMessagesCacheCollectPageRequest(queryOptions);
      const messagesReadAtBatchMapped = this._mapMessagesWithMetaToStorageRelatedStructure(messagesReadAtBatch);
      // if read less than requested it means that
      // all messages were read

      // TODO - provide a custom function to define it
      whetherFullMessagesRead = this._whetherMessagesReadLessThanRequested(
        messagesCountToReadAtTheBatch,
        currentPageItemsToReadCount,
        getItemsCount(messagesReadAtBatchMapped)
      );
      // TODO - ORBIT DB counts also removed items, so we can request more than
      // it will return
      // getItemsCount(messagesReadAtBatch) < currentPageItemsToRead;
      messagesCachedStoreTemp.update(messagesReadAtBatchMapped);
      // DEBUG--
      messagesReadAtBatchMapped.forEach((value, key) => {
        allMessagesRead.set(key, value);
      });
      if (allMessagesRead.size > Number(messagesCachedStoreTemp?.entries?.size)) {
        throw new Error('Read count is not equal');
      }
      if (whetherFullMessagesRead) {
        debugger;
      }
      // --DEBUG
      console.log(messagesCachedStoreTemp);
      resolveMessagesUpatingBatchPromise();
      messagesReadCount = messagesCountToReadAtTheBatch;
    }
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
  protected async _waitForCurrentMessagesUpdate(): Promise<void> {
    if (this._pendingMessagesUpdatePromise) {
      return this._pendingMessagesUpdatePromise;
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
  protected async _planNewCacheUpdate(): Promise<void> {
    this._setNewCacheUpdatePlanned();
    // await when the current iteration will be over
    await this._waitForCurrentMessagesUpdate();
    this._checkIsReady();
    if (!this._pendingMessagesUpdatePromise) {
      // start a new interaction if there is no one active
      this._unsetNewCacheUpdatePlanned();
      try {
        return await this._runNewCacheUpdate();
      } catch (err) {
        console.error(`Failed to plan a new cache update: ${err.message}`, err);
        await delay(SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_FAILED_RETRY_DELAY_MS);
        return await this._planNewCacheUpdate();
      }
    }
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
  protected async _runNextCacheUpdateIterationIfNecessary(): Promise<void> {
    if (this._isSwarmMessagesCacheUpdateRequested) {
      // uset that a cache update required
      this._unsetNewCacheUpdatePlanned();
      // and run the next cache update
      await this._runNewCacheUpdate();
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
    messagesTempStore: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>
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
  protected _updateMessagesCachedStoreByLinkedTempStoreMessages(): boolean {
    if (this._checkIsReady()) {
      const hasMessagesUpdated = this._messagesCachedStore.updateByTempStore();

      this._messagesCachedStore.unlinkWithTempStore();
      return hasMessagesUpdated;
    }
    return false;
  }

  /**
   * Runs swarm messages cache update and the next iteration
   * if it's planned.
   *
   * @protected
   * @returns {(Promise<TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined>)}
   * @memberof SwarmMessagesDatabase
   */
  protected async _runNewCacheUpdate(): Promise<void> {
    try {
      const messagesCachedTempStore = this._createMessagesCachedStorage(true);

      this._linkTempStoreToMessagesCachedStore(messagesCachedTempStore);

      const promiseMessagesUpdating = this._performMessagesReadingToUpdateCache(messagesCachedTempStore);

      this._setMessagesCacheUpdateInProgress(promiseMessagesUpdating);
      await promiseMessagesUpdating;

      let hasMessagesUpdated = this._updateMessagesCachedStoreByLinkedTempStoreMessages();

      hasMessagesUpdated = hasMessagesUpdated || (await this._runDefferedPartialCacheUpdateAfterCacheUpdate());
      if (hasMessagesUpdated) {
        // emit only if any message was updated in the cache store
        this._emitDbMessagesWithAddedMessagesCaheUpdated();
      }
    } catch (err) {
      console.error(`Failed to update messages cache: ${err.message}`, err);
      throw err;
    } finally {
      this._unsetCacheUpdateInProgress();
      void this._runNextCacheUpdateIterationIfNecessary();
    }
  }

  /**
   * Request database for all messages.
   *
   * @protected
   * @returns {Promise<TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined>}
   * @memberof SwarmMessagesDatabase
   */
  protected async _updateMessagesCache(): Promise<void> {
    this._checkIsReady();
    if (this._pendingMessagesUpdatePromise) {
      return this._planNewCacheUpdate();
    }
    this._unsetNewCacheUpdatePlanned();
    return this._runNewCacheUpdate();
  }

  protected _addSwarmMessageWithMetaToCachedStore(swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P, MD>): boolean {
    if (!this._checkIsReady()) {
      return false;
    }
    return this._messagesCachedStore.add(
      getMessageDescriptionForMessageWithMeta<P, DbType, MD>(swarmMessageWithMeta, this._dbType)
    );
  }

  protected _addMessageToCachedStore(swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P, MD>): boolean {
    const result = this._addSwarmMessageWithMetaToCachedStore(swarmMessageWithMeta);

    this._runDefferedPartialCacheUpdateDebounced();
    return result;
  }

  protected _removeMessageFromCachedStore = async (
    messageUniqAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<void> => {
    if (!this._checkIsReady()) {
      return;
    }

    const result = this._messagesCachedStore.remove(
      createMessagesMetaByAddressAndKey<P, DbType>(messageUniqAddress, key, this._dbType)
    );

    this._runDefferedPartialCacheUpdateDebounced();
    return result;
  };

  protected _getMessagesDefferedUpdateWithinCacheUpdateBatch(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>> | undefined {
    return this._messagesCachedStore?.getDefferedReadAfterCurrentCacheUpdateBatch();
  }

  protected _getDefferedUpdateAfterCacheUpdateProcess(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>> | undefined {
    return this._messagesCachedStore?.getDefferedRead();
  }

  protected _resetMessagesDeffered(): void {
    this._messagesCachedStore?.resetDeffered();
  }

  protected _resetMessagesDefferedWithinBatch(): void {
    this._messagesCachedStore?.resetDefferedAfterCurrentCacheUpdateBatch();
  }

  protected _getAndResetMessagesDefferedUpdateWithinCaheUpdateBatch():
    | Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>
    | undefined {
    const messagesMetaToUpdate = this._getMessagesDefferedUpdateWithinCacheUpdateBatch();

    this._resetMessagesDefferedWithinBatch();
    return messagesMetaToUpdate;
  }

  protected _getAndResetDefferedUpdateAfterCacheUpdateProcess(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>> | undefined {
    const messagesMetaToUpdate:
      | Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>
      | undefined = this._getDefferedUpdateAfterCacheUpdateProcess();

    this._resetMessagesDeffered();
    this._resetMessagesDefferedWithinBatch();
    return messagesMetaToUpdate;
  }

  /**
   * Run messages update in the cache batch read.
   *
   * @protected
   * @param {TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>[]} messagesMetaToRead
   * @returns {Promise<TSwarmMessageDatabaseMessagesCached<P, DbType>>}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected async _runDefferedMessageReadBatch(
    messagesMetaToRead: TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>[]
  ): Promise<TSwarmMessageDatabaseMessagesCached<P, DbType, MD>> {
    const options = this._getDatabaseMessagesToReadQueryOptionsWithMessagesToInclude(messagesMetaToRead);
    const messagesReadAtBatch = await this._performMessagesCacheCollectPageRequest(options);
    return this._mapMessagesWithMetaToStorageRelatedStructure(messagesReadAtBatch);
  }

  /**
   * Return a part of messages which must be updated at the
   * next batch.
   *
   * @protected
   * @param {TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>[]} messagesMetaToRead
   * @param {number} messagesCountReadAtPreviousBatches
   * @param {number} messagesCountToReadAtBatch
   * @returns {TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>[]}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected _getMessagesMetaToReadAtBatch(
    messagesMetaToRead: TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>[],
    messagesCountReadAtPreviousBatches: number,
    messagesCountToReadAtBatch: number
  ): TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>[] {
    return messagesMetaToRead.slice(messagesCountReadAtPreviousBatches, messagesCountToReadAtBatch);
  }

  /**
   * Read messages deffered by a metadata of them.
   *
   * @protected
   * @param {Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>} messagesForUpdateMeta
   * @param {ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DbType>} cacheStore
   * @param {DbType} dbType
   * @returns {Promise<boolean>}
   * @memberof SwarmMessagesDatabaseCache
   */
  protected async _runDefferedMessagesUpdateInCache<DT extends DbType>(
    messagesForUpdateMeta: Set<ISwarmMessagesDatabaseMesssageMeta<P, DT>>,
    cacheStore: ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DT, MD>,
    dbType: DT
  ): Promise<boolean> {
    let messagesCountAlreadyRead = 0;
    let hasMessagesUpdated = false;
    const messagesMetaToRead = getMessagesUniqIndexesByMeta(messagesForUpdateMeta, dbType);

    while (messagesCountAlreadyRead < messagesMetaToRead.length) {
      const messagesCountToReadAtBatch = await this._getItemsCountCanBeReadForCurrentIdlePeriod();

      if (!messagesCountToReadAtBatch) {
        continue;
      }

      const messagesMetaToReadAtBatch = this._getMessagesMetaToReadAtBatch(
        messagesMetaToRead,
        messagesCountAlreadyRead,
        messagesCountToReadAtBatch
      );
      const messagesReadAtBatch = await this._runDefferedMessageReadBatch(messagesMetaToReadAtBatch);
      const hasMessagesUpdatedAtBatch = cacheStore.update(messagesReadAtBatch);
      hasMessagesUpdated = hasMessagesUpdated || hasMessagesUpdatedAtBatch;
      messagesCountAlreadyRead += messagesCountToReadAtBatch;
      console.log('swarmMessagesDatabaseCache::messagesCountAlreadyRead', messagesCountAlreadyRead);
    }
    return hasMessagesUpdated;
  }

  protected _setActiveDefferedPartialCacheUpdate<ItemType extends T>(
    activeUpdate: ReturnType<
      SwarmMessagesDatabaseCache<P, ItemType, DbType, DBO, MD, SMSM, DCO>['_runDefferedMessagesUpdateInCache']
    >
  ): void {
    this._defferedPartialCacheUpdatePromise = activeUpdate;
  }

  protected _unsetActiveDefferedPartialCacheUpdate(): void {
    this._defferedPartialCacheUpdatePromise = undefined;
  }

  protected async _runDefferedPartialCacheUpdateForCachedMessagesStore(
    messagesMetaToUpdate: Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>,
    messagesCachedStore: ISwarmMessagesDatabaseMessagesCacheStoreNonTemp<P, DbType, MD>,
    dbType: DbType
  ): Promise<boolean> {
    const activeCachePartialUpdate = this._runDefferedMessagesUpdateInCache(messagesMetaToUpdate, messagesCachedStore, dbType);

    this._setActiveDefferedPartialCacheUpdate(activeCachePartialUpdate);

    const hasMessagesUpdated = await activeCachePartialUpdate;
    this._unsetActiveDefferedPartialCacheUpdate();
    return hasMessagesUpdated;
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
  protected _runDefferedPartialCacheUpdate = async (
    messagesMetaToUpdate: Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>
  ): Promise<boolean> => {
    if (!this._checkIsReady()) {
      return false;
    }
    return this._runDefferedPartialCacheUpdateForCachedMessagesStore(
      messagesMetaToUpdate,
      this._messagesCachedStore,
      this._dbType
    );
  };

  protected async _runDefferedPartialCacheUpdateAfterCacheUpdate(): Promise<boolean> {
    if (this._isDefferedMessagesUpdateActive) {
      // if it's already in progress
      await this._defferedPartialCacheUpdatePromise;
    }
    const messagesUpdate = this._getAndResetDefferedUpdateAfterCacheUpdateProcess();

    if (messagesUpdate?.size) {
      return this._runDefferedPartialCacheUpdate(messagesUpdate);
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected _runDefferedPartialCacheUpdateDebounced = debounce(async (): Promise<void> => {
    if (this._isDefferedMessagesUpdateActive) {
      // if it's already in progress
      return;
    }
    const messagesToUpdate = this._getAndResetMessagesDefferedUpdateWithinCaheUpdateBatch();

    if (messagesToUpdate?.size) {
      if (await this._runDefferedPartialCacheUpdate(messagesToUpdate)) {
        // if has any updated messages emit the event that the cache have updated
        this._emitDbMessagesWithAddedMessagesCaheUpdated();
      }
      this._runDefferedPartialCacheUpdateDebounced();
    }
  }, SWARM_MESSAGES_DATABASE_CACHE_ADD_TO_CACHE_MESSAGES_PENDING_DEBOUNCE_MS);
}
