import assert from 'assert';
import { SwarmStore } from '../swarm-store-class/swarm-store-class';
import {
  ESwarmStoreConnector,
  ESwarmStoreEventNames,
} from '../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageDatabaseConstructors,
} from './swarm-message-store.types';
import {
  ISwarmMessageConstructor,
  TSwarmMessageInstance,
} from '../swarm-message/swarm-message-constructor.types';
import {
  ESwarmMessageStoreEventNames,
  SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT,
} from './swarm-message-store.const';
import { extend } from '../../utils/common-utils/common-utils-objects';
import {
  TSwarmStoreDatabaseIteratorMethodAnswer,
  TSwarmStoreDatabaseMethodAnswer,
  TSwarmStoreDatabaseEntityAddress,
} from '../swarm-store-class/swarm-store-class.types';
import {
  TSwarmStoreDatabaseMethodArgument,
  TSwarmStoreDatabaseIteratorMethodArgument,
} from '../swarm-store-class/swarm-store-class.types';
import { TSwarmStoreConnectorOrbitDbDatabaseMethodNames } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseMethod,
} from '../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessageStoreConnectReturnType,
  ISwarmMessageStoreOptions,
} from './swarm-message-store.types';
import {
  ISwarmMessageStoreEvents,
  ISwarmMessageStore,
} from './swarm-message-store.types';
import { swarmMessageStoreUtilsConnectorOptionsProvider } from './swarm-message-store-utils/swarm-message-store-utils-connector-options-provider';
import { getMessageConstructorForDatabase } from './swarm-message-store-utils/swarm-message-store-utils-common/swarm-message-store-utils-common';
import {
  TSwarmMessageStoreMessageId,
  ISwarmMessageStoreDeleteMessageArg,
} from './swarm-message-store.types';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
  ISwarmMessageInstanceEncrypted,
  TSwarmMessageConstructorBodyMessage,
} from '../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../swarm-store-class/swarm-store-class.types';
import { swarmMessageStoreUtilsExtendDatabaseOptionsWithAccessControl } from './swarm-message-store-utils/swarm-message-store-utils-connector-options-provider/swarm-message-store-utils-connector-options-provider';

import {
  ISwarmMessageStoreMessagingRequestWithMetaResult,
  ISwarmMessageStoreSwarmMessageMetadata,
  TSwarmMessageStoreEntryRaw,
  ISwarmMessageStoreDatabaseType,
} from './swarm-message-store.types';
import {
  TSwarmStoreDatabaseRequestMethodReturnType,
  TSwarmStoreDatabaseEntityKey,
} from '../swarm-store-class/swarm-store-class.types';
import { StorageProviderInMemory } from '../storage-providers/storage-in-memory-provider/storage-in-memory-provider';
import { StorageProvider } from '../storage-providers/storage-providers.types';
import {
  ISwarmMessageStoreUtilsMessagesCache,
  ISwarmMessageStoreUtilsMessagesCacheOptions,
} from './swarm-message-store-utils/swarm-message-store-utils-messages-cache/swarm-message-store-utils-messages-cache.types';
import { SwarmMessageStoreUtilsMessagesCache } from './swarm-message-store-utils/swarm-message-store-utils-messages-cache/swarm-message-store-utils-messages-cache';
import {
  EOrbitDbFeedStoreOperation,
  ESwarmStoreConnectorOrbitDbDatabaseType,
} from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ESwarmStoreConnectorOrbitDbDatabaseMethodNames } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db';

