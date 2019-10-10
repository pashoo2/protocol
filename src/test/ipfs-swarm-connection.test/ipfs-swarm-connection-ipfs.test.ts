import { SwarmConnectionSubclassIPFS } from 'classes/swarm-connection-class/swarm-connection-class-subclasses/swarm-connection-class-subclass-ipfs/swarm-connection-class-subclass-ipfs';

export const runTestSwarmConnectionIPFS = async () => {
  const connection = new SwarmConnectionSubclassIPFS();

  await connection.connect();
};
