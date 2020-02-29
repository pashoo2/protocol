import { SwarmMessageStore } from '../../classes/swarm-message-store/swarm-message-store';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { expect } from 'chai';
import { createMessageConstructor } from '../swarrm-message-constructor.test/swarrm-message-constructor.shared';
import { SwarmMessageConstructor } from '../../classes/swarm-message/swarm-message-constructor';
import { ISwarmMessageStoreOptions } from '../../classes/swarm-message-store/swarm-message-store.types';
import { SWARM_MESSAGE_STORE_TEST_OPTIONS_VALID } from './swarm-message-store-test.const';
import { CentralAuthority } from '../../classes/central-authority-class/central-authority-class';
import { ipfsUtilsConnectBasic } from '../../utils/ipfs-utils/ipfs-utils';

export const runSwarmMessageStoreTest = () => {
  describe('SwarmMessageStore test', () => {
    let options: ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>;
    const swarmMessageStore = new SwarmMessageStore<
      ESwarmStoreConnector.OrbitDB
    >();

    it('SwarmMessageStore store constructor should not throw', () => {
      expect(
        () => new SwarmMessageStore<ESwarmStoreConnector.OrbitDB>()
      ).to.not.throw();
    });

    before(async function() {
      this.timeout(60000);

      const messageConstructor = await createMessageConstructor();

      expect(messageConstructor).to.be.an.instanceof(SwarmMessageConstructor);

      const caConnection = messageConstructor.caConnection;

      expect(caConnection).to.be.an.instanceof(CentralAuthority);

      const userId = caConnection?.getUserIdentity();

      expect(userId).to.be.a('string');

      const ipfs = await ipfsUtilsConnectBasic();

      expect(ipfs)
        .to.be.an('object')
        .which.have.property('bitswap')
        .which.is.an('object');

      options = {
        ...SWARM_MESSAGE_STORE_TEST_OPTIONS_VALID,
        userId: userId as string,
        providerConnectionOptions: {
          ipfs,
        },
        messageConstructors: {
          default: messageConstructor,
        },
      };
    });

    describe('"connect" and "close" methods', () => {
      before(() => {
        expect(swarmMessageStore).to.be.an('object');
        expect(swarmMessageStore.connect).to.be.a('function');
        expect(options).to.be.an('object');
      });
      it('Should not be rejected if valid options provided', async () => {
        await expect(
          swarmMessageStore.connect(options)
        ).to.not.eventually.be.rejectedWith(Error);
        await expect(
          swarmMessageStore.close()
        ).to.not.eventually.be.rejectedWith(Error);
      }).timeout(30000);
      it('Should not be rejected if no databases provided', async () => {
        debugger;
        await expect(
          swarmMessageStore.connect({
            ...options,
            databases: [],
          })
        ).to.not.eventually.be.rejectedWith(Error);
        await expect(
          swarmMessageStore.close()
        ).to.not.eventually.be.rejectedWith(Error);
      }).timeout(30000);
    });

    describe('"addMessage"', () => {
      before(async () => {
        expect(swarmMessageStore).to.be.an('object');
        expect(swarmMessageStore.addMessage).to.be.a('function');
        await expect(
          swarmMessageStore.connect(options)
        ).to.not.eventually.be.rejectedWith(Error);
      });

      it('expect not to throw on add a valid message', async () => {});
    });
  });
};
