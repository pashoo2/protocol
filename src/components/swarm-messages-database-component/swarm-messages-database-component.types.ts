import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';

export interface ISwarmMessagesDatabaseMessageDescription<
  P extends ESwarmStoreConnector.OrbitDB
> {
  id: TSwarmStoreDatabaseEntityKey<P>;
  key?: string;
  message: ISwarmMessageInstanceDecrypted;
}

export interface ISwarmMessagesDatabaseDeleteMessageDescription<
  P extends ESwarmStoreConnector.OrbitDB
> {
  /**
   * Id of the message which removed another message.
   *
   * @type {TSwarmStoreDatabaseEntityKey<P>}
   * @memberof ISwarmMessagesDatabaseDeleteMessageDescription
   */
  id: TSwarmStoreDatabaseEntityKey<P>;
  /**
   * a key or a hash of a message which was removed
   *
   * @type {string}
   * @memberof ISwarmMessagesDatabaseMessageDescription
   */
  keyOrIdRemoved?: string;
  /**
   * User's id who removed the message.
   *
   * @type {string}
   * @memberof ISwarmMessagesDatabaseMessageDescription
   */
  userId: string;
}
