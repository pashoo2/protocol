export enum ESwarmStoreConnectorOrbitDBEventNames {
    /**
     * fired before connecting to the swarm
     */
    CONNECTING = 'CONNECTING',
    /** 
     * firing on the ready state change
     * if the 'isReady' flag is true
     * then the instance can be used to read
     * a data from the database, if the flag
     * is false, then the instance can be used
     * to read/write a data.
     * */
    STATE_CHANGE = 'STATE_CHANGE',
    /**
     * a data was updated in the database and must
     * be query to get a a new results.
     * Arguments:
     * 1) String - name of the database
     */
    UPDATE = 'UPDATE',
    /**
     * emit when connection to the
     * database was opened
     * arguments:
     * 1) dbName = name of a database opened
     */
    READY = 'READY',
    /**
     * the instance closed and can't be used
     * to read/write
     */
    CLOSE = 'CLOSE',
    /**
     * emitted when loading the database from the local data
     * * Arguments:
     * 1) Number - percentage
     */
    LOADING = 'LOADING',
    /**
     * an error has occured on any operation
     * emits with the argument equals to an error
     */
    ERROR = 'ERROR',
}

/**
 * time out before the connection to the swarm throught
 * an ipfs will be timed out
 */
export const SWARM_STORE_CONNECTOR_ORBITDB_CONNECTION_TIMEOUT_MS = 120000;

/**
 * timeout for open a single database
 */
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS = 30000;

/**
 * maximum attempts to open connection with the database
 */
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_RECONNECTION_ATTEMPTS_MAX = 3;

// prefix used in logs
export const SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX = 'SwarmStoreConnctotOrbitDB';