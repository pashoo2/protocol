export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX = 'SwarmStoreConnectorOrbitDBDatabase';

export enum EOrbidDBFeedSoreEvents {
    REPLICATED = 'replicated',
    LOAD = 'load',
    LOAD_PROGRESS = 'load.progress',
    READY = 'ready',
    CLOSE = 'closed',
}

export enum ESwarmConnectorOrbitDbDatabaseEventNames {
    // on replicated from another peer
    // arguments:
    // 1) databaseName - a name of the database
    UPDATE = 'update',
    // loading from the local store
    LOADING = 'loading',
    // fully loading from the local store
    READY = 'ready',
    // has closed
    CLOSE = 'close',
    // an error has occurred
    ERROR = 'error',
    // a fatal error has occurred 
    // the instance can't be used anymore
    FATAL = 'fatal',
}
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION: IStoreOptions = {
    localOnly: false,
    create: true,
    replicate: true,
}

export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT = 500;