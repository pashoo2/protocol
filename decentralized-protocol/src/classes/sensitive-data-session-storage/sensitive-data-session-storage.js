import { __awaiter } from "tslib";
import { SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY, SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY_SALT, } from './sensitive-data-session-storage.const';
import assert from 'assert';
import { generatePasswordKeyByPasswordSalt, generateSaltForPassword } from "../secret-storage-class";
import { encryptDataToString, decryptDataByPassword } from '@pashoo2/crypto-utilities';
import { isSimpleObject } from "../../utils";
export class SensitiveDataSessionStorage {
    constructor() {
        this.isConnected = false;
        this.connectingPromise = undefined;
        this._temp = {};
        this.__tempStringified = undefined;
        this.storagePrefix = '';
        this.connect = (options) => __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected) {
                return;
            }
            if (options) {
                const { storagePrefix } = options;
                if (storagePrefix) {
                    this.storagePrefix = storagePrefix;
                }
            }
            if (!this.connectingPromise) {
                this.connectingPromise = this.connectToStorage(options);
            }
            yield this.connectingPromise;
        });
        this.getItem = (key) => __awaiter(this, void 0, void 0, function* () {
            assert(typeof key === 'string', 'Key must be a string');
            yield this.connectingPromise;
            return this._temp[key];
        });
        this.setItem = (key, v) => __awaiter(this, void 0, void 0, function* () {
            assert(typeof key === 'string', 'Key must be a string');
            yield this.connectingPromise;
            if (v == null) {
                delete this._temp[key];
            }
            else {
                this._temp[key] = v;
            }
            yield this.stringifyTemp();
        });
        this.beforeunloadHandler = () => {
            const v = this._tempStringified;
            if (v && typeof v === 'string') {
                sessionStorage.setItem(this.storageKeyValue, v);
            }
            else {
                sessionStorage.removeItem(this.storageKeyValue);
            }
        };
        this.stringifyTemp = () => __awaiter(this, void 0, void 0, function* () {
            const k = this.k;
            const v = this._temp;
            let stringified = undefined;
            if (!Object.keys(v).length) {
                stringified = undefined;
            }
            else if (k) {
                const encrypted = yield encryptDataToString(k, v);
                if (encrypted instanceof Error) {
                    return;
                }
                stringified = encrypted;
            }
            else {
                stringified = JSON.stringify(v);
            }
            this._tempStringified = stringified;
        });
    }
    get _tempStringified() {
        return this.__tempStringified;
    }
    set _tempStringified(v) {
        this.__tempStringified = v;
    }
    get storageKeyValue() {
        return `${this.storagePrefix}//${SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY}`;
    }
    get storageKeySalt() {
        return `${this.storagePrefix}//${SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY_SALT}`;
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectingPromise;
            this.unsubscribeOnWindowUnload();
            this.resetState();
        });
    }
    connectToStorage(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let error;
            let newsalt;
            try {
                let k;
                const pinCode = options === null || options === void 0 ? void 0 : options.pinCode;
                try {
                    const valueReadFromStore = (_a = (yield this.readFromStorage(pinCode))) !== null && _a !== void 0 ? _a : {};
                    if (isSimpleObject(valueReadFromStore)) {
                        this._temp = valueReadFromStore;
                    }
                }
                catch (err) {
                    error = err;
                }
                if (pinCode) {
                    assert(typeof pinCode === 'string', 'Pin code must be a string');
                    newsalt = this.generateSalt();
                    const pinCodeNewCryptoKey = yield generatePasswordKeyByPasswordSalt(pinCode, newsalt);
                    if (pinCodeNewCryptoKey instanceof Error) {
                        throw pinCodeNewCryptoKey;
                    }
                    k = pinCodeNewCryptoKey;
                }
                this.k = k;
                yield this.stringifyTemp();
            }
            catch (err) {
                error = err;
            }
            finally {
                if (error) {
                    this.resetState();
                    throw error;
                }
                if ((options === null || options === void 0 ? void 0 : options.clearStorageAfterConnect) !== false) {
                    this.clearValueStorage();
                    this.clearSaltStorage();
                }
                if (newsalt) {
                    sessionStorage.setItem(this.storageKeySalt, newsalt);
                }
                this.isConnected = true;
                this.subscribeOnWindowUnload();
            }
        });
    }
    readSalt() {
        const salt = sessionStorage.getItem(this.storageKeySalt);
        return salt;
    }
    generateSalt() {
        const newSalt = generateSaltForPassword();
        if (typeof newSalt !== 'string') {
            throw new Error('Failed to generate a salt value');
        }
        return newSalt;
    }
    toString() {
        var _a;
        return (_a = this._tempStringified) !== null && _a !== void 0 ? _a : '';
    }
    subscribeOnWindowUnload() {
        window.addEventListener('beforeunload', this.beforeunloadHandler);
    }
    unsubscribeOnWindowUnload() {
        window.removeEventListener('beforeunload', this.beforeunloadHandler);
    }
    readFromStorage(pinCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = sessionStorage.getItem(this.storageKeyValue);
            if (!v) {
                return;
            }
            const salt = !!pinCode && this.readSalt();
            const decrypted = salt && pinCode ? yield decryptDataByPassword(pinCode, salt, v) : v;
            if (decrypted instanceof Error) {
                throw decrypted;
            }
            return JSON.parse(decrypted);
        });
    }
    clearSaltStorage() {
        sessionStorage.removeItem(this.storageKeySalt);
    }
    clearValueStorage() {
        sessionStorage.removeItem(this.storageKeyValue);
    }
    resetState() {
        this.k = undefined;
        this._temp = {};
        this._tempStringified = undefined;
        this.isConnected = false;
    }
}
//# sourceMappingURL=sensitive-data-session-storage.js.map