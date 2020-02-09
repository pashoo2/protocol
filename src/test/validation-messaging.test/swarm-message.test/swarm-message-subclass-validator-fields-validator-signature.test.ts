//import '@types/jest';
import { validateMessageSignatureFormat } from '../../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-signature/swarm-message-subclass-validator-fields-validator-signature';
import {
  VALIDATE_MESSAGE_SIGNATURE_FORAMT_MIN_LENGTH,
  VALIDATE_MESSAGE_SIGNATURE_FORAMT_MAX_LENGTH,
} from '../../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-signature/swarm-message-subclass-validator-fields-validator-signature.const';

describe('validateMessageSignatureFormat tests', () => {
  it('validateMessageSignatureFormat must throw if non-string body', () => {
    expect(() => (validateMessageSignatureFormat as any)(123)).toThrow();
    expect(() => (validateMessageSignatureFormat as any)({})).toThrow();
    expect(() => (validateMessageSignatureFormat as any)(undefined)).toThrow();
    expect(() => (validateMessageSignatureFormat as any)(null)).toThrow();
  });
  it('validateMessageSignatureFormat must throw if empty string body', () => {
    expect(() => validateMessageSignatureFormat('')).toThrow();
  });
  it('validateMessageSignatureFormat must not throw if non-empty string body with min length', () => {
    expect(() =>
      validateMessageSignatureFormat(
        (new Array(VALIDATE_MESSAGE_SIGNATURE_FORAMT_MIN_LENGTH + 1) as any)
          .fill('1')
          .join('')
      )
    ).not.toThrow();
  });
  it('validateMessageSignatureFormat must not throw if non-empty string body with max length', () => {
    expect(() =>
      validateMessageSignatureFormat(
        (new Array(VALIDATE_MESSAGE_SIGNATURE_FORAMT_MAX_LENGTH - 1) as any)
          .fill('1')
          .join('')
      )
    ).not.toThrow();
  });
});
