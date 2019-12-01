import SwarmMessageSubclassFieldsValidator from 'classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validator/swarm-message-subclass-validator-fields-validator';
import { expect } from 'chai';
import { AssertionError } from 'assert';
import { SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT } from 'classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validator/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-timestamp/swarm-message-subclass-validator-fields-validator-validator-timestamp.const';
import { getDateNowInSeconds } from 'utils/common-utils/common-utils-date-time-synced';
import {
  SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES,
  SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MIN_LENGTH_BYTES,
} from 'classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validator/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-payload/swarm-message-subclass-validator-fields-validator-validator-payload.const';
import { TSwarmMessagePayloadSerialized } from 'classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validator/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-payload/swarm-message-subclass-validator-fields-validator-validator-payload.types';
import { OmitType, ConstructorType } from 'types/helper.types';
import { bytesInInteger } from 'utils/common-utils/common-utils-number';
import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { generateUUID } from 'utils/identity-utils/identity-utils';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
} from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { SWARM_MESSAGE_SUBCLASS_VALIDATOR_USER_IDENTITY_SERIALIZED_MAX_LENGTH } from 'classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validator/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.const';

export const runSwarmMessageFieldsValidator = () => {
  describe('SwarmMessageSubclassFieldsValidator tests', () => {
    it('check constructor with no options not throws', () => {
      expect(() => {
        new SwarmMessageSubclassFieldsValidator();
      }).not.to.throw();
    });

    describe('validate user identity', () => {
      let messageValidator: any;

      beforeEach(() => {
        messageValidator = new SwarmMessageSubclassFieldsValidator();
      });
      it('CentralAuthorityIdentity with UUID stringified - should not throw', () => {
        const testIdentityDescription = {
          [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]:
            'https://google.com',
          [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: generateUUID(),
        };
        const uid = new CentralAuthorityIdentity(testIdentityDescription);

        expect(uid.isValid).to.equal(true);

        const userIdString = uid.toString();

        expect(() =>
          messageValidator.validateUserIdentifier(userIdString)
        ).to.not.throw();
      });
      it('CentralAuthorityIdentity with UUID stringified but not valid - should throw', () => {
        const testIdentityDescription = {
          [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]:
            'https://google.com',
          [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: generateUUID(),
        };
        const uid = new CentralAuthorityIdentity(testIdentityDescription);

        expect(uid.isValid).to.equal(true);

        const userIdString = uid.toString();

        expect(() =>
          messageValidator.validateUserIdentifier(userIdString + '--')
        ).to.throw(AssertionError);
      });
      it('CentralAuthorityIdentity with UUID stringified but too large - should throw', () => {
        const uidProviderURl = `https://go${new Array(
          SWARM_MESSAGE_SUBCLASS_VALIDATOR_USER_IDENTITY_SERIALIZED_MAX_LENGTH
        ).join('o')}ogle.com`;
        const testIdentityDescription = {
          [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: uidProviderURl,
          [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: generateUUID(),
        };
        const uid = new CentralAuthorityIdentity(testIdentityDescription);

        expect(uid.isValid).to.equal(true);

        const userIdString = uid.toString();

        expect(() =>
          messageValidator.validateUserIdentifier(userIdString)
        ).to.throw(AssertionError);
      });
      it('empty string - should throw', () => {
        expect(() => messageValidator.validateUserIdentifier('')).to.throw(
          AssertionError
        );
      });
      it('empty - should throw', () => {
        expect(() => messageValidator.validateUserIdentifier()).to.throw(
          AssertionError
        );
        expect(() => messageValidator.validateUserIdentifier(null)).to.throw(
          AssertionError
        );
      });
    });

    describe('validate payload', () => {
      let messageValidator: any;

      beforeEach(() => {
        messageValidator = new SwarmMessageSubclassFieldsValidator();
      });

      const validatePayloadConstructorType = (
        PayloadConstructor: ConstructorType<
          OmitType<TSwarmMessagePayloadSerialized, string | number[]>
        >
      ) => {
        it(`validate empty ${PayloadConstructor} - should throw`, () => {
          const payload = new PayloadConstructor(0);

          expect(() => {
            messageValidator.validatePayload(payload);
          }).to.throw(AssertionError);
        });
        it(`validate not empty ${PayloadConstructor} greater than max length - should throw`, () => {
          const payload = new PayloadConstructor(
            SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES + 1
          );

          expect(() => {
            messageValidator.validatePayload(payload);
          }).to.throw(AssertionError);
        });
        it(`validate not empty ${PayloadConstructor} less than min length - should throw`, () => {
          const payload = new PayloadConstructor(
            SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MIN_LENGTH_BYTES - 1
          );

          expect(() => {
            messageValidator.validatePayload(payload);
          }).to.throw(AssertionError);
        });
        it(`validate not empty ${PayloadConstructor} greater than min length and less than the max length - should not throw`, () => {
          const payload = new PayloadConstructor(
            SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MIN_LENGTH_BYTES + 5
          );

          expect(() => {
            messageValidator.validatePayload(payload);
          }).to.not.throw();
        });
      };

      validatePayloadConstructorType(ArrayBuffer);
      validatePayloadConstructorType(Uint8Array);
      validatePayloadConstructorType(SharedArrayBuffer);

      it(`validate empty number[] - should throw`, () => {
        const payload: number[] = [];

        expect(() => {
          messageValidator.validatePayload(payload);
        }).to.throw(AssertionError);
      });

      const generateArrayOfLength = <T = number>(len: number, it: T): T[] => {
        const arr: T[] = [];
        let idx = 0;

        while ((idx += 1) < len) {
          arr.push(it);
        }
        return arr;
      };
      const testArrayOfNumbers = (num: number) => {
        const bytesInNumber = bytesInInteger(num);

        if (typeof bytesInNumber !== 'number') {
          throw new Error('Failed to calculate the bytes count for the number');
        }

        it(`validate empty number[] - should throw`, () => {
          const payload: number[] = [];

          expect(() => {
            messageValidator.validatePayload(payload);
          }).to.throw(AssertionError);
        });

        it(`validate not empty number[] greater than max length cause ${num} is ${bytesInNumber} bytes - should throw`, () => {
          const payload: number[] = generateArrayOfLength(
            Math.round(
              SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES /
                bytesInNumber
            ) + 2,
            num
          );

          expect(() => {
            messageValidator.validatePayload(payload);
          }).to.throw(AssertionError);
        });

        it(`validate not empty number[] less than max length cause ${num} is ${bytesInNumber} bytes - should not throw`, () => {
          const payload: number[] = generateArrayOfLength(
            Math.round(
              SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES /
                bytesInNumber
            ) - 2,
            num
          );

          expect(() => {
            messageValidator.validatePayload(payload);
          }).to.not.throw();
        });
      };

      testArrayOfNumbers(255);
      testArrayOfNumbers(65537);
      testArrayOfNumbers(4294967295);
      testArrayOfNumbers(4294967296);

      it('empty string - should throw', () => {
        expect(() => {
          messageValidator.validatePayload('');
        }).to.throw();
      });

      it('string with length less than min - should throw', () => {
        expect(() => {
          messageValidator.validatePayload(
            generateArrayOfLength<string>(
              SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MIN_LENGTH_BYTES - 1,
              ''
            )
          );
        }).to.throw(AssertionError);
      });

      it('string with length greater than max - should throw', () => {
        expect(() => {
          messageValidator.validatePayload(
            generateArrayOfLength<string>(
              SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MIN_LENGTH_BYTES + 1,
              ''
            )
          );
        }).to.throw(AssertionError);
      });

      it('empty - should throw', () => {
        expect(() => {
          messageValidator.validatePayload();
        }).to.throw(AssertionError);
        expect(() => {
          messageValidator.validatePayload(null);
        }).to.throw(AssertionError);
      });
    });

    describe('validate timestamps', () => {
      let fieldsValidator: any;

      beforeEach(() => {
        fieldsValidator = new SwarmMessageSubclassFieldsValidator();
      });

      it(`timestamp less than min on the ${SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT.maxDiffErrorSeconds +
        1} seconds - should throw`, () => {
        const lessThanMinTimestamp =
          SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT.minValue -
          SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT.maxDiffErrorSeconds -
          1;

        expect(() =>
          fieldsValidator.validateTimestamp(lessThanMinTimestamp)
        ).to.throw(AssertionError);
      });

      it('timestamp equal to minimum - should not throw cause an error allowed', () => {
        const eqToMinTimestamp =
          SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT.minValue;

        expect(() =>
          fieldsValidator.validateTimestamp(eqToMinTimestamp)
        ).not.to.throw(AssertionError);
      });

      it(`timestamp less than min on the ${SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT.maxDiffErrorSeconds -
        1} - should not throw cause in the interval of error allowed`, () => {
        const fieldsValidator = new SwarmMessageSubclassFieldsValidator({
          timestampValidationOptions: {
            ttlSeconds: 0,
          },
        });
        const lessThanMinTimestamp =
          SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT.minValue -
          SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT.maxDiffErrorSeconds +
          1;

        expect(() =>
          (fieldsValidator as any).validateTimestamp(lessThanMinTimestamp)
        ).to.not.throw(AssertionError);
      });

      it('timestamp is not an integer - should throw', () => {
        const lessThanMinTimestamp =
          SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT.minValue -
          0.1;

        expect(() =>
          fieldsValidator.validateTimestamp(lessThanMinTimestamp)
        ).to.throw(AssertionError);
      });

      it('timestamp equals to the current - should not throw', () => {
        expect(() =>
          fieldsValidator.validateTimestamp(getDateNowInSeconds())
        ).to.not.throw(AssertionError);
      });
    });

    describe('validate type', () => {
      const messageType1 = 'type1';
      const messageType2 = 'type2';
      const messageAllowedTypes = [messageType1, messageType2];
      let messageValidator: any;

      it('message validator constructor - shoult not throw', () => {
        expect(
          () =>
            (messageValidator = new SwarmMessageSubclassFieldsValidator({
              typesList: messageAllowedTypes,
            }))
        ).to.not.throw();
      });
      beforeEach(() => {
        messageValidator = new SwarmMessageSubclassFieldsValidator({
          typesList: messageAllowedTypes,
        });
      });
      it('message with allowed type - should not throw', () => {
        expect(() =>
          messageValidator.validateType(messageType1)
        ).to.not.throw();
        expect(() =>
          messageValidator.validateType(messageType2)
        ).to.not.throw();
      });
      it('message with not allowed type - should throw', () => {
        expect(() =>
          messageValidator.validateType(`${messageType1}-wrong`)
        ).to.throw(AssertionError);
        expect(() =>
          messageValidator.validateType(`${messageType2}-wrong`)
        ).to.throw(AssertionError);
      });
    });

    describe('validate issuer', () => {
      const messageIssuer1 = 'type1';
      const messageIssuer2 = 'type2';
      const messageAllowedIssuer = [messageIssuer1, messageIssuer2];
      let messageValidator: any;

      it('message validator constructor - shoult not throw', () => {
        expect(
          () =>
            (messageValidator = new SwarmMessageSubclassFieldsValidator({
              issuersList: messageAllowedIssuer,
            }))
        ).to.not.throw();
      });
      beforeEach(() => {
        messageValidator = new SwarmMessageSubclassFieldsValidator({
          issuersList: messageAllowedIssuer,
        });
      });
      it('message with allowed issuer - should not throw', () => {
        expect(() =>
          messageValidator.validateIssuer(messageIssuer1)
        ).to.not.throw();
        expect(() =>
          messageValidator.validateIssuer(messageIssuer2)
        ).to.not.throw();
      });
      it('message with not allowed issuer - should throw', () => {
        expect(() =>
          messageValidator.validateIssuer(`${messageIssuer1}-wrong`)
        ).to.throw(AssertionError);
        expect(() =>
          messageValidator.validateIssuer(`${messageIssuer2}-wrong`)
        ).to.throw(AssertionError);
      });
    });
  });
};
