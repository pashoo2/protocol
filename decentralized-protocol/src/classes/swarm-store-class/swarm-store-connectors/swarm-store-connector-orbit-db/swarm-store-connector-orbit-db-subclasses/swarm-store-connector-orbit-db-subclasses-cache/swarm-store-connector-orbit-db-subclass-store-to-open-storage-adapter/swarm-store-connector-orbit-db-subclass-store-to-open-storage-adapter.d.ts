/// <reference types="node" />
import { TCallbackError, TCallbackErrorValue } from 'orbit-db-cache';
import { IStorageCommon } from '../../../../../../../types/storage.types';
import { ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions } from './swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter.types';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS } from '../swarm-store-connector-orbit-db-subclasses-cache.const';
import { ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbKeystoreStore, ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore } from '../swarm-store-connector-orbit-db-subclasses-cache.types';
export declare class SwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapter implements ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbKeystoreStore, ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore {
    get status(): SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS;
    get db(): {
        status: SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_OPEN_STORAGE_ADAPTER_STATUS;
    };
    protected options?: ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions;
    protected storage?: IStorageCommon;
    protected isOpen: boolean;
    protected isClose: boolean;
    protected isPreventedClose: boolean;
    constructor(options: ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions);
    open(cb?: TCallbackError): Promise<void>;
    close: (cb?: TCallbackError) => Promise<void>;
    get(k: string, cb?: TCallbackErrorValue): Promise<string | undefined>;
    put(k: string, v: string | Buffer, cb?: TCallbackError): Promise<void>;
    del: (key: string, cb?: TCallbackError) => Promise<void>;
    setPreventClose: (isPrevented: boolean) => void;
    dropDb: () => Promise<void>;
    load(): Promise<void>;
    destroy(): Promise<void>;
    protected setIsOpen(): void;
    protected unsetIsOpen(): void;
    protected setIsClose(): void;
    protected unsetIsClose(): void;
    protected throwIfClosed(): void;
    protected getStorage(): Error | IStorageCommon;
    protected setStorageImplementationToUse(storageImplementation: IStorageCommon): void;
    protected setOptions(options: ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions): void;
    private unsetStorage;
    private createDefaultStorageImplementation;
    protected startStorage(): Promise<Error | boolean>;
    private disconnectStorage;
    protected openIfNecessary(): Promise<void>;
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-store-to-open-storage-adapter.d.ts.map