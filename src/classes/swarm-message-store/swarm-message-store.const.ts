import {
  ESwarmStoreConnectorOrbitDbDatabaseIteratorOption,
  ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions,
} from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
export enum ESwarmMessageStoreEventNames {
  /**
   * on new incoming message
   * arguments:
   * 1) string - database name where the message was added
   * 2) ISwarmMessage - swarm message instance
   * 3) string - the global unique address of the message in the swarm
   * 4) key - string/undefined - for key-value store it will be the key for the value
   */
  NEW_MESSAGE = 'NEW_MESSAGE',
  /**
   * on failed to construct a new incoming message
   * with the message constructor
   * arguments:
   * 1) string - database name where the message was added
   * 2) string - swarm message string failed to deserialize
   * 3) Error - error occurred
   * 4) string - the global unique address of the message in the swarm
   * 6) key - string/undefined - for key-value store it will be the key for the value
   */
  NEW_MESSAGE_ERROR = 'NEW_MESSAGE_ERROR',
}

export const SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT_LIMIT = 200;

export const SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions = {
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT_LIMIT,
};
