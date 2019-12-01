import assert from 'assert';
import { TSwarmMessageType } from './swarm-message-subclass-validator-fields-validator-validator-type.types';

/**
 * validate the type of the Type value
 * it's length or if it is positive or
 * a negative number
 *
 * @param {string | number} [type]
 * @throws
 */
function validateTypeFormat(type?: TSwarmMessageType): void {
  assert(type != null, 'A type must be specified');
  if (typeof type === 'string') {
    assert(!!type.length, 'The type of the message must not be empty');
  }
  if (typeof type === 'number') {
    assert(type < 0, 'The type must be a positive number');
  }
  assert.fail('Type of the swarm message must be a string or a number');
}

export default validateTypeFormat;
