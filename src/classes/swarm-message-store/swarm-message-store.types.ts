import {
  ISwarmStore,
  ISwarmStoreEvents,
  ISwarmStoreOptions,
} from '../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageInstance } from '../swarm-message/swarm-message-constructor.types';
import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from './swarm-message-store.const';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';

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
}

export type TSwarmMessageStoreAccessControlGrantAccessCallback = (
  // swarm message
  message: ISwarmMessageInstance,
  // identifier of the user sender of the message
  userId: string,
  // TODO - a name of the database from where the message is comming from
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
  allowedAccessFor?: TSwarmMessageUserIdentifierSerialized[];
}

export interface ISwarmMessageStoreOptions<P extends ESwarmStoreConnector>
  extends ISwarmStoreOptions<P>,
    ISwarmMessageStoreAccessControlOptions {}

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
  addMessage(
    dbName: string,
    message: ISwarmMessageStoreOptions<P>
  ): Promise<void>;
}
