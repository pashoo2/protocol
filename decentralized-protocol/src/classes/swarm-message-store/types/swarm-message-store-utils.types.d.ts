import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageConstructor } from '../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../swarm-store-class/swarm-store-class.types';
export interface ISwarmMessageStoreDatabaseOptionsExtender<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, DBOE extends TSwarmStoreDatabaseOptions<P, T, DbType>, SMC extends ISwarmMessageConstructor> {
    (dbOptions: DBO, swarmMessageConstructor: SMC): DBOE;
}
//# sourceMappingURL=swarm-message-store-utils.types.d.ts.map