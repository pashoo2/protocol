import { __awaiter } from "tslib";
import { validateCryptoKeyCredentials } from '../../../../../../secret-storage-class/secret-storage-class-utils/secret-storage-class-utils-main/secret-storage-class-utils-main';
import { ISecretStoreCredentials, ISecretStoreCredentialsCryptoKey, } from "../../../../../../secret-storage-class/secret-storage-class.types";
import { SecretStorage } from "../../../../../../secret-storage-class/secret-storage-class";
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_STORAGE_ADAPTER_DEFAULT_OPTIONS_STORAGE } from '../swarm-store-connector-orbit-db-subclasses-cache.const';
import { SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter } from '../swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter';
export class SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter extends SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter {
    constructor(options, credentials) {
        super(options);
        this.setCredentials(credentials);
        this.createSecretStorage();
    }
    setCredentials(credentials) {
        if (!credentials) {
            throw new Error('Credentials must be specified');
        }
        if (typeof credentials !== 'object') {
            throw new Error('Credentials must be an object');
        }
        if (credentials.key) {
            const credentialsValidationResult = validateCryptoKeyCredentials(credentials);
            if (credentialsValidationResult instanceof Error) {
                console.error(credentialsValidationResult);
                throw new Error('setCredentials::crypto credentials not valid');
            }
            this.credentialsCryptoKey = credentials;
        }
        this.credentials = credentials;
    }
    unsetCredentials() {
        this.credentials = undefined;
    }
    createSecretStorage() {
        const secretStorage = new SecretStorage(SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_STORAGE_ADAPTER_DEFAULT_OPTIONS_STORAGE);
        this.storage = secretStorage;
    }
    startStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const { options, credentials, storage: secretStorage, credentialsCryptoKey } = this;
            if (secretStorage) {
                if (credentialsCryptoKey) {
                    return secretStorage.authorizeByKey(credentialsCryptoKey, options);
                }
                else if (credentials) {
                    return secretStorage.authorize(credentials, options);
                }
                return new Error('Credentials was not provided');
            }
            return new Error('Secret storage is not defined');
        });
    }
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.js.map