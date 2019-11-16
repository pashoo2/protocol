
import { ISecretStorageOptions, ISecretStoreCredentials, ISecretStoreCredentialsCryptoKey } from 'classes/secret-storage-class/secret-storage-class.types';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import { IOrbitDbCacheStore, IOrbitDbKeystoreStore } from './swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.types';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_DEFAULT_OPTIONS_SECRET_STORAGE, SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS } from './swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.const';

export class SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter implements IOrbitDbKeystoreStore, IOrbitDbCacheStore {
    public get status(): SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS {
        const { isClose } = this;

        if (isClose) {
            return SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.CLOSE;
        }
        return SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.OPEN;
    }

    protected options?: ISecretStorageOptions;

    protected secretStorage?: InstanceType<typeof SecretStorage>;

    private credentials?: ISecretStoreCredentials;

    private credentialsCryptoKey?: ISecretStoreCredentialsCryptoKey;

    protected isOpen: boolean = false;

    protected isClose: boolean = false;

    constructor(
        credentials: ISecretStoreCredentials | ISecretStoreCredentialsCryptoKey,
        options: Required<ISecretStorageOptions>,
    ) {
        this.setOptions(options);
        this.setCredentials(credentials);
        this.createSecretStorage();
    }

    public async open(): Promise<void> {
        const { isClose, isOpen } = this;

        if (isClose) {
            throw new Error('The instance was closed before');
        }
        if (isOpen) {
            return;
        }


        const result = await this.startSecretStorage();

        if (result instanceof Error) {
            throw result;
        }
        this.setIsOpen();
    }

    public async close(): Promise<void> {
        this.setIsClose();

        const result = await this.disconnectSecretStorage();

        if (result instanceof Error) {
            console.error(result);
            throw result;
        }
    }

    public async get(k: string): Promise<string | undefined> {
        // open connection to the secret storage
        // before any operations
        await this.openIfNecessary(); 

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
        await this.openIfNecessary();

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

    public async load() {}

    public async destroy() {}

    protected setIsOpen() {
        this.isOpen = true;
    }

    protected setIsClose() {
        this.isClose = true;
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

    /**
     * validate and set credentials with password or crypto key
     *
     * @protected
     * @param {(ISecretStoreCredentials | ISecretStoreCredentialsCryptoKey)} credentials
     * @memberof SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter
     * @throws
     */
    protected setCredentials(credentials: ISecretStoreCredentials | ISecretStoreCredentialsCryptoKey) {
        if (!credentials) {
            throw new Error('Credentials must be specified');
        }
        if (typeof credentials !== 'object') {
            throw new Error('Credentials must be an object');
        }

        if ((credentials as ISecretStoreCredentialsCryptoKey).key) {
            const credentialsValidationResult = SecretStorage.validateCryptoKeyCredentials(credentials as ISecretStoreCredentialsCryptoKey);

            if (credentialsValidationResult instanceof Error) {
                console.error(credentialsValidationResult);
                throw new Error('setCredentials::crypto credentials not valid');
            }
            this.credentialsCryptoKey = credentials as ISecretStoreCredentialsCryptoKey;
        } else if ((credentials as ISecretStoreCredentials).password) {
            const credentialsValidationResult = SecretStorage.validateCredentials(credentials as ISecretStoreCredentials);

            if (credentialsValidationResult instanceof Error) {
                console.error(credentialsValidationResult);
                throw new Error('setCredentials::credentials not valid');
            }
            this.credentials = credentials as ISecretStoreCredentials;
        }
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
            credentialsCryptoKey,
        } = this;
        
        if (secretStorage) {
            if (credentialsCryptoKey) {
                return secretStorage.authorizeByKey(
                    credentialsCryptoKey!,
                    options!,
                );
            } else if (credentials) {
                return secretStorage.authorize(
                    credentials!,
                    options!,
                );
            }
            return new Error('Credentials was not provided');
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

    protected async openIfNecessary(): Promise<void> {
        const { isOpen } = this;

        if (isOpen) {
            return;
        }
        await this.open();
    }
}