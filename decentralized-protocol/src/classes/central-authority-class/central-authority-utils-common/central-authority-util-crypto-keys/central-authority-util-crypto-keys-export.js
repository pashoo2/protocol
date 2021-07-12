import { __awaiter } from "tslib";
import { exportKeyPairAsString as exportKeyPairDataEncryptAsString, exportKeyAsString as exportPublicKeyDataEncryptAsString, dataSignExportKeyPairAsString as exportKeyPairDataSignAsString, dataSignExportKeyAsString as exportPublicKeyDataSignAsString, } from '@pashoo2/crypto-utilities';
import { CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME, CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME, CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME, CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME, } from './central-authority-util-crypto-keys.const';
import { checkIsCryptoKeyPairs, getPublicKeysFromCryptoKeyPairs } from './central-authority-util-crypto-keys-common';
import { compressString } from "../../../../utils/data-compression-utils/data-compression-utils-strings";
import { stringify } from "../../../../utils/serialization-utils";
export const exportKeyPairsAsString = (cryptoKeyPairs, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!checkIsCryptoKeyPairs(cryptoKeyPairs, !!password)) {
        return new Error('The keypair is not valid');
    }
    const { [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPair, [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signDataKeyPair, } = cryptoKeyPairs;
    const [encryptionKeyPairString, signDataKeyPairString] = yield Promise.all([
        exportKeyPairDataEncryptAsString(encryptionKeyPair, password),
        exportKeyPairDataSignAsString(signDataKeyPair, password),
    ]);
    if (encryptionKeyPairString instanceof Error) {
        return encryptionKeyPairString;
    }
    if (signDataKeyPairString instanceof Error) {
        return signDataKeyPairString;
    }
    try {
        const stringifyResult = stringify({
            [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME]: encryptionKeyPairString,
            [CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME]: signDataKeyPairString,
        });
        return compressString(stringifyResult);
    }
    catch (err) {
        return err;
    }
});
export const exportPublicKeysAsString = (keyPairs) => __awaiter(void 0, void 0, void 0, function* () {
    const publicKeys = getPublicKeysFromCryptoKeyPairs(keyPairs);
    if (publicKeys instanceof Error) {
        return publicKeys;
    }
    const { [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME]: encryptionPublicKey, [CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME]: signPublicKey, } = publicKeys;
    const [encryptionPublicKeyExported, signPublicKeyExported] = yield Promise.all([
        exportPublicKeyDataEncryptAsString(encryptionPublicKey),
        exportPublicKeyDataSignAsString(signPublicKey),
    ]);
    if (encryptionPublicKeyExported instanceof Error) {
        console.error('export of the encryptionPublicKey was failed');
        return encryptionPublicKeyExported;
    }
    if (signPublicKeyExported instanceof Error) {
        console.error('export of the signPublicKeyExported was failed');
        return signPublicKeyExported;
    }
    try {
        return stringify({
            [CA_CRYPTO_KEY_PAIRS_ENCRYPTION_PUBLIC_KEY_NAME]: encryptionPublicKeyExported,
            [CA_CRYPTO_KEY_PAIRS_SIGN_PUBLIC_KEY_NAME]: signPublicKeyExported,
        });
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=central-authority-util-crypto-keys-export.js.map