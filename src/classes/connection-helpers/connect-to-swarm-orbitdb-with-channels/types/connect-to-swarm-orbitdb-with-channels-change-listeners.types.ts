import { IConnectionBridgeOptionsAny } from 'classes/connection-bridge/types/connection-bridge.types';
import { TSwarmStoreConnectorDefault } from 'classes/connection-helpers/connect-to-swarm-orbitdb-with-channels/types/connect-to-swarm-orbitdb-with-channels-constructor.types';
import { TSwarmMessageSerialized } from 'classes/swarm-message';
import { TSwarmDatabaseName } from 'classes/swarm-store-class/swarm-store-class.types';
import { TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from 'classes/swarm-store-class';

import {
  IConnectToSwarmOrbitDbSwarmMessageDescription,
  IConnectToSwarmOrbitDbWithChannelsState,
  TConnectToSwarmOrbitDbSwarmMessagesList,
} from './connect-to-swarm-orbitdb-with-channels-state.types';

export interface IConnectToSwarmOrbitDbWithChannelsStateListener<
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>,
  CBO extends IConnectionBridgeOptionsAny<TSwarmStoreConnectorDefault, T, DbType, DBO>
> {
  (updatedState: IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>): void;
}

export interface IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListenerParameter<
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>
> {
  databaseName: TSwarmDatabaseName;
  swarmMessageDescription: IConnectToSwarmOrbitDbSwarmMessageDescription<DbType>;
  databaseSwarmMessagesList: TConnectToSwarmOrbitDbSwarmMessagesList<DbType>;
}

export interface IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListener<
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>
> {
  (eventListenerParameter: IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListenerParameter<DbType>): void;
}
