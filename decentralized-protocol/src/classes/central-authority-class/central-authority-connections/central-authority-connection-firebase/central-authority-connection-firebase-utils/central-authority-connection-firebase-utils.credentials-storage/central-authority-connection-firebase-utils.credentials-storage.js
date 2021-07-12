import { __awaiter } from "tslib";
import { CAConnectionWithFirebaseUtilDatabase } from '../central-authority-connection-firebase-utils.database/central-authority-connection-firebase-utils.database';
import { getUserIdentityByCryptoCredentials, exportCryptoCredentialsToString, importCryptoCredentialsFromAString, } from "../../../../central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials";
import { CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX, CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY, CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_MAXIMUM_STORED_VALUES_CHECK, } from './central-authority-connection-firebase-utils.credentials-storage.const';
import { encodeForFirebaseKey } from "../../../../../../utils/firebase-utils/firebase-utils";
import { validateUserIdentity } from "../../../../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials";
import { TCentralAuthorityUserCryptoCredentials } from "../../../../central-authority-class-types/central-authority-class-types";
import { checkIsValidExportedCryptoCredentialsToString } from "../../../../central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys";
export class CAConnectionFirestoreUtilsCredentialsStrorage extends CAConnectionWithFirebaseUtilDatabase {
    constructor(connectionToFirebase) {
        super();
        this.setUpConnection(connectionToFirebase);
    }
    get firebaseUserData() {
        const isConnected = this.checkIsConnected();
        if (isConnected instanceof Error) {
            return isConnected;
        }
        const { app } = this;
        if (!app) {
            throw new Error('Firebase application is not ready');
        }
        try {
            return app.auth().currentUser;
        }
        catch (err) {
            console.error(err);
            return new Error('Failed to get the user id for firebase');
        }
    }
    get firebaseUserId() {
        const { firebaseUserData: userData } = this;
        if (userData instanceof Error) {
            console.error(userData);
            return new Error('Failed to read the user data from a firebase');
        }
        if (userData == null) {
            return new Error('There is no user data');
        }
        try {
            return userData.uid;
        }
        catch (err) {
            console.error(err);
            return new Error('Failed to get the user id for firebase');
        }
    }
    getCredentialsKeyByUserId(userId) {
        return `${CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX}${encodeForFirebaseKey(userId)}`;
    }
    checkIsConnected() {
        const isConnectedToDatabase = super.checkIsConnected();
        if (isConnectedToDatabase instanceof Error) {
            return isConnectedToDatabase;
        }
        const { app, connectionToFirebase } = this;
        if (!connectionToFirebase) {
            return new Error('There is no instance implements a connection to the Firebase application');
        }
        if (!connectionToFirebase.isConnected) {
            return new Error('There is no active connection to the firebase appliction');
        }
        if (!app) {
            return new Error('There is no app connection');
        }
        return true;
    }
    checkIsAuthorized() {
        const isConnectedToDatabase = this.checkIsConnected();
        if (isConnectedToDatabase instanceof Error) {
            return isConnectedToDatabase;
        }
        const { firebaseUserId, connectionToFirebase } = this;
        if (!connectionToFirebase || !connectionToFirebase.isUserSignedIn) {
            return new Error('The user is not authorized in the Firebase application');
        }
        if (firebaseUserId instanceof Error) {
            console.error(firebaseUserId);
            return new Error('The user is not authorized');
        }
        return true;
    }
    setUpConnection(connectionToFirebase) {
        this.connectionToFirebase = connectionToFirebase;
        const app = connectionToFirebase.getApp();
        if (!app) {
            throw new Error('There is no insatnce which implements a connection to the Firebase app');
        }
        this.app = app;
    }
    checkStoredCredentialsFormat(storedCredentialsValue) {
        if (storedCredentialsValue instanceof Error) {
            console.error(storedCredentialsValue);
            return false;
        }
        if (storedCredentialsValue && typeof storedCredentialsValue === 'object') {
            const { credentials, [CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY]: firebaseId } = storedCredentialsValue;
            if (typeof firebaseId === 'string') {
                if (checkIsValidExportedCryptoCredentialsToString(credentials)) {
                    return true;
                }
                console.error("Credentials are't exists or invalid in the stored credentials");
            }
            else {
                console.error('Firebase user id is not valid in the stored credentials');
            }
        }
        return false;
    }
    getCredentialsByValueStored(storedCredentialsValue, signUpCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            if (storedCredentialsValue == null) {
                return null;
            }
            if (storedCredentialsValue instanceof Error) {
                return storedCredentialsValue;
            }
            if (!this.checkStoredCredentialsFormat(storedCredentialsValue)) {
                return new Error('the value stored have an unknown format');
            }
            const { credentials: exportedCredentials } = storedCredentialsValue;
            const importedCredentials = yield importCryptoCredentialsFromAString(exportedCredentials, signUpCredentials === null || signUpCredentials === void 0 ? void 0 : signUpCredentials.password);
            if (importedCredentials instanceof Error) {
                console.error(importedCredentials);
                return new Error('Failed to import credentials value stored');
            }
            return importedCredentials;
        });
    }
    filterCredentialsValues(valueStored, signUpCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!valueStored) {
                return null;
            }
            if (valueStored instanceof Error) {
                return valueStored;
            }
            const keys = Object.keys(valueStored);
            if (keys.length === 0) {
                return null;
            }
            const len = Math.min(keys.length, CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_MAXIMUM_STORED_VALUES_CHECK);
            let idx = 0;
            let keyValueStored;
            let valueValueStored;
            let credentialsImported;
            for (; idx < len; idx++) {
                keyValueStored = keys[idx];
                valueValueStored = valueStored[keyValueStored];
                credentialsImported = yield this.getCredentialsByValueStored(valueValueStored, signUpCredentials);
                if (!(credentialsImported instanceof Error)) {
                    return credentialsImported;
                }
            }
            return null;
        });
    }
    getCredentialsForTheCurrentUser(signUpCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAuthorizedResult = this.checkIsAuthorized();
            if (isAuthorizedResult instanceof Error) {
                console.error(isAuthorizedResult);
                return new Error('The user is not authorized');
            }
            const { firebaseUserId } = this;
            if (firebaseUserId instanceof Error) {
                console.error(firebaseUserId);
                return new Error('Failed to get user id of the firebase user');
            }
            const { database } = this;
            if (!database) {
                return new Error('There is no connection to the database server');
            }
            try {
                const snapshot = yield database
                    .ref(CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX)
                    .orderByChild(CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY)
                    .equalTo(firebaseUserId)
                    .once('value');
                if (snapshot.exists()) {
                    const valueStored = snapshot.val();
                    return yield this.filterCredentialsValues(valueStored, signUpCredentials);
                }
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to read the user data from the database');
            }
            return null;
        });
    }
    setUserCredentials(credentials, signUpCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAuthorizedResult = this.checkIsAuthorized();
            if (isAuthorizedResult instanceof Error) {
                console.error(isAuthorizedResult);
                return new Error('The user is not authorized');
            }
            const { firebaseUserId } = this;
            if (firebaseUserId instanceof Error) {
                console.error(firebaseUserId);
                return new Error('Failed to get user id of the firebase user');
            }
            const credentialsForTheCurrentUser = yield this.getCredentialsForTheCurrentUser(signUpCredentials);
            if (credentialsForTheCurrentUser != null && !(credentialsForTheCurrentUser instanceof Error)) {
                return credentialsForTheCurrentUser;
            }
            const userId = getUserIdentityByCryptoCredentials(credentials);
            if (userId instanceof Error) {
                console.error(userId);
                return new Error("Failed to get a user's identity from the credentials");
            }
            if (!signUpCredentials.password) {
                return new Error('The password is required to encrypt the private keys');
            }
            const exportedCryptoCredentials = yield exportCryptoCredentialsToString(credentials, undefined, signUpCredentials.password);
            if (exportedCryptoCredentials instanceof Error) {
                console.error(exportedCryptoCredentials);
                return new Error('Failed to export the crypto credentials value');
            }
            const credentialsForTheUserId = yield this.getUserCredentials(userId);
            if (credentialsForTheUserId != null && !(credentialsForTheUserId instanceof Error)) {
                return new Error('A crypto credentials is already exists for the user id');
            }
            const keyForValue = this.getCredentialsKeyByUserId(userId);
            const storeResult = yield this.setValue(keyForValue, {
                credentials: exportedCryptoCredentials,
                [CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY]: firebaseUserId,
            });
            if (storeResult instanceof Error) {
                console.error(storeResult);
                return new Error('Failed to store the credentials in the database');
            }
            return credentials;
        });
    }
    getUserCredentials(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.checkIsConnected()) {
                return new Error('There is no active connection to the Firebase');
            }
            if (!validateUserIdentity(userId)) {
                return new Error('The user identity is not valid');
            }
            const keyForValue = this.getCredentialsKeyByUserId(userId);
            const storedCredentialsValue = yield this.getValue(keyForValue);
            return this.getCredentialsByValueStored(storedCredentialsValue);
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.checkIsConnected();
            if (!isConnected) {
                return true;
            }
            const { database } = this;
            if (!database) {
                return new Error('There is no active database connection');
            }
            try {
                yield database.goOffline();
            }
            catch (err) {
                console.error();
                return new Error('Failed to disconnect from the databases');
            }
            return true;
        });
    }
}
//# sourceMappingURL=central-authority-connection-firebase-utils.credentials-storage.js.map