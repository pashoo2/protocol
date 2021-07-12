import { __awaiter } from "tslib";
import { CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MAX_LENGTH, CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MIN_LENGTH, } from './central-authority-connection-firebase-utils.database.const';
export class CAConnectionWithFirebaseUtilDatabase {
    constructor() {
        this.wasConnected = false;
    }
    get isConnected() {
        const { wasConnected, database } = this;
        return wasConnected && !!database;
    }
    setWasConnectedStatus(wasConnected = false) {
        this.wasConnected = !!wasConnected;
    }
    setDatabaseInstance(db) {
        this.database = db;
    }
    checkIsConnected() {
        const { isConnected } = this;
        if (!isConnected) {
            return new Error('There is no connection with the remote database');
        }
        return true;
    }
    checkKeyValue(key) {
        if (typeof key !== 'string') {
            console.error('Key must be a string');
            return false;
        }
        const keyLen = key.length;
        if (keyLen > CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MAX_LENGTH) {
            console.error(`Key must be less than ${CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MAX_LENGTH}, but the value is ${keyLen} characters len`);
            return false;
        }
        if (keyLen < CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MIN_LENGTH) {
            console.error(`Key must be greater than ${CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MAX_LENGTH}, but the value is ${keyLen} characters len`);
            return false;
        }
        return true;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { isConnected, app } = this;
            if (isConnected) {
                return true;
            }
            if (!app) {
                return new Error('The app is not defined');
            }
            try {
                const database = app.database();
                yield database.goOnline();
                this.setDatabaseInstance(database);
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to connect to the Database server');
            }
            this.setWasConnectedStatus(true);
            return true;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.checkIsConnected();
            if (isConnected instanceof Error) {
                return isConnected;
            }
            const { database } = this;
            try {
                yield database.goOffline();
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to go offline before destroy the application');
            }
            this.setWasConnectedStatus(false);
            return true;
        });
    }
    checkBeforeReadWrite(key) {
        const isConnectedResult = this.checkIsConnected();
        if (isConnectedResult instanceof Error) {
            return isConnectedResult;
        }
        if (!this.checkKeyValue(key)) {
            return new Error('The key value is not valid');
        }
        return true;
    }
    setValue(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const canWrite = this.checkBeforeReadWrite(key);
            if (canWrite instanceof Error) {
                return canWrite;
            }
            const { database } = this;
            try {
                if (!database) {
                    throw new Error('An instance of a Realtime databse is not exists');
                }
                yield database.ref(key).set(value);
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to store the value in the database');
            }
            return true;
        });
    }
    getValue(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const canRead = this.checkBeforeReadWrite(key);
            if (canRead instanceof Error) {
                return canRead;
            }
            const { database } = this;
            try {
                const snapshot = yield database.ref(key).once('value');
                const isExists = snapshot.exists();
                if (!isExists) {
                    return null;
                }
                return snapshot.val();
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to read the value from the storage');
            }
        });
    }
}
export default CAConnectionWithFirebaseUtilDatabase;
//# sourceMappingURL=central-authority-connection-firebase-utils.database.js.map