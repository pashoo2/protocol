import { validateIssuerDesirizlizedFormat } from '../swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied';
import { TSwarmMessaggeIssuerSerialized } from './swarm-message-subclass-validator-fields-validator-validator-issuer-serialized.types';

/**
 * validates the Issuer type and length
 *
 * @param {string} issuer
 * @throws
 */
export function validateIssuerSerializedFormat(
  issuer: TSwarmMessaggeIssuerSerialized
): void {
  validateIssuerDesirizlizedFormat(issuer);
}

export default validateIssuerSerializedFormat;
