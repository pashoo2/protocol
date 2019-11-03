import { IPFS } from 'types/ipfs.types';
import { ESwarmStoreConnectorOrbitDBEventNames } from './swarm-store-connector-orbit-db.const';

export type TESwarmStoreConnectorOrbitDBEvents = {
    [ESwarmStoreConnectorOrbitDBEventNames.STATE_CHANGE]: boolean;
    [ESwarmStoreConnectorOrbitDBEventNames.ERROR]: Error;
    [ESwarmStoreConnectorOrbitDBEventNames.CLOSE]: void;
    [ESwarmStoreConnectorOrbitDBEventNames.UPDATE]: string;
    [ESwarmStoreConnectorOrbitDBEventNames.LOADING]: [string, number];
}

export interface ISwarmStoreConnectorOrbitDBOptions {
    // databases which must be started when the orbit db
    // instance will be ready to use
    databses: IDatabseOptions[];
}

export interface ISwarmStoreConnectorOrbitDBConnectionOptions {
    ipfs: IPFS; // instance of IPFS connection
}
