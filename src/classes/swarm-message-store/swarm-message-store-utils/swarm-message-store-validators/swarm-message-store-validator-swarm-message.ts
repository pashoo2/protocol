import assert from 'assert';
import {
  ISwarmMessageInstanceDecrypted,
  ISwarmMessageEncrypted,
  TSwarmMessageInstance,
} from '../../../swarm-message/swarm-message-constructor.types';
import SwarmMessageSubclassFieldsValidator from '../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator';

const swarmMessageFieldsValidator = new SwarmMessageSubclassFieldsValidator();

/**
 * Validates swarm message decrypted instance format
 *
 * @export
 * @param {ISwarmMessageInstanceDecrypted} message
 * @returns {true}
 * @throws - throw error if format is not valid
 */
export function isValidSwarmMessageDecryptedFormat(
  message: any
): message is ISwarmMessageInstanceDecrypted {
  assert(!!message, 'Swarm message should be defined');
  assert(
    typeof message.bdy === 'object',
    'Body of a decrypted message should be an object'
  );
  swarmMessageFieldsValidator.validateMessage(message);
  return true;
}

/**
 * Validates swarm message encrypted instance format
 *
 * @export
 * @param {ISwarmMessageInstanceDecrypted} message
 * @returns {true}
 * @throws - throw an error if format is not valid
 */
export function isValidSwarmMessageEncryptedFormat(
  message: any
): message is ISwarmMessageEncrypted {
  assert(!!message, 'Swarm message should be defined');
  assert(
    typeof message.bdy === 'string',
    'Body of an encrypted message should be a string'
  );
  swarmMessageFieldsValidator.validateMessage(message);
  return true;
}

/**
 * Validate is swarm message encrypted or decrypted has a valid format
 *
 * @export
 * @param {*} message
 * @returns {true}
 * @throws - if a message hasn't a valid format
 */
export function isValidSwarmMessageEncryptedOrDescryptedFormat(
  message: any
): message is TSwarmMessageInstance {
  assert(!!message, 'Swarm message should be defined');
  assert(
    typeof message.bdy === 'string',
    'Body of an encrypted message should be a string'
  );
  swarmMessageFieldsValidator.validateMessage(message);
  return true;
}
