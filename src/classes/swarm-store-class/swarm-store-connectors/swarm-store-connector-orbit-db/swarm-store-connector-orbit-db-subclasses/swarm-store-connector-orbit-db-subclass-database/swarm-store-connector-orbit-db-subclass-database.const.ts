import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from './swarm-store-connector-orbit-db-subclass-database.types';
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX = 'SwarmStoreConnectorOrbitDBDatabase';

export enum ESwarmStoreConnectorOrbitDbDatabaseType {
  FEED = 'feed_store',
  KEY_VALUE = 'key_value',
}

export enum ESortFileds {
  /**
   * sorting by entry time
   */
  TIME = 'TIME',
  /**
   * by entry key in key-value store
   */
  KEY = 'KEY',
  /**
   * by entry hash
   */
  HASH = 'HASH',
  USER_ID = 'USER_ID',
}

export enum EOrbidDBFeedSoreEvents {
  REPLICATED = 'replicated',
  REPLICATE_PROGRESS = 'replicate.progress',
  LOAD = 'load',
  LOAD_PROGRESS = 'load.progress',
  READY = 'ready',
  CLOSE = 'closed',
  // Emitted after an entry was added locally to the database.
  // hash is the IPFS hash of the latest state of the database.
  // entry is the added database op.
  WRITE = 'write',
}

export enum EOrbitDbStoreOperation {
  DELETE = 'DEL',
  ADD = 'ADD',
  PUT = 'PUT',
}

export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION: IStoreOptions = {
  localOnly: false,
  create: true,
  replicate: true,
};

export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT_DEFAULT = 100;

export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT = {
  limit: SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT_DEFAULT,
};

export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_INT_MS = 300;

export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_SIZE = 20;

export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_PRELOAD_COUNT_MIN = 1;

export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_FILTER_OPTIONS = [
  ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gt,
  ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gtT,
  ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gte,
  ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lt,
  ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.ltT,
  ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lte,
  ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.neq,
  ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq,
];

export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_VALUES_GETTER = {
  [ESortFileds.HASH]: (logEntry: LogEntry<any>) => logEntry.hash,
  [ESortFileds.KEY]: (logEntry: LogEntry<any>) => logEntry.payload.key,
  [ESortFileds.TIME]: (logEntry: LogEntry<any>) => logEntry.clock.time,
  [ESortFileds.USER_ID]: (logEntry: LogEntry<any>) => logEntry.identity.id,
};
