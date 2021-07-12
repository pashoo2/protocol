import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmStoreConnectorUtilsDatabaseOptionsValidators } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseOptionsSerialized } from '../../../../swarm-store-class/swarm-store-class.types';
export declare class SwarmStoreConnectorDbOptionsValidators<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> implements ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P, ItemType, DbType, DBO, DBOS> {
    isValidSerializedOptions(dbOptionsSerialized: unknown): dbOptionsSerialized is DBOS;
    isValidOptions(dbo: unknown): dbo is DBO;
}
//# sourceMappingURL=swarm-store-connector-db-options-validators.d.ts.map