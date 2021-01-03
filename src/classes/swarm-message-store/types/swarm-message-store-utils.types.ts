import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageConstructor } from '../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../swarm-store-class/swarm-store-class.types';

export interface ISwarmMessageStoreDatabaseOptionsExtender<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOE extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  SMC extends ISwarmMessageConstructor
> {
  (dbOptions: DBO, swarmMessageConstructor: SMC): DBOE;
}
