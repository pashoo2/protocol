import { SwarmMessageStore } from '../../classes/swarm-message-store/swarm-message-store';
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../../classes/swarm-store-class/swarm-store-class.const';
import { expect, assert } from 'chai';
import { createMessageConstructor } from '../swarrm-message-constructor.test/swarrm-message-constructor.shared';
import { SwarmMessageConstructor } from '../../classes/swarm-message/swarm-message-constructor';
import { ISwarmMessageStoreOptions } from '../../classes/swarm-message-store/swarm-message-store.types';
import {
  SWARM_MESSAGE_STORE_TEST_OPTIONS_VALID,
  SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME,
} from './swarm-message-store-test.const';
import { CentralAuthority } from '../../classes/central-authority-class/central-authority-class';
import { ipfsUtilsConnectBasic } from '../../utils/ipfs-utils/ipfs-utils';
import { SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.const';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ESwarmMessageStoreEventNames } from '../../classes/swarm-message-store/swarm-message-store.const';
import {
  TSwarmMessageConstructorArgumentBody,
  ISwarmMessageConstructor,
  ISwarmMessage,
  ISwarmMessageInstance,
} from '../../classes/swarm-message/swarm-message-constructor.types';

export const runSwarmMessageStoreTest = () => {
  describe('SwarmMessageStore test', () => {
    let options: ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>;
    let messageConstructor: ISwarmMessageConstructor;
    const swarmMessageStore = new SwarmMessageStore<ESwarmStoreConnector.OrbitDB>();

    it('SwarmMessageStore store constructor should not throw', () => {
      expect(() => new SwarmMessageStore<ESwarmStoreConnector.OrbitDB>()).to.not.throw();
    });

    before(async function () {
      this.timeout(60000);

      messageConstructor = await createMessageConstructor();

      expect(messageConstructor).to.be.an.instanceof(SwarmMessageConstructor);

      const caConnection = messageConstructor.caConnection;

      expect(caConnection).to.be.an.instanceof(CentralAuthority);

      const userId = caConnection?.getUserIdentity();

      expect(userId).to.be.a('string');

      const ipfs = await ipfsUtilsConnectBasic();

      expect(ipfs).to.be.an('object').which.have.property('bitswap').which.is.an('object');

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
        await expect(swarmMessageStore.connect(options)).to.not.eventually.be.rejectedWith(Error);
        await expect(swarmMessageStore.close()).to.not.eventually.be.rejectedWith(Error);
      }).timeout(30000);
      it('Should not be rejected if no databases provided', async () => {
        await expect(
          swarmMessageStore.connect({
            ...options,
            databases: [],
          })
        ).to.not.eventually.be.rejectedWith(Error);
        await expect(swarmMessageStore.close()).to.not.eventually.be.rejectedWith(Error);
      }).timeout(30000);

      // TODO - add test for an events and database stasuses
    });

    const checkIsSwarmMessage = (swarmMessage: any): swarmMessage is ISwarmMessageInstance => {
      expect(swarmMessage).to.be.an('object').which.have.property('bdy').which.have.property('pld').which.is.a('string');
      return true;
    };

    const createMessageBodyFromString = (message: string): TSwarmMessageConstructorArgumentBody => ({
      iss: 'test',
      pld: message,
      typ: 'string',
    });

    const createMessageFromString = (message: string) => messageConstructor.construct(createMessageBodyFromString(message));

    const TIMEOUT = SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS + 10000;

    describe('"addMessage" method test', () => {
      let messagesAdded: ISwarmMessageInstance[] = [];
      let messagesAddedHashes: Record<string, ISwarmMessageInstance> = {};

      // events emitted
      let allDbReadyEvent = false;
      let allDbLoadingEvent = false;
      let dbReadyEvent = false;
      let dbLoadingEvent = false;
      let errorEvent = false;
      let closeEvent = false;
      let newMessageEvent = false;

      before(async function () {
        this.timeout(TIMEOUT);
        expect(swarmMessageStore).to.be.an('object');
        expect(swarmMessageStore.addMessage).to.be.a('function');
        expect(messageConstructor).to.be.an('object').which.have.property('construct').which.is.a('function');

        swarmMessageStore.on(ESwarmMessageStoreEventNames.NEW_MESSAGE, ([dbName, message, hash]) => {
          if (dbName === SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME && typeof hash === 'string') {
            newMessageEvent = true;
          }
        });
        swarmMessageStore.on(ESwarmStoreEventNames.ERROR, (err) => {
          if (err instanceof Error) {
            errorEvent = true;
          }
        });
        swarmMessageStore.on(ESwarmStoreEventNames.DB_LOADING, ([dbName, percent]) => {
          if (dbName === SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME) {
            dbLoadingEvent = true;
          }
        });
        swarmMessageStore.on(ESwarmStoreEventNames.LOADING, (percent: number) => {
          if (typeof percent === 'number') {
            allDbLoadingEvent = true;
          }
        });
        swarmMessageStore.on(ESwarmStoreEventNames.READY, (dbName: string) => {
          if (dbName === SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME) {
            dbReadyEvent = true;
          }
        });
        swarmMessageStore.on(ESwarmStoreEventNames.STATE_CHANGE, (isReady: boolean) => {
          if (isReady) {
            allDbReadyEvent = isReady;
          }
        });
        swarmMessageStore.on(ESwarmStoreEventNames.CLOSE, () => {
          closeEvent = true;
        });

        await expect(swarmMessageStore.connect(options)).to.not.eventually.be.rejectedWith(Error);
      });

      after(async function () {
        this.timeout(TIMEOUT);
        await swarmMessageStore.close();
        expect(closeEvent).to.equal(true);
      });

      it('expect not to throw on add a valid message', async () => {
        const swarmMessage = await createMessageFromString('Hello');

        checkIsSwarmMessage(swarmMessage);
        await expect(swarmMessageStore.addMessage(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, swarmMessage)).to.eventually.be.a(
          'string'
        );
        messagesAdded.push(swarmMessage);
      }).timeout(TIMEOUT);

      it('expect not to throw on add a valid message from a long string with a special characters', async () => {
        const swarmMessage = await createMessageFromString(`
          ~!@##$%$&^(&^&&*^)P%&_*&*){}][]'d;f.ew'p;fl[,dm, vbf
          ]**/*-/+jgifgfj[fшоплпоаплоёёёёё]
        `);

        checkIsSwarmMessage(swarmMessage);

        const addedMessageHash = await swarmMessageStore.addMessage(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, swarmMessage);

        expect(addedMessageHash).to.be.a('string');
        messagesAddedHashes[addedMessageHash] = swarmMessage;
      }).timeout(TIMEOUT);

      it('expect to throw on add a not valid message', async () => {
        await expect(swarmMessageStore.addMessage(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, {} as any)).to.eventually.to.be
          .rejected;
      }).timeout(TIMEOUT);

      it('expect to throw on add a valid message to a non-existing database', async () => {
        const swarmMessage = await createMessageFromString('Hello');

        checkIsSwarmMessage(swarmMessage);
        await expect(swarmMessageStore.addMessage('non_existing_database_name', swarmMessage)).to.eventually.to.be.rejected;
      }).timeout(TIMEOUT);

      describe('test "collect" method', async () => {
        before(async function () {
          this.timeout(TIMEOUT);
          expect(swarmMessageStore).to.be.an('object');
          expect(swarmMessageStore.collect).to.be.a('function');
          expect(messageConstructor).to.be.an('object').which.have.property('construct').which.is.a('function');
        });

        it('iterate over all the existing messages should contain messages added before', async () => {
          const result = await swarmMessageStore.collect(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, {
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: -1,
          });

          expect(result)
            .to.be.an('array')
            .which.containSubset([...messagesAdded, ...Object.values(messagesAddedHashes)]);
        }).timeout(TIMEOUT);

        it('iterate with the "eq" request should return the message added before', async () => {
          const messageHashes = Object.keys(messagesAddedHashes);
          const messageHash = messageHashes[0];

          expect(messageHash).to.be.a('string');

          const result = await swarmMessageStore.collect(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, {
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: messageHash,
          });

          expect(result).to.be.an('array').which.containSubset([messagesAddedHashes[messageHash]]);
        }).timeout(TIMEOUT);

        it('iterate with the "eq" request should return the message added before', async () => {
          const messageHashes = Object.keys(messagesAddedHashes);

          expect(messageHashes).to.be.an('array');

          const result = await swarmMessageStore.collect(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, {
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: messageHashes,
          });

          expect(result).to.be.an('array').which.containSubset(Object.values(messagesAddedHashes));
        }).timeout(TIMEOUT);

        it('iterate witht the "limit" operand should return the same number of values', async () => {
          const result = await swarmMessageStore.collect(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, {
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: 2,
          });

          expect(result).to.be.an('array').haveOwnProperty('length').which.equal(2);
        });

        it('iterate witht the "limit" operand should return the same number of values', async () => {
          const result = await swarmMessageStore.collect(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, {
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: 2,
          });

          expect(result).to.be.an('array').haveOwnProperty('length').which.equal(2);
        });

        it('iterate with the "limit" operand and the "reverse" should return the same number of values', async () => {
          const result = await swarmMessageStore.collect(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, {
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: 2,
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.reverse]: true,
          });

          expect(result).to.be.an('array').haveOwnProperty('length').which.equal(2);
        });

        it('iterate with the "limit" operand and the "lte" should return the same number of values', async () => {
          const messageHashes = Object.keys(messagesAddedHashes);
          const messageHash = messageHashes[0];
          const expectedMaxLength = 2;

          expect(messageHash).to.be.a('string');

          const result = await swarmMessageStore.collect(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, {
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: 2,
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lte]: messageHash,
          });

          expect(result).to.be.an('array');
          assert.isAtMost(result.length, expectedMaxLength, `must be less or equal than ${expectedMaxLength}`);
        });

        it('iterate with the "limit" operand and the "gte" should return the same number of values', async () => {
          const messageHashes = Object.keys(messagesAddedHashes);
          const messageHash = messageHashes[0];
          const expectedMaxLength = 2;

          expect(messageHash).to.be.a('string');

          const result = await swarmMessageStore.collect(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, {
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: expectedMaxLength,
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lte]: messageHash,
          });

          expect(result).to.be.an('array');
          assert.isAtMost(result.length, expectedMaxLength, `must be less or equal than ${expectedMaxLength}`);
        });
        it('After the "deleteMessage" should not return the message removed', async () => {
          const messageHashes = Object.keys(messagesAddedHashes);
          const messageHash = messageHashes[0];
          const message = messagesAddedHashes[messageHash];

          expect(messageHash).to.be.a('string');

          await expect(
            swarmMessageStore.deleteMessage(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, messageHash)
          ).to.not.eventually.be.an('error');

          const result = await swarmMessageStore.collect(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, {});

          expect(result).to.be.an('array').which.not.containSubset([message]);
          expect(result.find((msg) => (msg as any).sig === message.sig)).to.equal(undefined);

          const messageRead = await swarmMessageStore.collect(SWARM_MESSAGE_STORE_TEST_DATABASE_ONE_NAME, {
            [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: messageHash,
          });

          expect(messageRead).to.be.an('array').which.haveOwnProperty('length').which.equal(0);
        });
      });

      describe('check events emitted', () => {
        it('storage ready', () => {
          expect(allDbReadyEvent).to.equal(true);
        });
        it('overall loading', () => {
          expect(allDbLoadingEvent).to.equal(true);
        });
        it('database ready', () => {
          expect(dbReadyEvent).to.equal(true);
        });
        it('database loading', () => {
          expect(dbLoadingEvent).to.equal(true);
        });
        it('error cause db not exists', () => {
          expect(errorEvent).to.equal(true);
        });
        it('new message cause a new message was added', () => {
          expect(newMessageEvent).to.equal(true);
        });
      });
    });

    describe('"addMessage" method test with non-public database', () => {
      const DB_NAME = 'database_not_public';

      before(async function () {
        this.timeout(TIMEOUT);
        expect(swarmMessageStore).to.be.an('object');
        expect(swarmMessageStore.addMessage).to.be.a('function');
        expect(messageConstructor).to.be.an('object').which.have.property('construct').which.is.a('function');
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

      after(async function () {
        this.timeout(TIMEOUT);
        await swarmMessageStore.close();
      });

      it("expect to throw on add a valid message cause the current user can't add a message", async () => {
        const swarmMessage = await createMessageFromString('Hello');

        checkIsSwarmMessage(swarmMessage);
        await expect(swarmMessageStore.addMessage(DB_NAME, swarmMessage)).to.eventually.be.rejectedWith(Error);
      }).timeout(TIMEOUT);

      it('expect to throw on add a not valid message', async () => {
        await expect(swarmMessageStore.addMessage(DB_NAME, {} as any)).to.eventually.be.rejectedWith(Error);
      }).timeout(TIMEOUT);
    });
  });
};
