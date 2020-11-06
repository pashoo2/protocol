import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmMessageUserIdentifierSerialized } from '../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';

export interface ISwarmMessagesDatabaseMessageDescription<P extends ESwarmStoreConnector.OrbitDB> {
  id: TSwarmStoreDatabaseEntityKey<P>;
  key?: string;
  message: ISwarmMessageInstanceDecrypted;
}

export interface ISwarmMessagesDatabaseDeleteMessageDescription<P extends ESwarmStoreConnector.OrbitDB> {
  /**
   * Id of the message which removed another message.
   *
   * @type {TSwarmStoreDatabaseEntityKey<P>}
   * @memberof ISwarmMessagesDatabaseDeleteMessageDescription
   */
  id: TSwarmStoreDatabaseEntityKey<P>;
  /**
   * hash of a message which was removed
   *
   * @type {string}
   * @memberof ISwarmMessagesDatabaseMessageDescription
   */
  idDeleted: TSwarmStoreDatabaseEntityKey<P> | undefined;
  /**
   * a key of a message which was removed
   *
   * @type {string}
   * @memberof ISwarmMessagesDatabaseMessageDescription
   */
  key: string | undefined;
  /**
   * User's id who removed the message.
   *
   * @type {string}
   * @memberof ISwarmMessagesDatabaseMessageDescription
   */
  userId: TSwarmMessageUserIdentifierSerialized;
}
