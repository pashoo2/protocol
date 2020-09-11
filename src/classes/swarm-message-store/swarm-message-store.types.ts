import {
  ISwarmStore,
  ISwarmStoreEvents,
  ISwarmStoreOptions,
} from '../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageInstance,
  ISwarmMessageConstructor,
} from '../swarm-message/swarm-message-constructor.types';
import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from './swarm-message-store.const';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import {
  TSwarmStoreDatabaseIteratorMethodArgument,
  TSwarmStoreDatabaseEntityKey,
} from '../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessageSeriazlized,
  TSwarmMessageConstructorBodyMessage,
} from '../swarm-message/swarm-message-constructor.types';
import { TCentralAuthorityUserIdentity } from '../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { IStorageCommon } from 'types/storage.types';
import { TSwarmStoreDatabaseEntryOperation } from '../swarm-store-class/swarm-store-class.types';

/**
 * message unique identifier in the database
 */
export type TSwarmMessageStoreMessageId = string;

export interface ISwarmMessageStoreEvents extends ISwarmStoreEvents {
  /**
   * new message stored in the local database
   * 1) the first argument - database name where the message was added
   * 2) the second argument - swarm message instance
   * 3) the third argument - the global unique address of the message in the swarm
   *
   * @type {[
   *     string,
   TSwarmMessageInstance,
   *     string
   *   ]}
   * @memberof ISwarmMessageStoreEvents
   */
  [ESwarmMessageStoreEventNames.NEW_MESSAGE]: [
    string,
    TSwarmMessageInstance,
    string
  ];
  /**
   * failed to deserialize a new message stored
   *
   * @type {[
   *     string,
   *     string,
   *     Error,
   *     string
   *   ]}
   * @memberof ISwarmMessageStoreEvents
   */
  [ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR]: [
    string,
    string,
    Error,
    string
  ];
}

export type TSwarmMessageStoreAccessControlGrantAccessCallback<
  P extends ESwarmStoreConnector
> = (
  // swarm message
  message: TSwarmMessageInstance,
  // identifier of the user sender of the message
  userId: TCentralAuthorityUserIdentity,
  // a name of the database from where the message is comming from
  // TODO - can it be gotten from the database entry??
  dbName: string,
  // key for the value in the database
  key?: string,
  // operation on the database
  op?: TSwarmStoreDatabaseEntryOperation<P>
) => Promise<boolean>;

/**
 * grant the write access options to define access options
 * for the databases connected to
 *
 * @export
 * @interface ISwarmMessageStoreAccessControlOptions
 */
export interface ISwarmMessageStoreAccessControlOptions<
  P extends ESwarmStoreConnector
> {
  // async callback which is called each time before a new message will be wrote to the database
  grantAccess?: TSwarmMessageStoreAccessControlGrantAccessCallback<P>;
  // a list of the user identifiers for whom an unconditional write access will be given
  allowAccessFor?: TSwarmMessageUserIdentifierSerialized[];
}

/**
 * Swarm message constructors,specified for a databases
 * and the default constructor for a messages.
 * Each private database must have it's own
 * message constructor with it's own instance of the swarm message
 * swarm message encrypted cache.
 *
 * @export
 * @interface ISwarmMessageDatabaseConstructors
 */
export interface ISwarmMessageDatabaseConstructors {
  [dbName: string]: ISwarmMessageConstructor;
  default: ISwarmMessageConstructor;
}

export interface ISwarmMessageStoreOptions<P extends ESwarmStoreConnector>
  extends ISwarmStoreOptions<P> {
  accessControl?: ISwarmMessageStoreAccessControlOptions<P>;
  messageConstructors: ISwarmMessageDatabaseConstructors;
  providerConnectionOptions: any;
  databasesListStorage: IStorageCommon;
  swarmMessageConstructorFabric?: ISwarmMessageConstructorWithEncryptedCacheFabric;
}

