import { SwarmConnection } from 'classes/swarm-connection-class/swarm-connection-class';
import { ESwarmConnectionClassSubclassType } from 'classes/swarm-connection-class/swarm-connection-class.types';
import { SWARM_CONNECTION_PASSWORD } from './ipfs-swarm-connection.const';

export const runTestIPFSSwarmConnection = async () => {
  console.warn('runTestIPFSSwarmConnection');
  const connectionToSwarm = new SwarmConnection();
  const result = await connectionToSwarm.connect({
    type: ESwarmConnectionClassSubclassType.IPFS,
    subclassOptions: {
      password: SWARM_CONNECTION_PASSWORD
    }
  });

  if (result instanceof Error) {
    console.error(result);
    return result;
  }
};
