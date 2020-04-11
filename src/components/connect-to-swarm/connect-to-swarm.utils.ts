import { ConnectionBridge } from 'classes';
import { CONNECT_TO_SWARM_CONNECTION_OPTIONS } from './connect-to-swarm.const';

export const connectToSwarmUtil = async (useSessionAuth: boolean) => {
  const connectionBridge = new ConnectionBridge();

  await connectionBridge.connect({
    ...CONNECT_TO_SWARM_CONNECTION_OPTIONS,
    auth: {
      ...CONNECT_TO_SWARM_CONNECTION_OPTIONS.auth,
      credentials: useSessionAuth
        ? undefined
        : CONNECT_TO_SWARM_CONNECTION_OPTIONS.auth.credentials,
    },
  });
};
