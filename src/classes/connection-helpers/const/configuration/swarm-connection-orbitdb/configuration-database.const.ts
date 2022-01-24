import { TSwarmStoreDatabaseOptions } from 'classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { SwarmMessagesDatabaseCacheWithEntitiesCount } from 'classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-cache-with-entities-count';
import {
  ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions,
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta,
} from 'classes';
import { ISwarmMessagesStoreMeta } from 'classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ConstructorArgumentType } from 'types';

export const CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT = ESwarmStoreConnector.OrbitDB as const;

export const CONFIGURATION_DEFAULT_DATABASE_PREFIX = 'DEFAULT_DATABASE_PREFIX/';

export const CONFIGURATION_DEFAULT_DATABASE_KEYVALUE_OPTIONS: TSwarmStoreDatabaseOptions<
  typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
> = {
  // public database
  isPublic: true,
  // database name
  dbName: 'Default key value database',
  // 0 - preload the whole database records
  preloadCount: 0,
  // type of the database
  dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
  /* 
        A function that is responsible whether a record can be read
        and written to the database. This function will be shared
        with others.
    */
  grantAccess: function grantAccess(_arg: unknown): Promise<boolean> {
    return Promise.resolve(true);
  },
};

export const CONFIGURATION_DEFAULT_DATABASE_FEED_OPTIONS: TSwarmStoreDatabaseOptions<
  typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.FEED
> = {
  // public database
  isPublic: true,
  // database name
  dbName: 'Default feed database',
  // 0 - preload the whole database records
  preloadCount: 0,
  // type of the database
  dbType: ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  /* 
        A function that is responsible whether a record can be read
        and written to the database. This function will be shared
        with others.
    */
  grantAccess: function grantAccess(_arg: unknown): Promise<boolean> {
    return Promise.resolve(true);
  },
};

const CONFIGURATION_DATABASE_CACHE_WITH_STORE_META_OPTIONS_CACHE_CONSTRUCTOR_DEFAULT =
  SwarmMessagesDatabaseCacheWithEntitiesCount;

export const CONFIGURATION_DATABASE_CACHE_WITH_STORE_META_OPTIONS_DEFAULT: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<
  typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType,
  TSwarmStoreDatabaseOptions<
    typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType
  >,
  ISwarmMessageInstanceDecrypted,
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<
    typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
    TSwarmMessageSerialized,
    TSwarmStoreDatabaseOptions<
      typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType
    >,
    ESwarmStoreConnectorOrbitDbDatabaseType,
    ISwarmMessageInstanceDecrypted,
    ISwarmMessagesStoreMeta
  >,
  ConstructorArgumentType<typeof CONFIGURATION_DATABASE_CACHE_WITH_STORE_META_OPTIONS_CACHE_CONSTRUCTOR_DEFAULT>,
  InstanceType<typeof CONFIGURATION_DATABASE_CACHE_WITH_STORE_META_OPTIONS_CACHE_CONSTRUCTOR_DEFAULT>
> = {
  cacheConstructor: CONFIGURATION_DATABASE_CACHE_WITH_STORE_META_OPTIONS_CACHE_CONSTRUCTOR_DEFAULT,
};
