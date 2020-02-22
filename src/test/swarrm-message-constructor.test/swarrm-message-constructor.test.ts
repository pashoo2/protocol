import { expect } from 'chai';
import { CentralAuthority } from '../../classes/central-authority-class/central-authority-class';
import { ICentralAuthority } from '../../classes/central-authority-class/central-authority-class.types';
import { CA_CLASS_OPTIONS_VALID_NO_PROFILE } from 'test/central-authority.test/central-authority-class.test/central-authority-class.test.const.shared';
import { SwarmMessageConstructor } from '../../classes/swarm-message/swarm-message-constructor';
import { SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER } from '../../classes/swarm-message/swarm-message-constructor.const';
import { stringToTypedArray } from '../../utils/typed-array-utils';

export const runSwarmMessageConstructorTests = () => {
  describe('SwarmMessageConstructor class tests', async function() {
    let caConnection: ICentralAuthority;

    this.timeout(10000);
    before(async () => {
      caConnection = new CentralAuthority();

      const result = await caConnection.connect(
        CA_CLASS_OPTIONS_VALID_NO_PROFILE
      );

      expect(result).not.to.be.an.instanceof(Error);
      expect(caConnection.isRunning).to.equal(true);
    });

    describe('SwarmMessageConstructor class constructor tests', () => {
      it('SwarmMessageConstructor with no options should throw', () => {
        expect(() => new (SwarmMessageConstructor as any)()).to.throw();
      });
      it('SwarmMessageConstructor with empty object instead of options should throw', () => {
        expect(() => new (SwarmMessageConstructor as any)({})).to.throw();
      });
      it('SwarmMessageConstructor only with the "caConnection" options should not throw', () => {
        expect(
          () =>
            new SwarmMessageConstructor({
              caConnection,
            })
        ).not.to.throw();
      });
    });

    describe('SwarmMessageConstructor class test methods', () => {
      let swarmMessageConstructor: SwarmMessageConstructor;

      before(() => {
        expect(caConnection).to.be.an.instanceof(CentralAuthority);
        expect(() => {
          swarmMessageConstructor = new SwarmMessageConstructor({
            caConnection,
          });
        }).not.to.throw();
        expect(swarmMessageConstructor).to.be.an.instanceof(
          SwarmMessageConstructor
        );
      });

      describe('SwarmMessageConstructor class message serizalization tests', () => {
        it('serialize message without fields required should be rejected', async () => {
          expect(swarmMessageConstructor).to.be.an.instanceof(
            SwarmMessageConstructor
          );
          await expect((swarmMessageConstructor.construct as any)()).to
            .eventually.be.rejected;
          await expect((swarmMessageConstructor.construct as any)({})).to
            .eventually.be.rejected;
          await expect(
            (swarmMessageConstructor.construct as any)({
              typ: 'message_type',
            })
          ).to.eventually.be.rejected;
          await expect(
            (swarmMessageConstructor.construct as any)({
              pld: {
                msg: 'message_payload',
              },
            })
          ).to.eventually.be.rejected;
          await expect(
            (swarmMessageConstructor.construct as any)({
              iss: 'message_issuer',
            })
          ).to.eventually.be.rejected;
          await expect(
            (swarmMessageConstructor.construct as any)({
              type: '',
              pld: '',
              iss: '',
            })
          ).to.eventually.be.rejected;
        });

        it('serialize message with all fields required as body as string should be fullfield with a valid message', async () => {
          expect(swarmMessageConstructor).to.be.an.instanceof(
            SwarmMessageConstructor
          );

          const messageIssuer = 'message_issuer';
          const messageType = 'message_type';
          const messagePayload = 'message_body';

          await expect(
            swarmMessageConstructor.construct({
              iss: messageIssuer,
              typ: messageType,
              pld: messagePayload,
            })
          ).to.eventually.be.fulfilled.with.an('Object');

          const message = await swarmMessageConstructor.construct({
            iss: messageIssuer,
            typ: messageType,
            pld: messagePayload,
          });
          const messageObjExpected = {
            alg: SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER.alg,
            sig: (expectedValue) => typeof expectedValue === 'string',
            toString: (expectedValue) => typeof expectedValue === 'function',
            uid: String(caConnection.getUserIdentity()),
            bdy: {
              iss: messageIssuer,
              pld: messagePayload,
              typ: messageType,
              ts: (ev) => typeof ev === 'number',
            },
          };

          expect(message).to.containSubset(messageObjExpected);

          const parsedFromStringified = JSON.parse(String(message));

          expect(parsedFromStringified.bdy).to.be.a('String');
          expect({
            ...parsedFromStringified,
            bdy: JSON.parse(parsedFromStringified.bdy),
          }).to.containSubset(messageObjExpected);
        });

        it('serialize message with all fields required and body as ArrayBuffer should be fullfield with a valid message', async () => {
          expect(swarmMessageConstructor).to.be.an.instanceof(
            SwarmMessageConstructor
          );

          const messageIssuer = 'message_issuer';
          const messageType = 'message_type';
          const messagePayloadString = 'message_payload';
          const messagePayload = stringToTypedArray(
            messagePayloadString
          ) as ArrayBuffer;

          expect(messagePayload).not.to.be.an('Error');
          await expect(
            swarmMessageConstructor.construct({
              iss: messageIssuer,
              typ: messageType,
              pld: messagePayload,
            })
          ).to.eventually.be.fulfilled.with.an('Object');

          const message = await swarmMessageConstructor.construct({
            iss: messageIssuer,
            typ: messageType,
            pld: messagePayload,
          });
          const messageObjExpected = {
            alg: SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER.alg,
            sig: (expectedValue) => typeof expectedValue === 'string',
            toString: (expectedValue) => typeof expectedValue === 'function',
            uid: String(caConnection.getUserIdentity()),
            bdy: {
              iss: messageIssuer,
              pld: messagePayloadString,
              typ: messageType,
              ts: (ev) => typeof ev === 'number',
            },
          };

          expect(message).to.containSubset(messageObjExpected);

          const parsedFromStringified = JSON.parse(String(message));

          expect(parsedFromStringified.bdy).to.be.a('String');
          expect({
            ...parsedFromStringified,
            bdy: JSON.parse(parsedFromStringified.bdy),
          }).to.containSubset(messageObjExpected);
        });

        it('serialize message with all fields required and body object as ArrayBuffer should be fullfield with a valid message', async () => {
          expect(swarmMessageConstructor).to.be.an.instanceof(
            SwarmMessageConstructor
          );

          const messageIssuer = 'message_issuer';
          const messageType = 'message_type';
          const massagePayloadObject = {
            num: 123456,
            string: '@!%^&%$*%(^_)&*+_(*kljdhjksdhffgdgлаоп',
            nested: {
              nulled: null,
              notDefined: undefined,
            },
          };
          const messagePayloadString = JSON.stringify(massagePayloadObject);
          const messagePayload = stringToTypedArray(
            messagePayloadString
          ) as ArrayBuffer;

          expect(messagePayload).not.to.be.an('Error');
          await expect(
            swarmMessageConstructor.construct({
              iss: messageIssuer,
              typ: messageType,
              pld: messagePayload,
            })
          ).to.eventually.be.fulfilled.with.an('Object');

          const message = await swarmMessageConstructor.construct({
            iss: messageIssuer,
            typ: messageType,
            pld: messagePayload,
          });
          const messageObjExpected = {
            alg: SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER.alg,
            sig: (expectedValue) => typeof expectedValue === 'string',
            toString: (expectedValue) => typeof expectedValue === 'function',
            uid: String(caConnection.getUserIdentity()),
            bdy: {
              iss: messageIssuer,
              pld: messagePayloadString,
              typ: messageType,
              ts: (ev) => typeof ev === 'number',
            },
          };

          expect(message).to.containSubset(messageObjExpected);
          expect(JSON.parse(message.bdy.pld)).containSubset(
            massagePayloadObject
          );

          const parsedFromStringified = JSON.parse(String(message));

          expect(parsedFromStringified.bdy).to.be.a('String');
          expect({
            ...parsedFromStringified,
            bdy: JSON.parse(parsedFromStringified.bdy),
          }).to.containSubset(messageObjExpected);
        });
      });

      describe('SwarmMessageConstructor class message parser tests', () => {});
    });
  });
};
