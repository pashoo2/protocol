import assert from 'assert';
import { TSwarmMessageIssuerDeserialized } from './swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied.types';

/**
 * validates the Issuer type and length
 *
 * @param {string} issuer
 * @throws
 */
export function validateIssuerDesirizlizedFormat(
  issuer: TSwarmMessageIssuerDeserialized
): void {
  assert(issuer != null, 'The issuer must be defined');
  assert(typeof issuer === 'string', 'The issuer must be a string');
  assert(!!issuer.length, 'The issuer string must not be empty');
}
