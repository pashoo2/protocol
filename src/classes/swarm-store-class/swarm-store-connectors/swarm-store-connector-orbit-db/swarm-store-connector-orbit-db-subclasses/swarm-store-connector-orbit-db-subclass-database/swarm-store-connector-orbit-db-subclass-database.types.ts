import { ESwarmConnectorOrbitDbDatabseEventNames } from './swarm-store-connector-orbit-db-subclass-database.const';

export interface ISwarmStoreConnectorOrbitDbDatabseOptions {
    // databse name
    dbName: string;
    // is a puclic database. Private by
    isPublic?: boolean;
}

export interface ISwarmStoreConnectorOrbitDbDatabseEvents<TSwarmStoreConnectorOrbitDBDatabase> {
    [ESwarmConnectorOrbitDbDatabseEventNames.FATAL]: [string, Error, TSwarmStoreConnectorOrbitDBDatabase],

    [ESwarmConnectorOrbitDbDatabseEventNames.ERROR]: [string, Error, TSwarmStoreConnectorOrbitDBDatabase],
    // databse name and percents loaded
    [ESwarmConnectorOrbitDbDatabseEventNames.LOADING]: [string, number, TSwarmStoreConnectorOrbitDBDatabase],
    [ESwarmConnectorOrbitDbDatabseEventNames.UPDATE]: [string, TSwarmStoreConnectorOrbitDBDatabase],
    [ESwarmConnectorOrbitDbDatabseEventNames.CLOSE]: [string, TSwarmStoreConnectorOrbitDBDatabase],
    [ESwarmConnectorOrbitDbDatabseEventNames.READY]: [string, TSwarmStoreConnectorOrbitDBDatabase]
}

export interface ISwarmStoreConnectorOrbitDbDatabseValue<TStoreValueType> {
    id: string; // id of the user who is store the event
    value: TStoreValueType;
    hash: string;
}

export interface ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions {
    gt?: string,
    gte?: string, 
    lt?: string, 
    lte?: string, 
    limit?: number, 
    reverse?: boolean 
}