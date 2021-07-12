import assert from 'assert';
import SwarmMessageSubclassFieldsValidator from '../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator';
const swarmMessageFieldsValidator = new SwarmMessageSubclassFieldsValidator();
export function isValidSwarmMessageDecryptedFormat(message) {
    assert(!!message, 'Swarm message should be defined');
    assert(typeof message.bdy === 'object', 'Body of a decrypted message should be an object');
    swarmMessageFieldsValidator.validateMessage(message);
    return true;
}
export function isValidSwarmMessageEncryptedFormat(message) {
    assert(!!message, 'Swarm message should be defined');
    assert(typeof message.bdy === 'string', 'Body of an encrypted message should be a string');
    swarmMessageFieldsValidator.validateMessage(message);
    return true;
}
export function isValidSwarmMessageEncryptedOrDescryptedFormat(message) {
    assert(!!message, 'Swarm message should be defined');
    assert(typeof message.bdy === 'string', 'Body of an encrypted message should be a string');
    swarmMessageFieldsValidator.validateMessage(message);
    return true;
}
//# sourceMappingURL=swarm-message-store-validator-swarm-message.js.map