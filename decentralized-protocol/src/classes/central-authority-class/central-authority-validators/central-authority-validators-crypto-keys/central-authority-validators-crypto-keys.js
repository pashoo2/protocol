import { CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME, CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME, CA_CREDENTIALS_KEY_CRYPTO_CREDENTIALS_EXPORTED_AS_STRING_MIN_LENGTH, } from "../../central-authority-class-const/central-authority-class-const";
import { TCentralAuthorityUserCryptoCredentials, TCentralAuthorityUserCryptoCredentialsExported, } from "../../central-authority-class-types/central-authority-class-types";
import { checkIsCryptoKeyPairs } from "../../central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys";
import { validateBySchema } from "../../../../utils/validation-utils/validation-utils";
import { validateUserIdentity } from '../central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { caValidatorsCryptoKeysExportedObjectValidationSchema } from './central-authority-validators-crypto-keys-schemas';
export const caValidateCryptoKeyPairExportedObject = (value) => validateBySchema(caValidatorsCryptoKeysExportedObjectValidationSchema, value);
export const checkIsValidCryptoCredentials = (cryptoCredentials, checkPrivateKey = true) => {
    if (!cryptoCredentials || typeof cryptoCredentials !== 'object') {
        return false;
    }
    const { [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeys, [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity, } = cryptoCredentials;
    if (!cryptoKeys) {
        console.error('There is a wrong format of the crypto credentials value, case a crypto keys was not found');
        return false;
    }
    if (!userIdentity) {
        console.error('There is a wrong format of the crypto credentials value, case a user identity value was not found');
        return false;
    }
    if (!validateUserIdentity(userIdentity)) {
        console.error('There is a wrong format of the crypto credentials value, case the user identity value have a wrong type');
        return false;
    }
    if (!checkIsCryptoKeyPairs(cryptoKeys, checkPrivateKey)) {
        console.error('There is a wrong format of the crypto credentials value, case the crypto keys value have a wrong type');
        return false;
    }
    return true;
};
export const checkIsValidCryptoCredentialsWithFunc = (cryptoCredentials, credentialsValidationFunction) => {
    if (!cryptoCredentials || typeof cryptoCredentials !== 'object') {
        return false;
    }
    const { [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeys, [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity, } = cryptoCredentials;
    if (!cryptoKeys) {
        console.error('There is a wrong format of the crypto credentials value, case a crypto keys was not found');
        return false;
    }
    if (!userIdentity) {
        console.error('There is a wrong format of the crypto credentials value, cause a user identity value was not found');
        return false;
    }
    if (!validateUserIdentity(userIdentity)) {
        console.error('There is a wrong format of the crypto credentials value, cause the user identity value have a wrong type');
        return false;
    }
    if (!credentialsValidationFunction(cryptoKeys)) {
        console.error('There is a wrong format of the crypto credentials value, cause the crypto keys exported as a string value have a wrong type');
        return false;
    }
    return true;
};
export const checkIsValidCryptoCredentialsExportedFormat = (cryptoCredentials) => {
    if (!checkIsValidCryptoCredentialsWithFunc(cryptoCredentials, checkIsValidExportedCryptoCredentialsToString)) {
        return false;
    }
    return true;
};
export const checkIsValidExportedCryptoCredentialsToString = (cryptoCredentialsExportedAsString) => {
    return (typeof cryptoCredentialsExportedAsString === 'string' &&
        cryptoCredentialsExportedAsString.length > CA_CREDENTIALS_KEY_CRYPTO_CREDENTIALS_EXPORTED_AS_STRING_MIN_LENGTH);
};
//# sourceMappingURL=central-authority-validators-crypto-keys.js.map