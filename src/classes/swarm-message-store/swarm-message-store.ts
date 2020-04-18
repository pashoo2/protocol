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
  ISwarmMessageInstance,
} from '../swarm-message/swarm-message-constructor.types';
import {
  ESwarmMessageStoreEventNames,
  SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT,
} from './swarm-message-store.const';
import { extend } from '../../utils/common-utils/common-utils-objects';
import { ISwarmStoreConnectorOrbitDbDatabaseIteratorAnswer } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import {
  TSwarmStoreDatabaseIteratorMethodAnswer,
  TSwarmStoreDatabaseMethodAnswer,
} from '../swarm-store-class/swarm-store-class.types';
import {
  TSwarmStoreDatabaseMethodArgument,
  TSwarmStoreDatabaseIteratorMethodArgument,
} from '../swarm-store-class/swarm-store-class.types';
import {
  ESwarmStoreConnectorOrbitDbDatabaseMethodNames,
  TSwarmStoreConnectorOrbitDbDatabaseMethodNames,
} from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
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
  TSwarmMessageSeriazlized,
  ISwarmMessage,
} from '../swarm-message/swarm-message-constructor.types';
import { isDefined } from '../../utils/common-utils/common-utils-main';
import { SwarmMessageConstructor } from '../swarm-message/swarm-message-constructor';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessgaeEncryptedCache } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { TSwarmMessageConstructorBodyMessage } from '../swarm-message/swarm-message-constructor.types';

