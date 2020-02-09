// import '@types/jest';
import { validateMessageBodyRawFormat } from '../../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-body-raw/swarm-message-subclass-validator-fields-validator-body-raw';
import {
  VALIDATE_MESSAGE_BODY_RAW_FORAMT_MIN_LENGTH,
  VALIDATE_MESSAGE_BODY_RAW_FORAMT_MAX_LENGTH,
} from '../../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-body-raw/swarm-message-subclass-validator-fields-validator-body-raw.const';

describe('validateMessageBodyRawFormat tests', () => {
  it('validateMessageBodyRawFormat must throw if non-string body', () => {
    expect(() => validateMessageBodyRawFormat(123)).toThrow();
    expect(() => (validateMessageBodyRawFormat as any)({})).toThrow();
    expect(() => (validateMessageBodyRawFormat as any)(undefined)).toThrow();
    expect(() => (validateMessageBodyRawFormat as any)(null)).toThrow();
  });
  it('validateMessageBodyRawFormat must throw if empty string body', () => {
    expect(() => validateMessageBodyRawFormat('')).toThrow();
  });
  it('validateMessageBodyRawFormat must not throw if non-empty string body with min length', () => {
    expect(() =>
      validateMessageBodyRawFormat(
        (new Array(VALIDATE_MESSAGE_BODY_RAW_FORAMT_MIN_LENGTH + 1) as any)
          .fill('1')
          .join('')
      )
    ).not.toThrow();
  });
  it('validateMessageBodyRawFormat must not throw if non-empty string body with max length', () => {
    expect(() =>
      validateMessageBodyRawFormat(
        (new Array(VALIDATE_MESSAGE_BODY_RAW_FORAMT_MAX_LENGTH - 1) as any)
          .fill('1')
          .join('')
      )
    ).not.toThrow();
  });
});