export class SwarmMessageStore<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
>
  extends SwarmStore<
    P,
    TSwarmMessageSerialized,
    DbType,
    ISwarmMessageStoreEvents
  >
  implements ISwarmMessageStore<P, DbType> {
  protected connectorType: P | undefined;

  protected accessControl?: ISwarmMessageStoreAccessControlOptions<P>;

  protected messageConstructors?: ISwarmMessageDatabaseConstructors;

  protected swarmMessageConstructorFabric?: ISwarmMessageConstructorWithEncryptedCacheFabric;

  protected extendsWithAccessControl?: ReturnType<
    typeof swarmMessageStoreUtilsExtendDatabaseOptionsWithAccessControl
  >;

  protected _dbTypes: Record<
    string,
    ESwarmStoreConnectorOrbitDbDatabaseType
  > = {};

  protected _cache?: StorageProvider<
    TSwarmMessageInstance
  > = new StorageProviderInMemory<TSwarmMessageInstance>();

  protected _databasesMessagesCaches: Record<
    string,
    ISwarmMessageStoreUtilsMessagesCache
  > = {};

  protected get dbMethodAddMessage(): TSwarmStoreDatabaseMethod<P> {
    const { connectorType } = this;

    switch (connectorType as P) {
      case ESwarmStoreConnector.OrbitDB:
        return (ESwarmStoreConnectorOrbitDbDatabaseMethodNames.add as TSwarmStoreConnectorOrbitDbDatabaseMethodNames) as TSwarmStoreDatabaseMethod<
          P
        >;
      default:
        throw new Error('Failed to define the method for adding message');
    }
  }

  protected get dbMethodRemoveMessage(): TSwarmStoreDatabaseMethod<P> {
    const { connectorType } = this;

    switch (connectorType as P) {
      case ESwarmStoreConnector.OrbitDB:
        return (ESwarmStoreConnectorOrbitDbDatabaseMethodNames.remove as TSwarmStoreConnectorOrbitDbDatabaseMethodNames) as TSwarmStoreDatabaseMethod<
          P
        >;
      default:
        throw new Error('Failed to define the method for adding message');
    }
  }

  protected get dbMethodIterator(): TSwarmStoreDatabaseMethod<P> {
    const { connectorType } = this;

    switch (connectorType as P) {
      case ESwarmStoreConnector.OrbitDB:
        return (ESwarmStoreConnectorOrbitDbDatabaseMethodNames.iterator as TSwarmStoreConnectorOrbitDbDatabaseMethodNames) as TSwarmStoreDatabaseMethod<
          P
        >;
      default:
        throw new Error('Failed to define the method for adding message');
    }
  }

  public async connect(
    options: ISwarmMessageStoreOptions<P, DbType>
  ): TSwarmMessageStoreConnectReturnType<P, DbType> {
    const extendsWithAccessControl = swarmMessageStoreUtilsExtendDatabaseOptionsWithAccessControl(
      options
    );
    const optionsSwarmStore = await swarmMessageStoreUtilsConnectorOptionsProvider(
      options,
      extendsWithAccessControl
    );

    this.extendsWithAccessControl = extendsWithAccessControl;
    this.setOptions(optionsSwarmStore);

    const connectionResult = await super.connect(
      optionsSwarmStore,
      optionsSwarmStore.databasesListStorage
    );

    if (connectionResult instanceof Error) {
      throw connectionResult;
    }
    await this._startCacheStore();
    this.setListeners();
  }

  /**
   * open a new connection to the database specified
   *
   * @param {TSwarmStoreDatabaseOptions} dbOptions
   * @returns {(Promise<void | Error>)}
   * @memberof SwarmStore
   */
  public async openDatabase(
    dbOptions: TSwarmStoreDatabaseOptions<P, TSwarmMessageSerialized>
  ): Promise<void | Error> {
    try {
      const optionsWithAcessControl = (this.extendsWithAccessControl?.(
        dbOptions
      ) || dbOptions) as TSwarmStoreDatabaseOptions<P, TSwarmMessageSerialized>;
      const dbOpenResult = await super.openDatabase(optionsWithAcessControl);

      if (!(dbOpenResult instanceof Error)) {
        await this.openDatabaseMessagesCache(dbOptions.dbName);
      }

      const dbType = this.getDatabaseTypeByOptions(dbOptions);

      this._setDatabaseType(dbOptions.dbName, dbType);
    } catch (err) {
      console.error(err);
      return new Error(
        `Swarm message store:failed to open the database ${dbOptions.dbName}: ${err.message}`
      );
    }
  }

  /**
   * Remove the database, clean it's messages cache if exists,
   * unset settings.
   *
   * @param {string} dbName
   * @returns {(Promise<void | Error>)}
   * @memberof SwarmMessageStore
   */
  public async dropDatabase(dbName: string): Promise<void | Error> {
    const dropDbResult = await super.dropDatabase(dbName);

    if (dropDbResult instanceof Error) {
      return dropDbResult;
    }
    const messageConstructor = await this.getMessageConstructor(dbName);

    try {
      if (messageConstructor?.encryptedCache) {
        await messageConstructor.encryptedCache.clearDb();
      }
      await this.unsetDatabaseMessagesCache(dbName);
      this._unsetDatabaseType(dbName);
    } catch (err) {
      console.error(
        `Failed to clear messages encrypted cache for the database ${dbName}`
      );
      return err;
    }
  }

  public async addMessage<
    T extends TSwarmStoreValueTypes<P>,
    DT extends DbType
  >(
    dbName: string,
    msg: TSwarmMessageInstance | TSwarmMessageConstructorBodyMessage | string,
    key?: TSwarmStoreDatabaseEntityAddress<P>
  ): Promise<TSwarmMessageStoreMessageId> {
    const message: TSwarmMessageInstance | string =
      typeof msg === 'string' ? msg : await this.constructMessage(dbName, msg);

    assert(dbName, 'Database name must be provided');
    this.validateMessageFormat(message);

    const requestAddArgument = {
      value: this.serializeMessage(message),
      key,
    } as TSwarmStoreDatabaseMethodArgument<P, TSwarmStoreValueTypes<P>, DT>;
    const response = (await this.request<TSwarmStoreValueTypes<P>, DT>(
      dbName,
      this.dbMethodAddMessage,
      requestAddArgument
    )) as TSwarmStoreDatabaseMethodAnswer<P, T> | Error;

    if (response instanceof Error) {
      throw response;
    }
    return this.deserializeAddMessageResponse(response);
  }

  public async deleteMessage(
    dbName: string,
    messageAddressOrDbKey: ISwarmMessageStoreDeleteMessageArg<P>
  ): Promise<void> {
    assert(dbName, 'Database name must be provided');
    assert(
      messageAddressOrDbKey && typeof messageAddressOrDbKey === 'string',
      'Message address must be a non empty string'
    );

    const result = await this.request(
      dbName,
      this.dbMethodRemoveMessage,
      this.getArgRemoveMessage(messageAddressOrDbKey)
    );

    if (result instanceof Error) {
      throw result;
    }
    try {
      await this.removeSwarmMessageFromCacheByAddressOrKey(
        dbName,
        messageAddressOrDbKey
      );
    } catch (err) {
      console.error(
        new Error(
          `Failed to remove a message by address or key "${messageAddressOrDbKey}" from cache for database "${dbName}"`
        ),
        err
      );
    }
  }

  public async collect<T extends TSwarmStoreValueTypes<P>, DT extends DbType>(
    dbName: string,
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DT>
  ): Promise<
    (ISwarmMessageInstanceDecrypted | ISwarmMessageInstanceEncrypted | Error)[]
  > {
    assert(typeof dbName === 'string', '');

    const iterator = await this.request<T, DT>(
      dbName,
      this.dbMethodIterator,
      this.getArgIterateDb<T, DT>(dbName, options)
    );

    if (iterator instanceof Error) {
      throw iterator;
    }
    return this.collectMessages(
      dbName,
      iterator as TSwarmStoreDatabaseIteratorMethodAnswer<P, T>,
      this._getDatabaseType(dbName) as ISwarmMessageStoreDatabaseType<P>
    );
  }

  public async collectWithMeta<
    T extends TSwarmStoreValueTypes<P>,
    DT extends DbType
  >(
    dbName: string,
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): Promise<
    Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P> | undefined>
  > {
    assert(typeof dbName === 'string', '');

    const rawEntries = await this.request(
      dbName,
      this.dbMethodIterator,
      this.getArgIterateDb<T, DT>(dbName, options)
    );

    if (rawEntries instanceof Error) {
      throw rawEntries;
    }

    const collectMessagesResult = await this.collectMessages(
      dbName,
      rawEntries as TSwarmStoreDatabaseIteratorMethodAnswer<
        P,
        TSwarmStoreValueTypes<P>
      >,
      this._getDatabaseType(dbName) as ISwarmMessageStoreDatabaseType<P>
    );
    return this.getMessagesWithMeta(
      collectMessagesResult,
      rawEntries as Exclude<
        TSwarmStoreDatabaseRequestMethodReturnType<P, TSwarmStoreValueTypes<P>>,
        Error
      >,
      dbName,
      this._getDatabaseType(dbName) as ISwarmMessageStoreDatabaseType<P>
    );
  }

  protected validateOpts(options: ISwarmMessageStoreOptions<P, DbType>): void {
    super.validateOptions(options);

    const { messageConstructors } = options;

    assert(messageConstructors, 'messages constructors must be specified');
    assert(
      typeof messageConstructors === 'object',
      'messages constructors must an object'
    );

    const validateMessageConstructor = (mc: any) => {
      assert(
        typeof mc === 'object',
        'the message constructor must be specified'
      );
      assert(
        typeof mc.construct === 'function',
        'the message constructor must have the "construct" method'
      );
    };

    assert(
      typeof messageConstructors.default === 'object',
      'the default message constructor must be cpecified'
    );
    validateMessageConstructor(messageConstructors.default);
    Object.values(messageConstructors).forEach(validateMessageConstructor);
    if (options.cache) {
      assert(
        typeof options.cache === 'object',
        'Cache option must be an object'
      );
      assert(
        typeof options.cache.get === 'function',
        'Cache option must implements StorageProvider and have a "get" method'
      );
      assert(
        typeof options.cache.set === 'function',
        'Cache option must implements StorageProvider and have a "set" method'
      );
      assert(
        typeof options.cache.clearDb === 'function',
        'Cache option must implements StorageProvider and have a "clearDb" method'
      );
    }
  }

  protected setOptions(options: ISwarmMessageStoreOptions<P, DbType>): void {
    this.validateOpts(options);
    this.connectorType = options.provider;
    this.accessControl = options.accessControl;
    this.messageConstructors = options.messageConstructors;

    if (options.cache) {
      this._cache = options.cache;
    }
    this.swarmMessageConstructorFabric = options.swarmMessageConstructorFabric;
  }

  /**
   * Return database type specifically for OrbitDB databases
   *
   * @protected
   * @param {TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB>} dbOptions
   * @returns {ESwarmStoreConnectorOrbitDbDatabaseType}
   * @memberof SwarmMessageStore
   */
  protected getOrbitDBDatabaseTypeByOptions<T extends TSwarmStoreValueTypes<P>>(
    dbOptions: TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T>
  ): ESwarmStoreConnectorOrbitDbDatabaseType {
    return dbOptions.dbType || ESwarmStoreConnectorOrbitDbDatabaseType.FEED;
  }

  /**
   * Return type of the database by it's options.
   *
   * @protected
   * @param {TSwarmStoreDatabaseOptions<P>} dbOptions
   * @returns {ESwarmStoreConnectorOrbitDbDatabaseType}
   * @memberof SwarmMessageStore
   */
  protected getDatabaseTypeByOptions<T extends TSwarmStoreValueTypes<P>>(
    dbOptions: TSwarmStoreDatabaseOptions<P, T>
  ): ISwarmMessageStoreDatabaseType<P> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return this.getOrbitDBDatabaseTypeByOptions(
          dbOptions
        ) as ISwarmMessageStoreDatabaseType<P>;
      default:
        return undefined as ISwarmMessageStoreDatabaseType<P>;
    }
  }

  /**
   * return the message constructor specified
   * for the database
   *
   * @protected
   * @param {string} dbName
   * @returns {(ISwarmMessageConstructor | undefined)}
   * @memberof SwarmMessageStore
   */
  protected async getMessageConstructor(
    dbName: string
  ): Promise<ISwarmMessageConstructor | undefined> {
    if (!dbName) {
      return;
    }
    const messageConstructor =
      this.messageConstructors &&
      getMessageConstructorForDatabase(dbName, this.messageConstructors);

    if (!messageConstructor) {
      return this.createMessageConstructorForDb(dbName);
    }
    return messageConstructor;
  }

  protected getMessagesWithMeta(
    messages: Array<
      Error | ISwarmMessageInstanceDecrypted | ISwarmMessageInstanceEncrypted
    >,
    rawEntriesIterator: Exclude<
      TSwarmStoreDatabaseRequestMethodReturnType<P, TSwarmStoreValueTypes<P>>,
      Error
    >,
    dbName: string,
    dbType: ISwarmMessageStoreDatabaseType<P>
  ): Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P> | undefined> {
    if (this.connectorType === ESwarmStoreConnector.OrbitDB) {
      return this.joinMessagesWithRawOrbitDBEntries(
        messages,
        rawEntriesIterator as Exclude<
          TSwarmStoreDatabaseIteratorMethodAnswer<
            ESwarmStoreConnector.OrbitDB,
            TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
          >,
          Error
        >,
        dbName,
        dbType
      );
    }
    return [];
  }

  protected joinMessagesWithRawOrbitDBEntries(
    messages: Array<
      Error | ISwarmMessageInstanceDecrypted | ISwarmMessageInstanceEncrypted
    >,
    rawEntriesIterator: Exclude<
      TSwarmStoreDatabaseIteratorMethodAnswer<
        ESwarmStoreConnector.OrbitDB,
        TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
      >,
      Error
    >,
    dbName: string,
    dbType: ISwarmMessageStoreDatabaseType<P>
  ): Array<
    | ISwarmMessageStoreMessagingRequestWithMetaResult<
        ESwarmStoreConnector.OrbitDB
      >
    | undefined
  > {
    return messages.map((messageInstance, idx) => {
      const logEntry = rawEntriesIterator[idx];
      const messageMetadata = this.getSwarmMessageMetadata<
        TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
      >(
        logEntry as TSwarmMessageStoreEntryRaw<
          P,
          TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
        >,
        dbType
      );

      if (!messageMetadata) {
        return undefined;
      }
      return {
        dbName,
        message: messageInstance,
        messageAddress: messageMetadata.messageAddress,
        key: messageMetadata.key,
      };
    });
  }

  /**
   * emits error occurred on a message creation
   *
   * @protected
   * @memberof SwarmMessageStore
   */
  protected emitMessageConstructionFails = (
    dbName: string,
    message: string,
    messageAddr: string,
    key: string | undefined, // message key
    error: Error
  ) => {
    this.emit(
      ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR,
      dbName,
      message,
      error,
      messageAddr,
      key
    );
  };

  /**
   * new message incoming
   *
   * @protected
   * @memberof SwarmMessageStore
   */
  protected emitMessageNew = (
    dbName: string,
    message: TSwarmMessageInstance,
    messageAddr: string,
    messageKey?: string
  ) => {
    console.log('SwarmMessageStore::emitMessageNew', {
      dbName,
      message,
      messageAddr,
      messageKey,
    });
    this.emit(
      ESwarmMessageStoreEventNames.NEW_MESSAGE,
      dbName,
      message,
      messageAddr,
      messageKey
    );
  };

  /**
   * Message or key was deleted
   *
   * @protected
   * @memberof SwarmMessageStore
   */
  protected emitMessageDelete = (
    dbName: string,
    userId: string,
    messageHash: TSwarmStoreDatabaseEntityAddress<P>,
    messageDeletedHash: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    messageKey: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityKey<P>
      : undefined
  ) => {
    console.log('SwarmMessageStore::emitMessageDelete', {
      dbName,
      userId,
      messageHash,
      messageKey,
    });
    this.emit(
      ESwarmMessageStoreEventNames.DELETE_MESSAGE,
      dbName,
      userId,
      messageHash,
      messageDeletedHash,
      messageKey
    );
  };

  /**
   * Check whether the message has a valid format
   *
   * @protected
   * @param {*} message
   * @param {ESwarmStoreConnectorOrbitDbDatabaseType} dbType
   * @returns {message is (
   *     P extends ESwarmStoreConnector.OrbitDB
   *     ? LogEntry<TSwarmMessageSerialized>
   *     : any
   *   )}
   * @memberof SwarmMessageStore
   */
  protected isValidDataMessageFormat<T extends TSwarmStoreValueTypes<P>>(
    message: TSwarmMessageStoreEntryRaw<P, T>,
    dbType: ISwarmMessageStoreDatabaseType<P>
  ): message is TSwarmMessageStoreEntryRaw<P, T> {
    return (
      typeof message === 'object' &&
      typeof message.payload === 'object' &&
      typeof message.hash === 'string' &&
      typeof message.payload.value === 'string' &&
      (dbType !== ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ||
        typeof message.payload.key === 'string')
    );
  }

  protected getSwarmMessageMetadataOrbitDb<T extends TSwarmStoreValueTypes<P>>(
    message:
      | TSwarmMessageStoreEntryRaw<ESwarmStoreConnector.OrbitDB, T>
      | undefined,
    dbType: ISwarmMessageStoreDatabaseType<P>
  ): ISwarmMessageStoreSwarmMessageMetadata | undefined {
    if (!message) {
      return message;
    }
    return {
      messageAddress: message.hash,
      key:
        dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
          ? message.payload.key
          : undefined,
    };
  }

  protected getSwarmMessageMetadata<T extends TSwarmStoreValueTypes<P>>(
    message: TSwarmMessageStoreEntryRaw<P, T> | undefined,
    dbType: ISwarmMessageStoreDatabaseType<P>
  ): ISwarmMessageStoreSwarmMessageMetadata | undefined {
    const { connectorType } = this;

    switch (connectorType as P) {
      case ESwarmStoreConnector.OrbitDB:
        return this.getSwarmMessageMetadataOrbitDb(message, dbType);
      default:
        throw new Error('Unsupported database connector');
    }
  }

  /**
   * Constructs new swarm message from the raw database entry.
   *
   * @template T
   * @param {string} dbName
   * @param {TSwarmMessageStoreEntryRaw<P, T>} message
   * @param {ISwarmMessageStoreDatabaseType<P>} dbType
   * @returns {(Promise<TSwarmMessageInstance>)}
   * @throw
   */
  protected constructNewSwarmMessageFromRawEntry = async <
    T extends TSwarmStoreValueTypes<P>
  >(
    dbName: string,
    dbType: ISwarmMessageStoreDatabaseType<P>,
    message: TSwarmMessageStoreEntryRaw<P, T>
  ): Promise<TSwarmMessageInstance> => {
    if (!this.isValidDataMessageFormat(message, dbType)) {
      throw new Error('There is unknown message format');
    }

    const messageMetadata = this.getSwarmMessageMetadata<T>(message, dbType);
    const swarmMessageInstance = await this.constructMessage(
      dbName,
      message.payload.value,
      messageMetadata
    );

    if (swarmMessageInstance instanceof Error) {
      throw swarmMessageInstance;
    }
    return swarmMessageInstance;
  };

  /**
   * Handle message with some information
   *
   * @protected
   * @memberof SwarmMessageStore
   */
  protected handleNewDataMessage = async <T extends TSwarmStoreValueTypes<P>>(
    dbName: string,
    dbType: ISwarmMessageStoreDatabaseType<P>,
    message: TSwarmMessageStoreEntryRaw<P, T>
  ): Promise<void> => {
    let messageRawType: T | undefined;
    let key: string | undefined;
    let swarmMessageInstance: TSwarmMessageInstance | undefined;

    try {
      swarmMessageInstance = await this.getSwarmMessageFromCacheByRawEntry<T>(
        dbName,
        dbType,
        message
      );
    } catch (err) {
      console.error(
        new Error(
          `Failed to read a swarm message because the error: ${err.message}`
        )
      );
    }

    if (!swarmMessageInstance) {
      try {
        swarmMessageInstance = await this.constructNewSwarmMessageFromRawEntry(
          dbName,
          dbType,
          message
        );
      } catch (err) {
        return this.emitMessageConstructionFails(
          dbName,
          messageRawType ? String(messageRawType) : '',
          message?.hash || '',
          key,
          err
        );
      }
    }
    if (swarmMessageInstance) {
      const messageWithMeta = this.getSwarmMessageMetadata<T>(message, dbType);

      if (!messageWithMeta) {
        return;
      }
      const { messageAddress, key } = messageWithMeta;
      return this.emitMessageNew(
        dbName,
        swarmMessageInstance,
        messageAddress,
        key
      );
    }
  };

  /**
   * handle a new message stored in the local database
   *
   * @memberof SwarmMessageStore
   */
  protected handleNewMessage = async <T extends TSwarmStoreValueTypes<P>>([
    dbName,
    message,
    messageAddress,
    heads,
    dbType,
  ]: [
    string,
    TSwarmMessageStoreEntryRaw<P, T>,
    TSwarmStoreDatabaseEntityAddress<P>,
    any,
    ISwarmMessageStoreDatabaseType<P>
  ]): Promise<void> => {
    console.log('SwarmMessageStore::handleNewMessage', {
      dbName,
      message,
      messageAddress,
    });
    if (message?.payload?.op === EOrbitDbFeedStoreOperation.DELETE) {
      // TODO - remove the message from the cache
      return this.emitMessageDelete(
        dbName,
        message.identity.id,
        message.hash as TSwarmStoreDatabaseEntityAddress<P>,
        (message.payload
          .value as unknown) as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
          ? TSwarmStoreDatabaseEntityAddress<P> | undefined
          : TSwarmStoreDatabaseEntityAddress<P>,
        (dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
          ? message.payload.key
          : undefined) as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
          ? TSwarmStoreDatabaseEntityKey<P>
          : undefined
      );
    }
    return this.handleNewDataMessage<T>(dbName, dbType, message);
  };

  protected setListeners() {
    this.addListener(ESwarmStoreEventNames.NEW_ENTRY, this.handleNewMessage);
  }

  /**
   * validate format of a message to send
   *
   * @protected
   * @param {(TSwarmMessageInstance | string)} message
   * @memberof SwarmMessageStore
   */
  protected validateMessageFormat(message: TSwarmMessageInstance | string) {
    assert(message, 'Message must be provided');
    assert(
      typeof message === 'string' || typeof message === 'object',
      'Message must be a string or an object'
    );
    assert(
      typeof (message as TSwarmMessageInstance).bdy === 'object' &&
        typeof (message as TSwarmMessageInstance).uid === 'string' &&
        typeof (message as TSwarmMessageInstance).sig === 'string',
      'Message must be a string or an object'
    );
  }

  /**
   * serizlize the message to a fromat
   * to store it in the store with
   * a type specified in the options
   *
   * @protected
   * @returns {TSwarmStoreValueTypes<P>}
   * @memberof SwarmMessageStore
   */
  protected serializeMessage(
    message: TSwarmMessageInstance | string
  ): TSwarmStoreValueTypes<P> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        return String(message) as TSwarmStoreValueTypes<
          ESwarmStoreConnector.OrbitDB
        >;
      default:
        throw new Error(
          'Failed to serizlize the message to the store connector compatible format'
        );
    }
  }

  /**
   * returns the argument for a message removing request
   * accepted by the connector type provided
   *
   * @protected
   * @param {string} messageAddress
   * @param {(TSwarmMessageInstance | string)} message
   * @returns {TSwarmStoreDatabaseMethodArgument<P, TSwarmStoreValueTypes<P>>}
   * @memberof SwarmMessageStore
   */
  protected getArgRemoveMessage<DbType extends TSwarmStoreDatabaseType<P>>(
    messageAddress: string
  ): TSwarmStoreDatabaseMethodArgument<P, TSwarmStoreValueTypes<P>, DbType> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return messageAddress as TSwarmStoreDatabaseMethodArgument<
          P,
          TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
          DbType
        >;
      default:
        throw new Error(
          'Failed to define argument value for a swarm message removing'
        );
    }
  }

  /**
   * returns argment for a database values iterator
   *
   * @protected
   * @param {string} dbName
   * @returns {TSwarmStoreDatabaseMethodArgument<P, TSwarmStoreValueTypes<P>>}
   * @memberof SwarmMessageStore
   */
  protected getArgIterateDb<
    V extends TSwarmStoreValueTypes<P>,
    DbType extends TSwarmStoreDatabaseType<P>
  >(
    dbName: string,
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): TSwarmStoreDatabaseMethodArgument<P, V, DbType> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        assert(options, 'The iteratro opti');
        return (options
          ? (extend(
              options,
              SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT
            ) as TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>)
          : (SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT as TSwarmStoreDatabaseIteratorMethodArgument<
              P,
              DbType
            >)) as TSwarmStoreDatabaseMethodArgument<P, V, DbType>;
      default:
        throw new Error(
          'Failed to define argument value for a swarm message collecting'
        );
    }
  }

  protected async collectMessagesFromOrbitDBIterator<
    T extends TSwarmStoreValueTypes<P>
  >(
    dbName: string,
    rawEnties: TSwarmStoreDatabaseIteratorMethodAnswer<
      ESwarmStoreConnector.OrbitDB,
      T
    >, // TODO - may be not a string,
    dbType: ESwarmStoreConnectorOrbitDbDatabaseType
  ): Promise<(TSwarmMessageInstance | Error)[]> {
    if (rawEnties instanceof Error) {
      throw rawEnties;
    }
    return Promise.all(
      rawEnties.map(async (logEntry) => {
        if (logEntry instanceof Error) {
          return logEntry;
        }
        if (!logEntry) {
          return logEntry;
        }
        try {
          const messageMetadata = this.getSwarmMessageMetadata<T>(
            logEntry as TSwarmMessageStoreEntryRaw<P, T>,
            dbType as ISwarmMessageStoreDatabaseType<P>
          );
          const message = await this.constructMessage(
            dbName,
            logEntry.payload.value,
            messageMetadata
          );

          return message;
        } catch (err) {
          return err;
        }
      })
    );
  }

  /**
   * collect messages from iterator
   *
   * @protected
   * @param {string} dbName
   * @param {TSwarmStoreDatabaseIteratorMethodAnswer<P, any>} rawEntries
   * @param {any} d
   * @returns {TSwarmMessageInstance[]}
   * @memberof SwarmMessageStore
   */
  protected collectMessages<T extends TSwarmStoreValueTypes<P>>(
    dbName: string,
    rawEntries: TSwarmStoreDatabaseIteratorMethodAnswer<P, T>,
    dbType: ISwarmMessageStoreDatabaseType<P>
  ): Promise<(TSwarmMessageInstance | Error)[]> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return this.collectMessagesFromOrbitDBIterator<T>(
          dbName,
          rawEntries,
          dbType
        );
      default:
        throw new Error(
          'Failed to define argument value for a swarm message collecting'
        );
    }
  }

  /**
   * transforms the result of a query for adding a message
   * to the unique message's identifier in the database
   *
   * @protected
   * @param {TSwarmStoreDatabaseMethodAnswer<
   *       P,
   TSwarmMessageSerialized
   *     >} addMessageResponse
   * @returns {TSwarmMessageStoreMessageId}
   * @memberof SwarmMessageStore
   */
  protected deserializeAddMessageResponse<T extends TSwarmStoreValueTypes<P>>(
    addMessageResponse: TSwarmStoreDatabaseMethodAnswer<P, T>
  ): TSwarmMessageStoreMessageId {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        if (typeof addMessageResponse !== 'string') {
          throw new Error('There is a wrong responce on add message request');
        }
        return addMessageResponse;
      default:
        return String(addMessageResponse);
    }
  }

  protected async createMessageConstructorForDb(
    dbName: string
  ): Promise<ISwarmMessageConstructor | undefined> {
    if (!this.swarmMessageConstructorFabric) {
      return;
    }
    return this.swarmMessageConstructorFabric({}, { dbName });
  }

  /**
   * construct message for the database by a constructor,
   * specified for the database,
   * or return itself if a SwarmMessageInstance
   * given.
   *
   * @protected
   * @param {string} dbName
   * @param {(TSwarmMessageInstance | TSwarmMessageConstructorBodyMessage)} message
   * @returns {Promise<TSwarmMessageInstance>}
   * @memberof SwarmMessageStore
   */
  protected async constructMessage(
    dbName: string,
    message:
      | TSwarmMessageInstance
      | TSwarmMessageConstructorBodyMessage
      | TSwarmMessageSerialized,
    metadata?: ISwarmMessageStoreSwarmMessageMetadata
  ): Promise<TSwarmMessageInstance> {
    if (metadata) {
      // try to read message from the cache at first
      // by it's unique address
      const { messageAddress } = metadata;
      const messageCached = await this.getSwarmMessageInstanceFromCacheByAddress(
        dbName,
        messageAddress
      );

      if (messageCached) {
        return messageCached;
      }
    }

    let swarmMessageInstance: TSwarmMessageInstance;

    if (
      (message as TSwarmMessageInstance).bdy &&
      (message as TSwarmMessageInstance).sig
    ) {
      // if the message argument is already instance of a swarm message
      swarmMessageInstance = message as TSwarmMessageInstance;
    } else {
      // construct swarm message instance if it's not in the cache and
      // the message argument is not an instance by itself
      const messageConsturctor = await this.getMessageConstructor(dbName);

      if (!messageConsturctor) {
        throw new Error(
          `A message consturctor is not specified for the database ${dbName}`
        );
      }
      swarmMessageInstance = await messageConsturctor.construct(
        message as TSwarmMessageConstructorBodyMessage
      );
    }
    if (swarmMessageInstance && metadata) {
      await this.addMessageToCacheByMetadata(
        dbName,
        metadata,
        swarmMessageInstance
      );
    }
    return swarmMessageInstance;
  }

  protected getOptionsForDatabaseMessagesCache(
    dbName: string
  ): ISwarmMessageStoreUtilsMessagesCacheOptions {
    if (!this._cache) {
      throw new Error(
        'Instance of storage used as messages cache is not defined'
      );
    }
    return {
      dbName,
      cache: this._cache,
    };
  }

  /**
   * set messages cache for the database
   *
   * @protected
   * @memberof SwarmMessageStore
   * @throws
   */
  protected openDatabaseMessagesCache = async (
    dbName: string
  ): Promise<void> => {
    const messagesCache = new SwarmMessageStoreUtilsMessagesCache();
    const options = this.getOptionsForDatabaseMessagesCache(dbName);

    await messagesCache.connect(options);
    this._databasesMessagesCaches[dbName] = messagesCache;
  };

  /**
   * Unset messages cache for the database
   *
   * @param {string} dbName
   * @returns {Promise<void>}
   * @throws
   */
  protected unsetDatabaseMessagesCache = async (
    dbName: string
  ): Promise<void> => {
    const messagesCache = this._databasesMessagesCaches[dbName];

    if (messagesCache) {
      await messagesCache.clear();
    }
  };

  /**
   * Returns messages cache or undefined.
   *
   * @protected
   * @param {string} dbName
   * @returns {(ISwarmMessageStoreUtilsMessagesCache | undefined)}
   * @memberof SwarmMessageStore
   */
  protected getMessagesCacheForDb(
    dbName: string
  ): ISwarmMessageStoreUtilsMessagesCache | undefined {
    return this._databasesMessagesCaches[dbName];
  }

  /**
   * Add message to a cache storage defined for the database.
   * If cache is not exists for the database do notrhing
   *
   * @protected
   * @param {string} dbName
   * @param {ISwarmMessageStoreSwarmMessageMetadata} messageMetadata
   * @param {TSwarmMessageInstance} messageInstance
   * @returns {Promise<void>}
   * @memberof SwarmMessageStore
   */
  protected async addMessageToCacheByMetadata(
    dbName: string,
    messageMetadata: ISwarmMessageStoreSwarmMessageMetadata,
    messageInstance: TSwarmMessageInstance
  ): Promise<void> {
    const cache = this.getMessagesCacheForDb(dbName);

    if (cache) {
      const { messageAddress, key } = messageMetadata;
      const pending = [
        cache.setMessageByAddress(messageAddress, messageInstance),
      ];

      if (key) {
        pending.push(cache.setMessageAddressForKey(key, messageAddress));
      }
      await Promise.all(pending);
    }
  }

  protected async removeSwarmMessageFromCacheByKey(
    dbName: string,
    key: string
  ): Promise<void> {
    const cache = this.getMessagesCacheForDb(dbName);

    if (cache) {
      await cache.unsetMessageAddressForKey(key);
    }
  }

  protected async removeSwarmMessageFromCacheByAddress(
    dbName: string,
    messageAddress: string
  ): Promise<void> {
    const cache = this.getMessagesCacheForDb(dbName);

    if (cache) {
      await cache.unsetMessageByAddress(messageAddress);
    }
  }

  /**
   * Remove the message from the swarm messages cache for
   * the database by it's metadata.
   *
   * @protected
   * @param {string} dbName
   * @param {ISwarmMessageStoreSwarmMessageMetadata} messageMetadata
   * @memberof SwarmMessageStore
   */
  protected async removeSwarmMessageFromCacheByAddressOrKey(
    dbName: string,
    messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P>
  ) {
    const databaseType = this._getDatabaseType(dbName);

    if (
      messageAddressOrKey &&
      databaseType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    ) {
      return this.removeSwarmMessageFromCacheByKey(dbName, messageAddressOrKey);
    }
    if (messageAddressOrKey) {
      return this.removeSwarmMessageFromCacheByAddress(
        dbName,
        messageAddressOrKey
      );
    }
    console.warn(
      'The message address or key is not provided',
      dbName,
      messageAddressOrKey
    );
  }

  protected async getSwarmMessageInstanceFromCacheByAddress(
    dbName: string,
    messageAddress: ISwarmMessageStoreSwarmMessageMetadata['messageAddress']
  ): Promise<TSwarmMessageInstance | undefined> {
    const cache = this.getMessagesCacheForDb(dbName);

    if (cache) {
      return cache.getMessageByAddress(messageAddress);
    }
  }

  protected async getSwarmMessageFromCacheByRawEntry<
    T extends TSwarmStoreValueTypes<P>
  >(
    dbName: string,
    dbType: ISwarmMessageStoreDatabaseType<P>,
    message: TSwarmMessageStoreEntryRaw<P, T> | undefined
  ): Promise<TSwarmMessageInstance | undefined> {
    const messageMetadata = this.getSwarmMessageMetadata<T>(message, dbType);
    if (!messageMetadata) {
      return;
    }
    return await this.getSwarmMessageInstanceFromCacheByAddress(
      dbName,
      messageMetadata.messageAddress
    );
  }

  /**
   * Set type for database with the name
   *
   * @protected
   * @param {string} dbName
   * @param {ESwarmStoreConnectorOrbitDbDatabaseType} dbType
   * @memberof SwarmMessageStore
   */
  protected _setDatabaseType(
    dbName: string,
    dbType: ISwarmMessageStoreDatabaseType<P>
  ): void {
    this._dbTypes[dbName] = dbType;
  }

  protected _unsetDatabaseType(dbName: string): void {
    delete this._dbTypes[dbName];
  }

  /**
   * Returns a database's type by it's name
   *
   * @param {string} dbName
   * @returns {(ESwarmStoreConnectorOrbitDbDatabaseType | undefined)}
   */
  protected _getDatabaseType = (
    dbName: string
  ): ESwarmStoreConnectorOrbitDbDatabaseType | undefined =>
    this._dbTypes[dbName];

  /**
   * Connect to the cache store
   *
   * @returns {Promise<void>}
   * @throws - throws if failed to connect
   */
  protected _startCacheStore = async (): Promise<void> => {
    const { _cache: cacheStore } = this;

    if (!cacheStore) {
      throw new Error('There is no cache store');
    }

    const connectToCacheResult = await cacheStore.connect();
    if (connectToCacheResult instanceof Error) {
      throw new Error(
        `Failed to connect to cache store: ${connectToCacheResult.message}`
      );
    }
  };
}
