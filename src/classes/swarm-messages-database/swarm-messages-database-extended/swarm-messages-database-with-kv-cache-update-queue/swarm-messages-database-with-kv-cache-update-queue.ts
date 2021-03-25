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
import { ESwarmMessageStoreEventNames } from '../../../swarm-message-store/swarm-message-store.const';
import { ESwarmMessagesDatabaseOperation } from '../../swarm-messages-database.const';
import { CONST_DATABASE_KEY_PARTS_SAFE_DELIMETER } from 'const/const-database/const-database-keys';

// TODO - use this instance intead of swarm-messages-database
/**
 * This class resolves issue with KV database.
 * When NEW_MESSAGE and DELETE_MESSAGE events are got
 * cache is updated by adding/removing of a message stored
 * in the key. But the message added or delet message event
 * might be older than the curent value stored in the cache.
 * So, we need to update KEY by an actual value. Therefore
 * we need to read value for the KEY and put the result
 * into the cache.
 * And also we need to emit the NEW_MESSAGE event only for
 * messages that are really new.
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

  private readonly __newMessagesEmitted = new Set<string>();

  /**
   * Interval deffered keys values updating in the cahce related
   *
   * @private
   * @memberof SwarmMessagesDatabaseWithKVCacheUpdateQueue
   */
  private __intervalDefferedKeysValuesUpdateInCacheRelatedToStorage: NodeJS.Timeout | undefined;

  async connect(options: OPT): Promise<void> {
    await super.connect(options);
    this.__startIntervalDefferedKeysValuesUpdateInCacheRelatedToStorage();
  }

  async close(): Promise<void> {
    await super.close();
    this.__stopIntervalDefferedKeysValuesUpdateInCacheRelatedToStorage();
  }

  async drop(): Promise<void> {
    await super.drop();
    this.__stopIntervalDefferedKeysValuesUpdateInCacheRelatedToStorage();
  }

  protected _handleDatabaseNewMessage = async (
    dbName: DBO['dbName'],
    message: MD,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<void> => {
    if (this._isKeyValueDatabase) {
      if (!key) {
        throw new Error('Key should exists for a message in a KV database');
      }
      this._addKeyInMessagesDefferedReadQueue(key);
      return;
    }
    return await super._handleDatabaseNewMessage(dbName, message, messageAddress, key);
  };

  protected _handleDatabaseDeleteMessage = async (
    dbName: DBO['dbName'],
    userID: TSwarmMessageUserIdentifierSerialized,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // the global unique address (hash) of the DELETED message in the swarm
    messageDeletedAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrHash: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<void> => {
    if (this._isKeyValueDatabase) {
      if (!keyOrHash) {
        throw new Error('Key should exists for a message in a KV database');
      }

      const dbKey = (keyOrHash as unknown) as TSwarmStoreDatabaseEntityKey<P>;

      this._addOperationUnderMessageToListOfHandled(ESwarmMessagesDatabaseOperation.DELETE, messageAddress, dbKey);
      try {
        if (!(await this._whetherAMessageExistsForDbKey(dbKey))) {
          this._emitDeleteMessageEventIfHaventBeenEmittedBefore(dbName, userID, messageAddress, messageDeletedAddress, dbKey);
        }
      } catch (err) {
        this._deleteOperationUnderMessageFromListOfHandled(ESwarmMessagesDatabaseOperation.DELETE, messageAddress, dbKey);
        throw err;
      }
      return;
    }
    return await super._handleDatabaseDeleteMessage(dbName, userID, messageAddress, messageDeletedAddress, keyOrHash);
  };

  /**
   * Returns params for querying the database to read only
   * the one value for the key or multiple values for multiple
   * keys.
   *
   * @param {TSwarmStoreDatabaseEntityKey<P> | TSwarmStoreDatabaseEntityKey<P>[] |} keyOrKeys - a key for the database value
   */
  protected _getQueryParamsToReadValueForDbKeys(
    keyOrKeys: TSwarmStoreDatabaseEntityKey<P>[] | TSwarmStoreDatabaseEntityKey<P>
  ): TSwarmStoreDatabaseIteratorMethodArgument<P, DbType> {
    // TODO - make it universally for any database, not only for OrbitDb
    return ({
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: keyOrKeys,
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
  protected _addKeyInMessagesDefferedReadQueue(key: TSwarmStoreDatabaseEntityKey<P>): void {
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
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @memberof SwarmMessagesDatabase
   */
  protected _handleMessageForKeyInKVDatabase(key: TSwarmStoreDatabaseEntityKey<P>): void {
    this._addKeyInMessagesDefferedReadQueue(key);
  }

  /**
   * Constructs a unique hash for an event related to a swarm message.
   *
   * @protected
   * @param {ESwarmMessageStoreEventNames} eventType
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @param {MD} [message]
   * @returns {string}
   * @memberof SwarmMessagesDatabaseWithKVCacheUpdateQueue
   */
  protected _getUniqueHashForTheEventTypeForAMessage(
    eventType: ESwarmMessageStoreEventNames,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>,
    message?: MD
  ): string {
    const prefix = String(eventType);
    const postfix = this._getUniqueHashForMessageMetaInfo(messageAddress, key, message);
    return `${prefix}${CONST_DATABASE_KEY_PARTS_SAFE_DELIMETER}${postfix}`;
  }

  /**
   * Add message to the list of a messages uniq id's which
   * were emitted as a new before
   *
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @param {MD} [message] - optional cause for DELETE messages
   * a message object by itself may be not exists.
   */
  protected _addMessageEventToListOfEmitted = (
    eventType: ESwarmMessageStoreEventNames,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>,
    message?: MD
  ): void => {
    const uniqueHash = this._getUniqueHashForTheEventTypeForAMessage(eventType, messageAddress, key, message);
    this.__newMessagesEmitted.add(uniqueHash);
  };

  /**
   * Checks whether the message is already been emitted as a new message
   *
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @param {MD} [message] - optional cause for DELETE messages
   * a message object by itself may be not exists.
   * @returns {boolean}
   */
  protected _hasMessageEventAlreadyBeenEmitted = (
    messageType: ESwarmMessageStoreEventNames,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>,
    message?: MD
  ): boolean => {
    const uniqueHash = this._getUniqueHashForTheEventTypeForAMessage(messageType, messageAddress, key, message);
    return this.__newMessagesEmitted.has(uniqueHash);
  };

  /**
   * Emit event that a new messsage has been received.
   *
   * @protected
   * @param {DBO['dbName']} dbName
   * @param {MD} message
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @memberof SwarmMessagesDatabase
   */
  protected _emitNewMessageEventIfHaventBeenEmittedBefore(
    dbName: DBO['dbName'],
    message: MD,
    // the global unique address (hash) of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): void {
    const eventName = ESwarmMessageStoreEventNames.NEW_MESSAGE;

    if (this._hasMessageEventAlreadyBeenEmitted(eventName, messageAddress, key, message)) {
      return;
    }
    this._emitNewMessageEvent(dbName, message, messageAddress, key);
    this._addMessageEventToListOfEmitted(eventName, messageAddress, key, message);
  }

  /**
   * Emit event that a new messsage has been received.
   *
   * @protected
   * @param {DBO['dbName']} dbName
   * @param {MD} message
   * @param {TSwarmStoreDatabaseEntityAddress<P>} messageAddress
   * @param {TSwarmStoreDatabaseEntityKey<P>} [key]
   * @memberof SwarmMessagesDatabase
   */
  protected _emitDeleteMessageEventIfHaventBeenEmittedBefore(
    dbName: DBO['dbName'],
    userID: TSwarmMessageUserIdentifierSerialized,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // the global unique address (hash) of the DELETED message in the swarm
    messageDeletedAddress: TSwarmStoreDatabaseEntityAddress<P> | undefined,

    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrHash: TSwarmStoreDatabaseEntityKey<P>
  ): void {
    const eventName = ESwarmMessageStoreEventNames.DELETE_MESSAGE;

    if (this._hasMessageEventAlreadyBeenEmitted(eventName, messageAddress, keyOrHash)) {
      return;
    }
    this._emitDeleteMessageEvent(
      dbName,
      userID,
      messageAddress,
      messageDeletedAddress as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
        ? TSwarmStoreDatabaseEntityAddress<P> | undefined
        : TSwarmStoreDatabaseEntityAddress<P>,
      // TODO - resolve type casting
      (keyOrHash as unknown) as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
        ? TSwarmStoreDatabaseEntityKey<P>
        : undefined
    );
    this._addMessageEventToListOfEmitted(eventName, messageAddress, keyOrHash);
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
  protected async __emitMessagesUpdatesAndUpdateCacheIfExistsByRequestResult(
    requestValuesWithMetadataForKeysResult: (
      | ISwarmMessageStoreMessagingRequestWithMetaResult<
          P,
          Exclude<Exclude<T, T>, ISwarmMessageInstanceEncrypted> | Exclude<Exclude<MD, T>, ISwarmMessageInstanceEncrypted>
        >
      | undefined
    )[]
  ): Promise<void> {
    const promisesPending: Promise<void>[] = [];
    requestValuesWithMetadataForKeysResult.forEach((requestResult): void => {
      if (!requestResult) {
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
        if (this._hasMessageAlreadyBeenHandled(messageAddress, key, message)) {
          return;
        }
        this._emitNewMessageEventIfHaventBeenEmittedBefore(dbName, message, messageAddress, key);
        this._addOperationUnderMessageToListOfHandled(ESwarmMessagesDatabaseOperation.ADD, messageAddress, key, message);
        if (this._isMessagesCacheExists) {
          promisesPending.push(
            this._createAndAddSwarmMessageWithMetaToMessagesCacheByMessageAndMetaRelatedTo(dbName, message, messageAddress, key)
          );
        }
      } catch (err) {
        console.error('Failed to update value in cache');
        console.error(err);
      }
    });
    if (promisesPending.length) {
      await Promise.all(promisesPending);
    }
  }

  protected async _whetherAMessageExistsForDbKey(dbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<boolean> {
    const databaseQueryForReadingKeys = this._getQueryParamsToReadValueForDbKeys(dbKey);
    const requestValuesWithoutMetadataForKeysResult = await this.collect(databaseQueryForReadingKeys);

    return !requestValuesWithoutMetadataForKeysResult?.length || !!requestValuesWithoutMetadataForKeysResult[0];
  }

  protected async _readMessagesByDefferedKeysQueueKVStorage(): Promise<void> {
    const keys = this.__dbKeysForDefferedValuesUpdateInCacheQueue;
    const databaseQueryForReadingKeys = this._getQueryParamsToReadValueForDbKeys(keys);

    this._resetKeysQueuedForDefferedCacheUpdate();

    try {
      const requestValuesWithMetadataForKeysResult = await this.collectWithMeta(databaseQueryForReadingKeys);

      await this.__emitMessagesUpdatesAndUpdateCacheIfExistsByRequestResult(requestValuesWithMetadataForKeysResult);
    } catch (err) {
      console.error('The error has occurred during updating the cache');
      console.error(err);
      keys.forEach((key) => this._addKeyInMessagesDefferedReadQueue(key));
    }
  }

  private __startIntervalDefferedKeysValuesUpdateInCacheRelatedToStorage(): void {
    this.__intervalDefferedKeysValuesUpdateInCacheRelatedToStorage = setInterval(
      () => this._readMessagesByDefferedKeysQueueKVStorage(),
      SWARM_MESSAGES_DATABASE_WITH_KV_CACHE_UPDATE_QUEUE_INTERVAL_UPDATING_DEFFERED_KEYS_IN_CACHE_MS
    );
  }

  private __stopIntervalDefferedKeysValuesUpdateInCacheRelatedToStorage(): void {
    const intervalDefferedKeysValuesUpdateInCacheRelatedToStorage = this
      .__intervalDefferedKeysValuesUpdateInCacheRelatedToStorage;
    if (intervalDefferedKeysValuesUpdateInCacheRelatedToStorage) {
      clearInterval(intervalDefferedKeysValuesUpdateInCacheRelatedToStorage);
    }
  }
}
