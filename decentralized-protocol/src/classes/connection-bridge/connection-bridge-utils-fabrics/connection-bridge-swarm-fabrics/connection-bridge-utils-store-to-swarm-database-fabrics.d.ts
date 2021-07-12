import { ESwarmStoreConnector, ISwarmStoreConnectorBasic, ISwarmStoreConnectorBasicWithEntriesCount, ISwarmStoreConnectorOrbitDbConnecectionBasicFabric, ISwarmStoreConnectorOrbitDbDatabaseOptions, TSwarmStoreConnectorBasicFabric, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseOptions } from '../../../swarm-store-class';
import OrbitDB from 'orbit-db';
import { IConnectionBridgeSwarmConnection, TNativeConnectionType } from '../../types/connection-bridge.types';
import { IPFS } from '../../../../types';
export declare const connectorBasicFabricOrbitDBDefault: <T extends string, DbType extends import("../../../swarm-store-class").ESwarmStoreConnectorOrbitDbDatabaseType, DBO extends ISwarmStoreConnectorOrbitDbDatabaseOptions<T, DbType>>(dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<T, DbType>, orbitDb: OrbitDB) => ISwarmStoreConnectorBasic<ESwarmStoreConnector, T, DbType, DBO>;
export declare const connectorBasicFabricOrbitDBWithEntriesCount: <T extends string, DbType extends import("../../../swarm-store-class").ESwarmStoreConnectorOrbitDbDatabaseType, DBO extends ISwarmStoreConnectorOrbitDbDatabaseOptions<T, DbType>>(dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<T, DbType>, orbitDb: OrbitDB) => ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, T, DbType, DBO>;
export declare const getSwarmStoreConnectionProviderOptionsForOrbitDb: <T extends string, DbType extends import("../../../swarm-store-class").ESwarmStoreConnectorOrbitDbDatabaseType, DBO extends ISwarmStoreConnectorOrbitDbDatabaseOptions<T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<ESwarmStoreConnector, T, DbType, DBO>, NC extends IPFS, SC extends IConnectionBridgeSwarmConnection<ESwarmStoreConnector, NC>>(swarmConnection: SC, connectorBasicFabric: ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<T, DbType, DBO, ConnectorBasic>) => import("../../../swarm-store-class").ISwarmStoreConnectorOrbitDBConnectionOptions<T, DbType, DBO, ConnectorBasic>;
export declare const getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector: <P extends ESwarmStoreConnector, T extends string, DbType extends import("../../../swarm-store-class").ESwarmStoreConnectorOrbitDbDatabaseType, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, NC extends TNativeConnectionType<P>, SC extends IConnectionBridgeSwarmConnection<P, NC>>(swarmStoreConnectorType: P, swarmConnection: SC, connectorBasicFabric: TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic>) => TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>;
//# sourceMappingURL=connection-bridge-utils-store-to-swarm-database-fabrics.d.ts.map