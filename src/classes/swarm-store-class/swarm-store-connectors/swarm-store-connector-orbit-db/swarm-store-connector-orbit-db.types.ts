import { IPFS } from 'types/ipfs.types';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ISwarmStoreMainOptions } from '../../swarm-store-class.types';
import { ISwarmStoreEvents } from '../../swarm-store-class.types';

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
export interface ISwarmStoreConnectorOrbitDBOptions<TFeedStoreTypes>
  extends ISwarmStoreMainOptions {
  // databases which must be started when the orbit db
  // instance will be ready to use
  databases: ISwarmStoreConnectorOrbitDbDatabaseOptions<TFeedStoreTypes>[];
}

export interface ISwarmStoreConnectorOrbitDBConnectionOptions {
  ipfs: IPFS; // instance of IPFS connection
}

export interface ISwarmStoreConnectorOrbitDBLogEntity<T> {
  op?: string;
  key?: string;
  value: T;
}
