import { __awaiter } from "tslib";
import levelup from 'levelup';
import leveljs from 'level-js';
import { SECRET_STORAGE_LEVELJS_PROVIDER_DEFAULTS_DB_NAME } from './secret-storage-level-js-provider.const';
export class SecretStorageProviderLevelJS {
    constructor() {
        this.dbName = SECRET_STORAGE_LEVELJS_PROVIDER_DEFAULTS_DB_NAME;
        this.isDisconnected = false;
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { isDisconnected } = this;
                if (isDisconnected) {
                    return new Error('The instance of the SecretStorageProvider was closed before');
                }
                this.setOptions(options);
                const res = yield this.createInstanceOfLevelDB();
                if (res instanceof Error) {
                    console.error('SecretStorageProviderLevelJS', res);
                    return res;
                }
                return true;
            }
            catch (err) {
                console.error('SecretStorageProviderLevelJS', err);
                return err;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { levelStorage, isDisconnected } = this;
                if (isDisconnected) {
                    return true;
                }
                this.setIsDisconnected();
                if (levelStorage) {
                    yield levelStorage.close();
                }
            }
            catch (err) {
                console.error(err);
                return err;
            }
            return true;
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDisconnected = this.checkIsReady();
                if (isDisconnected instanceof Error) {
                    return isDisconnected;
                }
                const { levelStorage } = this;
                if (!levelStorage) {
                    return new Error('There is no storage connected');
                }
                if (!value) {
                    return yield this.unset(key);
                }
                else {
                    yield levelStorage.put(key, value);
                }
                return true;
            }
            catch (err) {
                return err;
            }
        });
    }
    unset(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDisconnected = this.checkIsReady();
                if (isDisconnected instanceof Error) {
                    return isDisconnected;
                }
                const { levelStorage } = this;
                if (!levelStorage) {
                    return new Error('There is no storage connected');
                }
                yield levelStorage.del(key);
                return true;
            }
            catch (err) {
                return err;
            }
        });
    }
    clearDb() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDisconnected = this.checkIsReady();
                const { levelStorage } = this;
                if (isDisconnected instanceof Error) {
                    return isDisconnected;
                }
                if (!levelStorage) {
                    return new Error('There is no connection to the local forage');
                }
                if (this.dbName === SECRET_STORAGE_LEVELJS_PROVIDER_DEFAULTS_DB_NAME) {
                    return new Error("The DEFAULT database can't be removed");
                }
                if (!levelStorage.clear) {
                    return new Error('The version of the library does not supports for a db clearing');
                }
                yield levelStorage.clear();
                return true;
            }
            catch (err) {
                return err;
            }
        });
    }
    setUInt8Array(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDisconnected = this.checkIsReady();
                if (isDisconnected instanceof Error) {
                    return isDisconnected;
                }
                const { levelStorage } = this;
                if (!levelStorage) {
                    return new Error('There is no storage connected');
                }
                if (!value) {
                    return yield this.unset(key);
                }
                yield levelStorage.put(key, value);
                return true;
            }
            catch (err) {
                return err;
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDisconnected = this.checkIsReady();
                if (isDisconnected instanceof Error) {
                    return isDisconnected;
                }
                const { levelStorage } = this;
                const item = yield levelStorage.get(key, { asBuffer: false });
                if (typeof item !== 'string') {
                    return undefined;
                }
                return item;
            }
            catch (err) {
                return err;
            }
        });
    }
    getUInt8Array(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDisconnected = this.checkIsReady();
                if (isDisconnected instanceof Error) {
                    return isDisconnected;
                }
                const { levelStorage } = this;
                const item = yield levelStorage.get(key, { asBuffer: true });
                return new Uint8Array(item);
            }
            catch (err) {
                return err;
            }
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
    setIsDisconnected() {
        this.isDisconnected = true;
    }
    checkIsReady() {
        const { isDisconnected, levelStorage } = this;
        if (isDisconnected) {
            return new Error('The StorageProvider instance is disconnected');
        }
        if (!levelStorage) {
            return new Error('There is no storage connected');
        }
    }
    createInstanceOfLevelDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dbName } = this;
            const levelStorage = levelup(leveljs(dbName));
            try {
                yield levelStorage.open();
            }
            catch (err) {
                return err;
            }
            this.levelStorage = levelStorage;
        });
    }
}
SecretStorageProviderLevelJS.isBufferSupported = true;
//# sourceMappingURL=secret-storage-level-js-provider.js.map