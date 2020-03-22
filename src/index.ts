import { SwarmConnection } from './classes/swarm-connection-class/swarm-connection-class';
import { ESwarmConnectionClassSubclassType } from 'classes';

export * from './classes';

const run = async () => {
  const swarmConnection = new SwarmConnection();

  try {
    await swarmConnection.connect({
      type: ESwarmConnectionClassSubclassType.IPFS,
      subclassOptions: {
        password: '123456789101112131415',
      },
    });
  } catch (err) {
    console.error(err);
    debugger;
  }
  const ipfs = swarmConnection.getNativeConnection();
  debugger;
};

run();
