import { CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME, CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME, } from '../../central-authority-class-const/central-authority-class-const-auth-credentials';
import { CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME, CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME, } from '../central-authority-util-crypto-keys/central-authority-util-crypto-keys.const';
export const getCryptoKeysByCryptoCredentials = (cryptoCredentials) => {
    if (!cryptoCredentials) {
        return null;
    }
    return cryptoCredentials[CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME];
};
export const getUserIdentityFromCryptoCredentials = (cryptoCredentials) => {
    if (!cryptoCredentials) {
        return null;
    }
    return cryptoCredentials[CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME];
};
export const getKeyPairByCryptoCredentials = (cryptoCredentials, keyType) => {
    const cryptoKeyPair = getCryptoKeysByCryptoCredentials(cryptoCredentials);
    if (!cryptoKeyPair) {
        return null;
    }
    return cryptoKeyPair[keyType];
};
export const getPubKeyByCryptoCredentials = (cryptoCredentials, keyType) => {
    const cryptoKeyPair = getKeyPairByCryptoCredentials(cryptoCredentials, keyType);
    if (!cryptoKeyPair) {
        return null;
    }
    return cryptoKeyPair.publicKey;
};
export const getDataSignPubKeyByCryptoCredentials = (cryptoCredentials) => {
    return getPubKeyByCryptoCredentials(cryptoCredentials, CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME);
};
export const getDataSignKeyPairByCryptoCredentials = (cryptoCredentials) => {
    return getKeyPairByCryptoCredentials(cryptoCredentials, CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME);
};
export const getDataEncryptionPubKeyByCryptoCredentials = (cryptoCredentials) => {
    return getPubKeyByCryptoCredentials(cryptoCredentials, CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME);
};
export const getDataEncryptionKeyPairByCryptoCredentials = (cryptoCredentials) => {
    return getKeyPairByCryptoCredentials(cryptoCredentials, CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME);
};
//# sourceMappingURL=central-authority-utils-crypto-credentials-crypto-keys.js.map