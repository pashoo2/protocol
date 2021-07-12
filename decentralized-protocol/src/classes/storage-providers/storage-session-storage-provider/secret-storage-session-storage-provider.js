import { __awaiter } from "tslib";
import assert from 'assert';
export class SecretStorageProvideSessionStorage {
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!window || !window.sessionStorage) {
                    return new Error('There is no sessionStorage available for this context');
                }
                this.setOptions(options);
                this.sessionStorage = window.sessionStorage;
                return true;
            }
            catch (err) {
                console.error('SecretStorageProvidersessionStorage', err);
                return err;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sessionStorage = undefined;
            return true;
        });
    }
    clearDb() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dbName, sessionStorage } = this;
                if (!dbName) {
                    return new Error('There is no database connected to');
                }
                if (!sessionStorage) {
                    return new Error('Does not connected to a session storage to remove the database');
                }
                Object.keys(sessionStorage).forEach((key) => {
                    if (key.startsWith(dbName)) {
                        sessionStorage.removeItem(key);
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
                const { sessionStorage } = this;
                if (!sessionStorage) {
                    return new Error('There is no storage connected');
                }
                if (!value) {
                    return yield this.unset(key);
                }
                sessionStorage.setItem(this.resolveKey(key), value);
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
                const { sessionStorage } = this;
                if (!sessionStorage) {
                    return new Error('There is no storage connected');
                }
                sessionStorage.removeItem(this.resolveKey(key));
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
                const { sessionStorage } = this;
                if (!sessionStorage) {
                    return new Error('There is no storage connected');
                }
                const item = sessionStorage.getItem(this.resolveKey(key));
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
SecretStorageProvideSessionStorage.isDbNameSupported = true;
//# sourceMappingURL=secret-storage-session-storage-provider.js.map