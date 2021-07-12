import { IPFS } from 'types/ipfs.types';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions, TSwarmStoreConnectorOrbitDbDatabaseEntityIndex } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ISwarmStoreConnectorBasic, ISwarmStoreEvents, ISwarmStoreMainOptions, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType, TSwarmStoreValueTypes } from '../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import OrbitDB from 'orbit-db';
export interface ISwarmStoreConnectorOrbitDBEvents<P extends ESwarmStoreConnector.OrbitDB, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>> extends ISwarmStoreEvents<P, ItemType, DbType, DBO> {
}
export interface ISwarmStoreConnectorOrbitDBOptions<ItemType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>, DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>> extends ISwarmStoreMainOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType> {
    databases: ISwarmStoreConnectorOrbitDbDatabaseOptions<ItemType, DbType>[];
}
export interface ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>, DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>, DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType, DBO>> {
    (dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<T, DbType>, orbitDb: OrbitDB): ConnectorBasic;
}
export interface ISwarmStoreConnectorOrbitDBSpecificConnectionOptions {
    ipfs: IPFS;
}
export interface ISwarmStoreConnectorOrbitDBConnectionOptions<T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>, DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>, DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType, DBO>> extends ISwarmStoreConnectorOrbitDBSpecificConnectionOptions {
    connectorBasicFabric: ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<T, DbType, DBO, ConnectorBasic>;
}
export interface ISwarmStoreConnectorOrbitDBLogEntity<T> {
    op?: string;
    key?: string;
    value: T;
}
export declare type TSwarmStoreConnectorOrbitDBEnityKey = TSwarmStoreConnectorOrbitDbDatabaseEntityIndex;
export declare enum ESwarmStoreConnectorOrbitDbDatabaseMethodNames {
    'get' = "get",
    'add' = "add",
    'remove' = "remove",
    'iterator' = "iterator",
    'close' = "close",
    'load' = "load"
}
//# sourceMappingURL=swarm-store-connector-orbit-db.types.d.ts.map