import { ICentralAuthorityUserProfile, TCentralAuthorityUserIdentity } from 'classes/central-authority-class';
import { IConnectionBridgeOptionsAny } from 'classes/connection-bridge/types/connection-bridge.types';
import { TSwarmStoreConnectorDefault } from 'classes/connection-helpers/connect-to-swarm-orbitdb-with-channels/types/connect-to-swarm-orbitdb-with-channels-constructor.types';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message';
import {
  ESwarmStoreConnectorOrbitDbDatabaseType,
  ISwarmStoreDatabasesCommonStatusList,
  TSwarmDatabaseName,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from 'classes/swarm-store-class';
import { TConnectionBridgeByOptions } from 'classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge.types.helpers';
import { ISwarmMessagesChannelsDescriptionsList } from 'classes/swarm-messages-channels';

export type TSwarmMessageIdentity = string;

export interface IConnectToSwarmOrbitDbSwarmMessageDescription<
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>
> {
  id: TSwarmMessageIdentity;
  message: ISwarmMessageInstanceDecrypted;
  key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    ? TSwarmStoreDatabaseEntityKey<TSwarmStoreConnectorDefault>
    : void;
}

export type TConnectToSwarmOrbitDbSwarmMessagesList<DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>> = Map<
  TSwarmMessageIdentity,
  IConnectToSwarmOrbitDbSwarmMessageDescription<DbType>
>;

export type TConnectToSwarmOrbitDatabasesSwarmMessagesLists<DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>> =
  Map<TSwarmDatabaseName, TConnectToSwarmOrbitDbSwarmMessagesList<DbType>>;

export interface IConnectToSwarmOrbitDbWithChannelsState<
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>,
  CBO extends IConnectionBridgeOptionsAny<TSwarmStoreConnectorDefault, T, DbType, DBO>
> {
  isConnectingToSwarm: boolean;
  userId: TCentralAuthorityUserIdentity | undefined;
  userProfileData: ICentralAuthorityUserProfile | undefined;
  connectionBridge: TConnectionBridgeByOptions<TSwarmStoreConnectorDefault, T, DbType, DBO, CBO> | undefined;
  databasesList:
    | ISwarmStoreDatabasesCommonStatusList<
        TSwarmStoreConnectorDefault,
        string,
        DbType,
        TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>
      >
    | undefined;
  databasesMessagesLists: TConnectToSwarmOrbitDatabasesSwarmMessagesLists<DbType>;
  swarmMessagesChannelsList:
    | ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, ISwarmMessageInstanceDecrypted>
    | undefined;
  connectionError?: Error;
}
