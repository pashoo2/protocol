import { IPFS } from 'types/ipfs.types';
import {
  ISwarmStoreConnectorOrbitDbDatabaseOptions,
  TSwarmStoreConnectorOrbitDbDatabaseEntityIndex,
} from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreEvents,
  ISwarmStoreMainOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
} from '../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import OrbitDB from 'orbit-db';

export interface ISwarmStoreConnectorOrbitDBEvents<
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmStoreValueTypes<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>
> extends ISwarmStoreEvents<P, ItemType, DBO> {}

/**
 * directory - this string will be used as a
 * part of keynames for all storages and databases.
 * If the credentials property does not specified
 * then the local secret storage will not be used
 * and all data will be stored in the default,
 * not safe, storages of the OrbitDB.
 *
 * @export
 * @interface ISwarmStoreConnectorOrbitDBOptions
 * @template TFeedStoreTypes
 */
export interface ISwarmStoreConnectorOrbitDBOptions<DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>>
  extends ISwarmStoreMainOptions<ESwarmStoreConnector.OrbitDB> {
  // databases which must be started when the orbit db
  // instance will be ready to use
  databases: ISwarmStoreConnectorOrbitDbDatabaseOptions<DbType>[];
}

export interface ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<
  T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType>
> {
  (dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<T>, orbitDb: OrbitDB): ConnectorBasic;
}

export interface ISwarmStoreConnectorOrbitDBSpecificConnectionOptions {
  ipfs: IPFS; // instance of IPFS connection
}

export interface ISwarmStoreConnectorOrbitDBConnectionOptions<
  T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType>
> extends ISwarmStoreConnectorOrbitDBSpecificConnectionOptions {
  connectorFabric: ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<T, DbType, ConnectorBasic>;
}

export interface ISwarmStoreConnectorOrbitDBLogEntity<T> {
  op?: string;
  key?: string;
  value: T;
}

export type TSwarmStoreConnectorOrbitDBEnityKey = TSwarmStoreConnectorOrbitDbDatabaseEntityIndex;

export enum ESwarmStoreConnectorOrbitDbDatabaseMethodNames {
  'get' = 'get',
  'add' = 'add',
  'remove' = 'remove',
  'iterator' = 'iterator',
  'close' = 'close',
  'load' = 'load',
}
