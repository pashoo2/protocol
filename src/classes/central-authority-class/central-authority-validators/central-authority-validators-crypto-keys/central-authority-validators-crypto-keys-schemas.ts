import {
  CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
  CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
} from 'classes/central-authority-class/central-authority-utils/central-authority-util-crypto-keys.const';

export const caValidatorsCryptoKeysExportedObjectValidationSchema = {
  type: 'object',
  required: [
    CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME,
    CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME,
  ],
  additionalProperties: false,
  properties: {
    [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: {
      type: 'string',
    },
    [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: {
      type: 'string',
    },
  },
};
