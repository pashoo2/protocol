import { ESwarmStoreEventNames } from '../../../../swarm-store-class.const';
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
  WRITE = 'write',
}

export enum EOrbitDbFeedStoreOperation {
  DELETE = 'DEL',
  ADD = 'ADD',
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
