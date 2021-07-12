import { __awaiter } from "tslib";
import assert from 'assert';
import { SecretStorage } from '../secret-storage-class/secret-storage-class';
import { SWARM_MESSAGE_ENCRYPTED_CACHE_DEFAULT_STORAGE_DATABASE_NAME, SWARM_MESSAGE_ENCRYPTED_CACHE_DEFAULT_STORAGE_DATABASE_NAME_HASH, } from './swarm-message-encrypted-cache.const';
import { calculateHash } from '@pashoo2/crypto-utilities';
export class SwarmMessageEncryptedCache {
    constructor() {
        this.isRunning = false;
        this.options = undefined;
        this.storageProvider = undefined;
        this.add = (sig, message) => __awaiter(this, void 0, void 0, function* () {
            this.checkIsActive();
            const value = message || null;
            const result = yield this.storageProvider.insert(sig, value);
            if (result instanceof Error) {
                throw result;
            }
            return result;
        });
        this.get = (sig) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.readValue(sig);
            if (!result) {
                return undefined;
            }
            return result;
        });
        this.unset = (sig) => __awaiter(this, void 0, void 0, function* () {
            this.checkIsActive();
            const resutl = yield this.storageProvider.unset(sig);
            if (resutl instanceof Error) {
                throw resutl;
            }
        });
        this.set = (sig, message) => __awaiter(this, void 0, void 0, function* () {
            this.checkIsActive();
            const value = message || null;
            const result = yield this.storageProvider.set(sig, value);
            if (result instanceof Error) {
                throw result;
            }
        });
    }
    get dbNamePrefix() {
        var _a;
        return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.dbNamePrefix) || '';
    }
    get dbName() {
        var _a, _b;
        return `${((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.storageProviderOptions) === null || _b === void 0 ? void 0 : _b.dbName) ||
            SWARM_MESSAGE_ENCRYPTED_CACHE_DEFAULT_STORAGE_DATABASE_NAME}`;
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setOptions(options);
            yield this.runStorageConnection();
            this.setIsRunning();
        });
    }
    clearDb() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const clearDbResult = yield ((_a = this.storageProvider) === null || _a === void 0 ? void 0 : _a.clearDb());
            if (clearDbResult instanceof Error) {
                throw clearDbResult;
            }
        });
    }
    setOptions(options) {
        assert(options, 'Options must be provided');
        assert(typeof options === 'object', 'Options must be an object');
        const optsWithStorageProvider = options;
        if (optsWithStorageProvider.storageProvider) {
            assert(typeof optsWithStorageProvider.storageProvider === 'object', 'Storage provider must be an object');
            assert(typeof optsWithStorageProvider.storageProvider.connect === 'function' &&
                typeof optsWithStorageProvider.storageProvider.get === 'function' &&
                typeof optsWithStorageProvider.storageProvider.get === 'function', 'Storage provider provided is not valid');
        }
        else {
            const optsWithConfForStorageProviderConnection = options;
            assert(optsWithConfForStorageProviderConnection.storageProviderAuthOptions, 'Options for authorization to the storage provider must be provided');
        }
        this.options = options;
    }
    setStorageProvider(provider) {
        this.storageProvider = provider;
    }
    runDefaultStorageConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const { options } = this;
            const optsWithConfForStorageProviderConnection = options;
            if (!optsWithConfForStorageProviderConnection.storageProviderAuthOptions) {
                throw new Error('Auth options was not provided to connect with the secret storage provider');
            }
            const { storageProviderOptions, storageProviderAuthOptions } = optsWithConfForStorageProviderConnection;
            const storageProvider = new SecretStorage();
            const dbName = yield calculateHash(this.dbName, SWARM_MESSAGE_ENCRYPTED_CACHE_DEFAULT_STORAGE_DATABASE_NAME_HASH);
            if (dbName instanceof Error) {
                console.error(`Failed to calculate hash for the database name ${this.dbName}`);
                throw dbName;
            }
            yield storageProvider.authorize(storageProviderAuthOptions, Object.assign(Object.assign({}, storageProviderOptions), { dbName }));
            this.setStorageProvider(storageProvider);
        });
    }
    runStorageConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const { options } = this;
            const optsWithStorageProvider = options;
            if (optsWithStorageProvider.storageProvider) {
                this.setStorageProvider(optsWithStorageProvider.storageProvider);
                return;
            }
            yield this.runDefaultStorageConnection();
        });
    }
    setIsRunning() {
        this.isRunning = true;
    }
    checkIsActive() {
        if (!this.isRunning) {
            throw new Error('The instance is not running');
        }
        if (!this.storageProvider || !this.storageProvider.isActive) {
            throw new Error('There is no running storage provider');
        }
        return true;
    }
    readValue(sig) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkIsActive();
            const result = yield this.storageProvider.get(sig);
            if (result instanceof Error) {
                throw result;
            }
            if (result === null) {
                return undefined;
            }
            if (!result) {
                return undefined;
            }
            if (typeof result !== 'string') {
                throw new Error('There is a wrong result');
            }
            return result;
        });
    }
}
//# sourceMappingURL=swarm-messgae-encrypted-cache.js.map