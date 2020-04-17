import {
  ISwarmStore,
  ISwarmStoreEvents,
  ISwarmStoreOptions,
} from '../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageInstance,
  ISwarmMessageConstructor,
} from '../swarm-message/swarm-message-constructor.types';
import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from './swarm-message-store.const';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { TSwarmStoreDatabaseIteratorMethodArgument } from '../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageSeriazlized } from '../swarm-message/swarm-message-constructor.types';
import { TCentralAuthorityUserIdentity } from '../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';

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
   *     ISwarmMessageInstance,
   *     string
   *   ]}
   * @memberof ISwarmMessageStoreEvents
   */
  [ESwarmMessageStoreEventNames.NEW_MESSAGE]: [
    string,
    ISwarmMessageInstance,
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

export type TSwarmMessageStoreAccessControlGrantAccessCallback = (
  // swarm message
  message: ISwarmMessageInstance,
  // identifier of the user sender of the message
  userId: TCentralAuthorityUserIdentity,
  // a name of the database from where the message is comming from
  // TODO - can it be gotten from the database entry??
  dbName: string
) => Promise<boolean>;

/**
 * grant the write access options to define access options
 * for the databases connected to
 *
 * @export
 * @interface ISwarmMessageStoreAccessControlOptions
 */
export interface ISwarmMessageStoreAccessControlOptions {
  // async callback which is called each time before a new message will be wrote to the database
  grantAccess?: TSwarmMessageStoreAccessControlGrantAccessCallback;
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
  accessControl?: ISwarmMessageStoreAccessControlOptions;
  messageConstructors: ISwarmMessageDatabaseConstructors;
  providerConnectionOptions: any;
  swarmMessageConstructorFabric?: ISwarmMessageConstructorWithEncryptedCacheFabric;
}

export type TSwarmMessageStoreConnectReturnType<
  P extends ESwarmStoreConnector
> = ReturnType<ISwarmStore<P, TSwarmMessageSeriazlized>['connect']>;

export type ISwarmMessageStoreDeleteMessageArg<
  P extends ESwarmStoreConnector
> = P extends ESwarmStoreConnector.OrbitDB
  ? string // swarm message address
  : ISwarmMessageInstance; // instance of the message to remove

/**
 * allows to write messages to the swarm storage
 *
 * @export
 * @interface ISwarmMessageStore
 * @extends {Omit<ISwarmStore<P>, 'connect'>}
 * @extends {EventEmitter<ISwarmMessageStoreEvents>}
 * @template P
 */
export interface ISwarmMessageStore<P extends ESwarmStoreConnector>
  extends ISwarmStore<P, TSwarmMessageSeriazlized>,
    EventEmitter<ISwarmMessageStoreEvents> {
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
  /**
   * add message to a database with the given name
   *
   * @param {string} dbName - name of the database
   * @param {ISwarmMessageStoreOptions<P>} message - message to add
   * @returns {Promise<TSwarmMessageStoreMessageId>} - unique message's identifier in the database
   * @memberof ISwarmMessageStore
   * @throws
   */
  addMessage(
    dbName: string,
    message: ISwarmMessageInstance
  ): Promise<TSwarmMessageStoreMessageId>;
  /**
   * Message removed from the database
   * or marked as removed, It will not
   * be accessed with iterator.
   *
   * @param dbName
   * @param messageAddress
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
  ): Promise<(ISwarmMessageInstance | Error)[]>;
}
