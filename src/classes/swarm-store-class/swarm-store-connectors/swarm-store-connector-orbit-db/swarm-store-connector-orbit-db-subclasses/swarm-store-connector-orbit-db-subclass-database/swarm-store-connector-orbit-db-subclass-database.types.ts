import { ESwarmConnectorOrbitDbDatabseEventNames } from './swarm-store-connector-orbit-db-subclass-database.const';

export interface ISwarmStoreConnectorOrbitDbDatabseOptions {
    // databse name
    dbName: string;
    // is a puclic database. Private by
    isPublic?: boolean;
}

export interface ISwarmStoreConnectorOrbitDbDatabseEvents {
    [ESwarmConnectorOrbitDbDatabseEventNames.FATAL]: [string, Error],

    [ESwarmConnectorOrbitDbDatabseEventNames.ERROR]: [string, Error],
    // databse name and percents loaded
    [ESwarmConnectorOrbitDbDatabseEventNames.LOADING]: [string, number],
    [ESwarmConnectorOrbitDbDatabseEventNames.UPDATE]: string,
    [ESwarmConnectorOrbitDbDatabseEventNames.CLOSE]: string,
    [ESwarmConnectorOrbitDbDatabseEventNames.READY]: string,
}