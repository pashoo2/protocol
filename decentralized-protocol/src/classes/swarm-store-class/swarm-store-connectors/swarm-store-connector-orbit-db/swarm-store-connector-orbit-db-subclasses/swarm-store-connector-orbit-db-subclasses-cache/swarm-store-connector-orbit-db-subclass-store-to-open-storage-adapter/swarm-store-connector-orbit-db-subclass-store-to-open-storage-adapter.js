import { __awaiter } from "tslib";
import { OpenStorage } from '../../../../../../open-storage/open-storage';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_STORAGE_ADAPTER_DEFAULT_OPTIONS_STORAGE } from '../swarm-store-connector-orbit-db-subclasses-cache.const';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS } from '../swarm-store-connector-orbit-db-subclasses-cache.const';
export class SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter {
    constructor(options) {
        this.isOpen = false;
        this.isClose = false;
        this.isPreventedClose = false;
        this.close = (cb) => __awaiter(this, void 0, void 0, function* () {
            this.throwIfClosed();
            if (this.isPreventedClose) {
                return;
            }
            this.setIsClose();
            this.unsetIsOpen();
            const result = yield this.disconnectStorage();
            if (result instanceof Error) {
                console.error(result);
                throw result;
            }
            if (typeof cb === 'function') {
                cb(undefined);
            }
        });
        this.del = (key, cb) => __awaiter(this, void 0, void 0, function* () {
            this.throwIfClosed();
            yield this.openIfNecessary();
            const storage = this.getStorage();
            if (storage instanceof Error) {
                console.error(Storage);
                throw storage;
            }
            const result = yield storage.set(key, undefined);
            if (result instanceof Error) {
                console.error(result);
                throw result;
            }
            if (typeof cb === 'function') {
                cb(undefined);
            }
        });
        this.setPreventClose = (isPrevented) => {
            this.throwIfClosed();
            this.isPreventedClose = Boolean(isPrevented);
        };
        this.dropDb = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield this.openIfNecessary();
            const storage = this.getStorage();
            if (Storage instanceof Error) {
                console.error(Storage);
                throw storage;
            }
            const result = yield ((_b = (_a = storage).clearDb) === null || _b === void 0 ? void 0 : _b.call(_a));
            if (result instanceof Error) {
                console.error(result);
                throw new Error('Failed to drop the database');
            }
        });
        this.setOptions(options);
    }
    get status() {
        const { isClose } = this;
        if (isClose) {
            return SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS.CLOSE;
        }
        return SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS.OPEN;
    }
    get db() {
        return {
            status: this.status,
        };
    }
    open(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isClose, isOpen } = this;
            if (!isClose && isOpen) {
                return;
            }
            const result = yield this.startStorage();
            if (result instanceof Error) {
                throw result;
            }
            this.setIsOpen();
            this.unsetIsClose();
            if (typeof cb === 'function') {
                cb(undefined);
            }
        });
    }
    get(k, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwIfClosed();
            yield this.openIfNecessary();
            const storage = this.getStorage();
            if (storage instanceof Error) {
                console.error(Storage);
                throw storage;
            }
            const result = yield storage.get(k);
            if (result instanceof Error) {
                console.error(result);
                throw result;
            }
            const resulted = result ? result : undefined;
            if (typeof cb === 'function') {
                cb(undefined, resulted);
            }
            return resulted;
        });
    }
    put(k, v, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwIfClosed();
            yield this.openIfNecessary();
            const storage = this.getStorage();
            if (storage instanceof Error) {
                console.error(Storage);
                throw storage;
            }
            const value = v instanceof Buffer ? v.toString() : v;
            const result = yield storage.set(k, value);
            if (result instanceof Error) {
                console.error(result);
                throw result;
            }
            if (typeof cb === 'function') {
                cb(undefined);
            }
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dropDb();
            yield this.close();
            this.unsetStorage();
        });
    }
    setIsOpen() {
        this.isOpen = true;
    }
    unsetIsOpen() {
        this.isOpen = false;
    }
    setIsClose() {
        this.isClose = true;
    }
    unsetIsClose() {
        this.isClose = false;
    }
    throwIfClosed() {
        if (this.isClose) {
            throw new Error('The instance is closed');
        }
    }
    getStorage() {
        const { storage } = this;
        if (storage) {
            return storage;
        }
        return new Error('There is no connection to the OpenStorage');
    }
    setStorageImplementationToUse(storageImplementation) {
        this.storage = storageImplementation;
    }
    setOptions(options) {
        if (!options) {
            throw new Error('Options must be provided');
        }
        if (typeof options !== 'object') {
            throw new Error('Options must be an object');
        }
        const { dbName, storageImplementation } = options;
        if (!dbName) {
            throw new Error('A database name must be specified in the options');
        }
        if (typeof dbName !== 'string') {
            throw new Error('A database name must be a string');
        }
        if (storageImplementation) {
            this.setStorageImplementationToUse(storageImplementation);
        }
        this.options = options;
    }
    unsetStorage() {
        this.storage = undefined;
    }
    createDefaultStorageImplementation() {
        return __awaiter(this, void 0, void 0, function* () {
            const storageImplementation = new OpenStorage();
            const storageImplementationConnectionResult = yield storageImplementation.connect(Object.assign(Object.assign({}, SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_STORAGE_ADAPTER_DEFAULT_OPTIONS_STORAGE), { options: this.options }));
            if (storageImplementationConnectionResult instanceof Error) {
                console.error(storageImplementationConnectionResult);
                throw new Error(storageImplementationConnectionResult.message);
            }
            return storageImplementation;
        });
    }
    startStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.storage) {
                return true;
            }
            const storageImplementation = yield this.createDefaultStorageImplementation();
            this.setStorageImplementationToUse(storageImplementation);
            return true;
        });
    }
    disconnectStorage() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { storage } = this;
            if (!Storage) {
                return new Error('There is no instance of the storage connected to');
            }
            try {
                const result = yield ((_b = (_a = storage).disconnect) === null || _b === void 0 ? void 0 : _b.call(_a));
                if (result instanceof Error) {
                    return result;
                }
            }
            catch (err) {
                return err;
            }
        });
    }
    openIfNecessary() {
        return __awaiter(this, void 0, void 0, function* () {
            const { isOpen } = this;
            if (isOpen) {
                return;
            }
            yield this.open();
        });
    }
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter.js.map