export type TSwarmMessageStoreConnectReturnType<
  P extends ESwarmStoreConnector
> = ReturnType<ISwarmStore<P, TSwarmMessageSeriazlized>['connect']>;

export type ISwarmMessageStoreDeleteMessageArg<
  P extends ESwarmStoreConnector
> = P extends ESwarmStoreConnector.OrbitDB
  ? TSwarmStoreDatabaseEntityKey<P> // swarm message address
  : TSwarmMessageInstance; // instance of the message to remove

/**
 * Methods for messaging between swarm users.
 *
 * @export
 * @interface ISwarmMessageStoreMessagingMethods
 * @template P
 */
export interface ISwarmMessageStoreMessagingMethods<
  P extends ESwarmStoreConnector
> {
  /**
   * add message to a database with the given name
   *
   * @param {string} dbName - name of the database
   * @param {ISwarmMessageStoreOptions<P>} message - message to add
   * @param {TSwarmStoreDatabaseEntityKey<P>} key - key for the message under which the message will be stored
   * @returns {Promise<TSwarmMessageStoreMessageId>} - unique message's identifier in the database
   * @memberof ISwarmMessageStore
   * @throws
   */
  addMessage(
    dbName: string,
    message: TSwarmMessageInstance,
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<TSwarmMessageStoreMessageId>;

  /**
   * add message serialized to a database with the given name
   *
   * @param {string} dbName - name of the database
   * @param {ISwarmMessageStoreOptions<P>} message - message to add
   * @returns {Promise<TSwarmMessageStoreMessageId>} - unique message's identifier in the database
   * @memberof ISwarmMessageStore
   * @throws
   */
  addMessage(
    dbName: string,
    message: string,
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<TSwarmMessageStoreMessageId>;

  /**
   * construct and add message to a database with the given name.
   *
   * @param {string} dbName - name of the database
   * @param {ISwarmMessageStoreOptions<P>} message - message to add
   * @returns {Promise<TSwarmMessageStoreMessageId>} - unique message's identifier in the database
   * @memberof ISwarmMessageStore
   * @throws
   */
  addMessage(
    dbName: string,
    message: TSwarmMessageConstructorBodyMessage,
    key?: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<TSwarmMessageStoreMessageId>;

  /**
   * Message removed from the database
   * or marked as removed, It will not
   * be accessed with iterator.
   *
   * @param dbName
   * @param messageAddress - a message's key for a key value store.
   * A message's address in the swarm for a non key value store.
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStore
   * @throws
   */
  deleteMessage(
    dbName: string,
    messageAddress: ISwarmMessageStoreDeleteMessageArg<P>
  ): Promise<void>;
  /**
   * read all messages existing (not removed) in the database
   * with the name provided.
   *
   * @param dbName
   * @param messageAddress
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStore
   * @throws
   */
  collect(
    dbName: string,
    options: TSwarmStoreDatabaseIteratorMethodArgument<P>
  ): Promise<(TSwarmMessageInstance | Error)[]>;
}

/**
 * Allows to write messages to the swarm storage
 * and creating a new swarm databases.
 *
 * @export
 * @interface ISwarmMessageStore
 * @extends {Omit<ISwarmStore<P>, 'connect'>}
 * @extends {EventEmitter<ISwarmMessageStoreEvents>}
 * @template P
 */
export interface ISwarmMessageStore<P extends ESwarmStoreConnector>
  extends ISwarmStore<P, TSwarmMessageSeriazlized>,
    EventEmitter<ISwarmMessageStoreEvents>,
    ISwarmMessageStoreMessagingMethods<P> {
  /**
   * connect to the swarm storage
   *
   * @param {ISwarmMessageStoreOptions<P>} options
   * @returns {TSwarmMessageStoreConnectReturnType<P>}
   * @memberof ISwarmMessageStore
   * @throws
   */
  connect(
    options: ISwarmMessageStoreOptions<P>
  ): TSwarmMessageStoreConnectReturnType<P>;
}