export class SwarmMessageStore<P extends ESwarmStoreConnector>
  extends SwarmStore<P, ISwarmMessageStoreEvents>
  implements ISwarmMessageStore<P> {
  protected connectorType: P | undefined;

  protected accessControl?: ISwarmMessageStoreAccessControlOptions;

  protected messageConstructors?: ISwarmMessageDatabaseConstructors;

  protected swarmMessageConstructorFabric?: ISwarmMessageConstructorWithEncryptedCacheFabric;

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
    options: ISwarmMessageStoreOptions<P>
  ): TSwarmMessageStoreConnectReturnType<P> {
    const optionsSwarmStore = await swarmMessageStoreUtilsConnectorOptionsProvider(
      options
    );

    this.setOptions(optionsSwarmStore);

    const connectionResult = await super.connect(optionsSwarmStore);

    if (connectionResult instanceof Error) {
      throw connectionResult;
    }
    this.setListeners();
  }

  public async addMessage(
    dbName: string,
    msg: ISwarmMessageInstance | TSwarmMessageConstructorBodyMessage | string
  ): Promise<TSwarmMessageStoreMessageId> {
    const message: ISwarmMessageInstance | string =
      typeof msg === 'string' ? msg : await this.constructMessage(dbName, msg);

    assert(dbName, 'Database name must be provided');
    this.validateMessageFormat(message);

    const response = (await this.request<
      TSwarmStoreValueTypes<P>,
      TSwarmMessageStoreMessageId
    >(dbName, this.dbMethodAddMessage, this.serializeMessage(message))) as
      | TSwarmStoreDatabaseMethodAnswer<P, string>
      | Error;

    if (response instanceof Error) {
      throw response;
    }
    return this.deserializeAddMessageResponse(response);
  }

  public async deleteMessage(
    dbName: string,
    messageAddress: ISwarmMessageStoreDeleteMessageArg<P>
  ): Promise<void> {
    assert(dbName, 'Database name must be provided');
    assert(
      messageAddress && typeof messageAddress === 'string',
      'Message address must be a non empty string'
    );

    const result = await this.request(
      dbName,
      this.dbMethodRemoveMessage,
      this.getArgRemoveMessage(messageAddress)
    );

    if (result instanceof Error) {
      throw result;
    }
  }

  public async collect(
    dbName: string,
    options: TSwarmStoreDatabaseIteratorMethodArgument<P>
  ) {
    assert(typeof dbName === 'string', '');

    const iterator = await this.request(
      dbName,
      this.dbMethodIterator,
      this.getArgIterateDb(dbName, options)
    );

    if (iterator instanceof Error) {
      throw iterator;
    }
    return this.collectMessages(
      dbName,
      iterator as TSwarmStoreDatabaseIteratorMethodAnswer<P, any>
    );
  }

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
    } catch (err) {
      console.error(
        `Failed to clear messages encrypted cache for the database ${dbName}`
      );
      return err;
    }
  }

  protected validateOpts(options: ISwarmMessageStoreOptions<P>): void {
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
  }

  protected setOptions(options: ISwarmMessageStoreOptions<P>): void {
    this.validateOpts(options);
    this.connectorType = options.provider;
    this.accessControl = options.accessControl;
    this.messageConstructors = options.messageConstructors;
    this.swarmMessageConstructorFabric = options.swarmMessageConstructorFabric;
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
    error: Error
  ) => {
    this.emit(
      ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR,
      dbName,
      message,
      error,
      messageAddr
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
    message: ISwarmMessageInstance,
    messageAddr: string
  ) => {
    console.log('SwarmMessageStore::emitMessageNew', {
      dbName,
      message,
      messageAddr,
    });
    this.emit(
      ESwarmMessageStoreEventNames.NEW_MESSAGE,
      dbName,
      message,
      messageAddr
    );
  };

  /**
   * handle a new message stored in the local database
   *
   * @memberof SwarmMessageStore
   */
  protected handleNewMessage = async ([dbName, message, messageAddress]: [
    string,
    P extends ESwarmStoreConnector.OrbitDB
      ? LogEntry<TSwarmMessageSeriazlized>
      : any,
    string
  ]): Promise<void> => {
    console.log('SwarmMessageStore::handleNewMessage', {
      dbName,
      message,
      messageAddress,
    });
    const messageConstructor = await this.getMessageConstructor(dbName);

    if (
      typeof message !== 'object' ||
      typeof message.payload !== 'object' ||
      typeof message.payload.value !== 'string'
    ) {
      return this.emitMessageConstructionFails(
        dbName,
        String(message),
        messageAddress,
        new Error('There is unknown message format')
      );
    }

    const { hash: messageHash, payload } = message;
    const { value: messageString } = payload;

    if (!messageConstructor) {
      return this.emitMessageConstructionFails(
        dbName,
        messageString,
        messageHash,
        new Error('There is no message constructor specified for the message')
      );
    }

    try {
      const swarmMessage = await messageConstructor.construct(messageString);

      if (swarmMessage instanceof Error) {
        return this.emitMessageConstructionFails(
          dbName,
          messageString,
          messageHash,
          swarmMessage
        );
      }
      return this.emitMessageNew(dbName, swarmMessage, message.hash);
    } catch (err) {
      return this.emitMessageConstructionFails(
        dbName,
        messageString,
        messageHash,
        err
      );
    }
  };

  protected setListeners() {
    this.addListener(ESwarmStoreEventNames.NEW_ENTRY, this.handleNewMessage);
  }

  /**
   * validate format of a message to send
   *
   * @protected
   * @param {(ISwarmMessageInstance | string)} message
   * @memberof SwarmMessageStore
   */
  protected validateMessageFormat(message: ISwarmMessageInstance | string) {
    assert(message, 'Message must be provided');
    assert(
      typeof message === 'string' || typeof message === 'object',
      'Message must be a string or an object'
    );
    assert(
      typeof (message as ISwarmMessageInstance).bdy === 'object' &&
        typeof (message as ISwarmMessageInstance).uid === 'string' &&
        typeof (message as ISwarmMessageInstance).sig === 'string',
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
    message: ISwarmMessageInstance | string
  ): TSwarmStoreValueTypes<P> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return String(message) as TSwarmStoreValueTypes<P>;
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
   * @param {(ISwarmMessageInstance | string)} message
   * @returns {TSwarmStoreDatabaseMethodArgument<P, TSwarmStoreValueTypes<P>>}
   * @memberof SwarmMessageStore
   */
  protected getArgRemoveMessage(
    messageAddress: string
  ): TSwarmStoreDatabaseMethodArgument<P, TSwarmStoreValueTypes<P>> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return messageAddress as TSwarmStoreDatabaseMethodArgument<
          P,
          TSwarmStoreValueTypes<P>
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
  protected getArgIterateDb(
    dbName: string,
    options: TSwarmStoreDatabaseIteratorMethodArgument<P>
  ): TSwarmStoreDatabaseIteratorMethodArgument<P> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        assert(options, 'The iteratro opti');
        return options
          ? (extend(
              options,
              SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT
            ) as TSwarmStoreDatabaseIteratorMethodArgument<P>)
          : (SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT as TSwarmStoreDatabaseIteratorMethodArgument<
              P
            >);
      default:
        throw new Error(
          'Failed to define argument value for a swarm message collecting'
        );
    }
  }

  protected async collectMessagesFromOrbitDBIterator(
    dbName: string,
    iteratorAnswer: TSwarmStoreDatabaseIteratorMethodAnswer<
      ESwarmStoreConnector.OrbitDB,
      string
    > // TODO - may be not a string
  ): Promise<(ISwarmMessageInstance | Error)[]> {
    const messageConstructor = await this.getMessageConstructor(dbName);

    if (!messageConstructor) {
      throw new Error(
        `Message constructor is not defined for the database "${dbName}"`
      );
    }

    if (iteratorAnswer instanceof Error) {
      throw iteratorAnswer;
    }
    return Promise.all(
      iteratorAnswer
        .map((messageSerialized) => {
          if (messageSerialized instanceof Error) {
            return messageSerialized;
          }
          if (!messageSerialized) {
            return messageSerialized;
          }
          try {
            return messageConstructor
              .construct(messageSerialized.value)
              .catch((err: Error) => err);
          } catch (err) {
            return err;
          }
        })
        .filter(isDefined)
    );
  }

  /**
   * collect messages from iterator
   *
   * @protected
   * @param {TSwarmStoreDatabaseIteratorMethodAnswer<P, any>} iterator
   * @returns {ISwarmMessageInstance[]}
   * @memberof SwarmMessageStore
   */
  protected collectMessages(
    dbName: string,
    iterator: TSwarmStoreDatabaseIteratorMethodAnswer<P, any>
  ): Promise<(ISwarmMessageInstance | Error)[]> {
    const { connectorType } = this;

    switch (connectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return this.collectMessagesFromOrbitDBIterator(dbName, iterator);
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
   *       TSwarmMessageSeriazlized
   *     >} addMessageResponse
   * @returns {TSwarmMessageStoreMessageId}
   * @memberof SwarmMessageStore
   */
  protected deserializeAddMessageResponse(
    addMessageResponse: TSwarmStoreDatabaseMethodAnswer<
      P,
      TSwarmMessageSeriazlized
    >
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
    debugger;
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
   * @param {(ISwarmMessageInstance | TSwarmMessageConstructorBodyMessage)} message
   * @returns {Promise<ISwarmMessageInstance>}
   * @memberof SwarmMessageStore
   */
  protected async constructMessage(
    dbName: string,
    message: ISwarmMessageInstance | TSwarmMessageConstructorBodyMessage
  ): Promise<ISwarmMessageInstance> {
    if (
      (message as ISwarmMessageInstance).bdy &&
      (message as ISwarmMessageInstance).sig
    ) {
      return message as ISwarmMessageInstance;
    }

    const messageConsturctor = await this.getMessageConstructor(dbName);
    debugger;
    if (!messageConsturctor) {
      throw new Error(
        `A message consturctor is not specified for the database ${dbName}`
      );
    }
    return await messageConsturctor.construct(
      message as TSwarmMessageConstructorBodyMessage
    );
  }
}
