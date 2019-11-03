export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX = 'SwarmStoreConnectorOrbitDBDatabase';

export enum EOrbidDBFeedSoreEvents {
    REPLICATED = 'replicated',
    LOAD = 'load',
    LOAD_PROGRESS = 'load.progress',
    READY = 'ready',
    CLOSE = 'closed',
}

export enum ESwarmConnectorOrbitDbDatabseEventNames {
    // on replicated from another peer
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