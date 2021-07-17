import { IConnectToSwarmOrbitdbWithChannelsState } from 'classes/connection-helpers/connect-to-swarm-orbitdb-with-channels/types/connect-to-swarm-orbitdb-with-channels-state.types';

export const CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME =
  'CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME' as const;

export const CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_DEFAULT: IConnectToSwarmOrbitdbWithChannelsState<any, any, any, any> = {
  isConnectingToSwarm: false,
  userCredentialsActive: undefined,
  userId: undefined,
  databasesList: undefined,
  userProfileData: undefined,
  connectionBridge: undefined,
  connectionError: undefined,
};
