import { __awaiter } from "tslib";
import { encryptDataToString, decryptDataWithKey, generatePasswordKeyByPasswordString, calculateHash, } from '@pashoo2/crypto-utilities';
import { SECRET_STORAGE_CLASS_UTILS_LOGIN_HASH_ALG, SECRET_STORAGE_CLASS_UTILS_LOGIN_SALT, } from './secret-storage-class-utils-login.const';
export const getLoginHash = (login) => {
    return calculateHash(login, SECRET_STORAGE_CLASS_UTILS_LOGIN_HASH_ALG);
};
export const getCryptoKeyByLogin = (login) => {
    return generatePasswordKeyByPasswordString(login, SECRET_STORAGE_CLASS_UTILS_LOGIN_SALT);
};
export const encryptValueByLogin = (login, value) => __awaiter(void 0, void 0, void 0, function* () {
    const loginCryptoKey = yield getCryptoKeyByLogin(login);
    if (loginCryptoKey instanceof Error) {
        console.error(loginCryptoKey);
        return new Error('Failed to generate a crypto key by the login');
    }
    return yield encryptDataToString(loginCryptoKey, value);
});
export const decryptValueByLogin = (login, value) => __awaiter(void 0, void 0, void 0, function* () {
    const loginCryptoKey = yield getCryptoKeyByLogin(login);
    if (loginCryptoKey instanceof Error) {
        return loginCryptoKey;
    }
    return yield decryptDataWithKey(loginCryptoKey, value);
});
//# sourceMappingURL=secret-storage-class-utils-login.js.map