import { ISecretStorage, TSecretStorageAuthorizazionOptions } from '../../../../../../secret-storage-class/secret-storage-class.types';
import { ISwarmStoreConnectorOrbitDbSubclassStoreToSecretStorageAdapterConstructorOptions } from './swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.types';
import { ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbKeystoreStore, ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore } from '../swarm-store-connector-orbit-db-subclasses-cache.types';
import { SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter } from '../swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter';
export declare class SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter extends SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter implements ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbKeystoreStore, ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore {
    protected storage?: ISecretStorage;
    private credentials?;
    private credentialsCryptoKey?;
    constructor(options: ISwarmStoreConnectorOrbitDbSubclassStoreToSecretStorageAdapterConstructorOptions, credentials: TSecretStorageAuthorizazionOptions);
    protected setCredentials(credentials: TSecretStorageAuthorizazionOptions): void;
    protected unsetCredentials(): void;
    private createSecretStorage;
    protected startStorage(): Promise<Error | boolean>;
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.d.ts.map