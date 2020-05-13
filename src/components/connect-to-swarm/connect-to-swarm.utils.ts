import { ConnectionBridge } from 'classes';
import { CONNECT_TO_SWARM_CONNECTION_OPTIONS } from './connect-to-swarm.const';

export const connectToSwarmUtil = async (credentials: any) => {
  const connectionBridge = new ConnectionBridge();
  const useSessionAuth = await connectionBridge.checkSessionAvailable({
    ...CONNECT_TO_SWARM_CONNECTION_OPTIONS,
    auth: {
      ...CONNECT_TO_SWARM_CONNECTION_OPTIONS.auth,
      credentials: undefined,
    },
  });

  await connectionBridge.connect({
    ...CONNECT_TO_SWARM_CONNECTION_OPTIONS,
    auth: {
      ...CONNECT_TO_SWARM_CONNECTION_OPTIONS.auth,
      credentials: useSessionAuth ? undefined : credentials,
    },
  });
  return connectionBridge;
};
