import { CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME, CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME, } from "../../central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys.const";
export const caValidatorsCryptoKeysExportedObjectValidationSchema = {
    type: 'object',
    required: [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME, CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME],
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
//# sourceMappingURL=central-authority-validators-crypto-keys-schemas.js.map