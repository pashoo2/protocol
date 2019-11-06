import { ESwarmConnectorOrbitDbDatabaseEventNames } from './swarm-store-connector-orbit-db-subclass-database.const';

export interface ISwarmStoreConnectorOrbitDbDatabaseOptions {
    // Database name
    dbName: string;
    // is a puclic database. Private by
    isPublic?: boolean;
}

export interface ISwarmStoreConnectorOrbitDbDatabaseEvents<TSwarmStoreConnectorOrbitDBDatabase> {
    [ESwarmConnectorOrbitDbDatabaseEventNames.FATAL]: [string, Error, TSwarmStoreConnectorOrbitDBDatabase],

    [ESwarmConnectorOrbitDbDatabaseEventNames.ERROR]: [string, Error, TSwarmStoreConnectorOrbitDBDatabase],
    // Database name and percents loaded
    [ESwarmConnectorOrbitDbDatabaseEventNames.LOADING]: [string, number, TSwarmStoreConnectorOrbitDBDatabase],
    [ESwarmConnectorOrbitDbDatabaseEventNames.UPDATE]: [string, TSwarmStoreConnectorOrbitDBDatabase],
    [ESwarmConnectorOrbitDbDatabaseEventNames.CLOSE]: [string, TSwarmStoreConnectorOrbitDBDatabase],
    [ESwarmConnectorOrbitDbDatabaseEventNames.READY]: [string, TSwarmStoreConnectorOrbitDBDatabase]
}

export interface ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValueType> {
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

export type TFeedStoreHash = string;

export type TSwarmStoreConnectorOrbitDbDatabaseMathodNames = 'get' | 'add' | 'remove' | 'iterator';

export type TSwarmStoreConnectorOrbitDbDatabaseMathodArgument<TFeedStoreType> = TFeedStoreHash | TFeedStoreType | ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions;