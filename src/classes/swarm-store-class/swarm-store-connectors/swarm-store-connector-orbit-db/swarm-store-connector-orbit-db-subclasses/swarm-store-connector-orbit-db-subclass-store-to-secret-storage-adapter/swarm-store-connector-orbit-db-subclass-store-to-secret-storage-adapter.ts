import { ISwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter } from './swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.types';
import { ISecretStorageOptions, ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';
import undefined from 'firebase/empty-import';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_DEFAULT_OPTIONS_SECRET_STORAGE } from './swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.const';

export class SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter implements ISwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter {
    protected options?: ISecretStorageOptions;

    protected secretStorage?: InstanceType<typeof SecretStorage>;

    private credentials?: ISecretStoreCredentials;

    constructor(
        credentials: ISecretStoreCredentials,
        options: Required<ISecretStorageOptions>,
    ) {
        this.setOptions(options);
        this.setCredentials(credentials);
        this.createSecretStorage();
    }

    public async open(): Promise<void> {
        const result = await this.startSecretStorage();

        if (result instanceof Error) {
            throw result;
        }
    }

    protected setOptions(options: Required<ISecretStorageOptions>): void {
        if (!options) {
            throw new Error('Options must be provided');
        }
        if (typeof options !== 'object') {
            throw new Error('Options must be an object');
        }

        const { dbName } = options;

        if (!dbName) {
            throw new Error('A database name must be specified in the options');
        }
        if (typeof dbName !== 'string') {
            throw new Error('A database name must be a string');
        }
        this.options = options;
    }

    protected setCredentials(credentials: ISecretStoreCredentials) {
        if (!credentials) {
            throw new Error('Credentials must be specified');
        }
        if (typeof credentials !== 'object') {
            throw new Error('Credentials must be an object');
        }

        const { password } = credentials;

        if (!password) {
            throw new Error('A password must be specified');
        }
        this.credentials = credentials;
    }

    protected unsetCredentials() {
        this.credentials = undefined;
    }

    private createSecretStorage() {
        const secretStorage = new SecretStorage(
            SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_DEFAULT_OPTIONS_SECRET_STORAGE,
        );

        this.secretStorage = secretStorage;
    }

    private startSecretStorage(): Promise<Error | boolean> | Error {
        const { 
            options,
            credentials,
            secretStorage,
        } = this;
        
        if (secretStorage) {
            return secretStorage.authorize(
                credentials!,
                options!,
            );
        }
        return new Error('Secret storage is not defined');
    }
}