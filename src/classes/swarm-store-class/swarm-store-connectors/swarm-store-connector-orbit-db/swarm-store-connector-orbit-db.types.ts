import { IPFS } from 'types/ipfs.types';
import {
  ISwarmStoreConnectorOrbitDbDatabaseOptions,
  TSwarmStoreConnectorOrbitDbDatabaseEntityIndex,
} from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreEvents,
  ISwarmStoreMainOptions,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
} from '../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import OrbitDB from 'orbit-db';

export interface ISwarmStoreConnectorOrbitDBEvents extends ISwarmStoreEvents {}

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
export interface ISwarmStoreConnectorOrbitDBOptions<
  TFeedStoreTypes extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
> extends ISwarmStoreMainOptions<ESwarmStoreConnector.OrbitDB> {
  // databases which must be started when the orbit db
  // instance will be ready to use
  databases: ISwarmStoreConnectorOrbitDbDatabaseOptions<TFeedStoreTypes>[];
}

export interface ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<
  ISwarmDatabaseValueTypes extends TSwarmStoreValueTypes<
    ESwarmStoreConnector.OrbitDB
  >,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
> {
  (
    dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<
      ISwarmDatabaseValueTypes
    >,
    orbitDb: OrbitDB
  ): ISwarmStoreConnectorBasic<
    ESwarmStoreConnector.OrbitDB,
    ISwarmDatabaseValueTypes,
    DbType
  >;
}

export interface ISwarmStoreConnectorOrbitDBConnectionOptions<
  ISwarmDatabaseValueTypes extends TSwarmStoreValueTypes<
    ESwarmStoreConnector.OrbitDB
  >,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
> {
  ipfs: IPFS; // instance of IPFS connection
  connectorFabric: ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<
    ISwarmDatabaseValueTypes,
    DbType
  >;
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
