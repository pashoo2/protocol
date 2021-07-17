import { ICentralAuthorityUserProfile, TCentralAuthorityUserIdentity } from 'classes/central-authority-class';
import { IConnectionBridgeOptionsAny } from 'classes/connection-bridge/types/connection-bridge.types';
import { TSwarmStoreConnectorDefault } from 'classes/connection-helpers/connect-to-swarm-orbitdb-with-channels/types/connect-to-swarm-orbitdb-with-channels-constructor.types';
import { TSwarmMessageSerialized } from 'classes/swarm-message';
import {
  ISwarmStoreDatabasesCommonStatusList,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from 'classes/swarm-store-class';
import { IUserCredentialsCommon } from 'types/credentials.types';
import { TConnectionBridgeByOptions } from '../../../connection-bridge/types/connection-bridge.types-helpers/connection-bridge.types.helpers';

export interface IConnectToSwarmOrbitdbWithChannelsState<
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>,
  CBO extends IConnectionBridgeOptionsAny<TSwarmStoreConnectorDefault, T, DbType, DBO>
> {
  isConnectingToSwarm: boolean;
  userId: TCentralAuthorityUserIdentity | undefined;
  userProfileData: ICentralAuthorityUserProfile | undefined;
  userCredentialsActive: IUserCredentialsCommon | undefined;
  connectionBridge: TConnectionBridgeByOptions<TSwarmStoreConnectorDefault, T, DbType, DBO, CBO> | undefined;
  databasesList:
    | ISwarmStoreDatabasesCommonStatusList<
        TSwarmStoreConnectorDefault,
        string,
        DbType,
        TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>
      >
    | undefined;
  connectionError?: Error;
}

export interface IConnectToSwarmOrbitdbWithChannelsStateListener<
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>,
  CBO extends IConnectionBridgeOptionsAny<TSwarmStoreConnectorDefault, T, DbType, DBO>
> {
  (updatedState: IConnectToSwarmOrbitdbWithChannelsState<DbType, T, DBO, CBO>): void;
}
