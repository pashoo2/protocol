import assert from 'assert';
import { isValidSwarmMessageDecryptedFormat } from './swarm-message-store-validator-swarm-message';
export function validateSwarmMessageWithMeta(swarmMessageWithMeta) {
    if (!swarmMessageWithMeta) {
        alert('No swarm message with meta');
    }
    assert(!!swarmMessageWithMeta, 'Swarm message with meta is not defined');
    assert(typeof swarmMessageWithMeta === 'object', 'Swarm message with meta should be an object');
    assert(!!swarmMessageWithMeta.dbName, 'A databse name should not be empty');
    assert(typeof swarmMessageWithMeta.dbName === 'string', 'A database name should be a string');
    assert(!!swarmMessageWithMeta.messageAddress, 'A message address should not be empty');
    assert(typeof swarmMessageWithMeta.messageAddress === 'string', 'A message address should not be empty');
    if (swarmMessageWithMeta.key) {
        assert(typeof swarmMessageWithMeta.key === 'string', 'Swarm message key should be a string');
    }
    isValidSwarmMessageDecryptedFormat(swarmMessageWithMeta.message);
    return true;
}
//# sourceMappingURL=swarm-message-store-validator-message-with-meta.js.map