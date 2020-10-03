import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
export const CONNECT_TO_SWARM_IMMEDIATE_CREDENTIALS_VARIANT = 2;

export const CONNECT_TO_SWARM_IMMEDIATE_DATABASE_NAME =
  'DATABASE_CONNECT_IMMEDIATE_FEED_2';

export const CONNECT_TO_SWARM_IMMEDIATE_DATABASE_NAME_KEY_VALUE =
  'CONNECT_TO_SWARM_IMMEDIATE_DATABASE_NAME_KEY_VALUE';

export const CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS = {
  dbName: CONNECT_TO_SWARM_IMMEDIATE_DATABASE_NAME_KEY_VALUE,
  preloadCount: 0,
  dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
};
