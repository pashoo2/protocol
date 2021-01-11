import assert from 'assert';
import { SwarmStore } from '../swarm-store-class/swarm-store-class';
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageInstance,
  ISwarmMessageInstanceEncrypted,
  ISwarmMessageInstanceDecrypted,
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
  ISwarmStoreDatabaseBaseOptions,
} from '../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageStoreConnectReturnType } from './types/swarm-message-store.types';
import { ISwarmMessageStoreEvents, ISwarmMessageStore } from './types/swarm-message-store.types';
import {
  getMessageConstructorForDatabase,
  getMessageValidator,
} from './swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker/swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker';
import { ISwarmMessageStoreDeleteMessageArg } from './types/swarm-message-store.types';
import { TSwarmMessageSerialized, TSwarmMessageConstructorBodyMessage } from '../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
} from '../swarm-store-class/swarm-store-class.types';

import { ISwarmMessageStoreAccessControlOptions, ISwarmMessageDatabaseConstructors } from './types/swarm-message-store.types';
import { extendSwarmMessageStoreConnectionOptionsWithAccessControlAndConnectorSpecificOptions } from './swarm-message-store-connection-options/swarm-message-store-connection-options-utils/swarm-message-store-connection-options-extender';
import {
  ISwarmMessageStoreMessagingRequestWithMetaResult,
  ISwarmMessageStoreSwarmMessageMetadata,
  TSwarmMessageStoreEntryRaw,
} from './types/swarm-message-store.types';
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
import {
  TSwarmStoreDatabaseRequestMethodEntitiesReturnType,
  TSwarmStoreDatabaseLoadMethodAnswer,
  TSwarmStoreDatabaseCloseMethodAnswer,
} from '../swarm-store-class/swarm-store-class.types';
import { ISwarmStoreConnectorBasic, ISwarmStoreConnector } from '../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from './types/swarm-message-store.types';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { PromiseResolveType } from '../../types/promise.types';
import { createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControl } from './swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks';
import { ISwarmMessageStoreDatabaseOptionsExtender } from './types/swarm-message-store-utils.types';
import { TCentralAuthorityUserIdentity } from '../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import {
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../swarm-store-class/swarm-store-class.types';

