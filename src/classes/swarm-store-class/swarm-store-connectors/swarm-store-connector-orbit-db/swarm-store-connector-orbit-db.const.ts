import { SwarmStoreConnectorOrbitDBSubclassIdentityProvider } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-identity-provider/swarm-store-connector-orbit-db-subclass-identity-provider';

/**
 * time out before the connection to the swarm throught
 * an ipfs will be timed out
 */
export const SWARM_STORE_CONNECTOR_ORBITDB_CONNECTION_TIMEOUT_MS = 120000;

/**
 * timeout for a single database opening
 */
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS = 30000;

/**
 * maximum attempts to open connection with the database
 */
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_RECONNECTION_ATTEMPTS_MAX = 3;

export const SWARM_STORE_CONNECTOR_ORBITDB_IDENTITY_TYPE = SwarmStoreConnectorOrbitDBSubclassIdentityProvider.type;

// prefix used in logs
export const SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX = 'SwarmStoreConnctotOrbitDB';

export const SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DBNAME = '___SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DBNAME';

export const SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DIRECTORY =
  'SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DIRECTORY';
