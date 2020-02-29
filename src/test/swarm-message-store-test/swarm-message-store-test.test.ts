import { SwarmMessageStore } from '../../classes/swarm-message-store/swarm-message-store';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { expect } from 'chai';

export const runSwarmMessageStoreTest = () => {
  describe('SwarmMessageStore test', () => {
    test('SwarmMessageStore store constructor should not throw', () => {
      expect(
        () => new SwarmMessageStore<ESwarmStoreConnector.OrbitDB>()
      ).to.not.throw();
    });

    describe('SwarmMessageStore store connect method', () => {
      test('Should not throw if valid options provided');
    });
  });
};
