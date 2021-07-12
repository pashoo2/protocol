import { __awaiter } from "tslib";
import { TCentralAuthorityUserCryptoCredentials } from "../../central-authority-class-types/central-authority-class-types-crypto-credentials";
import { checkIsCryptoKeyPairs, exportKeyPairsAsString, importKeyPairsFromString, } from "../central-authority-util-crypto-keys/central-authority-util-crypto-keys";
import { validateUserIdentity } from "../../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials";
import { CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME, CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME, } from "../../central-authority-class-const/central-authority-class-const";
import { TCentralAuthorityUserIdentity, TCACryptoKeyPairs, } from "../../central-authority-class-types/central-authority-class-types";
import { CentralAuthorityIdentity } from "../../central-authority-class-user-identity/central-authority-class-user-identity";
import { checkIsValidCryptoCredentials, checkIsValidCryptoCredentialsExportedFormat, checkIsValidExportedCryptoCredentialsToString, } from "../../central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys";
import { stringify } from "../../../../utils/serialization-utils";
import { TUserIdentityVersion } from "../../central-authority-class-user-identity/central-authority-class-user-identity.types";
import { calcCryptoKeyPairHash } from '@pashoo2/crypto-utilities';
import { CA_UTILS_CRYPTO_CREDENTIALS_NORMALIZE_URL_OPTIONS } from './central-authority-utils-crypto-credentials.const';
import normalizeUrl from 'normalize-url';
export const exportCryptoCredentialsToString = (userCryptoCredentials, withoutIdentityVersion = false, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!checkIsValidCryptoCredentials(userCryptoCredentials, !!password)) {
        return new Error('The given value is not a valid crypto credentials');
    }
    const { [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeys, [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity } = userCryptoCredentials;
    const exportedCryptoKeys = yield exportKeyPairsAsString(cryptoKeys, password);
    if (exportedCryptoKeys instanceof Error) {
        return exportedCryptoKeys;
    }
    const cryptoCredentialsExported = {
        [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: exportedCryptoKeys,
        [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity,
    };
    if (withoutIdentityVersion) {
        const userCAIdentity = new CentralAuthorityIdentity(userIdentity);
        const { id } = userCAIdentity;
        if (id instanceof Error) {
            return new Error('The identity is not valid');
        }
        cryptoCredentialsExported[CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME] = id;
    }
    if (!checkIsValidCryptoCredentialsExportedFormat(cryptoCredentialsExported)) {
        return new Error('Failed to create a crypto credentials in the exported format');
    }
    try {
        const exportedCryptoCredentialsAsString = stringify(cryptoCredentialsExported);
        if (!checkIsValidExportedCryptoCredentialsToString(exportedCryptoCredentialsAsString)) {
            return new Error('Failed cause the crypto credentials exported as a sting have a wrong format');
        }
        return exportedCryptoCredentialsAsString;
    }
    catch (err) {
        console.error(err);
        return new Error('Failed to stringify the crypto credentials');
    }
});
export const exportCryptoCredentialsToStringWithoutTheCAIdentityVersion = (userCryptoCredentials) => exportCryptoCredentialsToString(userCryptoCredentials, true);
export const compareAuthProvidersIdentities = (...authProvidersIds) => {
    const { length: len } = authProvidersIds;
    if (len < 2) {
        return true;
    }
    const firstAuthProviderId = normalizeUrl(authProvidersIds[0], CA_UTILS_CRYPTO_CREDENTIALS_NORMALIZE_URL_OPTIONS);
    let idx = 0;
    while (++idx < len) {
        if (firstAuthProviderId !== normalizeUrl(authProvidersIds[idx], CA_UTILS_CRYPTO_CREDENTIALS_NORMALIZE_URL_OPTIONS)) {
            return false;
        }
    }
    return true;
};
export const compareCryptoCredentials = (...credentials) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(credentials instanceof Array)) {
        return new Error('Crdentails to compare must be an array');
    }
    const cryptoCredentialsBase = credentials[0];
    if (!checkIsValidCryptoCredentials(cryptoCredentialsBase)) {
        return new Error('The crypto credentials on index 0 is not valid');
    }
    if (credentials.length === 1) {
        return true;
    }
    const userIdentityBase = new CentralAuthorityIdentity(cryptoCredentialsBase[CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]);
    if (!userIdentityBase.isValid) {
        return new Error('The user identity is not valid in the crypto credentials base');
    }
    const cryptoCredentialsKeysBase = cryptoCredentialsBase[CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME];
    const cryptoCredentialsEncryptKeyPairHashBase = yield calcCryptoKeyPairHash(cryptoCredentialsKeysBase.encryptionKeyPair);
    if (cryptoCredentialsEncryptKeyPairHashBase instanceof Error) {
        return new Error('Failed to calculate hash of the encrypt key pairs base');
    }
    const cryptoCredentialsSignKeyPairHashBase = yield calcCryptoKeyPairHash(cryptoCredentialsKeysBase.signDataKeyPair);
    if (cryptoCredentialsSignKeyPairHashBase instanceof Error) {
        return new Error('Failed to calculate hash of the data sign key pairs base');
    }
    let idx = 1;
    const length = credentials.length;
    let nextCryptoCredentials = null;
    let keyPairs = null;
    let userIdentity = null;
    let encryptionKeyPairsHash = null;
    let signPairsHash = null;
    for (; idx < length; idx += 1) {
        nextCryptoCredentials = credentials[idx];
        if (!checkIsValidCryptoCredentials(nextCryptoCredentials)) {
            return new Error(`The crypto credentials on index ${idx} is not valid`);
        }
        userIdentity = new CentralAuthorityIdentity(nextCryptoCredentials[CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]);
        if (!userIdentity.isValid) {
            return new Error(`The user identity is not valid in the crypto credentials on index ${idx}`);
        }
        if (userIdentity.id !== userIdentityBase.id) {
            return new Error(`The user identity are different on index ${idx}`);
        }
        keyPairs = nextCryptoCredentials[CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME];
        encryptionKeyPairsHash = yield calcCryptoKeyPairHash(keyPairs.encryptionKeyPair);
        if (cryptoCredentialsEncryptKeyPairHashBase !== encryptionKeyPairsHash) {
            return new Error(`The encryption key pairs are different on index ${idx}`);
        }
        signPairsHash = yield calcCryptoKeyPairHash(keyPairs.signDataKeyPair);
        if (cryptoCredentialsSignKeyPairHashBase !== signPairsHash) {
            return new Error(`The data sign key pairs are different on index ${idx}`);
        }
    }
    return true;
});
export const importCryptoCredentialsFromExportedFromat = (cryptoCredentialsExported, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!checkIsValidCryptoCredentialsExportedFormat(cryptoCredentialsExported)) {
        return new Error('The crypto credentials exported have a wrong format');
    }
    const { [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeysExported, [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentityExported, } = cryptoCredentialsExported;
    const cryptoKeysImported = yield importKeyPairsFromString(cryptoKeysExported, password);
    if (cryptoKeysImported instanceof Error) {
        console.error(cryptoKeysImported);
        return new Error('Failed to import a crypto key pairs from the given string');
    }
    const cryptoCredentials = {
        [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeysImported,
        [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentityExported,
    };
    if (!checkIsValidCryptoCredentials(cryptoCredentials, !!password)) {
        return new Error('Failed to return the crypto credentials imorted in the valid format');
    }
    return cryptoCredentials;
});
export const importCryptoCredentialsFromAString = (cryptoCredentialsString, password) => __awaiter(void 0, void 0, void 0, function* () {
    const typeCryptoCredentials = typeof cryptoCredentialsString;
    if (typeCryptoCredentials !== 'string') {
        return new Error(`The cryptoCredentials value have the wrong type::${typeCryptoCredentials}::`);
    }
    if (!checkIsValidExportedCryptoCredentialsToString(cryptoCredentialsString)) {
        return new Error('The cryptoCredentials value have a wrong format');
    }
    let cryptoCredentialsExported;
    try {
        cryptoCredentialsExported = JSON.parse(cryptoCredentialsString);
    }
    catch (err) {
        console.error(err);
        return new Error('Failed to parse the given crypto credentials string');
    }
    return importCryptoCredentialsFromExportedFromat(cryptoCredentialsExported, password);
});
export const getUserCredentialsByUserIdentityAndCryptoKeys = (userIdentity, cryptoKeyPairs, checkPrivateKey = true) => {
    if (!validateUserIdentity(userIdentity)) {
        return new Error('The user identity has a wrong format');
    }
    if (!checkIsCryptoKeyPairs(cryptoKeyPairs, checkPrivateKey)) {
        return new Error('The crypto key pairs has a wrong format');
    }
    const cryptoCredentials = {
        [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity,
        [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeyPairs,
    };
    if (!checkIsValidCryptoCredentials(cryptoCredentials, checkPrivateKey)) {
        return new Error('Failed to create a valid crypto credentials');
    }
    return cryptoCredentials;
};
export const getExportedAsStringCryptoCredentials = (identity, cryptoCredentialsKeyPairs, checkPrivateKey = true) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const caIdentity = new CentralAuthorityIdentity(identity);
        const { isValid } = caIdentity;
        if (!isValid) {
            return new Error('The identity is not valid or have an unknown format');
        }
        if (!checkIsCryptoKeyPairs(cryptoCredentialsKeyPairs, checkPrivateKey)) {
            return new Error('The crypto keys are not valid or have an unknown format');
        }
        const caUserCryptoCredentials = getUserCredentialsByUserIdentityAndCryptoKeys(identity, cryptoCredentialsKeyPairs, checkPrivateKey);
        if (caUserCryptoCredentials instanceof Error) {
            console.error(caUserCryptoCredentials);
            return new Error('Failed to get User crypto credentials');
        }
        return yield exportCryptoCredentialsToString(caUserCryptoCredentials);
    }
    catch (err) {
        console.error(err);
        return new Error('Failed to process the credentials or identity');
    }
});
export const getExportedCryptoCredentialsByCAIdentity = (caIdentity, cryptoCredentialsKeyPairs, checkPrivateKey = true) => __awaiter(void 0, void 0, void 0, function* () {
    if (caIdentity instanceof CentralAuthorityIdentity) {
        if (caIdentity.isValid) {
            return getExportedAsStringCryptoCredentials(String(caIdentity), cryptoCredentialsKeyPairs, checkPrivateKey);
        }
        return new Error('The CA identity is wrong');
    }
    return new Error('The CA identity must be an instance of caIdentity');
});
export const replaceCryptoCredentialsIdentity = (cryptoCredentials, identity, checkPrivateKey = true) => {
    if (checkIsValidCryptoCredentials(cryptoCredentials, checkPrivateKey)) {
        return Object.assign(Object.assign({}, cryptoCredentials), { [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: identity });
    }
    return new Error('The crypto credentials have a wrong format');
};
export const getUserIdentityByCryptoCredentials = (cryptoCredentials) => {
    if (typeof cryptoCredentials !== 'object') {
        return new Error('The crypto credentials have an unknown format');
    }
    const { [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity } = cryptoCredentials;
    if (validateUserIdentity(userIdentity)) {
        return userIdentity;
    }
    return new Error('The user identity is not valid');
};
export const getCryptoKeyPairsByCryptoCredentials = (cryptoCredentials, checkPrivateKey = true) => {
    if (typeof cryptoCredentials !== 'object') {
        return new Error('The crypto credentials have an unknown format');
    }
    const { [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeyPairs } = cryptoCredentials;
    if (checkIsCryptoKeyPairs(cryptoKeyPairs, checkPrivateKey)) {
        return cryptoKeyPairs;
    }
    return new Error('The crypto key pairs are not valid');
};
export const getUserIdentityVersion = (userIdentity) => {
    if (!(userIdentity instanceof CentralAuthorityIdentity) && typeof userIdentity !== 'string') {
        return new Error('The userIdentity must be a string or an instance of the CentralAuthorityIdentity class');
    }
    const userIdentityObj = new CentralAuthorityIdentity(userIdentity);
    if (!userIdentityObj.isValid) {
        return new Error('The user identity is not valid');
    }
    return userIdentityObj.version;
};
export const getVersionOfCryptoCredentials = (cryptoCredentials) => {
    const userIdentity = getUserIdentityByCryptoCredentials(cryptoCredentials);
    if (userIdentity instanceof Error) {
        return userIdentity;
    }
    return getUserIdentityVersion(userIdentity);
};
//# sourceMappingURL=central-authority-utils-crypto-credentials.js.map