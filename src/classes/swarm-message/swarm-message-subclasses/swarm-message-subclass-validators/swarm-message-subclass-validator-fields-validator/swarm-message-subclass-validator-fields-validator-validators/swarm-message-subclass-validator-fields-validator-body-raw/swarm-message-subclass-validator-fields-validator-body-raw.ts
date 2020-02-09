import assert from 'assert';
import {
  VALIDATE_MESSAGE_BODY_RAW_FORAMT_MIN_LENGTH,
  VALIDATE_MESSAGE_BODY_RAW_FORAMT_MAX_LENGTH,
} from './swarm-message-subclass-validator-fields-validator-body-raw.const';

export function validateMessageBodyRawFormat(bodyRaw: string) {
  assert(bodyRaw, 'A body of the message must not be empty');
  assert(typeof bodyRaw === 'string', 'A body of the message must be a string');
  assert(
    bodyRaw.length > VALIDATE_MESSAGE_BODY_RAW_FORAMT_MIN_LENGTH,
    `The minimum length of a message bodyRaw is ${VALIDATE_MESSAGE_BODY_RAW_FORAMT_MIN_LENGTH}`
  );
  assert(
    bodyRaw.length < VALIDATE_MESSAGE_BODY_RAW_FORAMT_MAX_LENGTH,
    `The maximum length of a message bodyRaw is ${VALIDATE_MESSAGE_BODY_RAW_FORAMT_MIN_LENGTH}`
  );
}
