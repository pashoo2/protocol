import { SwarmMessageStore } from '../../classes/swarm-message-store/swarm-message-store';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { expect } from 'chai';
import { createMessageConstructor } from '../swarrm-message-constructor.test/swarrm-message-constructor.shared';
import { SwarmMessageConstructor } from '../../classes/swarm-message/swarm-message-constructor';
import { ISwarmMessageStoreOptions } from '../../classes/swarm-message-store/swarm-message-store.types';
import {
  SWARM_MESSAGE_STORE_TEST_OPTIONS_VALID,
  SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME,
} from './swarm-message-store-test.const';
import { CentralAuthority } from '../../classes/central-authority-class/central-authority-class';
import { ipfsUtilsConnectBasic } from '../../utils/ipfs-utils/ipfs-utils';
import { TSwarmMessageConstructorArgumentBody } from '../../classes/swarm-message/swarm-message-constructor.types';
import { SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.const';
import {
  ISwarmMessageConstructor,
  ISwarmMessage,
  ISwarmMessageInstance,
} from '../../classes/swarm-message/swarm-message-constructor.types';

export const runSwarmMessageStoreTest = () => {
  describe('SwarmMessageStore test', () => {
    let options: ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>;
    let messageConstructor: ISwarmMessageConstructor;
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

      messageConstructor = await createMessageConstructor();

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

      // TODO - add test for an events and database stasuses
    });

    const checkIsSwarmMessage = (
      swarmMessage: any
    ): swarmMessage is ISwarmMessageInstance => {
      expect(swarmMessage)
        .to.be.an('object')
        .which.have.property('bdy')
        .which.have.property('pld')
        .which.is.a('string');
      return true;
    };

    const createMessageBodyFromString = (
      message: string
    ): TSwarmMessageConstructorArgumentBody => ({
      iss: 'test',
      pld: message,
      typ: 'string',
    });

    const createMessageFromString = (message: string) =>
      messageConstructor.construct(createMessageBodyFromString(message));

    const TIMEOUT =
      SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS + 10000;

    describe('"addMessage" method test', () => {
      before(async function() {
        this.timeout(TIMEOUT);
        expect(swarmMessageStore).to.be.an('object');
        expect(swarmMessageStore.addMessage).to.be.a('function');
        expect(messageConstructor)
          .to.be.an('object')
          .which.have.property('construct')
          .which.is.a('function');
        await expect(
          swarmMessageStore.connect(options)
        ).to.not.eventually.be.rejectedWith(Error);
      });

      after(async function() {
        this.timeout(TIMEOUT);
        await swarmMessageStore.close();
      });

      it('expect not to throw on add a valid message', async () => {
        const swarmMessage = await createMessageFromString('Hello');

        checkIsSwarmMessage(swarmMessage);
        await expect(
          swarmMessageStore.addMessage(
            SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME,
            swarmMessage
          )
        ).to.eventually.be.a('string');
      }).timeout(TIMEOUT);

      it('expect to throw on add a not valid message', async () => {
        await expect(
          swarmMessageStore.addMessage(
            SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME,
            {} as any
          )
        ).to.eventually.to.be.rejected;
      }).timeout(TIMEOUT);

      it('expect to throw on add a valid message to a non-existing database', async () => {
        const swarmMessage = await createMessageFromString('Hello');

        checkIsSwarmMessage(swarmMessage);
        await expect(
          swarmMessageStore.addMessage(
            'non_existing_database_name',
            swarmMessage
          )
        ).to.eventually.to.be.rejected;
      }).timeout(TIMEOUT);

      describe('test "collect" method', async () => {
        before(async function() {
          this.timeout(TIMEOUT);
          expect(swarmMessageStore).to.be.an('object');
          expect(swarmMessageStore.collect).to.be.a('function');
          expect(messageConstructor)
            .to.be.an('object')
            .which.have.property('construct')
            .which.is.a('function');
        });

        it('iterate over all the existing messages', async () => {
          const result = await swarmMessageStore.collect(
            SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME,
            {
              limit: -1,
            }
          );
          debugger;
        });
      });
    });

    describe('"addMessage" method test with non-public database', () => {
      const DB_NAME = 'database_not_public';

      before(async function() {
        this.timeout(TIMEOUT);
        expect(swarmMessageStore).to.be.an('object');
        expect(swarmMessageStore.addMessage).to.be.a('function');
        expect(messageConstructor)
          .to.be.an('object')
          .which.have.property('construct')
          .which.is.a('function');
        await expect(
          swarmMessageStore.connect({
            ...options,
            databases: options.databases.map((dbOptions) => ({
              ...dbOptions,
              dbName: DB_NAME,
              isPublic: false,
            })),
          })
        ).to.not.eventually.be.rejectedWith(Error);
      });

      after(async function() {
        this.timeout(TIMEOUT);
        await swarmMessageStore.close();
      });

      it("expect to throw on add a valid message cause the current user can't add a message", async () => {
        const swarmMessage = await createMessageFromString('Hello');

        checkIsSwarmMessage(swarmMessage);
        await expect(
          swarmMessageStore.addMessage(DB_NAME, swarmMessage)
        ).to.eventually.be.rejectedWith(Error);
      }).timeout(TIMEOUT);

      it('expect to throw on add a not valid message', async () => {
        await expect(
          swarmMessageStore.addMessage(DB_NAME, {} as any)
        ).to.eventually.be.rejectedWith(Error);
      }).timeout(TIMEOUT);
    });
  });
};
