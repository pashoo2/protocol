import { SwarmStoreConnectorOrbitDB } from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db';

export enum ESwarmStoreProvider {
  OrbitDB = 'OrbitDB',
}

export const SWARM_STORE_PROVIDERS = {
  [ESwarmStoreProvider.OrbitDB]: SwarmStoreConnectorOrbitDB,
};

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
   * emitted when loading the database from the local data
   * Arguments:
   * 1) Number - percentage
   */
  LOADING = 'LOADING',
  /**
   * an error has occured on any operation
   * emits with the argument equals to an error
   */
  ERROR = 'ERROR',
}
