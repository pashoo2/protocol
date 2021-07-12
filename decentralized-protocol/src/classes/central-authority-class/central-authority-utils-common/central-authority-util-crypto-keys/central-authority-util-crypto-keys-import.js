import { __awaiter } from "tslib";
import { importKeyPairFromString as importKeyPairDataEncryptionFromString, importKeyFromString as importKeyEncryptionFromString, dataSignImportKeyPairFromString as importKeyPairDataSignFromString, dataSignImportKeyFromString as importKeySignFromString, } from '@pashoo2/crypto-utilities';
import { CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME, CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME, CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME, CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME, CA_CRYPTO_KEY_PAIRS_PUBLIC_KEYS_STRINGIFIED_MIN_LENGTH, } from './central-authority-util-crypto-keys.const';
import { caValidateCryptoKeyPairExportedObject } from '../../central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import { checkIsPublicKeys, checkIsCryptoKeyPairs, checkIsCryptoKeyPairsExportedAsString, } from './central-authority-util-crypto-keys-common';
import { decompressString } from "../../../../utils/data-compression-utils/data-compression-utils-strings";
export const importKeyPairsFromString = (keyPairsString, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!checkIsCryptoKeyPairsExportedAsString(keyPairsString)) {
        return new Error('This is a wrong type of exported crypto keys');
    }
    let parsedKeyPairsObject;
    const decompressedValue = decompressString(keyPairsString);
    if (decompressedValue instanceof Error) {
        console.error(decompressedValue);
        return new Error('Failed to decompress key pairs');
    }
    try {
        parsedKeyPairsObject = JSON.parse(decompressedValue);
    }
    catch (err) {
        return err;
    }
    if (!caValidateCryptoKeyPairExportedObject(parsedKeyPairsObject)) {
        return new Error('There is a wrong format of a key pairs exported');
    }
    const { [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPairString, [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signDataKeyPairString, } = parsedKeyPairsObject;
    const [encryptionKeyPair, dataSignKeyPair] = yield Promise.all([
        importKeyPairDataEncryptionFromString(encryptionKeyPairString, password),
        importKeyPairDataSignFromString(signDataKeyPairString, password),
    ]);
    if (encryptionKeyPair instanceof Error) {
        return encryptionKeyPair;
    }
    if (dataSignKeyPair instanceof Error) {
        return dataSignKeyPair;
    }
    const encryptionKeyPairs = {
        [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPair,
        [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: dataSignKeyPair,
    };
    if (checkIsCryptoKeyPairs(encryptionKeyPairs, !!password)) {
        return encryptionKeyPairs;
    }
    return new Error('Failed to import key pairs');
});
export const importPublicKeyPairsFromString = (publicKeyPairsString) => __awaiter(void 0, void 0, void 0, function* () {
    let publicKeyPairsImport;
    try {
        publicKeyPairsImport = JSON.parse(publicKeyPairsString);
    }
    catch (err) {
        return err;
    }
    const { [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME]: importedStringEncryptionPublicKey, [CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME]: importedStringSignPublicKey, } = publicKeyPairsImport;
    if (typeof importedStringEncryptionPublicKey !== 'string' ||
        importedStringEncryptionPublicKey.length < CA_CRYPTO_KEY_PAIRS_PUBLIC_KEYS_STRINGIFIED_MIN_LENGTH) {
        const err = new Error('Encryption public key import as a string was failed');
        console.error(err);
        return err;
    }
    if (typeof importedStringSignPublicKey !== 'string' ||
        importedStringSignPublicKey.length < CA_CRYPTO_KEY_PAIRS_PUBLIC_KEYS_STRINGIFIED_MIN_LENGTH) {
        const err = new Error('Sign public key import as a string was failed');
        console.error(err);
        return err;
    }
    const [importedEncryptionPublicKey, importedSignPublicKey] = yield Promise.all([
        importKeyEncryptionFromString(importedStringEncryptionPublicKey),
        importKeySignFromString(importedStringSignPublicKey),
    ]);
    if (importedEncryptionPublicKey instanceof Error) {
        console.error('Failed to import encryption public key from the string');
        return importedEncryptionPublicKey;
    }
    if (importedSignPublicKey instanceof Error) {
        console.error('Failed to import sign public key from the string');
        return importedSignPublicKey;
    }
    const publicKeys = {
        [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME]: importedEncryptionPublicKey,
        [CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME]: importedSignPublicKey,
    };
    if (checkIsPublicKeys(publicKeys)) {
        return publicKeys;
    }
    return new Error('Failed to import a public keys');
});
//# sourceMappingURL=central-authority-util-crypto-keys-import.js.map