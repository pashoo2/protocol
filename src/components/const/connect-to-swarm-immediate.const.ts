import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';

export const CONNECT_TO_SWARM_IMMEDIATE_DATABASE_NAME_FEED_STORE = 'DATABASE_CONNECT_IMMEDIATE_FEED_02012021';

export const CONNECT_TO_SWARM_IMMEDIATE_DATABASE_NAME_KEY_VALUE = 'CONNECT_TO_SWARM_IMMEDIATE_DATABASE_NAME_KEY_VALUE_02012021  ';

export const CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_KEY_VALUE = {
  isPublic: true,
  dbName: CONNECT_TO_SWARM_IMMEDIATE_DATABASE_NAME_KEY_VALUE,
  preloadCount: 0,
  dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
  grantAccess: async function grantAccess(...args: any[]) {
    console.log('grantAccess');
    console.log(...args);
    console.log(this);
    debugger;
    return true;
  },
};

export const CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_SWARM_CHANNELS_LIST: TSwarmStoreDatabaseOptions<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
> = {
  isPublic: true,
  dbName: CONNECT_TO_SWARM_IMMEDIATE_DATABASE_NAME_KEY_VALUE,
  preloadCount: 0,
  dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
  grantAccess: async function grantAccess(...args: any[]) {
    console.log('grantAccess');
    console.log(...args);
    console.log(this);
    debugger;
    return true;
  },
};

export const CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_FEED = {
  isPublic: true,
  dbName: CONNECT_TO_SWARM_IMMEDIATE_DATABASE_NAME_FEED_STORE,
  preloadCount: 0,
  dbType: ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  grantAccess: async function grantAccess(...args: any[]) {
    console.log('grantAccess arguments', ...args);
    console.log('grantAccess context', this);
    return true;
  },
};
