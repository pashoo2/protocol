import { __awaiter } from "tslib";
import { OPEN_STORAGE_KEY_PREFIX } from './open-storage.const';
import { STORAGE_PROVIDERS_NAME } from './../storage-providers/storage-providers.const';
import { StorageProvider, IStorageProviderOptions } from "../storage-providers/storage-providers.types";
import { getStorageProviderByName } from "../storage-providers";
export class OpenStorage {
    constructor() {
        this.connect = (configuration) => __awaiter(this, void 0, void 0, function* () {
            const { connectingPromise } = this;
            if (connectingPromise) {
                return yield connectingPromise;
            }
            try {
                const connectToStorePromise = this.connectToStore(configuration);
                this.setConnectingPromise(connectToStorePromise);
                return yield connectToStorePromise;
            }
            catch (err) {
                this.unsetConnectingPromise();
                return err;
            }
        });
        this.disconnect = () => __awaiter(this, void 0, void 0, function* () {
            yield this.waitTillConnecting();
            const { isActive, storageProvider } = this;
            if (isActive && storageProvider) {
                const disconnectResult = yield storageProvider.disconnect();
                if (disconnectResult instanceof Error) {
                    console.error(disconnectResult);
                    return new Error('Failed to disconnect from the storage provider');
                }
            }
            this.unsetStorageProviderConnection();
            this.unsetOptions();
            this.unsetConnectingPromise();
            console.error(new Error('disconnect'));
            throw new Error('disconnect');
        });
        this.set = (key, value) => __awaiter(this, void 0, void 0, function* () {
            yield this.waitTillConnecting();
            const { isActive, storageProvider } = this;
            if (!isActive || !storageProvider) {
                return new Error('There is no connection to a StorageProvider');
            }
            return yield storageProvider.set(this.keyNameInStorage(key), value);
        });
        this.setUInt8Array = (key, value) => __awaiter(this, void 0, void 0, function* () {
            yield this.waitTillConnecting();
            const { isActive, storageProvider, isBufferSupported } = this;
            if (!isActive || !storageProvider) {
                return new Error('There is no connection to a StorageProvider');
            }
            if (!isBufferSupported || typeof storageProvider.setUInt8Array !== 'function') {
                return new Error('The storage provider is not support this operation');
            }
            return yield storageProvider.setUInt8Array(this.keyNameInStorage(key), value);
        });
        this.get = (key) => __awaiter(this, void 0, void 0, function* () {
            yield this.waitTillConnecting();
            const { isActive, storageProvider } = this;
            if (!isActive || !storageProvider) {
                return new Error('There is no connection to a StorageProvider');
            }
            return yield storageProvider.get(this.keyNameInStorage(key));
        });
        this.getUInt8Array = (key) => __awaiter(this, void 0, void 0, function* () {
            yield this.waitTillConnecting();
            const { isActive, storageProvider, isBufferSupported } = this;
            if (!isActive || !storageProvider) {
                return new Error('There is no connection to a StorageProvider');
            }
            if (!isBufferSupported || typeof storageProvider.getUInt8Array !== 'function') {
                return new Error('The storage provider is not support this operation');
            }
            return yield storageProvider.getUInt8Array(this.keyNameInStorage(key));
        });
        this.clearDb = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.waitTillConnecting();
            const { isActive, storageProvider } = this;
            if (!isActive || !storageProvider) {
                return new Error('There is no connection to a StorageProvider');
            }
            const result = yield ((_a = this.storageProvider) === null || _a === void 0 ? void 0 : _a.clearDb());
            if (result instanceof Error) {
                console.error(result);
                return Error('Failed to clear the database with the storage provider');
            }
            return true;
        });
    }
    get isActive() {
        return !!this.storageProvider;
    }
    get isBufferSupported() {
        return (this.isActive &&
            !!this.storageProvider &&
            !!this.storageProvider.constructor.isBufferSupported);
    }
    get isDbNameSupported() {
        return (this.isActive &&
            !this.storageProvider &&
            !!this.storageProvider.constructor.isDbNameSupported);
    }
    keyNameInStorage(key) {
        if (!this.isDbNameSupported && this.dbName) {
            return `${this.dbName}_${key}`;
        }
        return `${OPEN_STORAGE_KEY_PREFIX}_${key}`;
    }
    setOptions(options) {
        this.dbName = options ? options.dbName : undefined;
    }
    unsetOptions() {
        this.dbName = undefined;
    }
    setStorageProviderConnection(storageProviderConnection) {
        this.storageProvider = storageProviderConnection;
    }
    unsetStorageProviderConnection() {
        this.storageProvider = undefined;
    }
    connectToStore(configuration) {
        return __awaiter(this, void 0, void 0, function* () {
            const { options, storageProviderName } = configuration || {};
            const storageProvider = getStorageProviderByName(storageProviderName || STORAGE_PROVIDERS_NAME.LOCAL_FORAGE);
            if (!storageProvider) {
                throw new Error(`There is no storage provider with the name ${storageProviderName}`);
            }
            const connectToStorageProviderResult = yield storageProvider.connect(options);
            if (connectToStorageProviderResult instanceof Error) {
                console.error(connectToStorageProviderResult);
                throw new Error('Failed to connect to the storage provider');
            }
            this.setStorageProviderConnection(storageProvider);
            this.setOptions(options);
        });
    }
    setConnectingPromise(connectingPromise) {
        this.connectingPromise = connectingPromise;
    }
    unsetConnectingPromise() {
        this.connectingPromise = undefined;
    }
    waitTillConnecting() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectingPromise;
        });
    }
}
//# sourceMappingURL=open-storage.js.map