export class SwarmMessageStore<
    P extends ESwarmStoreConnector,
    T extends TSwarmMessageSerialized,
    DbType extends TSwarmStoreDatabaseType<P>,
    DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
    ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
    PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
    CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
    ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
    CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
    MSI extends TSwarmMessageInstance | T,
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
    E extends ISwarmMessageStoreEvents<P, T, DbType, DBO>,
    MD extends ISwarmMessageInstanceDecrypted = Exclude<Exclude<MSI, ISwarmMessageInstanceEncrypted>, T>
  >
  extends SwarmStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O, E>
  implements ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O> {
  protected connectorType: P | undefined;

  protected accessControl?: ACO;

  protected messageConstructors?: ISwarmMessageDatabaseConstructors<PromiseResolveType<ReturnType<NonNullable<MCF>>>>;

  protected swarmMessageConstructorFabric?: MCF;

  protected extendDBOWithAccessControl?: ISwarmMessageStoreDatabaseOptionsExtender<
    P,
    T,
    DbType,
    DBO,
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
    PromiseResolveType<ReturnType<NonNullable<MCF>>>
  >;

  protected _dbTypes: Record<string, DbType> = {};

  protected _cache?: StorageProvider<MD> = new StorageProviderInMemory<MD>();

  protected _databasesMessagesCaches: Record<
    string,
    ISwarmMessageStoreUtilsMessagesCache<P, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>
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
    options: O
  ): TSwarmMessageStoreConnectReturnType<
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
    ACO,
    O
  > {
    // TODO - make it provided from options
    const extenderWithAccessControl = this._createDatabaseOptionsExtender(options);
    const optionsSwarmStore = await this._extendSwarmMessgeStoreOptions(options);

    // TODO - add class which can use a custom datbase options constructor instead
    // of the swarmMessageStoreConnectionOptionsExtender and extendsWithAccessControl
    this._setCurrentDatabaseOptionsExtenderWithAccessControl(extenderWithAccessControl);
    this._setOptions(optionsSwarmStore);

    const connectionResult = await super.connect(optionsSwarmStore);

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
  public async openDatabase(dbOptions: DBO): Promise<void | Error> {
    try {
      const { extendDBOWithAccessControl: extendsWithAccessControl } = this;

      if (!extendsWithAccessControl) {
        throw new Error('There is no "extendsWithAccessControl" utility for the current instance');
      }

      const swarmMessageConstructorForDatabase = await this._getSwarmMessageConstructorForDb(dbOptions.dbName);
      const optionsWithAcessControl = extendsWithAccessControl(dbOptions, swarmMessageConstructorForDatabase);
      const dbOpenResult = await super.openDatabase(optionsWithAcessControl);

      if (!(dbOpenResult instanceof Error)) {
        await this.openDatabaseMessagesCache(dbOptions.dbName);
      }

      const dbType = this.getDatabaseTypeByOptions(dbOptions);

      if (!dbType) {
        throw new Error('Database type should ne defined');
      }

      this._setDatabaseType(dbOptions.dbName, dbType);
    } catch (err) {
      console.error(err);
      return new Error(`Swarm message store:failed to open the database ${dbOptions.dbName}: ${err.message}`);
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
  public async dropDatabase(dbName: DBO['dbName']): Promise<void | Error> {
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
      console.error(`Failed to clear messages encrypted cache for the database ${dbName}`);
      return err;
    }
  }

  public async addMessage<ValueType extends MSI | TSwarmMessageConstructorBodyMessage, DT extends DbType>(
    dbName: DBO['dbName'],
    msg: ValueType,
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<TSwarmStoreDatabaseEntityAddress<P>> {
    assert(dbName, 'Database name must be provided');

    const message = typeof msg === 'string' ? (msg as T) : ((await this.constructMessage(dbName, msg)) as MSI);

    this.validateMessageFormat(message as MSI | TSwarmMessageConstructorBodyMessage);

    const requestAddArgument = {
      value: this.serializeMessage(message as MSI),
      key,
    } as TSwarmStoreDatabaseMethodArgument<P, T, DT>;
    const response = (await this.request<T, DT>(dbName, this.dbMethodAddMessage, requestAddArgument)) as
      | TSwarmStoreDatabaseMethodAnswer<P, T>
      | Error;

    if (response instanceof Error) {
      throw response;
    }
    const deserializedResponse = this.deserializeAddMessageResponse(response);

    if (!deserializedResponse) {
      throw new Error('Failed to deserialize the response');
    }
    return deserializedResponse;
  }

  public async deleteMessage(dbName: DBO['dbName'], messageAddressOrDbKey: ISwarmMessageStoreDeleteMessageArg<P>): Promise<void> {
    assert(dbName, 'Database name must be provided');
    if (!messageAddressOrDbKey || typeof messageAddressOrDbKey !== 'string') {
      throw new Error('Message address must be a non empty string');
    }

    const result = await this.request<T, DbType>(
      dbName,
      this.dbMethodRemoveMessage,
      this.getArgRemoveMessage(messageAddressOrDbKey)
    );

    if (result instanceof Error) {
      throw result;
    }
    try {
      await this.removeSwarmMessageFromCacheByAddressOrKey(dbName, messageAddressOrDbKey);
    } catch (err) {
      console.error(
        new Error(`Failed to remove a message by address or key "${messageAddressOrDbKey}" from cache for database "${dbName}"`),
        err
      );
    }
  }

  public async collect<ValueType extends T, DT extends DbType, MD extends Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>(
    dbName: DBO['dbName'],
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DT>
  ): Promise<Array<MD | Error>> {
    assert(dbName, 'Database name should be provided');

    const dbType = this._getDatabaseType(dbName);

    if (!dbType) {
      throw new Error("The database's type can't be defined");
    }

    const iterator = await this.request<ValueType, DT>(
      dbName,
      this.dbMethodIterator,
      this.getArgIterateDb<ValueType, DT>(dbName, options)
    );

    if (iterator instanceof Error) {
      throw iterator;
    }
    return await this.collectMessages(dbName, iterator as TSwarmStoreDatabaseIteratorMethodAnswer<P, ValueType>, dbType);
  }

  public async collectWithMeta<MD extends MD>(
    dbName: DBO['dbName'],
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>> {
    assert(dbName, 'Database name should be defined');

    const dbType = this._getDatabaseType(dbName);

    if (!dbType) {
      throw new Error("The database's type can't be defined");
    }

    const rawEntries = await this.request<T, DbType>(
      dbName,
      this.dbMethodIterator,
      this.getArgIterateDb<T, DbType>(dbName, options)
    );

    if (!this.checkIsRequestMethodReturnEntries(rawEntries)) {
      throw new Error('The request returns unexpected result');
    }

    const collectMessagesResult = await this.collectMessages(dbName, rawEntries, dbType);
    return this.getMessagesWithMeta<MD>(collectMessagesResult as Array<Error | MD>, rawEntries, dbName, dbType);
  }

  protected validateOpts(options: O): void {
    super.validateOptions(options);

    const { messageConstructors } = options;

    assert(messageConstructors, 'messages constructors must be specified');
    assert(typeof messageConstructors === 'object', 'messages constructors must an object');

    const validateMessageConstructor = (mc: any) => {
      assert(typeof mc === 'object', 'the message constructor must be specified');
      assert(typeof mc.construct === 'function', 'the message constructor must have the "construct" method');
    };

    assert(typeof messageConstructors.default === 'object', 'the default message constructor must be cpecified');
    validateMessageConstructor(messageConstructors.default);
    Object.values(messageConstructors).forEach(validateMessageConstructor);
    if (options.cache) {
      assert(typeof options.cache === 'object', 'Cache option must be an object');
      assert(typeof options.cache.get === 'function', 'Cache option must implements StorageProvider and have a "get" method');
      assert(typeof options.cache.set === 'function', 'Cache option must implements StorageProvider and have a "set" method');
      assert(
        typeof options.cache.clearDb === 'function',
        'Cache option must implements StorageProvider and have a "clearDb" method'
      );
    }
  }

  protected _setOptions(options: O): void {
    this.validateOpts(options);
    this.connectorType = options.provider;
    this.accessControl = options.accessControl;
    this.messageConstructors = options.messageConstructors;

    if (options.cache) {
      this._cache = options.cache as StorageProvider<MD>;
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
  protected getOrbitDBDatabaseTypeByOptions(dbOptions: DBO): ESwarmStoreConnectorOrbitDbDatabaseType {
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
  protected getDatabaseTypeByOptions(dbOptions: DBO): DbType | undefined {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return this.getOrbitDBDatabaseTypeByOptions(dbOptions) as DbType;
      default:
        return undefined;
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
    dbName: DBO['dbName']
  ): Promise<PromiseResolveType<ReturnType<NonNullable<MCF>>> | undefined> {
    if (!dbName) {
      return;
    }
    const messageConstructor = this.messageConstructors && getMessageConstructorForDatabase(dbName, this.messageConstructors);

    if (!messageConstructor) {
      return await this.createMessageConstructorForDb(dbName);
    }
    return messageConstructor;
  }

  protected _getDefaultSwarmMessageConstructor(): PromiseResolveType<ReturnType<NonNullable<MCF>>> {
    if (!this.messageConstructors) {
      throw new Error('There is no message constructors');
    }
    return this.messageConstructors.default;
  }

  protected async _getSwarmMessageConstructorForDb(
    dbName: DBO['dbName']
  ): Promise<PromiseResolveType<ReturnType<NonNullable<MCF>>>> {
    return ((await this.getMessageConstructor(dbName)) ?? this._getDefaultSwarmMessageConstructor()) as PromiseResolveType<
      ReturnType<NonNullable<MCF>>
    >;
  }

  protected getMessagesWithMeta<MD extends MD>(
    messages: Array<Error | MD>,
    rawEntriesIterator: TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P, T>,
    dbName: DBO['dbName'],
    dbType: DbType
  ): Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined> {
    if (this.connectorType === ESwarmStoreConnector.OrbitDB) {
      return this.joinMessagesWithRawOrbitDBEntries<MD>(messages, rawEntriesIterator, dbName, dbType);
    }
    return [];
  }

  protected joinMessagesWithRawOrbitDBEntries<M extends MD>(
    messages: Array<Error | M>,
    rawEntriesIterator: TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P, T>,
    dbName: DBO['dbName'],
    dbType: DbType
  ): Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, M> | undefined> {
    const messagesWithMeta = messages.map((messageInstance, idx) => {
      const entriesIterator = rawEntriesIterator instanceof Array ? rawEntriesIterator : [rawEntriesIterator];
      const logEntry = entriesIterator[idx];
      const messageMetadata = this.getSwarmMessageMetadata<T>(logEntry as TSwarmMessageStoreEntryRaw<P, T>, dbType);

      if (!messageMetadata) {
        return undefined;
      }
      return {
        dbName,
        message: messageInstance,
        messageAddress: messageMetadata.messageAddress,
        key: messageMetadata.key,
      } as ISwarmMessageStoreMessagingRequestWithMetaResult<P, M>;
    });
    return messagesWithMeta;
  }

  /**
   * emits error occurred on a message creation
   *
   * @protected
   * @memberof SwarmMessageStore
   */
  protected emitMessageConstructionFails = (
    dbName: DBO['dbName'],
    message: T,
    messageAddr: TSwarmStoreDatabaseEntityAddress<P>,
    key: TSwarmStoreDatabaseEntityKey<P> | undefined, // message key
    error: Error
  ) => {
    this.emit(ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR, dbName, message, error, messageAddr, key);
  };

  /**
   * new message incoming
   *
   * @protected
   * @memberof SwarmMessageStore
   */
  protected emitMessageNew = (
    dbName: DBO['dbName'],
    message: Exclude<MSI, T>,
    messageAddr: TSwarmStoreDatabaseEntityAddress<P>,
    messageKey: TSwarmStoreDatabaseEntityKey<P> | undefined
  ) => {
    console.log('SwarmMessageStore::emitMessageNew', {
      dbName,
      message,
      messageAddr,
      messageKey,
    });
    this.emit(ESwarmMessageStoreEventNames.NEW_MESSAGE, dbName, message, messageAddr, messageKey);
  };

  /**
   * Message or key was deleted
   *
   * @protected
   * @memberof SwarmMessageStore
   */
  protected emitMessageDelete = (
    dbName: DBO['dbName'],
    userId: TSwarmMessageUserIdentifierSerialized,
    messageHash: TSwarmStoreDatabaseEntityAddress<P>,
    messageDeletedHash: TSwarmStoreDatabaseEntityAddress<P> | undefined,
    messageKey: TSwarmStoreDatabaseEntityKey<P> | undefined
  ) => {
    console.log('SwarmMessageStore::emitMessageDelete', {
      dbName,
      userId,
      messageHash,
      messageKey,
    });
    this.emit(ESwarmMessageStoreEventNames.DELETE_MESSAGE, dbName, userId, messageHash, messageDeletedHash, messageKey);
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
  protected isValidDataMessageFormat(
    message: TSwarmMessageStoreEntryRaw<P, T>,
    dbType: DbType
  ): message is TSwarmMessageStoreEntryRaw<P, T> {
    return (
      typeof message === 'object' &&
      typeof message.payload === 'object' &&
      typeof message.hash === 'string' &&
      typeof message.payload.value === 'string' &&
      (dbType !== ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE || typeof message.payload.key === 'string')
    );
  }

  protected getSwarmMessageMetadataOrbitDb(
    message: TSwarmMessageStoreEntryRaw<ESwarmStoreConnector.OrbitDB, T> | undefined,
    dbType: DbType
  ): ISwarmMessageStoreSwarmMessageMetadata<P> | undefined {
    if (!message) {
      return;
    }
    return {
      messageAddress: message.hash,
      key: dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? message.payload.key : undefined,
    } as ISwarmMessageStoreSwarmMessageMetadata<P>;
  }

  protected getSwarmMessageMetadata(
    message: TSwarmMessageStoreEntryRaw<P, T> | undefined,
    dbType: DbType
  ): ISwarmMessageStoreSwarmMessageMetadata<P> | undefined {
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
  protected constructNewSwarmMessageFromRawEntry = async (
    dbName: DBO['dbName'],
    dbType: DbType,
    message: TSwarmMessageStoreEntryRaw<P, T>
  ): Promise<Exclude<MSI, T | ISwarmMessageInstanceEncrypted>> => {
    if (!dbName) {
      throw new Error('Databsae name should be defined');
    }
    if (!this.isValidDataMessageFormat(message, dbType)) {
      throw new Error('There is unknown message format');
    }

    const messageMetadata = this.getSwarmMessageMetadata<T>(message, dbType);
    const swarmMessageInstance = await this.constructMessage(dbName, (message.payload.value as unknown) as MSI, messageMetadata);

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
  protected handleNewDataMessage = async (
    dbName: DBO['dbName'],
    dbType: DbType,
    message: TSwarmMessageStoreEntryRaw<P, T>
  ): Promise<void> => {
    let messageRawType: T | undefined;
    let key: string | undefined;
    let swarmMessageInstance: TSwarmMessageInstance | undefined;

    try {
      swarmMessageInstance = await this.getSwarmMessageFromCacheByRawEntry<T>(dbName, dbType, message);
    } catch (err) {
      console.error(new Error(`Failed to read a swarm message because the error: ${err.message}`));
    }

    if (!swarmMessageInstance) {
      try {
        swarmMessageInstance = await this.constructNewSwarmMessageFromRawEntry(dbName, dbType, message);
      } catch (err) {
        return this.emitMessageConstructionFails(
          dbName,
          (messageRawType ? String(messageRawType) : '') as T,
          (message?.hash || '') as TSwarmStoreDatabaseEntityAddress<P>,
          key as TSwarmStoreDatabaseEntityKey<P> | undefined,
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
      return this.emitMessageNew(dbName, swarmMessageInstance as Exclude<MSI, T>, messageAddress, key);
    }
  };

  /**
   * handle a new message stored in the local database
   *
   * @memberof SwarmMessageStore
   */
  protected handleNewMessage = async ([dbName, message, messageAddress, heads, dbType]: [
    DBO['dbName'],
    TSwarmMessageStoreEntryRaw<P, T>,
    TSwarmStoreDatabaseEntityAddress<P>,
    unknown,
    DbType
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
        (message.payload.value as unknown) as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
          ? TSwarmStoreDatabaseEntityAddress<P> | undefined
          : TSwarmStoreDatabaseEntityAddress<P>,
        (dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
          ? message.payload.key
          : undefined) as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
          ? TSwarmStoreDatabaseEntityKey<P>
          : undefined
      );
    }
    return await this.handleNewDataMessage<T>(dbName, dbType, message);
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
  protected validateMessageFormat(
    message: MSI | TSwarmMessageConstructorBodyMessage
  ): message is MSI | TSwarmMessageConstructorBodyMessage {
    assert(message, 'Message must be provided');
    if (typeof message === 'object') {
      assert(
        typeof (message as TSwarmMessageInstance).bdy === 'object',
        'Message must be an object which has bdy property with an object value'
      );
      assert(
        typeof (message as TSwarmMessageInstance).uid === 'string',
        'Message must be an object which has uid property with a string value'
      );
      assert(
        typeof (message as TSwarmMessageInstance).sig === 'string',
        'Message must be an object which has sig property with a string value'
      );
    } else {
      assert(typeof message === 'string', 'Message must be a string or an object');
    }
    return true;
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
  protected serializeMessage(message: MSI): T {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        return (String(message) as TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>) as T;
      default:
        throw new Error('Failed to serizlize the message to the store connector compatible format');
    }
  }

  /**
   * returns the argument for a message removing request
   * accepted by the connector type provided
   *
   * @protected
   * @param {string} messageAddress
   * @returns {TSwarmStoreDatabaseMethodArgument<P, TSwarmStoreValueTypes<P>>}
   * @memberof SwarmMessageStore
   */
  protected getArgRemoveMessage<DBT extends DbType>(
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>
  ): TSwarmStoreDatabaseMethodArgument<P, T, DBT> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return messageAddress as TSwarmStoreDatabaseMethodArgument<P, T, DBT>;
      default:
        throw new Error('Failed to define argument value for a swarm message removing');
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
  protected getArgIterateDb<V extends T, DBT extends DbType>(
    dbName: DBO['dbName'],
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DBT>
  ): TSwarmStoreDatabaseMethodArgument<P, V, DBT> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        assert(options, 'The iteratro opti');
        return (options
          ? (extend(
              options,
              SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT
            ) as TSwarmStoreDatabaseIteratorMethodArgument<P, DBT>)
          : (SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT as TSwarmStoreDatabaseIteratorMethodArgument<
              P,
              DBT
            >)) as TSwarmStoreDatabaseMethodArgument<P, V, DBT>;
      default:
        throw new Error('Failed to define argument value for a swarm message collecting');
    }
  }

  protected async collectMessagesFromOrbitDBIterator<MD extends Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>(
    dbName: DBO['dbName'],
    rawEnties: TSwarmStoreDatabaseRequestMethodEntitiesReturnType<ESwarmStoreConnector.OrbitDB, T>, // TODO - may not be a string,
    dbType: DbType
  ): Promise<Array<MD | Error>> {
    if (rawEnties instanceof Error) {
      throw rawEnties;
    }
    if (!rawEnties) {
      return [];
    }

    const arrayEntities = rawEnties instanceof Array ? rawEnties : [rawEnties];
    const promises = arrayEntities.map(async (logEntry) => {
      if (logEntry instanceof Error) {
        return logEntry;
      }
      if (!logEntry) {
        return logEntry;
      }
      try {
        const messageMetadata = this.getSwarmMessageMetadata(logEntry as TSwarmMessageStoreEntryRaw<P, T>, dbType);
        const message = await this.constructMessage<MD>(dbName, logEntry.payload.value as MSI, messageMetadata);

        return message;
      } catch (err) {
        return err;
      }
    });
    return await Promise.all(promises);
  }

  protected isSwarmStoreDatabaseLoadMethodAnswer(
    rawEntries: TSwarmStoreDatabaseRequestMethodReturnType<P, T>
  ): rawEntries is TSwarmStoreDatabaseLoadMethodAnswer<P> {
    if (typeof rawEntries === 'object') {
      if (
        typeof (rawEntries as TSwarmStoreDatabaseLoadMethodAnswer<P>).count === 'number' &&
        typeof (rawEntries as TSwarmStoreDatabaseLoadMethodAnswer<P>).loadedCount === 'number' &&
        typeof (rawEntries as TSwarmStoreDatabaseLoadMethodAnswer<P>).overallCount === 'number'
      ) {
        return true;
      }
    }
    return false;
  }

  protected isSwarmStoreDatabaseCloseMethodAnswer(
    rawEntries: TSwarmStoreDatabaseRequestMethodReturnType<P, T>
  ): rawEntries is TSwarmStoreDatabaseCloseMethodAnswer<P> {
    if (rawEntries === undefined) {
      return true;
    }
    return false;
  }

  /**
   * Checks whether a database response consists of
   * some entities or just one.
   *
   * @protected
   * @template T
   * @param {TSwarmStoreDatabaseRequestMethodReturnType<P, T>} rawEntries
   * @returns {rawEntries is TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P, T>}
   * @memberof SwarmMessageStore
   * @throws
   */
  protected checkIsRequestMethodReturnEntries(
    rawEntries: TSwarmStoreDatabaseRequestMethodReturnType<P, T>
  ): rawEntries is TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P, T> {
    if (rawEntries instanceof Error) {
      throw rawEntries;
    }
    if (this.isSwarmStoreDatabaseLoadMethodAnswer(rawEntries)) {
      throw new Error('The argument is TSwarmStoreDatabaseLoadMethodAnswer type');
    }
    if (this.isSwarmStoreDatabaseCloseMethodAnswer(rawEntries)) {
      throw new Error('The argument is TSwarmStoreDatabaseCloseMethodAnswer type');
    }
    return true;
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
  protected collectMessages<MD extends Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>(
    dbName: DBO['dbName'],
    rawEntries: TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P, T>,
    dbType: DbType
  ): Promise<Array<MD | Error>> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return this.collectMessagesFromOrbitDBIterator<T, MD>(dbName, rawEntries, dbType);
      default:
        throw new Error('Failed to define argument value for a swarm message collecting');
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
  protected deserializeAddMessageResponse(
    addMessageResponse: TSwarmStoreDatabaseMethodAnswer<P, T>
  ): TSwarmStoreDatabaseEntityAddress<P> | undefined {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        if (typeof addMessageResponse !== 'string') {
          throw new Error('There is a wrong responce on add message request');
        }
        return addMessageResponse;
      default:
        return undefined;
    }
  }

  protected async createMessageConstructorForDb(
    dbName: DBO['dbName']
  ): Promise<PromiseResolveType<ReturnType<NonNullable<MCF>>> | undefined> {
    if (!this.swarmMessageConstructorFabric) {
      return;
    }
    return (await this.swarmMessageConstructorFabric({}, { dbName })) as PromiseResolveType<ReturnType<NonNullable<MCF>>>;
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
  protected async constructMessage<MD extends Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>(
    dbName: DBO['dbName'],
    message: MSI | TSwarmMessageConstructorBodyMessage,
    metadata?: ISwarmMessageStoreSwarmMessageMetadata<P>
  ): Promise<MD> {
    if (metadata) {
      // try to read message from the cache at first
      // by it's unique address
      const { messageAddress } = metadata;
      const messageCached = await this.getSwarmMessageInstanceFromCacheByAddress(dbName, messageAddress);

      if (messageCached) {
        return messageCached as MD;
      }
    }

    let swarmMessageInstance: Exclude<MSI, T | ISwarmMessageInstanceEncrypted>;

    if ((message as TSwarmMessageInstance).bdy && (message as TSwarmMessageInstance).sig) {
      // if the message argument is already instance of a swarm message
      if (typeof (message as ISwarmMessageInstanceEncrypted).bdy === 'string') {
        throw new Error('Swarm message should be decrypted');
      }
      swarmMessageInstance = message as Exclude<MSI, T | ISwarmMessageInstanceEncrypted>;
    } else {
      // construct swarm message instance if it's not in the cache and
      // the message argument is not an instance by itself
      const messageConsturctor = await this.getMessageConstructor(dbName);

      if (!messageConsturctor) {
        throw new Error(`A message consturctor is not specified for the database ${dbName}`);
      }
      swarmMessageInstance = (await messageConsturctor.construct(message as TSwarmMessageConstructorBodyMessage)) as Exclude<
        MSI,
        T | ISwarmMessageInstanceEncrypted
      >;
    }
    if (swarmMessageInstance && metadata) {
      await this.addMessageToCacheByMetadata(dbName, metadata, swarmMessageInstance);
    }
    return swarmMessageInstance as MD;
  }

  protected getOptionsForDatabaseMessagesCache(
    dbName: DBO['dbName']
  ): ISwarmMessageStoreUtilsMessagesCacheOptions<P, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>> {
    if (!this._cache) {
      throw new Error('Instance of storage used as messages cache is not defined');
    }
    return {
      dbName,
      cache: this._cache as StorageProvider<
        TSwarmStoreDatabaseEntityKey<P> | TSwarmStoreDatabaseEntityAddress<P> | Exclude<MSI, T | ISwarmMessageInstanceEncrypted>
      >,
    };
  }

  /**
   * set messages cache for the database
   *
   * @protected
   * @memberof SwarmMessageStore
   * @throws
   */
  protected openDatabaseMessagesCache = async (dbName: DBO['dbName']): Promise<void> => {
    const messagesCache = new SwarmMessageStoreUtilsMessagesCache<P, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>();
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
  protected unsetDatabaseMessagesCache = async (dbName: DBO['dbName']): Promise<void> => {
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
    dbName: DBO['dbName']
  ): ISwarmMessageStoreUtilsMessagesCache<P, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>> {
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
    dbName: DBO['dbName'],
    messageMetadata: ISwarmMessageStoreSwarmMessageMetadata<P>,
    messageInstance: Exclude<MSI, T | ISwarmMessageInstanceEncrypted>
  ): Promise<void> {
    const cache = this.getMessagesCacheForDb(dbName);

    if (cache) {
      const { messageAddress, key } = messageMetadata;
      const pending = [cache.setMessageByAddress(messageAddress, messageInstance)];

      if (key) {
        pending.push(cache.setMessageAddressForKey(key, messageAddress));
      }
      await Promise.all(pending);
    }
  }

  protected async removeSwarmMessageFromCacheByKey(dbName: DBO['dbName'], key: TSwarmStoreDatabaseEntityKey<P>): Promise<void> {
    const cache = this.getMessagesCacheForDb(dbName);

    if (cache) {
      await cache.unsetMessageAddressForKey(key);
    }
  }

  protected async removeSwarmMessageFromCacheByAddress(
    dbName: DBO['dbName'],
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>
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
   * @param {ISwarmMessageStoreDeleteMessageArg} deleteMessageArg
   * @memberof SwarmMessageStore
   */
  protected async removeSwarmMessageFromCacheByAddressOrKey(
    dbName: DBO['dbName'],
    deleteMessageArg: ISwarmMessageStoreDeleteMessageArg<P>
  ) {
    const databaseType = this._getDatabaseType(dbName);

    if (deleteMessageArg && databaseType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
      return await this.removeSwarmMessageFromCacheByKey(dbName, deleteMessageArg);
    }
    if (deleteMessageArg) {
      return await this.removeSwarmMessageFromCacheByAddress(dbName, deleteMessageArg);
    }
    console.warn('The message address or key is not provided', dbName, deleteMessageArg);
  }

  protected async getSwarmMessageInstanceFromCacheByAddress(
    dbName: DBO['dbName'],
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>
  ): Promise<Exclude<MSI, T | ISwarmMessageInstanceEncrypted> | undefined> {
    const cache = this.getMessagesCacheForDb(dbName);

    if (cache) {
      return await cache.getMessageByAddress(messageAddress);
    }
  }

  protected async getSwarmMessageFromCacheByRawEntry(
    dbName: DBO['dbName'],
    dbType: DbType,
    message: TSwarmMessageStoreEntryRaw<P, T> | undefined
  ): Promise<Exclude<MSI, T | ISwarmMessageInstanceEncrypted> | undefined> {
    const messageMetadata = this.getSwarmMessageMetadata<T>(message, dbType);
    if (!messageMetadata) {
      return;
    }
    return await this.getSwarmMessageInstanceFromCacheByAddress(dbName, messageMetadata.messageAddress);
  }

  /**
   * Set type for database with the name
   *
   * @protected
   * @param {string} dbName
   * @param {ESwarmStoreConnectorOrbitDbDatabaseType} dbType
   * @memberof SwarmMessageStore
   */
  protected _setDatabaseType(dbName: DBO['dbName'], dbType: DbType): void {
    this._dbTypes[dbName] = dbType;
  }

  protected _unsetDatabaseType(dbName: DBO['dbName']): void {
    delete this._dbTypes[dbName];
  }

  /**
   * Returns a database's type by it's name
   *
   * @param {string} dbName
   * @returns {(ESwarmStoreConnectorOrbitDbDatabaseType | undefined)}
   */
  protected _getDatabaseType = (dbName: DBO['dbName']): DbType | undefined => this._dbTypes[dbName];

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
      throw new Error(`Failed to connect to cache store: ${connectToCacheResult.message}`);
    }
  };

  protected _createDatabaseOptionsExtender(
    options: O
  ): ISwarmMessageStoreDatabaseOptionsExtender<
    P,
    T,
    DbType,
    DBO,
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
    PromiseResolveType<ReturnType<NonNullable<MCF>>>
  > {
    return createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControl<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      CFO,
      MD,
      GAC,
      MCF,
      ACO,
      O
    >(
      options,
      getMessageValidator as (
        dboptions: DBO,
        messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>,
        grantAccessCb: GAC | undefined,
        currentUserId: TCentralAuthorityUserIdentity
      ) => TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, MD>
    );
  }

  protected _setCurrentDatabaseOptionsExtenderWithAccessControl(
    extenderDbOptionsWithAccessControl: ISwarmMessageStoreDatabaseOptionsExtender<
      P,
      T,
      DbType,
      DBO,
      DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
      PromiseResolveType<ReturnType<NonNullable<MCF>>>
    >
  ): void {
    this.extendDBOWithAccessControl = extenderDbOptionsWithAccessControl;
  }

  protected async _extendSwarmMessgeStoreOptions(options: O) {
    return await extendSwarmMessageStoreConnectionOptionsWithAccessControlAndConnectorSpecificOptions<
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
      ACO,
      O
    >(options);
  }
}
