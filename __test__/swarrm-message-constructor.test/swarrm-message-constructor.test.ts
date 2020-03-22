import { expect } from 'chai';
import { CentralAuthority } from '../../src/classes/central-authority-class/central-authority-class';
import { ICentralAuthority } from '../../src/classes/central-authority-class/central-authority-class.types';
import {
  CA_CLASS_OPTIONS_VALID_NO_PROFILE,
  CA_CLASS_OPTIONS_VALID_NO_PROFILE_ANOTHER,
} from '__test__/central-authority.test/central-authority-class.test/central-authority-class.test.const.shared';
import { SwarmMessageConstructor } from '../../src/classes/swarm-message/swarm-message-constructor';
import { SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER } from '../../src/classes/swarm-message/swarm-message-constructor.const';
import { stringToTypedArray } from '../../src/utils/typed-array-utils';
import {
  ISwarmMessage,
  ISwarmMessageRaw,
} from '../../src/classes/swarm-message/swarm-message-constructor.types';

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

    describe('class methods tests', () => {
      let messagesConstructed: ISwarmMessage[] = [];
      let messagesExpected: {}[] = [];
      let swarmMessageConstructor: SwarmMessageConstructor;

      const testMessage = async (
        messageConstructed: ISwarmMessage,
        messageObjExpected: {},
        swarmMessageConstructor: SwarmMessageConstructor
      ) => {
        // deserizlization should fail with a not valid message

        expect(messageConstructed).to.be.an('object');

        const messageSerializedStringified = JSON.stringify(messageConstructed);

        // should throw cause the body is object after JSON.parse, but must be a string
        await expect(
          swarmMessageConstructor.construct(messageSerializedStringified)
        ).to.eventually.be.rejected;

        const messageStringifiedParsed: ISwarmMessageRaw = JSON.parse(
          String(messageConstructed)
        );
        const messageStringifiedParsedWrongAlg = {
          ...messageStringifiedParsed,
          alg: '1' as any,
        };

        await expect(
          swarmMessageConstructor.construct(
            JSON.stringify(messageStringifiedParsedWrongAlg)
          )
        ).to.eventually.be.rejected;

        const uidWrong = `${messageStringifiedParsed.uid}`.replace('19', '20');
        const messageStringifiedParsedWrongUid = {
          ...messageStringifiedParsed,
          uid: uidWrong,
        };

        await expect(
          swarmMessageConstructor.construct(
            JSON.stringify(messageStringifiedParsedWrongUid)
          )
        ).to.eventually.be.rejected;

        const messageStringifiedParsedWrongSig = {
          ...messageStringifiedParsed,
          sig: `${messageStringifiedParsed.sig}1`,
        };

        await expect(
          swarmMessageConstructor.construct(
            JSON.stringify(messageStringifiedParsedWrongSig)
          )
        ).to.eventually.be.rejected;

        const messageStringifiedParsedWrongBody = {
          ...messageStringifiedParsed,
          bdy: JSON.stringify(
            Object.assign(JSON.parse(messageStringifiedParsed.bdy), {
              fieldNotExists: '',
            })
          ),
        };

        await expect(
          swarmMessageConstructor.construct(
            JSON.stringify(messageStringifiedParsedWrongBody)
          )
        ).to.eventually.be.rejected;

        //deserizlization should be fullfield with a valid message

        expect(messageConstructed).to.be.an('object');
        const messageStringified = String(messageConstructed);

        await expect(
          swarmMessageConstructor.construct(messageStringified)
        ).to.eventually.be.fulfilled.with.an('object');

        const swarmMessage = await swarmMessageConstructor.construct(
          messageStringified
        );

        expect(swarmMessage).to.containSubset(messageObjExpected);
        return true;
      };

      describe('construction tests', () => {
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

        it('message with all fields required as body as string should be fullfield with a valid message', async () => {
          expect(swarmMessageConstructor).to.be.an.instanceof(
            SwarmMessageConstructor
          );

          const messageIssuer = 'message_issuer';
          const messageType = 'message_type';
          const messagePayload = 'message_body';
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

          expect(message).to.containSubset(messageObjExpected);

          const parsedFromStringified = JSON.parse(String(message));

          expect(parsedFromStringified.bdy).to.be.a('String');
          expect({
            ...parsedFromStringified,
            bdy: JSON.parse(parsedFromStringified.bdy),
          }).to.containSubset(messageObjExpected);
          await expect(
            testMessage(message, messageObjExpected, swarmMessageConstructor)
          ).to.eventually.be.fulfilled.with.eq(true);
          messagesConstructed.push(message);
          messagesExpected.push(messageObjExpected);
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

          expect(message).to.containSubset(messageObjExpected);

          const parsedFromStringified = JSON.parse(String(message));

          expect(parsedFromStringified.bdy).to.be.a('String');
          expect({
            ...parsedFromStringified,
            bdy: JSON.parse(parsedFromStringified.bdy),
          }).to.containSubset(messageObjExpected);
          await expect(
            testMessage(message, messageObjExpected, swarmMessageConstructor)
          ).to.eventually.be.fulfilled.with.eq(true);
          messagesConstructed.push(message);
          messagesExpected.push(messageObjExpected);
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
          await expect(
            testMessage(message, messageObjExpected, swarmMessageConstructor)
          ).to.eventually.be.fulfilled.with.eq(true);
          messagesConstructed.push(message);
          messagesExpected.push(messageObjExpected);
        });
      });

      describe("construction tests with another user's connection to the central authority", () => {
        before(async () => {
          if (caConnection) {
            await expect(caConnection.disconnect()).to.eventually.not.rejected;
            expect(caConnection.isRunning).to.be.equal(false);
          }
          const caConnectionNext = new CentralAuthority();
          const result = await caConnectionNext.connect(
            CA_CLASS_OPTIONS_VALID_NO_PROFILE_ANOTHER
          );

          expect(result).not.to.be.an.instanceof(Error);
          expect(caConnectionNext).to.be.an.instanceof(CentralAuthority);
          expect(caConnectionNext.isRunning).to.equal(true);
          expect(() => {
            swarmMessageConstructor = new SwarmMessageConstructor({
              caConnection: caConnectionNext,
            });
          }).not.to.throw();
          expect(swarmMessageConstructor).to.be.an.instanceof(
            SwarmMessageConstructor
          );
        });

        it('deserizlize and validate each message created on previous test', async () => {
          let message: ISwarmMessage | undefined;
          let expected: {} | undefined;

          while (
            (message = messagesConstructed.pop()) &&
            (expected = messagesExpected.pop())
          ) {
            await expect(
              testMessage(message, expected, swarmMessageConstructor)
            ).to.eventually.be.fulfilled.with.eq(true);
          }
        });
      });
    });
  });
};
