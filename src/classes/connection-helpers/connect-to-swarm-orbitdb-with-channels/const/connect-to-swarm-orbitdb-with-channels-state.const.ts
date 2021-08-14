import { TSwarmDatabaseName } from 'classes/swarm-store-class';
import {
  TSwarmChannelsListGeneral,
  TSwarmChannelsListId,
  TSwarmChannelOpenedInListDescription,
} from '../types/connect-to-swarm-orbitdb-with-channels-state.types';
import { TSwarmMessagesChannelId } from '../../../swarm-messages-channels/types/swarm-messages-channel-instance.types';
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
  userId: undefined,
  databasesList: undefined,
  userCentralAuthorityProfileData: undefined,
  connectionBridge: undefined,
  connectionError: undefined,
  databasesMessagesLists: new Map<TSwarmDatabaseName, TConnectToSwarmOrbitDbSwarmMessagesList<any>>(),
  swarmChannelsListsInstances: new Map<TSwarmChannelsListId, TSwarmChannelsListGeneral>(),
  swarmChannelsList: new Map<TSwarmMessagesChannelId, TSwarmChannelOpenedInListDescription>(),
};
