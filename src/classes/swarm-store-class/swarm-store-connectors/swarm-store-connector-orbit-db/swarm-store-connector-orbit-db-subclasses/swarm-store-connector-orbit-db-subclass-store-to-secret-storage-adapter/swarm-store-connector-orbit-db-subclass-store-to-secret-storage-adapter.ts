import { ISecretStorageOptions, ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import { IOrbitDbCacheStore, IOrbitDbKeystoreStore } from './swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.types';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_DEFAULT_OPTIONS_SECRET_STORAGE } from './swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.const';

export class SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter implements IOrbitDbKeystoreStore, IOrbitDbCacheStore {
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

    public async close(): Promise<void> {
        const result = await this.disconnectSecretStorage();

        if (result instanceof Error) {
            console.error(result);
            throw result;
        }
    }

    public async get(k: string): Promise<string | undefined> {
        const secretStorage = this.getSecretStorage();

        if (secretStorage instanceof Error) {
            console.error(secretStorage);
            throw secretStorage;
        }
        
        const result = await secretStorage.get(k);

        if (result instanceof Error) {
            console.error(result);
            throw result;
        }
        return result 
            ? result
            : undefined;
    }

    public async put(
        k: string,
        v: string | Buffer,
    ): Promise<void> {
        const secretStorage = this.getSecretStorage();

        if (secretStorage instanceof Error) {
            console.error(secretStorage);
            throw secretStorage;
        }
        
        const value = v instanceof Buffer
            ? v.toString()
            : v;
        const result = await secretStorage.set(k, value);

        if (result instanceof Error) {
            console.error(result);
            throw result;
        }
    }

    protected getSecretStorage(): Error | SecretStorage {
        const { secretStorage } = this;

        if (secretStorage) {
            return secretStorage;
        }
        return new Error('There is no connection to the SecretStorage');
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

    private unsetSecretStorage() {
        this.secretStorage = undefined;
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

    private async disconnectSecretStorage(): Promise<Error | void> {
        const { secretStorage } = this;

        if (!secretStorage) {
            return new Error('There is no instance of the SecretStorage connected to');
        }
        try {
            const result = await secretStorage.disconnect();
            
            if (result instanceof Error) {
                return result;
            }
        } catch(err) {
            return err;
        }
        this.unsetSecretStorage();
    }
}