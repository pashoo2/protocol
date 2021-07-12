import { ISwarmStoreConnectorDatabaseAccessControlleGrantCallback, ISwarmStoreDatabaseBaseOptionsWithWriteAccess, TSwarmStoreValueTypes } from '../../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../swarm-store-class.const';
export interface ISwarmStoreConnectorOrbitDbDatabaseAccessControllerManifest {
    skipManifest?: boolean;
}
export interface ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback<TValueType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>> extends ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<ESwarmStoreConnector.OrbitDB, TValueType> {
}
export interface ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptions extends ISwarmStoreDatabaseBaseOptionsWithWriteAccess {
    type?: string;
}
export interface ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<TFeedStoreType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>> extends ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptions, ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback<TFeedStoreType> {
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-access-controller.types.d.ts.map