import { SwarmConnectionSubclassIPFS } from 'classes/swarm-connection-class/swarm-connection-class-subclasses/swarm-connection-class-subclass-ipfs/swarm-connection-class-subclass-ipfs';
import { initializeMocha, runMocha } from 'test/mocha-chai-initialize';
import { expect, assert } from 'chai';

export const runTestSwarmConnectionIPFS = async () => {
  await initializeMocha();

  describe('ipfs swarm connection', () => {
    it('create ipfs swarm connection', (done) => {
      const connection = new SwarmConnectionSubclassIPFS();

      expect(connection.connect).to.be.a('function');
      assert.becomes(connection.connect(), true, 'Connection to the swarm was not established');
      done();
    }).timeout(5000)
  })
  runMocha();
};
