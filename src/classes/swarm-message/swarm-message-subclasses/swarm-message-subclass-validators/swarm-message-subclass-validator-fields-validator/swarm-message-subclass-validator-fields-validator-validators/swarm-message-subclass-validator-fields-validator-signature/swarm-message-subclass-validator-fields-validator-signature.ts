import assert from 'assert';
import {
  VALIDATE_MESSAGE_SIGNATURE_FORAMT_MIN_LENGTH,
  VALIDATE_MESSAGE_SIGNATURE_FORAMT_MAX_LENGTH,
} from './swarm-message-subclass-validator-fields-validator-signature.const';

export function validateMessageSignatureFormat(signature: string) {
  assert(signature, 'A signature of the message must not be empty');
  assert(typeof signature === 'string', 'A signature of the message must be a string');
  assert(
    signature.length > VALIDATE_MESSAGE_SIGNATURE_FORAMT_MIN_LENGTH,
    `The minimum length of the message signature must be ${VALIDATE_MESSAGE_SIGNATURE_FORAMT_MIN_LENGTH}`
  );
  assert(
    signature.length < VALIDATE_MESSAGE_SIGNATURE_FORAMT_MAX_LENGTH,
    `The maximum length of the message signature must be ${VALIDATE_MESSAGE_SIGNATURE_FORAMT_MIN_LENGTH}`
  );
}
