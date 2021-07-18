import { IConnectionBridgeOptionsDefault } from 'classes/connection-bridge/types/connection-bridge.types';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message';
import {
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheConstructor,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions,
  ISwarmMessagesDatabaseMessagesCollector,
} from 'classes/swarm-messages-database';
import { TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from 'classes/swarm-store-class';

import { CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT } from '../../const/configuration/swarm-connection-orbitdb/configuration-database.const';

export type TSwarmStoreConnectorDefault = typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT;

export interface IConnectToSwarmOrbitDbWithChannelsConstructorOptions<
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>,
  CD extends boolean,
  CBO extends IConnectionBridgeOptionsDefault<TSwarmStoreConnectorDefault, T, DbType, CD>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<TSwarmStoreConnectorDefault, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<TSwarmStoreConnectorDefault, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<TSwarmStoreConnectorDefault, T, DbType, DBO, MD, SMSM>,
  SMDCC extends ISwarmMessagesDatabaseCacheConstructor<TSwarmStoreConnectorDefault, T, DbType, DBO, MD, SMSM, DCO, DCCRT>
> {
  /* TODO - maybe add 
        directory: CONFIGURATION_DEFAULT_DATABASE_PREFIX,
        // List of databases connection to which should be established once a connection to swarm will be established
        databases: [],
    */

  connectionBridgeOptions: CBO;
  swarmMessagesDatabaseCacheOptions: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<
    TSwarmStoreConnectorDefault,
    T,
    DbType,
    DBO,
    MD,
    SMSM,
    DCO,
    DCCRT,
    SMDCC
  >;
}
