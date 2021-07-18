import { TSwarmDatabaseName } from 'classes/swarm-store-class';
import {
  IConnectToSwarmOrbitDbWithChannelsState,
  TConnectToSwarmOrbitDbSwarmMessagesList,
} from '../types/connect-to-swarm-orbitdb-with-channels-state.types';

export const CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME =
  'CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME' as const;

export const CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_DATABASE_MESSAGES_UPDATE_EVENT_NAME =
  'CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_DATABASE_MESSAGES_UPDATE_EVENT_NAME' as const;

export const CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_DEFAULT: IConnectToSwarmOrbitDbWithChannelsState<any, any, any, any> = {
  isConnectingToSwarm: false,
  userCredentialsActive: undefined,
  userId: undefined,
  databasesList: undefined,
  userProfileData: undefined,
  connectionBridge: undefined,
  connectionError: undefined,
  databasesMessagesLists: new Map<TSwarmDatabaseName, TConnectToSwarmOrbitDbSwarmMessagesList<any>>(),
  swarmMessagesChannelsList: undefined,
};
