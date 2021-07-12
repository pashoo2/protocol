import { __awaiter } from "tslib";
import { ISecretStoreConfiguration, ISecretStorageSessionInfo, ISecretStorageSessionInfoStored, ISecretStoreCredentialsSession, } from "./secret-storage-class.types";
import { ownValueOf } from "../../types/helper.types";
import { importPasswordKey, exportPasswordKeyAsString, importPasswordKeyFromString, decryptDataWithKey, decryptDataWithKeyFromUint8Array, encryptDataToString, encryptDataToUInt8Array, calcCryptoKeyHash, isCryptoKeyDataEncryption, } from '@pashoo2/crypto-utilities';
import { getStatusClass } from "../basic-classes/status-class-base/status-class-base";
import { STORAGE_PROVIDERS, STORAGE_PROVIDERS_NAME, STORAGE_PROVIDERS_NAMES, } from "../storage-providers/storage-providers.const";
import { SecretStorageProviderLocalStorage } from "../storage-providers/storage-local-storage-provider/secret-storage-local-storage-provider";
import { checkIsStorageProviderInstance, validateCryptoKeyCredentials, } from './secret-storage-class-utils/secret-storage-class-utils-main/secret-storage-class-utils-main';
import { decryptValueByLogin, encryptValueByLogin, } from './secret-storage-class-utils/secret-storage-class-utils-login/secret-storage-class-utils-login';
import { generatePasswordKeyByPasswordSalt, generateSaltForPassword, } from './secret-storage-class-utils/secret-storage-class-utils-password/secret-storage-class-utils-password';
import { SECRET_STORAGE_STATUS, SECRET_STORAGE_PASSWORD_MIN_LENGTH, SECRET_STORAGE_SESSION_KEY, } from './secret-storage-class.const';
import { getLoginHash } from './secret-storage-class-utils/secret-storage-class-utils-login';
import { SECRET_STORAGE_LOGIN_MIN_LENGTH, SECRET_STORAGE_UNSET_MAX_ATTEMPTS } from './secret-storage-class.const';
import { IStorageProviderOptions } from "../storage-providers/storage-providers.types";
import { ISensitiveDataSessionStorage } from "../sensitive-data-session-storage/sensitive-data-session-storage.types";
export class SecretStorage extends getStatusClass({
    errorStatus: SECRET_STORAGE_STATUS.ERROR,
    instanceName: 'SecretStorage',
}) {
    constructor(configuration = {}) {
        super();
        this.configuration = configuration;
        this.keyHash = '';
        this.isStorageProviderSupportUInt8Array = false;
        this.connect = (options) => __awaiter(this, void 0, void 0, function* () {
            this.clearState();
            this.setStatus(SECRET_STORAGE_STATUS.CONNECTING);
            this.setOptions(options);
            const resultRunAuthProvider = yield this.runAuthStorageProvider();
            if (resultRunAuthProvider instanceof Error) {
                this.setErrorStatus(resultRunAuthProvider);
                return resultRunAuthProvider;
            }
            const isStorageProviderStarted = yield this.runStorageProvider();
            if (isStorageProviderStarted instanceof Error) {
                this.setErrorStatus(isStorageProviderStarted);
                return isStorageProviderStarted;
            }
            this.setStatus(SECRET_STORAGE_STATUS.RUNNING);
            return true;
        });
        this.has = (key) => __awaiter(this, void 0, void 0, function* () {
            const valueEncrypted = yield this.readValueForKey(key);
            if (valueEncrypted instanceof Error) {
                return valueEncrypted;
            }
            return this.isValueDefined(valueEncrypted);
        });
        this.get = (key) => __awaiter(this, void 0, void 0, function* () {
            const valueEncrypted = yield this.readValueForKey(key);
            if (!valueEncrypted) {
                return undefined;
            }
            if (valueEncrypted instanceof Error) {
                return SecretStorage.error(valueEncrypted);
            }
            if (this.isNullishValue(valueEncrypted)) {
                return null;
            }
            const decryptResult = yield (valueEncrypted instanceof Uint8Array
                ? this.decryptValueFromUInt8Array(valueEncrypted)
                : this.decryptValue(valueEncrypted));
            if (decryptResult instanceof Error) {
                return decryptResult;
            }
            return decryptResult || undefined;
        });
        this.storageProviderDisconnect = () => __awaiter(this, void 0, void 0, function* () {
            const { authStorageProvider } = this;
            if (authStorageProvider) {
                return authStorageProvider.disconnect();
            }
            return new Error('There is no Auth storage provider defined');
        });
        this.unsetWithStorageProvider = (key) => __awaiter(this, void 0, void 0, function* () {
            const { storageProvider } = this;
            if (!storageProvider) {
                return new Error('There is no an active connection with storage provider');
            }
            const result = yield storageProvider.set(this.storageKey(key), undefined);
            if (result instanceof Error) {
                return result;
            }
            return true;
        });
        this.readValueForKey = (key) => __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning) {
                return new Error('There is no connection with storage or not authorized');
            }
            const k = this.storageKey(key);
            const { isStorageProviderSupportUInt8Array } = this;
            return isStorageProviderSupportUInt8Array ? this.getWithStorageProviderUint8Array(k) : this.getWithStorageProvider(k);
        });
    }
    static validatePassword(password) {
        if (typeof password !== 'string') {
            return new Error('validateCredentials::A password string must be provided to authorize');
        }
        if (!password) {
            return new Error('validateCredentials::A password non-empty string must be provided to authorize');
        }
        if (password.length < SECRET_STORAGE_PASSWORD_MIN_LENGTH) {
            return new Error(`validateCredentials::The password string must be a ${SECRET_STORAGE_PASSWORD_MIN_LENGTH} characters ar least`);
        }
    }
    static validateLogin(login) {
        if (typeof login !== 'string') {
            return new Error('validateCredentials::A login string must be provided to authorize');
        }
        if (!login) {
            return new Error('validateCredentials::A login non-empty string must be provided to authorize');
        }
        if (login.length < SECRET_STORAGE_LOGIN_MIN_LENGTH) {
            return new Error(`validateCredentials::The login string must be a ${SECRET_STORAGE_LOGIN_MIN_LENGTH} characters ar least`);
        }
    }
    static validateCredentials(credentials) {
        var _a;
        if (!credentials) {
            return new Error('validateCredentials::Credentials must not be empty');
        }
        if (typeof credentials !== 'object') {
            return new Error('validateCredentials::Credentials must be an object');
        }
        return (_a = SecretStorage.validateLogin(credentials.login)) !== null && _a !== void 0 ? _a : SecretStorage.validatePassword(credentials.password);
    }
    static saltKey(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginHash = yield getLoginHash(credentials.login);
            if (loginHash instanceof Error) {
                console.error(loginHash);
                return new Error('Failed to calculate hash by a login string');
            }
            return `${SecretStorage.PREFIX_FOR_SALT_VALUE}__${loginHash}`;
        });
    }
    get isRunning() {
        const { status } = this;
        return status === SECRET_STORAGE_STATUS.RUNNING;
    }
    get isActive() {
        return !!this.isRunning;
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const resultDisconnectFromStorageProvider = yield this.storageProviderDisconnect();
            if (resultDisconnectFromStorageProvider instanceof Error) {
                console.error(resultDisconnectFromStorageProvider);
                return new Error('Failed to disconnect from the storage provider');
            }
            this.reset();
            this.setStatus(SECRET_STORAGE_STATUS.STOPPED);
            return true;
        });
    }
    generateCryptoKey(credentialsOrSession) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isCryptoKeyDataEncryption(credentialsOrSession)) {
                return credentialsOrSession;
            }
            const session = credentialsOrSession.session;
            if (session) {
                const sessionInfo = yield this.readLoginAndKeyFromSession(session);
                if (sessionInfo && !(sessionInfo instanceof Error) && sessionInfo.key) {
                    return sessionInfo.key;
                }
            }
            const credentials = credentialsOrSession;
            const credentialsValidationResult = SecretStorage.validateCredentials(credentials);
            if (credentialsValidationResult instanceof Error) {
                this.setErrorStatus(credentialsValidationResult);
                return credentialsValidationResult;
            }
            const salt = yield this.getSaltValue(credentials);
            if (salt instanceof Error) {
                this.setErrorStatus(salt);
                return new Error('Failed to generate salt value');
            }
            const cryptoKey = yield generatePasswordKeyByPasswordSalt(credentials.password, salt);
            if (cryptoKey instanceof Error) {
                this.setErrorStatus(cryptoKey);
                return cryptoKey;
            }
            return cryptoKey;
        });
    }
    authorize(credentials, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentialsWithKey = credentials;
            if (credentialsWithKey.key &&
                isCryptoKeyDataEncryption(credentialsWithKey.key) &&
                isCryptoKeyDataEncryption(credentialsWithKey.key)) {
                return this.authorizeByKey(credentialsWithKey, options);
            }
            const credentialsWithSession = credentials;
            if (credentialsWithSession && credentialsWithSession.session) {
                const sessionInfo = yield this.readLoginAndKeyFromSession(credentialsWithSession.session);
                if (sessionInfo && !(sessionInfo instanceof Error)) {
                    return this.authorizeByKey({
                        key: sessionInfo.key,
                    }, options);
                }
            }
            const cred = credentials;
            const cryptoKey = yield this.generateCryptoKey(cred);
            if (cryptoKey instanceof Error) {
                console.error(cryptoKey);
                return new Error('Failed to generate a crypto key to encrypt local data');
            }
            const resultRunAuthProvider = yield this.runAuthStorageProvider();
            if (resultRunAuthProvider instanceof Error) {
                this.setErrorStatus(resultRunAuthProvider);
                return resultRunAuthProvider;
            }
            const setKeyResult = yield this.setEncryptionKey(cryptoKey);
            if (setKeyResult instanceof Error) {
                this.setErrorStatus(setKeyResult);
                return setKeyResult;
            }
            if (credentialsWithSession.session) {
                yield this.saveLoginAndKeyToSession(credentialsWithSession.session, cred.login, cryptoKey);
            }
            return this.connect(options);
        });
    }
    authorizeByKey(credentials, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentialsValidationResult = validateCryptoKeyCredentials(credentials);
            if (credentialsValidationResult instanceof Error) {
                this.setErrorStatus(credentialsValidationResult);
                return credentialsValidationResult;
            }
            const { key: cryptoKey } = credentials;
            const resultRunAuthProvider = yield this.runAuthStorageProvider();
            if (resultRunAuthProvider instanceof Error) {
                this.setErrorStatus(resultRunAuthProvider);
                return resultRunAuthProvider;
            }
            const setKeyResult = yield this.setEncryptionKey(cryptoKey);
            if (setKeyResult instanceof Error) {
                this.setErrorStatus(setKeyResult);
                return setKeyResult;
            }
            return yield this.connect(options);
        });
    }
    set(keyForValue, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let encryptedValue;
            if (!this.isRunning) {
                return SecretStorage.error('The instance of SecretStorage is not connected to the storage provider or there is no an encryption key');
            }
            if (value === null) {
                encryptedValue = this.isStorageProviderSupportUInt8Array ? new Uint8Array() : '';
            }
            else {
                encryptedValue = this.isStorageProviderSupportUInt8Array
                    ? yield this.encryptValueAsInt8Array(value)
                    : yield this.encryptValue(value);
            }
            if (encryptedValue instanceof Error) {
                return SecretStorage.error(encryptedValue);
            }
            const key = this.storageKey(keyForValue);
            const storeValueResult = yield (encryptedValue instanceof Uint8Array
                ? this.setWithStorageProviderUInt8Array(key, encryptedValue)
                : this.setWithStorageProvider(key, encryptedValue));
            if (storeValueResult instanceof Error) {
                return SecretStorage.error(storeValueResult);
            }
            return storeValueResult;
        });
    }
    insert(keyForValue, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.has(keyForValue)) {
                return false;
            }
            return this.set(keyForValue, value);
        });
    }
    unset(key, maxAttempts = SECRET_STORAGE_UNSET_MAX_ATTEMPTS) {
        return __awaiter(this, void 0, void 0, function* () {
            let promisePending = [];
            let attempt = 1;
            const isKeyString = typeof key === 'string';
            if (key instanceof Array) {
                promisePending = key.map(this.unsetWithStorageProvider);
            }
            else if (isKeyString) {
                promisePending = [this.unsetWithStorageProvider(key)];
            }
            else {
                return new Error('Key must be a string or an array of strings');
            }
            while (promisePending.length && attempt++ < maxAttempts) {
                const results = yield Promise.all(promisePending);
                const len = results.length;
                let idx = 0;
                promisePending = [];
                for (; idx < len; idx++) {
                    if (results[idx] instanceof Error) {
                        promisePending.push(this.unsetWithStorageProvider(isKeyString ? key : key[idx]));
                    }
                }
            }
        });
    }
    clearDb() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning) {
                return SecretStorage.error('The instance of SecretStorage is not connected to the storage provider or there is no an encryption key');
            }
            const result = yield ((_a = this.storageProvider) === null || _a === void 0 ? void 0 : _a.clearDb());
            if (result instanceof Error) {
                console.error(result);
                return SecretStorage.error('Failed to clear the database with the storage provider');
            }
            return true;
        });
    }
    setStorageProviderName(storageProviderName = STORAGE_PROVIDERS_NAME.LOCAL_STORAGE) {
        if (STORAGE_PROVIDERS_NAMES.includes(storageProviderName)) {
            this.storageProviderName = storageProviderName;
            return true;
        }
        return false;
    }
    createInstanceOfStorageProvider(StorageProviderConstructor) {
        try {
            const storageProvider = new StorageProviderConstructor();
            const checkResult = checkIsStorageProviderInstance(storageProvider);
            if (checkResult instanceof Error) {
                return checkResult;
            }
            return storageProvider;
        }
        catch (err) {
            return err;
        }
    }
    setSupportForUInt8Array(StorageProviderConstructor) {
        this.isStorageProviderSupportUInt8Array = !!StorageProviderConstructor.isBufferSupported;
    }
    runAuthStorageProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            const { authStorageProvider: runningAuthStorageProvider } = this;
            const checkIsRunning = checkIsStorageProviderInstance(runningAuthStorageProvider);
            if (checkIsRunning === true) {
                return true;
            }
            const { AuthStorageProvider } = SecretStorage;
            if (!AuthStorageProvider) {
                return new Error('There is no provider for the auth storage is defined');
            }
            const authStorageProvider = this.createInstanceOfStorageProvider(AuthStorageProvider);
            if (authStorageProvider instanceof Error) {
                return authStorageProvider;
            }
            const { dbName } = this;
            const connectResult = yield authStorageProvider.connect({
                dbName,
            });
            if (connectResult instanceof Error) {
                return connectResult;
            }
            if (connectResult !== true) {
                return new Error('There is a wrong result was returned by auth storage provider');
            }
            this.authStorageProvider = authStorageProvider;
            return true;
        });
    }
    runStorageProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            const { configuration } = this;
            if (configuration) {
                const { storageProviderName } = configuration;
                if (this.setStorageProviderName(storageProviderName)) {
                    const { storageProviderName: storageProviderChosenName } = this;
                    if (!storageProviderChosenName) {
                        return new Error('There is no storage provider was choosed');
                    }
                    const storageProviderConstructor = STORAGE_PROVIDERS[storageProviderChosenName];
                    this.setSupportForUInt8Array(storageProviderConstructor);
                    if (storageProviderConstructor) {
                        const storageProvider = this.createInstanceOfStorageProvider(storageProviderConstructor);
                        if (storageProvider instanceof Error) {
                            return storageProvider;
                        }
                        const { dbName } = this;
                        const storageProviderIsRunning = yield storageProvider.connect({
                            dbName,
                        });
                        if (storageProviderIsRunning instanceof Error) {
                            return storageProviderIsRunning;
                        }
                        this.storageProvider = storageProvider;
                        return true;
                    }
                }
                throw new Error('Failed to set the name of the storage provider');
            }
            throw new Error('There is no storage provider configuration was defined');
        });
    }
    storageKey(key) {
        return `${SecretStorage.PREFIX_KEY_IN_SECRET_STORAGE}_${this.keyHash}_${key}`;
    }
    setEncryptionKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let k;
            if (key instanceof CryptoKey) {
                k = key;
            }
            else {
                const importedKey = yield importPasswordKey(key);
                if (importedKey instanceof Error) {
                    return importedKey;
                }
            }
            if (!(k instanceof CryptoKey)) {
                return new Error('Unknown type of the key');
            }
            const keyString = yield exportPasswordKeyAsString(k);
            if (keyString instanceof Error) {
                return new Error("Can't convert the key to exported format");
            }
            const keyHash = yield calcCryptoKeyHash(k);
            if (keyHash instanceof Error) {
                console.error(keyHash);
                return new Error('Failed to calculate hash value for the CryptoKey');
            }
            this.k = k;
            this.keyHash = keyHash;
            return true;
        });
    }
    setOptions(options) {
        if (options && typeof options === 'object') {
            this.options = options;
            const { dbName } = options;
            if (dbName && typeof dbName === 'string') {
                this.dbName = dbName;
            }
        }
    }
    isNullishValue(value) {
        return (typeof value === 'string' && value === '') || (value instanceof Uint8Array && value.byteLength === 0);
    }
    reset() {
        this.clearError();
        this.clearStatus();
        this.clearState();
        this.k = undefined;
        this.authStorageProvider = undefined;
    }
    getSaltValue(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield SecretStorage.saltKey(credentials);
            if (key instanceof Error) {
                console.error(key);
                return new Error('Failed to get key for a salt value');
            }
            const saltStorageProvider = new SecretStorageProviderLocalStorage();
            const saltStorageProviderConnectResult = yield saltStorageProvider.connect();
            if (saltStorageProviderConnectResult instanceof Error) {
                console.error(saltStorageProviderConnectResult);
                return new Error('Failed to connect to the salt storage provider');
            }
            const saltEncrypted = yield saltStorageProvider.get(key);
            if (saltEncrypted instanceof Error) {
                console.error(saltEncrypted);
                return new Error('Failed to read salt value');
            }
            if (!saltEncrypted) {
                console.log('A salt value was not found a new one will be generated');
                const newSalt = generateSaltForPassword();
                if (newSalt instanceof Error) {
                    console.error(newSalt);
                    return new Error('Failed to generate a new salt value');
                }
                const newSaltEncrypted = yield encryptValueByLogin(credentials.login, newSalt);
                if (newSaltEncrypted instanceof Error) {
                    console.error(newSaltEncrypted);
                    return new Error('Failed to encrypt the salt value');
                }
                const saltValueSetInStorageResult = yield saltStorageProvider.set(key, newSaltEncrypted);
                if (saltValueSetInStorageResult instanceof Error) {
                    console.error(saltValueSetInStorageResult);
                    return new Error('Failed to store the salt value in the persistant storage');
                }
                return newSalt;
            }
            return decryptValueByLogin(credentials.login, saltEncrypted);
        });
    }
    getWithStorageProvider(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storageProvider } = this;
            if (!storageProvider) {
                return new Error('There is no connection with a storage provider');
            }
            const value = yield storageProvider.get(key);
            if (value instanceof Error) {
                return SecretStorage.error(value);
            }
            if (!value) {
                return value;
            }
            if (typeof value !== 'string' || !value.length) {
                return SecretStorage.error('There is a wrong value type returned by the storage provider. A string must be returned');
            }
            return value;
        });
    }
    getWithStorageProviderUint8Array(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storageProvider } = this;
            if (!storageProvider) {
                return new Error('There is no connection with a storage provider');
            }
            if (typeof storageProvider.getUInt8Array !== 'function') {
                return new Error('The storage provider which support Uint8Array must provide the method called getUInt8Array');
            }
            const value = yield storageProvider.getUInt8Array(key);
            if (!value) {
                return undefined;
            }
            if (value instanceof Error) {
                return SecretStorage.error(value);
            }
            if (!(value instanceof Uint8Array) || !value.length) {
                return SecretStorage.error('There is a wrong value type returned by the storage provider. An instance of Uint8Array must be returned');
            }
            return value;
        });
    }
    decryptValue(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const { k } = this;
            if (!(k instanceof CryptoKey)) {
                return SecretStorage.error('There is no a valid key to decrypt the value');
            }
            const decryptedValue = yield decryptDataWithKey(k, value);
            if (decryptedValue instanceof Error) {
                return SecretStorage.error(decryptedValue);
            }
            if (typeof decryptedValue !== 'string') {
                return SecretStorage.error('A wrong value decrypted');
            }
            return decryptedValue;
        });
    }
    decryptValueFromUInt8Array(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const { k } = this;
            if (!(k instanceof CryptoKey)) {
                return SecretStorage.error('There is no a valid key to decrypt the value');
            }
            if (!value.length) {
                return SecretStorage.error('The value must not be empty');
            }
            const decryptedValue = yield decryptDataWithKeyFromUint8Array(k, value);
            if (decryptedValue instanceof Error) {
                return SecretStorage.error(decryptedValue);
            }
            if (typeof decryptedValue !== 'string') {
                return SecretStorage.error('A wrong value decrypted');
            }
            return decryptedValue;
        });
    }
    setWithStorageProvider(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storageProvider } = this;
            if (!storageProvider) {
                return new Error('There is no an active connection with storage provider');
            }
            const result = yield storageProvider.set(key, value);
            if (result instanceof Error) {
                return result;
            }
            if (result !== true) {
                return new Error('A wrong result on set the value into the storage provider');
            }
            return true;
        });
    }
    setWithStorageProviderUInt8Array(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storageProvider } = this;
            if (!storageProvider) {
                return new Error('There is no an active connection with storage provider');
            }
            if (typeof storageProvider.setUInt8Array !== 'function') {
                return new Error("The storage provider doesn't have the method setUInt8Array");
            }
            const result = yield storageProvider.setUInt8Array(key, value);
            if (result instanceof Error) {
                return result;
            }
            if (result !== true) {
                return new Error('A wrong result on set the value into the storage provider');
            }
            return true;
        });
    }
    encryptValue(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const { k } = this;
            if (!(k instanceof CryptoKey)) {
                return new Error('There is no key to encrypt the value');
            }
            const encryptedValue = yield encryptDataToString(k, value);
            if (encryptedValue instanceof Error) {
                return encryptedValue;
            }
            if (typeof encryptedValue !== 'string' || !encryptedValue.length) {
                return new Error('A wrong encryption result for the value');
            }
            return encryptedValue;
        });
    }
    encryptValueAsInt8Array(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const { k } = this;
            if (!(k instanceof CryptoKey)) {
                return new Error('There is no key to encrypt the value');
            }
            const encryptedValue = yield encryptDataToUInt8Array(k, value);
            if (encryptedValue instanceof Error) {
                return encryptedValue;
            }
            if (!(encryptedValue instanceof Uint8Array) || !encryptedValue.length) {
                return new Error('A wrong encryption result for the value');
            }
            return encryptedValue;
        });
    }
    readLoginAndKeyFromSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionInfo = yield session.getItem(SECRET_STORAGE_SESSION_KEY);
                if (sessionInfo) {
                    const cryptoKey = yield importPasswordKeyFromString(sessionInfo.key);
                    if (cryptoKey instanceof Error) {
                        return cryptoKey;
                    }
                    return {
                        key: cryptoKey,
                        login: sessionInfo.login,
                    };
                }
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
    }
    saveLoginAndKeyToSession(session, login, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyExported = yield exportPasswordKeyAsString(key);
            if (keyExported instanceof Error) {
                return keyExported;
            }
            const sessionInfo = {
                login,
                key: keyExported,
            };
            try {
                yield session.setItem(SECRET_STORAGE_SESSION_KEY, sessionInfo);
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
    }
    isValueDefined(valueEncrypted) {
        if (this.isNullishValue(valueEncrypted)) {
            return true;
        }
        if (!valueEncrypted) {
            return false;
        }
        return true;
    }
}
SecretStorage.AuthStorageProvider = STORAGE_PROVIDERS[STORAGE_PROVIDERS_NAME.SESSION_STORAGE];
SecretStorage.PREFIX_KEY_IN_SECRET_STORAGE = '__SecretStorage__';
SecretStorage.PREFIX_FOR_SALT_VALUE = '__SecretStorage__s_uk';
//# sourceMappingURL=secret-storage-class.js.map