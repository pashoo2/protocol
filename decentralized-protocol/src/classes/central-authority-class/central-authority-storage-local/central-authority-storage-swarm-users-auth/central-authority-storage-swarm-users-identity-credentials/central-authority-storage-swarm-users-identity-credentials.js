import { __awaiter, __decorate, __metadata } from "tslib";
import { OpenStorage } from './../../../../open-storage/open-storage';
import { getStatusClass } from "../../../../basic-classes/status-class-base/status-class-base";
import { CA_IDENTITY_CREDENTIALS_STORAGE_STATUS, CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION, CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY, CA_IDENTITY_CREDENTIALS_STORAGE_READ_RAW_CACHE_CAPACITY, CA_IDENTITY_CREDENTIALS_STORAGE_NAME_OPTIONS_MAX_LENGTH, CA_IDENTITY_CREDENTIALS_STORAGE_FULL_NAME, } from './central-authority-storage-swarm-users-identity-credentials.const';
import { TCentralAuthorityUserIdentity, TCACryptoKeyPairs, TCentralAuthorityUserCryptoCredentials, } from "../../../central-authority-class-types/central-authority-class-types";
import CentralAuthorityIdentity from "../../../central-authority-class-user-identity/central-authority-class-user-identity";
import { getExportedCryptoCredentialsByCAIdentity, replaceCryptoCredentialsIdentity, importCryptoCredentialsFromAString, getUserIdentityByCryptoCredentials, getCryptoKeyPairsByCryptoCredentials, } from "../../../central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials";
import { dataCachingUtilsCachingDecoratorGlobalCachePerClass as caching } from "../../../../../utils/data-cache-utils";
import { checkIsValidExportedCryptoCredentialsToString, checkIsValidCryptoCredentials, } from "../../../central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys";
export class CentralAuthorityIdentityCredentialsStorage extends getStatusClass({
    errorStatus: CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.ERROR,
    initialStatus: CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.NEW,
    instanceName: 'CentralAuthorityIdentityCredentialsStorage',
}) {
    constructor() {
        super(...arguments);
        this.setCredentialsByIdentity = (identity, cryptoKeyPairs, checkPrivateKey = true) => __awaiter(this, void 0, void 0, function* () {
            const { isActive, storageConnection } = this;
            if (!isActive || !storageConnection) {
                return new Error('The storage is not active');
            }
            try {
                const caIdentity = new CentralAuthorityIdentity(identity);
                const caIdentityStorageKey = this.getStorageKeyByCAIdentity(caIdentity);
                if (caIdentityStorageKey instanceof Error) {
                    console.error(caIdentityStorageKey);
                    return new Error('The identity is not valid');
                }
                const cryptoCredentialsExported = yield getExportedCryptoCredentialsByCAIdentity(caIdentity, cryptoKeyPairs, checkPrivateKey);
                if (cryptoCredentialsExported instanceof Error) {
                    console.error(cryptoCredentialsExported);
                    return new Error('Failed to export the credentials to a string');
                }
                const credentialsStoredForIdentity = yield this.getCredentialsRaw(caIdentityStorageKey);
                if (credentialsStoredForIdentity && !(credentialsStoredForIdentity instanceof Error)) {
                    return false;
                }
                return yield storageConnection.set(caIdentityStorageKey, cryptoCredentialsExported);
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to store the credentials');
            }
        });
    }
    get isActive() {
        const { status, storageConnection } = this;
        return status === CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTED && !!storageConnection && storageConnection.isActive;
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultSetOptions = this.setOptions(options);
            if (resultSetOptions instanceof Error) {
                console.error(resultSetOptions);
                return new Error('Failed to set options');
            }
            const connection = this.createConnectionToStorage();
            if (connection instanceof Error) {
                console.error(connection);
                return this.setErrorStatus('Failed to create an instance of SecretStorage');
            }
            this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTING);
            const connectionResult = yield connection.connect(CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION);
            if (connectionResult instanceof Error) {
                console.error(connectionResult);
                this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTION_FAILED);
                return new Error('Failed to authorize');
            }
            this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTED);
            this.storageConnection = connection;
            return true;
        });
    }
    getCredentials(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isActive } = this;
            if (!isActive) {
                return new Error('The storage is not active');
            }
            return this.getCredentialsCached(identity);
        });
    }
    setCredentials(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const argsLenght = args.length;
            const withCheckPrivateFlag = typeof args[1] === 'boolean';
            const checkPrivateKey = !withCheckPrivateFlag || args[1] !== false;
            if (argsLenght === 2 && !withCheckPrivateFlag) {
                return this.setCredentialsByIdentity(args[0], args[1], checkPrivateKey);
            }
            else if (argsLenght === 1 || withCheckPrivateFlag) {
                const caCryptoCredentials = args[0];
                if (checkIsValidExportedCryptoCredentialsToString(caCryptoCredentials)) {
                    return this.setCredentialsByCACryptoCredentialsExportedToString(caCryptoCredentials, checkPrivateKey);
                }
                else if (checkIsValidCryptoCredentials(caCryptoCredentials, checkPrivateKey)) {
                    return this.setCredentialsByCACryptoCredentials(caCryptoCredentials, checkPrivateKey);
                }
            }
            return new Error('An unknown arguments');
        });
    }
    setCredentialsNoCheckPrivateKey(cryptoCredentials) {
        return this.setCredentials(cryptoCredentials, false);
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, storageConnection } = this;
            if (status === CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.DISCONNECTED) {
                console.error(new Error('The instance is already disconnected from the storage'));
                return false;
            }
            if (status !== CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.CONNECTED || status === CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.ERROR) {
                return this.setErrorStatus(new Error("Can't disconnect cause the instance is not in the Connected state"));
            }
            if (!(storageConnection instanceof OpenStorage)) {
                return this.setErrorStatus('There is no connection to the SecretStorage');
            }
            const disconnectionResult = yield storageConnection.disconnect();
            if (disconnectionResult instanceof Error) {
                console.error(disconnectionResult);
                return this.setErrorStatus('SecretStorage failed to disconnect');
            }
            this.setStatus(CA_IDENTITY_CREDENTIALS_STORAGE_STATUS.DISCONNECTED);
            return true;
        });
    }
    getKeyNameWithPrefix(key) {
        return `${this.storageName}_${key}`;
    }
    setStorageName(postfix = '') {
        this.storageName = `${CA_IDENTITY_CREDENTIALS_STORAGE_FULL_NAME}_${postfix}`;
    }
    setDefaultOptions() {
        this.setStorageName();
    }
    setOptions(options) {
        this.setDefaultOptions();
        if (!options) {
            return;
        }
        if (options.storageName) {
            if (typeof options.storageName !== 'string') {
                return new Error('The storage name must be a string');
            }
            if (options.storageName.length > CA_IDENTITY_CREDENTIALS_STORAGE_NAME_OPTIONS_MAX_LENGTH) {
                return new Error(`The maximum length of a storage name is ${CA_IDENTITY_CREDENTIALS_STORAGE_NAME_OPTIONS_MAX_LENGTH}`);
            }
            this.setStorageName(options.storageName);
        }
    }
    createConnectionToStorage() {
        try {
            const connection = new OpenStorage();
            return connection;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }
    getStorageKeyByCAIdentity(identity) {
        if (!(identity instanceof CentralAuthorityIdentity)) {
            return new Error('The argument must be an instance of CentralAuthorityIdentity');
        }
        if (!identity.isValid) {
            return new Error('The CA identity is not valid');
        }
        const { id } = identity;
        if (id instanceof Error) {
            console.error(id);
            return new Error('Failed to get the unique identifier of the user');
        }
        return this.getKeyNameWithPrefix(id);
    }
    getCredentialsRaw(identityKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isActive, storageConnection } = this;
            if (!isActive || !storageConnection) {
                return new Error('The storage is not active');
            }
            try {
                const caCryptoCredentials = yield storageConnection.get(identityKey);
                if (caCryptoCredentials instanceof Error) {
                    console.error(caCryptoCredentials);
                    return new Error('Failed to read credentials from the storage');
                }
                return caCryptoCredentials ? caCryptoCredentials : undefined;
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to read a credentials for identity from the storage');
            }
        });
    }
    setCredentialsByCACryptoCredentials(caCryptoCredentials, checkPrivateKey = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const identity = getUserIdentityByCryptoCredentials(caCryptoCredentials);
            if (identity instanceof Error) {
                console.error(identity);
                return new Error('The user identity is not valid or have an unknown format');
            }
            const cryptoKeyPairs = getCryptoKeyPairsByCryptoCredentials(caCryptoCredentials, checkPrivateKey);
            if (cryptoKeyPairs instanceof Error) {
                console.error(cryptoKeyPairs);
                return new Error('The crypto key pairs are not valid or have an unknown format');
            }
            return this.setCredentialsByIdentity(identity, cryptoKeyPairs, checkPrivateKey);
        });
    }
    setCredentialsByCACryptoCredentialsExportedToString(caCryptoCredentialsExportedToString, checkPrivateKey = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const cryptoCredentials = yield importCryptoCredentialsFromAString(caCryptoCredentialsExportedToString);
            if (cryptoCredentials instanceof Error) {
                console.error(cryptoCredentials);
                return new Error('Failed to import crypto credentials from the string');
            }
            return this.setCredentialsByCACryptoCredentials(cryptoCredentials, checkPrivateKey);
        });
    }
    getCredentialsCached(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const caIdentity = new CentralAuthorityIdentity(identity);
                const credentialsKey = this.getStorageKeyByCAIdentity(caIdentity);
                if (credentialsKey instanceof Error) {
                    console.error(credentialsKey);
                    return new Error('The identity has a wrong format');
                }
                const caCryptoCredentials = yield this.getCredentialsRaw(credentialsKey);
                if (caCryptoCredentials instanceof Error) {
                    console.error(caCryptoCredentials);
                    return new Error('Failed to read credentials from the storage');
                }
                if (!caCryptoCredentials) {
                    return null;
                }
                const importedCryptoCredentials = yield importCryptoCredentialsFromAString(caCryptoCredentials);
                if (importedCryptoCredentials instanceof Error) {
                    console.error(importedCryptoCredentials);
                    return new Error('Failed to import the value read');
                }
                const resultedValue = replaceCryptoCredentialsIdentity(importedCryptoCredentials, String(caIdentity), false);
                if (resultedValue instanceof Error) {
                    console.error(resultedValue);
                    return new Error('Failed to replace the identity in the credentials read from the storage');
                }
                return resultedValue;
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to read a credentials for identity from the storage');
            }
        });
    }
}
__decorate([
    caching(CA_IDENTITY_CREDENTIALS_STORAGE_READ_RAW_CACHE_CAPACITY),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentralAuthorityIdentityCredentialsStorage.prototype, "getCredentialsRaw", null);
__decorate([
    caching(CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CentralAuthorityIdentityCredentialsStorage.prototype, "getCredentialsCached", null);
//# sourceMappingURL=central-authority-storage-swarm-users-identity-credentials.js.map