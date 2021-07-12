import { __awaiter } from "tslib";
import { getUserIdentityByCryptoCredentials } from "../../../central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials";
import { validateAuthProviderIdentity } from './../../../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { exportCryptoCredentialsToString, importCryptoCredentialsFromAString, } from './../../../central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { CentralAuthorityIdentity } from "../../../central-authority-class-user-identity/central-authority-class-user-identity";
import { checkIsValidCryptoCredentials } from './../../../central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import { ISecretStoreCredentials, ISecretStoreCredentialsSession } from "../../../../secret-storage-class/secret-storage-class.types";
import { CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_CONFIGURATION, CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_DATABASE_NAME, CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_OPTIONS, CA_STORAGE_CURRENT_USER_CREDENTIALS_SESSION_KEY, } from './central-authority-storage-current-user-credentials.const';
import { SecretStorage } from "../../../../secret-storage-class";
import { ISensitiveDataSessionStorage } from "../../../../sensitive-data-session-storage/sensitive-data-session-storage.types";
import { exportPasswordKeyAsString, importPasswordKeyFromString } from '@pashoo2/crypto-utilities';
export class CentralAuthorityStorageCurrentUserCredentials {
    constructor() {
        this.isDisconnected = false;
        this.connect = (options) => __awaiter(this, void 0, void 0, function* () {
            const { isSecretStorageActive } = this;
            if (isSecretStorageActive) {
                return new Error('The instance is already connected to the secret storage');
            }
            const { credentials } = options;
            const connectToSecretStorageResult = yield this.createSecretStorageConnection(credentials);
            if (connectToSecretStorageResult instanceof Error) {
                return connectToSecretStorageResult;
            }
            this.unsetIsDisconnected();
        });
        this.disconnect = () => __awaiter(this, void 0, void 0, function* () {
            const disconnectFromSecretStorageResult = yield this.disconnectFromSecretStorage();
            if (disconnectFromSecretStorageResult instanceof Error) {
                return disconnectFromSecretStorageResult;
            }
            this.unsetSecretStorageCryptoKey();
            this.setIsDisconnected();
        });
        this.set = (userCryptoCredentials) => __awaiter(this, void 0, void 0, function* () {
            const connectionCheckResult = yield this.checkConnectionAndReconnect();
            if (connectionCheckResult instanceof Error) {
                return connectionCheckResult;
            }
            const credentialsExportedToString = yield this.exportCredentialsToString(userCryptoCredentials);
            if (credentialsExportedToString instanceof Error) {
                return credentialsExportedToString;
            }
            const [resultSetWithUserId, resultSetWithAuthProvider] = yield Promise.all([
                this.setCredentialsForUserIdentity(userCryptoCredentials, credentialsExportedToString),
                this.setCredentialsForAuthProvider(userCryptoCredentials, credentialsExportedToString),
            ]);
            let err = false;
            if (resultSetWithUserId instanceof Error) {
                console.error(resultSetWithUserId);
                console.error(new Error('Failed to set credentials for the user id'));
                err = true;
            }
            if (resultSetWithAuthProvider instanceof Error) {
                console.error(resultSetWithAuthProvider);
                console.error(new Error('Failed to set credentials for the auth provider'));
                err = true;
            }
            if (err) {
                const resultUnsetAll = yield this.unsetCredentialsForUser(userCryptoCredentials);
                if (resultUnsetAll instanceof Error) {
                    console.error(resultUnsetAll);
                    console.error(new Error('Failed to unset credentials for the user identity'));
                }
                return new Error('Failed to store credentials');
            }
        });
        this.get = (userIdentity) => __awaiter(this, void 0, void 0, function* () {
            if (!this.validateUserIdentity(userIdentity)) {
                return new Error('The user identity is not valid');
            }
            return this.getCredentials(userIdentity);
        });
        this.unset = (userIdentity) => __awaiter(this, void 0, void 0, function* () {
            return this.unsetCredentialsForUser(userIdentity);
        });
        this.getByAuthProvider = (authProviderIdentity) => __awaiter(this, void 0, void 0, function* () {
            const connectionCheckResult = yield this.checkConnectionAndReconnect();
            if (connectionCheckResult instanceof Error) {
                return connectionCheckResult;
            }
            const validationResult = this.validateAuthProviderId(authProviderIdentity);
            if (validationResult instanceof Error) {
                return validationResult;
            }
            return this.getCredentials(authProviderIdentity);
        });
    }
    static authorizeInStorage(secretStorageConnection, cryptoKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(cryptoKey instanceof CryptoKey)) {
                return new Error('Crypto key must be an instance of the Crypto key');
            }
            if (!(secretStorageConnection instanceof SecretStorage)) {
                return new Error('The secret storage connection must be an instance of the SecretStorage');
            }
            const authorizeByKeyResult = yield secretStorageConnection.authorizeByKey({
                key: cryptoKey,
            }, CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_OPTIONS);
            if (authorizeByKeyResult instanceof Error) {
                return authorizeByKeyResult;
            }
        });
    }
    get isSecretStorageActive() {
        return !this.isDisconnected && !!this.secretStorageConnection && this.secretStorageConnection.isActive;
    }
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { secretStorageEncryptionKey, isDisconnected } = this;
            if (isDisconnected) {
                return new Error('The instance was disconnected from the secret storage from the outside by calling the "disconnect" method');
            }
            if (!secretStorageEncryptionKey) {
                return new Error('There is no encryption key');
            }
            const disconnectResult = yield this.disconnectFromSecretStorage();
            if (disconnectResult instanceof Error) {
                console.error(disconnectResult);
                return new Error('Failed to disconnect');
            }
            const secretStorageConnection = this.createConnectionToSecretStorage();
            const authToSecretStorageResult = yield CentralAuthorityStorageCurrentUserCredentials.authorizeInStorage(secretStorageConnection, secretStorageEncryptionKey);
            if (authToSecretStorageResult instanceof Error) {
                console.error(authToSecretStorageResult);
                return new Error('Failed to authorize in the SecretStorage');
            }
        });
    }
    keyWithPrefix(key) {
        return `${CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_DATABASE_NAME}_${key}`;
    }
    getCredentials(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionCheckResult = yield this.checkConnectionAndReconnect();
            if (connectionCheckResult instanceof Error) {
                return connectionCheckResult;
            }
            const { secretStorageConnection } = this;
            if (!secretStorageConnection) {
                return new Error('There is no active connection with the SecretStorage');
            }
            const keyPrefixed = this.keyWithPrefix(key);
            const val = yield secretStorageConnection.get(keyPrefixed);
            if (!val) {
                return undefined;
            }
            if (val instanceof Error) {
                return val;
            }
            const credentialsImported = yield importCryptoCredentialsFromAString(val);
            if (credentialsImported instanceof Error) {
                console.error(credentialsImported);
                return new Error('Failed to import the credentials');
            }
            return credentialsImported;
        });
    }
    validateAuthProviderId(authProviderURL) {
        const validationResult = validateAuthProviderIdentity(authProviderURL);
        if (!validationResult) {
            return new Error('The auth provider identity is not valid');
        }
    }
    validateUserIdentity(userIdentity) {
        const caUserIdentity = new CentralAuthorityIdentity(userIdentity);
        return !!caUserIdentity.isValid;
    }
    getAuthProviderIdentityByUserId(userIdentity) {
        const caUserIdentity = new CentralAuthorityIdentity(userIdentity);
        if (!caUserIdentity.isValid) {
            return new Error('The user identity is not valid');
        }
        return caUserIdentity.identityDescription.authorityProviderURI;
    }
    exportCredentialsToString(userCryptoCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCredentialsExported = exportCryptoCredentialsToString(userCryptoCredentials);
            if (userCredentialsExported instanceof Error) {
                console.error(userCredentialsExported);
                return new Error('Failed to export credentials to string');
            }
            return userCredentialsExported;
        });
    }
    setCredentialsForUserIdentity(userCryptoCredentials, userCryptoCredentialsExported) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionCheckResult = yield this.checkConnectionAndReconnect();
            if (connectionCheckResult instanceof Error) {
                return connectionCheckResult;
            }
            const { secretStorageConnection } = this;
            if (!secretStorageConnection) {
                return new Error('There is no active connection with the SecretStorage');
            }
            const userIdentity = getUserIdentityByCryptoCredentials(userCryptoCredentials);
            const resultSetInStorage = yield secretStorageConnection.set(this.keyWithPrefix(userIdentity), userCryptoCredentialsExported);
            if (resultSetInStorage instanceof Error) {
                console.error(resultSetInStorage);
                return new Error('Failed to set credentials in the storage');
            }
        });
    }
    setCredentialsForAuthProvider(userCryptoCredentials, userCryptoCredentialsExported) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionCheckResult = yield this.checkConnectionAndReconnect();
            if (connectionCheckResult instanceof Error) {
                return connectionCheckResult;
            }
            const { secretStorageConnection } = this;
            if (!secretStorageConnection) {
                return new Error('There is no active connection with the SecretStorage');
            }
            const userIdentity = getUserIdentityByCryptoCredentials(userCryptoCredentials);
            const authorityProviderURL = this.getAuthProviderIdentityByUserId(userIdentity);
            if (authorityProviderURL instanceof Error) {
                return authorityProviderURL;
            }
            const resultSetInStorage = yield secretStorageConnection.set(this.keyWithPrefix(authorityProviderURL), userCryptoCredentialsExported);
            if (resultSetInStorage instanceof Error) {
                console.error(resultSetInStorage);
                return new Error('Failed to set credentials in the storage');
            }
        });
    }
    unsetCredentialsForUser(identityOrCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionCheckResult = yield this.checkConnectionAndReconnect();
            if (connectionCheckResult instanceof Error) {
                return connectionCheckResult;
            }
            const { secretStorageConnection } = this;
            if (!secretStorageConnection) {
                return new Error('There is no active connection with the SecretStorage');
            }
            const userIdentity = typeof identityOrCredentials === 'string'
                ? identityOrCredentials
                : getUserIdentityByCryptoCredentials(identityOrCredentials);
            if (userIdentity instanceof Error) {
                console.error(userIdentity);
                return new Error('Failed to get the user identity by the crypto credentials value');
            }
            const authorityProviderURL = this.getAuthProviderIdentityByUserId(userIdentity);
            if (authorityProviderURL instanceof Error) {
                return authorityProviderURL;
            }
            return secretStorageConnection.unset([this.keyWithPrefix(userIdentity), this.keyWithPrefix(authorityProviderURL)]);
        });
    }
    validateCryptoCredentials(cryptoCredentials) {
        return checkIsValidCryptoCredentials(cryptoCredentials);
    }
    setIsDisconnected() {
        this.isDisconnected = true;
    }
    unsetIsDisconnected() {
        this.isDisconnected = false;
    }
    setSecretStorageCryptoKey(key, session) {
        return __awaiter(this, void 0, void 0, function* () {
            this.secretStorageEncryptionKey = key;
            if (session) {
                const result = yield this.setSecretStorageCryptoKeyInSession(session, key);
                if (result instanceof Error) {
                    console.error('"createSecretStorageConnection"::failed to set key in session', result);
                }
            }
        });
    }
    unsetSecretStorageCryptoKey() {
        this.secretStorageEncryptionKey = undefined;
    }
    setSecretStorageConnection(secretStorage) {
        this.secretStorageConnection = secretStorage;
    }
    unsetSecretStorageConnection() {
        this.secretStorageConnection = undefined;
    }
    createConnectionToSecretStorage() {
        return new SecretStorage(CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_CONFIGURATION);
    }
    readSecretStorageCryptoKeyFromSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const k = yield session.getItem(CA_STORAGE_CURRENT_USER_CREDENTIALS_SESSION_KEY);
                if (k) {
                    return yield importPasswordKeyFromString(k);
                }
            }
            catch (err) {
                return err;
            }
        });
    }
    setSecretStorageCryptoKeyInSession(session, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield session.setItem(CA_STORAGE_CURRENT_USER_CREDENTIALS_SESSION_KEY, yield exportPasswordKeyAsString(key));
            }
            catch (err) {
                return err;
            }
        });
    }
    createSecretStorageConnection(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            let { secretStorageEncryptionKey } = this;
            const secretStorageConnection = this.createConnectionToSecretStorage();
            const session = credentials.session;
            if (!secretStorageEncryptionKey && session) {
                const k = yield this.readSecretStorageCryptoKeyFromSession(credentials.session);
                if (k && !(k instanceof Error)) {
                    secretStorageEncryptionKey = k;
                }
            }
            const cryptoKey = secretStorageEncryptionKey || (yield secretStorageConnection.generateCryptoKey(credentials));
            if (cryptoKey instanceof Error) {
                return new Error('Failed to generate crypto key by the credentials');
            }
            if (!secretStorageEncryptionKey) {
                yield this.setSecretStorageCryptoKey(cryptoKey, session);
            }
            const authToSecretStorageResult = yield CentralAuthorityStorageCurrentUserCredentials.authorizeInStorage(secretStorageConnection, cryptoKey);
            if (authToSecretStorageResult instanceof Error) {
                console.error(authToSecretStorageResult);
                return new Error('Failed to authorize in the SecretStorage');
            }
            this.setSecretStorageConnection(secretStorageConnection);
        });
    }
    disconnectFromSecretStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const { isSecretStorageActive, secretStorageConnection } = this;
            if (isSecretStorageActive && secretStorageConnection) {
                const disconnectResult = yield secretStorageConnection.disconnect();
                if (disconnectResult instanceof Error) {
                    console.error(disconnectResult);
                    return new Error('Failed to disconnect from the secret storage');
                }
            }
            this.unsetSecretStorageConnection();
        });
    }
    checkConnectionAndReconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { isSecretStorageActive } = this;
            if (!isSecretStorageActive) {
                const reconnect = yield this.reconnect();
                if (reconnect instanceof Error) {
                    console.error(reconnect);
                    return new Error('Connection to the SecretStorage is not active and failed to reconnect');
                }
            }
        });
    }
}
//# sourceMappingURL=central-authority-storage-current-user-credentials.js.map