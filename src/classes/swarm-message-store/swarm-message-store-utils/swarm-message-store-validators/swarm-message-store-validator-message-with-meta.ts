import assert from 'assert';
import { ISwarmMessageStoreMessageWithMeta } from '../../types/swarm-message-store.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { isValidSwarmMessageDecryptedFormat } from './swarm-message-store-validator-swarm-message';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';

/**
 * Validates swarm message with meta format
 *
 * @export
 * @template P
 * @param {ISwarmMessageStoreMessageWithMeta<P>} swarmMessageWithMeta
 * @returns {true}
 * @throws - is format is not valid
 */
export function validateSwarmMessageWithMeta<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted
>(swarmMessageWithMeta: any): swarmMessageWithMeta is ISwarmMessageStoreMessageWithMeta<P, MD> {
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
