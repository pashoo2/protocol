import { SwarmConnectionSubclassIPFS } from 'classes/swarm-connection-class/swarm-connection-class-subclasses/swarm-connection-class-subclass-ipfs/swarm-connection-class-subclass-ipfs';
import { initializeMocha, runMocha } from 'test/mocha-chai-initialize';
import { expect, assert } from 'chai';

export const runTestSwarmConnectionIPFS = async () => {
  await initializeMocha();

  describe('ipfs swarm connection', () => {
    it('create ipfs swarm connection', async () => {
      const connection = new SwarmConnectionSubclassIPFS();

      try {
        expect(connection.connect).to.be.a('function');
        await assert.becomes(connection.connect(), true, 'Connection to the swarm was not established');
        expect(connection.isConnected).to.equal(true);
        await assert.becomes(connection.close(), true, 'Connection to the swarm was not closed succesfully');
        expect(connection.isConnected).to.equal(false);
        await expect(connection.connect()).to.eventually.be.an.instanceOf(Error)
        return Promise.resolve();
      } catch(err) {
        return Promise.reject(err);
      }
    }).timeout(10000)
  })
  runMocha();
};
