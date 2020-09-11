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
