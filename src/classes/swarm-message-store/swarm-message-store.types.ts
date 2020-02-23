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
  userId: string,
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
  grantAcess?: TSwarmMessageStoreAccessControlGrantAccessCallback;
  // a list of the user identifiers for whom an unconditional write access will be given
  allowAccessFor?: TSwarmMessageUserIdentifierSerialized[];
}

/**
 * swarm message constructors,specified for a databases
 * and the default constructor for a messages
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
}

export type TSwarmMessageStoreConnectReturnType<
  P extends ESwarmStoreConnector
> = ReturnType<ISwarmStore<P>['connect']>;

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
  extends Omit<ISwarmStore<P>, 'connect'>,
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
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStore
   * @throws
   */
  addMessage(dbName: string, message: ISwarmMessageInstance): Promise<void>;
  /**
   * delete a message by it's address from the database
   * @param dbName
   * @param messageAddress
   * @returns {Promise<void>}
   * @memberof ISwarmMessageStore
   * @throws
   */
  deleteMessage(
    dbName: string,
    messageAddress: string,
    message: ISwarmMessageInstance | string
  ): Promise<void>;
  /**
   * read all messages existing in the database
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
