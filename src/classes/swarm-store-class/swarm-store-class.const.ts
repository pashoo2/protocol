import { SwarmStoreConnectorOrbitDB } from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db';
import { ISwarmStoreDatabasesStatuses } from './swarm-store-class.types';

export enum ESwarmStoreConnector {
  OrbitDB = 'OrbitDB',
}

export enum ESwarmStoreEventNames {
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
   * the instance closed and can't be used
   * to read/write
   * * Arguments:
   * 1) string - name of the database closed
   * 2) object - instance closed
   */
  CLOSE_DATABASE = 'CLOSE_DATABASE',
  /**
   * emitted when loading the a database from the local data
   * Arguments:
   * 1) Number - overall loaded data percentage for all databases
   */
  LOADING = 'LOADING',
  /**
   * emitted when loading the a database from the local data
   * Arguments:
   * 1) dbName - name of the database,
   * 2) Number - loaded data percentage for the database.
   */
  DB_LOADING = 'DB_LOADING',
  /**
   * an error has occured on any operation
   * emits with the argument equals to an error
   */
  ERROR = 'error',
  /**
   * a fatal error has occurred
   * caused the instance can't be used anymore
   */
  FATAL = 'fatal',
  /**
   * Emitted after an entry was added locally to the database. hash is the IPFS hash of the latest state of the database. entry is the added database op.
   * args:
   * 1) string - database name where the entry was added
   * 2) any - entry
   * 3) string - the global address of the entry in the swarm
   * 4) any - heads
   */
  NEW_ENTRY = 'NEW_ENTRY',
}

export enum ESwarmStoreDbStatus {
  // database updated from the swarm
  UPDATE = 'UPDATE',
  // database loaded
  READY = 'READY',
  // database closed
  CLOSE = 'CLOSE_DATABASE',
  // database data load in progress  from the local storage
  LOADING = 'LOADING',
  // all data of the database loaded from the local storage
  LOADED = 'LOADED',
  // means that database is exists in the list, but still not started
  EMPTY = 'EMPTY',
}

// means that there is no status found for a database
export const SWARM_STORE_DATABASE_STATUS_ABSENT = undefined;

export const SWARM_STORE_DATABASES_STATUSES_EMPTY: ISwarmStoreDatabasesStatuses = {};

export const SWARM_STORE_CONNECTORS = {
  [ESwarmStoreConnector.OrbitDB]: SwarmStoreConnectorOrbitDB,
};
