export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX =
  'SwarmStoreConnectorOrbitDBDatabase';

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
  NEW_ENTRY = 'write',
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
  // after a new entry stored locally
  NEW_ENTRY = 'entry',
}
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION: IStoreOptions = {
  localOnly: false,
  create: true,
  replicate: true,
};

export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT = 500;

export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT = {
  limit: SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT,
};
