import { __awaiter } from "tslib";
import localforage from 'localforage';
import assert from 'assert';
import { SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DEFAULTS_DB_NAME, SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DRIVER, } from './secret-storage-local-forage-provider.const';
export class SecretStorageProviderLocalForage {
    constructor() {
        this.dbName = SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DEFAULTS_DB_NAME;
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
                const res = yield this.createInstanceOfLocalforage();
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
                const { localForage, isDisconnected } = this;
                if (isDisconnected) {
                    return true;
                }
                this.setIsDisconnected();
                this.localForage = undefined;
                if (localForage) {
                    yield localForage.dropInstance();
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
                const { localForage: levelStorage } = this;
                if (!levelStorage) {
                    return new Error('There is no storage connected');
                }
                if (!value) {
                    return yield this.unset(key);
                }
                else {
                    yield levelStorage.setItem(key, value);
                }
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
                const { localForage: levelStorage } = this;
                if (!levelStorage) {
                    return new Error('There is no storage connected');
                }
                if (!value) {
                    return yield this.unset(key);
                }
                yield levelStorage.setItem(key, value);
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
                const { localForage } = this;
                if (isDisconnected instanceof Error) {
                    return isDisconnected;
                }
                if (!localForage) {
                    return new Error('There is no connection to the local forage');
                }
                const item = yield localForage.getItem(key);
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
    unset(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDisconnected = this.checkIsReady();
                const { localForage } = this;
                if (isDisconnected instanceof Error) {
                    return isDisconnected;
                }
                if (!localForage) {
                    return new Error('There is no connection to the local forage');
                }
                yield localForage.removeItem(key);
                return true;
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
    }
    clearDb() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDisconnected = this.checkIsReady();
                const { localForage } = this;
                if (isDisconnected instanceof Error) {
                    return isDisconnected;
                }
                if (!localForage) {
                    return new Error('There is no connection to the local forage');
                }
                if (this.dbName === SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DEFAULTS_DB_NAME) {
                    return new Error("The DEFAULT database can't be removed");
                }
                yield localForage.clear();
                return true;
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
                const { localForage } = this;
                if (isDisconnected instanceof Error) {
                    return isDisconnected;
                }
                if (!localForage) {
                    return new Error('There is no connection to the local forage');
                }
                const item = yield localForage.getItem(key);
                if (!item) {
                    return undefined;
                }
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
            if (dbName) {
                assert(typeof dbName === 'string', 'A name of the database must be a string');
                this.dbName = dbName;
            }
        }
    }
    setIsDisconnected() {
        this.isDisconnected = true;
    }
    checkIsReady() {
        const { isDisconnected, localForage: levelStorage } = this;
        if (isDisconnected) {
            return new Error('The StorageProvider instance is disconnected');
        }
        if (!levelStorage) {
            return new Error('There is no storage connected');
        }
    }
    createInstanceOfLocalforage() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dbName } = this;
            const localForage = localforage.createInstance({
                name: dbName,
                storeName: dbName,
                driver: SECRET_STORAGE_LOCAL_FORAGE_PROVIDER_DRIVER,
            });
            try {
                yield localForage.ready();
            }
            catch (err) {
                return err;
            }
            this.localForage = localForage;
        });
    }
}
SecretStorageProviderLocalForage.isBufferSupported = true;
SecretStorageProviderLocalForage.isDbNameSupported = true;
//# sourceMappingURL=secret-storage-local-forage-provider.js.map