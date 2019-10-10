import { SwarmConnection } from 'classes/swarm-connection-class/swarm-connection-class';
import { ESwarmConnectionClassSubclassType } from 'classes/swarm-connection-class/swarm-connection-class.types';

export const runTestIPFSSwarmConnection = async () => {
  console.warn('runTestIPFSSwarmConnection');
  const connectionToSwarm = new SwarmConnection();
  const result = await connectionToSwarm.connect({
    type: ESwarmConnectionClassSubclassType.IPFS,
  });

  if (result instanceof Error) {
    console.error(result);
    return result;
  }
};
