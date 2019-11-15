export interface IOrbitDbStoreBase {
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