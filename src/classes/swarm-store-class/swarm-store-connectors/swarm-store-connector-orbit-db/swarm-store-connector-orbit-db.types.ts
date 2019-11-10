import { IPFS } from 'types/ipfs.types';
import { ESwarmStoreConnectorOrbitDBEventNames } from './swarm-store-connector-orbit-db.const';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';

export type TESwarmStoreConnectorOrbitDBEvents = {
    [ESwarmStoreConnectorOrbitDBEventNames.STATE_CHANGE]: boolean;
    [ESwarmStoreConnectorOrbitDBEventNames.ERROR]: Error;
    [ESwarmStoreConnectorOrbitDBEventNames.CLOSE]: void;
    [ESwarmStoreConnectorOrbitDBEventNames.UPDATE]: string;
    [ESwarmStoreConnectorOrbitDBEventNames.LOADING]: number;
    [ESwarmStoreConnectorOrbitDBEventNames.READY]: string;
}

export interface ISwarmStoreConnectorOrbitDBOptions {
    // databases which must be started when the orbit db
    // instance will be ready to use
    databases: ISwarmStoreConnectorOrbitDbDatabaseOptions[];
    id?: string;
}

export interface ISwarmStoreConnectorOrbitDBConnectionOptions {
    ipfs: IPFS; // instance of IPFS connection
}
