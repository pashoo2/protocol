import { ConnectionBridge } from '../../classes/connection-bridge/connection-bridge';
import { expect } from 'chai';
import { ISwarmMessage } from '../../classes/swarm-message/swarm-message-constructor.types';
import {
  CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES_DB2,
  CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES_DB1,
} from './connection-bridge.test.const';
import {
  CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS,
  CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_EMAIL_NOT_VERIFIED,
} from './connection-bridge.test.const';

export const runConnectionBridgeTests = () => {
  describe('ConnectionBridge class tests', () => {
    it('constructor should not throws', () => {
      expect(() => {
        new ConnectionBridge();
      }).not.to.throw();
    });

    // describe('"connect" method', async () => {
    //   const connectionBridge = new ConnectionBridge();

    //   it('should fail if there is no options', async () => {
    //     await expect(connectionBridge.connect({} as any)).to.eventually.be
    //       .rejected;
    //   }).timeout(40000);

    //   it('should be rejected with a non-verified email in the options and be fullfilled with a valid options', async () => {
    //     await expect(
    //       connectionBridge.connect(
    //         CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_EMAIL_NOT_VERIFIED
    //       )
    //     )
    //       .to.eventually.be.rejected.with.an('error')
    //       .have.property('message')
    //       .which.is.a('string')
    //       .include('verif');
    //     await expect(connectionBridge.close()).to.eventually.be.fulfilled;
    //   }).timeout(40000);
    //   it('should be fullfilled with a valid options', async () => {
    //     await expect(
    //       connectionBridge.connect(CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS)
    //     ).to.eventually.be.fulfilled;
    //     expect(connectionBridge.caConnection)
    //       .to.be.an('object')
    //       .which.have.property('getSwarmUserCredentials')
    //       .which.is.a('function');
    //     expect(connectionBridge.storage)
    //       .to.be.an('object')
    //       .which.have.property('addMessage')
    //       .which.is.a('function');
    //     expect(connectionBridge.close).to.be.a('function');
    //     await expect(connectionBridge.close()).to.eventually.be.fulfilled;
    //   }).timeout(40000);
    // });

    describe('Check the "store", "messageConstructor" and "caConnection"', () => {
      const connectionBridge = new ConnectionBridge();
      let message: ISwarmMessage;

      before(async function() {
        this.timeout(40000);
        await expect(
          connectionBridge.connect(CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS)
        ).to.eventually.be.fulfilled;
      });

      after(async function() {
        this.timeout(40000);
        await expect(connectionBridge.close()).to.eventually.be.fulfilled;
      });

      it('The "caConnection" should be defined and implements the CentralAuthority connection interface', async () => {
        expect(connectionBridge.caConnection).to.be.an('object');
        expect(connectionBridge.caConnection!.isRunning).to.be.equal(true);
        await expect(connectionBridge.caConnection!.getUserEncryptionKeyPair())
          .to.eventually.be.fulfilled;
      });

      it('The "messageConstructor" should be defined and allows to create a new nessage', async () => {
        const { messageConstructor } = connectionBridge;

        expect(messageConstructor).to.be.an('object');
        await expect(
          messageConstructor!.construct({
            iss: 'test_issuer',
            typ: 'test_type',
            pld: 'test_payload',
          })
        )
          .to.eventually.be.fulfilled.with.an('object')
          .which.is.have.property('bdy')
          .which.is.an('object')
          .which.have.property('pld')
          .which.is.a('string');

        message = await messageConstructor!.construct({
          iss: 'test_issuer',
          typ: 'test_type',
          pld: 'test_payload',
        });

        expect(message)
          .to.be.an('object')
          .is.have.property('bdy')
          .which.is.an('object')
          .which.have.property('pld')
          .which.is.a('string');
      });

      it('The "storage" should be allowed to add new messages and read it', async () => {
        const { storage } = connectionBridge;

        expect(message).to.be.an('object');
        expect(storage).to.be.an('object');
        expect(storage!.isReady).to.be.equal(true);
        expect(storage!.isClosed).to.be.equal(false);
        await expect(
          storage!.addMessage(
            CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES_DB2.dbName,
            message
          )
        )
          .to.eventually.be.rejected.with.an('error')
          .have.property('message')
          .which.include('is not allowed to write'); // rejected cause the database is not public
        await expect(
          storage!.addMessage(
            CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES_DB1.dbName,
            message
          )
        ).to.eventually.be.fulfilled;
        await expect(
          storage?.collect(
            CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES_DB1.dbName,
            {
              limit: 1000,
            }
          )
        ).to.eventually.be.fulfilled.with.an('array');

        const messages = await storage?.collect(
          CONNECTION_BRIDGE_TEST_CONNECT_OPTIONS_STORAGE_DATABASES_DB1.dbName,
          {
            limit: 1000,
          }
        );

        expect(messages).to.containSubset([message]);
      }).timeout(10000);
    });
  });
};
