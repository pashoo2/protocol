import { SwarmConnectionSubclassIPFS } from 'classes/swarm-connection-class/swarm-connection-class-subclasses/swarm-connection-class-subclass-ipfs/swarm-connection-class-subclass-ipfs';
import { initializeMochaChai, runMochaChai } from 'test/mocha-chai-initialize';

export const runTestSwarmConnectionIPFS = async () => {
  await initializeMochaChai();

  describe('ipfs swarm connection', () => {
    it('create ipfs swarm connection', async () => {
      const connection = new SwarmConnectionSubclassIPFS();
      const connectionResult = await connection.connect(); 
      debugger 
    })
  })
  runMochaChai();
};
