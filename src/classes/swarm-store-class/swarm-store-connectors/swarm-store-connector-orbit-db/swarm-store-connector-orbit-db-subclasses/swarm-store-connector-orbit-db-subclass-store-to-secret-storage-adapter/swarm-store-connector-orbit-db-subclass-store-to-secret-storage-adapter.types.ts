import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS } from './swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.const';

export interface IOrbitDbStoreBase {
    /**
     *
     *
     * @type {string}
     * @memberof IOrbitDbStoreBase
     */
    status: SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS;
    /**
     * open connection to the store
     *
     * @returns {Promise<void>}
     * @memberof IOrbitDbStoreBase
     * @throws
     */
    open(): Promise<void>;
    /**
     * close connection to the storage
     *
     * @returns {Promise<void>}
     * @memberof IOrbitDbStoreBase
     * @throws
     */
    close(): Promise<void>;
    /**
     * get the key value as a string,
     * if there is no value for the key
     * then undefined will returned
     * 
     * @param {string} k
     * @returns {(Promise<string | void>)}
     * @memberof IOrbitDbStoreBase
     * @throws
     */
    get(k: string): Promise<string | void>;
    /**
     * save a string or a Buffer to the 
     * storage. Before save string will be
     * converted to the utf8 encoding
     * for safe usage.
     * 
     * @param {string} k
     * @param {(Buffer | string)} v
     * @returns {Promise<string>}
     * @memberof IOrbitDbStoreBase
     */
    put(k: string, v: Buffer | string): Promise<void>;
}

export interface IOrbitDbKeystoreStore extends IOrbitDbStoreBase {
}

export interface IOrbitDbCacheStore extends IOrbitDbStoreBase {
}