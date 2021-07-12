import { __awaiter } from "tslib";
import { CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME } from './../../central-authority-class-const/central-authority-class-const-auth-credentials';
import { CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME } from "../../central-authority-class-const/central-authority-class-const";
import { generateKeyPair as generateKeyPairDataEncryption, dataSignGenerateKeyPair as generateKeyPairSignData, isCryptoKeyPair, } from '@pashoo2/crypto-utilities';
import { CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME, CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME, } from './central-authority-util-crypto-keys.const';
import { checkIsCryptoKeyPairs } from './central-authority-util-crypto-keys-common';
import { generateUUID } from "../../../../utils/identity-utils/identity-utils";
import { ICAUserUniqueIdentifierMetadata, ICAUserUniqueIdentifierDescriptionWithOptionalVersion, } from "../../central-authority-class-user-identity/central-authority-class-user-identity.types";
import { checkIsValidUserIdentityMetadata } from "../../central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-class-user-identity-validators";
import { CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME, CA_USER_IDENTITY_VERSION_PROP_NAME, CA_USER_IDENTITY_VERSIONS, } from "../../central-authority-class-user-identity/central-authority-class-user-identity.const";
import CentralAuthorityIdentity from "../../central-authority-class-user-identity/central-authority-class-user-identity";
import validator from 'validator';
import { dataValidatorUtilSafeLogin } from "../../../../utils/data-validators-utils/data-validators-utils-common";
export const generateEncryptKeyPair = () => __awaiter(void 0, void 0, void 0, function* () {
    const keyPair = yield generateKeyPairDataEncryption();
    const isKeyPair = isCryptoKeyPair(keyPair);
    if (!isKeyPair) {
        return new Error('Failed to generate a key pair');
    }
    return keyPair;
});
export const generateSignKeyPair = () => __awaiter(void 0, void 0, void 0, function* () {
    const keyPair = yield generateKeyPairSignData();
    const isKeyPair = isCryptoKeyPair(keyPair);
    if (!isKeyPair) {
        return new Error('Failed to generate a key pair');
    }
    return keyPair;
});
export const generateKeyPairs = () => __awaiter(void 0, void 0, void 0, function* () {
    const [encryptionKeyPair, signDataKeyPair] = yield Promise.all([generateEncryptKeyPair(), generateSignKeyPair()]);
    if (encryptionKeyPair instanceof Error) {
        return encryptionKeyPair;
    }
    if (signDataKeyPair instanceof Error) {
        return signDataKeyPair;
    }
    const keyPairs = {
        [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPair,
        [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signDataKeyPair,
    };
    if (checkIsCryptoKeyPairs(keyPairs)) {
        return keyPairs;
    }
    return new Error('Failed to generate a valid key pairs');
});
export const generateCryptoCredentialsV1 = () => __awaiter(void 0, void 0, void 0, function* () {
    const cryptoKeyPair = yield generateKeyPairs();
    if (cryptoKeyPair instanceof Error) {
        console.error(cryptoKeyPair);
        return new Error('Failed to generate a valid crypto credentials');
    }
    return {
        [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: generateUUID(),
        [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeyPair,
    };
});
export const generateCryptoCredentialsWithUserIdentityV1 = (identityMetadata) => __awaiter(void 0, void 0, void 0, function* () {
    const validationIdentityMetadataResult = checkIsValidUserIdentityMetadata(identityMetadata);
    if (validationIdentityMetadataResult instanceof Error) {
        console.error(validationIdentityMetadataResult);
        return new Error('The identity metadata is not valid');
    }
    const uuidProvided = identityMetadata[CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME];
    const userUUID = typeof uuidProvided === 'string' && validator.isUUID(uuidProvided) ? uuidProvided : generateUUID();
    const userUniqueIdentityDescription = Object.assign(Object.assign({}, identityMetadata), { [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUUID, [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['01'] });
    const userUniqueIdentityInstance = new CentralAuthorityIdentity(userUniqueIdentityDescription);
    if (!userUniqueIdentityInstance.isValid) {
        return new Error('Failed to generate a valid user unique identity');
    }
    const userUniqueId = userUniqueIdentityInstance.toString();
    if (!userUniqueId) {
        return new Error('Failed to get stringified version of the user unique identity generated');
    }
    const cryptoKeyPair = yield generateKeyPairs();
    if (cryptoKeyPair instanceof Error) {
        console.error(cryptoKeyPair);
        return new Error('Failed to generate a valid crypto credentials');
    }
    return {
        [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userUniqueId,
        [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeyPair,
    };
});
export const generateCryptoCredentialsWithUserIdentityV2 = (identityMetadata) => __awaiter(void 0, void 0, void 0, function* () {
    const validationIdentityMetadataResult = checkIsValidUserIdentityMetadata(identityMetadata);
    if (validationIdentityMetadataResult instanceof Error) {
        console.error(validationIdentityMetadataResult);
        return new Error('The identity metadata is not valid');
    }
    const userIdentifier = identityMetadata[CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME];
    if (!userIdentifier) {
        return new Error('A user identifier must be specified');
    }
    if (!dataValidatorUtilSafeLogin(userIdentifier)) {
        return new Error('The user identifier provided is not valid');
    }
    const userUniqueIdentityDescription = Object.assign(Object.assign({}, identityMetadata), { [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['02'] });
    const userUniqueIdentityInstance = new CentralAuthorityIdentity(userUniqueIdentityDescription);
    if (!userUniqueIdentityInstance.isValid) {
        return new Error('Failed to generate a valid user unique identity');
    }
    const userUniqueId = userUniqueIdentityInstance.toString();
    if (!userUniqueId) {
        return new Error('Failed to get stringified version of the user unique identity generated');
    }
    const cryptoKeyPair = yield generateKeyPairs();
    if (cryptoKeyPair instanceof Error) {
        console.error(cryptoKeyPair);
        return new Error('Failed to generate a valid crypto credentials');
    }
    return {
        [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userUniqueId,
        [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeyPair,
    };
});
//# sourceMappingURL=central-authority-util-crypto-keys-generate.js.map