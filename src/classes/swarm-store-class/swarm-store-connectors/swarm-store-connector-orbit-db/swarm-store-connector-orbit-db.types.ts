import { IPFS } from 'types/ipfs.types';
import { ESwarmStoreConnectorOrbitDBEventNames } from './swarm-store-connector-orbit-db.const';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';

export type TESwarmStoreConnectorOrbitDBEvents = {
    [ESwarmStoreConnectorOrbitDBEventNames.STATE_CHANGE]: boolean;
    [ESwarmStoreConnectorOrbitDBEventNames.ERROR]: Error;
    [ESwarmStoreConnectorOrbitDBEventNames.CLOSE]: void;
    [ESwarmStoreConnectorOrbitDBEventNames.UPDATE]: string;
    [ESwarmStoreConnectorOrbitDBEventNames.LOADING]: number;
    [ESwarmStoreConnectorOrbitDBEventNames.READY]: string;
}

/**
 * directory - this string will be used as a 
 * part of keynames for all storages and databases
 *
 * @export
 * @interface ISwarmStoreConnectorOrbitDBOptions
 * @template TFeedStoreTypes
 */
export interface ISwarmStoreConnectorOrbitDBOptions<TFeedStoreTypes> {
    // databases which must be started when the orbit db
    // instance will be ready to use
    databases: ISwarmStoreConnectorOrbitDbDatabaseOptions<TFeedStoreTypes>[];
    directory?: string; 
    id?: string;
    credentials?: ISecretStoreCredentials;
}

export interface ISwarmStoreConnectorOrbitDBConnectionOptions {
    ipfs: IPFS; // instance of IPFS connection
}

export interface ISwarmStoreConnectorOrbitDBLogEntity<T> {
    op?: string,
    key?: string,
    value: T,
}