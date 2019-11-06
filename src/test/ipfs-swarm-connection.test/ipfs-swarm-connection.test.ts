import { SwarmConnection } from 'classes/swarm-connection-class/swarm-connection-class';
import { ESwarmConnectionClassSubclassType, ESwarmConnectionSubclassStatus } from 'classes/swarm-connection-class/swarm-connection-class.types';
import { expect, assert } from 'chai';
import { SWARM_CONNECTION_PASSWORD, SWARM_CONNECTION_OPTIONS } from './ipfs-swarm-connection.const';
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import { STATUS_CLASS_STATUS_CHANGE_EVENT } from 'classes/basic-classes/status-class-base/status-class-base.const';

export const runTestSwarmConnection = async () => {
  describe('swarm connection:: ipfs', () => {
    it('create ipfs swarm connection', async () => {
      console.warn('runTestIPFSSwarmConnection');
      const connectionToSwarm = new SwarmConnection();

      expect(connectionToSwarm).to.be.an.instanceof(SwarmConnection);
      expect(connectionToSwarm.connect).to.be.a('function');
      try {
        await assert.becomes(connectionToSwarm.connect(SWARM_CONNECTION_OPTIONS), true, 'Failed to connect to the Swarm with ipfs');
        expect(connectionToSwarm.isConnected).to.equal(true);
        await assert.becomes(connectionToSwarm.close(), true, 'Connection to the swarm was not closed succesfully');
        expect(connectionToSwarm.isConnected).to.equal(false);
        await expect(connectionToSwarm.connect(SWARM_CONNECTION_OPTIONS)).to.eventually.be.an.instanceOf(Error);
        assert(connectionToSwarm.isClosed === true, 'Connection isClosed flag must be true, after the connection was closed previousely');
        assert(connectionToSwarm.isConnected === false, 'Connection isConnected flag must be false, after the connection was closed previousely');
        return Promise.resolve();
      } catch(err) {
        console.error(err);
        return Promise.reject(err);
      }
    }).timeout(10000);

    it('swarm connection: check status', async () => {
      console.warn('runTestIPFSSwarmConnection');
      const connectionToSwarm = new SwarmConnection();

      expect(connectionToSwarm).to.be.an.instanceof(SwarmConnection);
      expect(connectionToSwarm.connect).to.be.a('function');

      const connectionOptions = {
        type: ESwarmConnectionClassSubclassType.IPFS,
        subclassOptions: {
          password: SWARM_CONNECTION_PASSWORD
        }
      };

      try {
        const { statusEmitter } = connectionToSwarm;
        const statusesEmitted: ESwarmConnectionSubclassStatus[] = [];

        expect(statusEmitter).to.be.an.instanceof(EventEmitter);
        statusEmitter.addListener(STATUS_CLASS_STATUS_CHANGE_EVENT, status => statusesEmitted.push(status));
        await assert.becomes(connectionToSwarm.connect(connectionOptions), true, '');
        expect(statusesEmitted).to.be.an('array').to.include.members([
          ESwarmConnectionSubclassStatus.CONNECTED,
          ESwarmConnectionSubclassStatus.CONNECTING,
          ESwarmConnectionSubclassStatus.STARTED,
        ]);
        return Promise.resolve();
      } catch(err) {
        console.error(err);
        return Promise.reject(err);
      }
    }).timeout(10000)

  })
};
