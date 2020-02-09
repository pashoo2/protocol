import validateIssuerDeserialized from '../swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied';
import { TSwarmMessaggeIssuerSerialized } from './swarm-message-subclass-validator-fields-validator-validator-issuer-serialized.types';

/**
 * validates the Issuer type and length
 *
 * @param {string} issuer
 * @throws
 */
function validateIssuerSerializedFormat(
  issuer: TSwarmMessaggeIssuerSerialized
): void {
  validateIssuerDeserialized(issuer);
}

export default validateIssuerSerializedFormat;
