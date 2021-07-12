import { __awaiter } from "tslib";
import assert from 'assert';
export class SecretStorageProviderLocalStorage {
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!window || !window.localStorage) {
                    return new Error('There is no localStorage available for this context');
                }
                this.setOptions(options);
                this.localStorage = window.localStorage;
                return true;
            }
            catch (err) {
                console.error('SecretStorageProviderLocalStorage', err);
                return err;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.localStorage = undefined;
            return true;
        });
    }
    clearDb() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dbName, localStorage } = this;
                if (!dbName) {
                    return new Error('There is no database connected to');
                }
                if (!localStorage) {
                    return new Error('Does not connected to a session storage to remove the database');
                }
                Object.keys(localStorage).forEach((key) => {
                    if (key.startsWith(dbName)) {
                        localStorage.removeItem(key);
                    }
                });
                return true;
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { localStorage } = this;
                if (!localStorage) {
                    return new Error('There is no storage connected');
                }
                if (!value) {
                    return yield this.unset(key);
                }
                localStorage.setItem(this.resolveKey(key), value);
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
                const { localStorage } = this;
                if (!localStorage) {
                    return new Error('There is no storage connected');
                }
                localStorage.removeItem(this.resolveKey(key));
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
                const { localStorage } = this;
                if (!localStorage) {
                    return new Error('There is no storage connected');
                }
                const item = localStorage.getItem(this.resolveKey(key));
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
    setOptions(options) {
        if (options) {
            assert(typeof options === 'object', 'Options provided must be an object');
            const { dbName } = options;
            if (dbName) {
                assert(typeof dbName === 'string', 'dbName must be a string');
                this.dbName = `${dbName}//`;
            }
        }
    }
    resolveKey(key) {
        if (this.dbName) {
            return `${this.dbName}${key}`;
        }
        return key;
    }
}
SecretStorageProviderLocalStorage.isDbNameSupported = true;
//# sourceMappingURL=secret-storage-local-storage-provider.js.map