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
     * the instance closed and can't be used
     * to read/write
     */
    CLOSE = 'CLOSE',
    /**
     * emitted when loading the database from the local data
     * * Arguments:
     * 1) String - name of the database
     * 2) Number - percentage
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
export const SWARM_STORE_CONNECTOR_ORBITDB_CONNECTION_TIMEOUT_MS = 20000; 

// prefix used in logs
export const SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX = 'SwarmStoreConnctotOrbitDB';