import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceConstructor } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseOptionsSerialized } from 'classes/swarm-store-class/swarm-store-class.types';
export declare function swarmStoreConnectorDbOptionsValidatorsWithGACValidationClassFabric<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized>(ValidatorsClass: ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceConstructor<P, ItemType, DbType, DBO, DBOS>, grantAccessCallbackValidator: (cb: unknown) => boolean): ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceConstructor<P, ItemType, DbType, DBO, DBOS>;
//# sourceMappingURL=swarm-store-connector-db-options-validators-fabric.d.ts.map