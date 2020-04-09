import { ConnectionBridge } from 'classes';
import { CONNECT_TO_SWARM_CONNECTION_OPTIONS } from './connect-to-swarm.const';

export const connectToSwarmUtil = async () => {
  const connectionBridge = new ConnectionBridge();

  await connectionBridge.connect(CONNECT_TO_SWARM_CONNECTION_OPTIONS);
};
