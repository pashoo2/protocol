import { __awaiter } from "tslib";
import assert from 'assert';
import { isTypedArrayNative } from "../../../utils/typed-array-utils";
import { StorageProvider } from '../storage-providers.types';
export class StorageProviderInMemory extends StorageProvider {
    constructor() {
        super(...arguments);
        this._isConnected = false;
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this._isConnected) {
                    this._storage = new Map();
                    this._setOptions(options);
                    this._setIsConnected();
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
                if (this._isConnected) {
                    this._unsetOptions();
                    this._unsetDb();
                    this._unsetIsConnected();
                }
                return true;
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
    }
    set(key, value) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!value) {
                return this.unset(key);
            }
            try {
                this._checkIsReady();
                (_a = this._storage) === null || _a === void 0 ? void 0 : _a.set(key, value);
                return true;
            }
            catch (err) {
                return err;
            }
        });
    }
    unset(key) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._checkIsReady();
                (_a = this._storage) === null || _a === void 0 ? void 0 : _a.delete(key);
                return true;
            }
            catch (err) {
                return err;
            }
        });
    }
    clearDb() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._checkIsReady();
                (_a = this._storage) === null || _a === void 0 ? void 0 : _a.clear();
                return true;
            }
            catch (err) {
                return err;
            }
        });
    }
    setUInt8Array(key, value) {
        return this.set(key, value);
    }
    get(key) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._checkIsReady();
                return (_a = this._storage) === null || _a === void 0 ? void 0 : _a.get(key);
            }
            catch (err) {
                return err;
            }
        });
    }
    getUInt8Array(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._checkIsReady();
                const item = yield this.get(key);
                if (item instanceof Error) {
                    throw item;
                }
                if (Array.isArray(item) || isTypedArrayNative(item)) {
                    return new Uint8Array(item);
                }
                if (item) {
                    throw new Error('The entiry is not related to Uint8Array');
                }
                return undefined;
            }
            catch (err) {
                return err;
            }
        });
    }
    _setOptions(options) {
        if (options) {
            assert(options && typeof options !== 'object', 'Options must be an object');
            this._options = options;
        }
    }
    _setIsConnected() {
        this._isConnected = true;
    }
    _unsetIsConnected() {
        this._isConnected = false;
    }
    _unsetOptions() {
        this._options = undefined;
    }
    _unsetDb() {
        this._storage = undefined;
    }
    _checkIsReady() {
        assert(this._isConnected, 'The instance is disconnected');
        assert(this._storage instanceof Map, 'Storage is not initialized');
        return true;
    }
}
StorageProviderInMemory.isBufferSupported = true;
//# sourceMappingURL=storage-in-memory-provider.js.map