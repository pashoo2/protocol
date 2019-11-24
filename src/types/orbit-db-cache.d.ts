declare module 'orbit-db-cache' {
  export type TCacheStatus = 'open' | 'close';

  export type TCallbackError = (err?: Error) => void;

  export type TCallbackErrorValue = (err?: Error, val?: string) => void;

  export interface IStore {
    db: { status: TCacheStatus };

    /**
     *
     *
     * @type {string}
     * @memberof IOrbitDbStoreBase
     */
    status: TCacheStatus;

    /**
     * open connection to the store
     *
     * @returns {Promise<void>}
     * @memberof IOrbitDbStoreBase
     * @throws
     */
    open(cb?: TCallbackError): Promise<void>;

    /**
     * close connection to the storage
     *
     * @returns {Promise<void>}
     * @memberof IOrbitDbStoreBase
     * @throws
     */
    close(cb?: TCallbackError): Promise<void>;
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
    get(k: string, cb?: TCallbackErrorValue): Promise<string | void>;

    /**
     * delete the key from the store
     *
     * @param {string} k
     * @param {TCallbackErrorValue} [cb]
     * @returns {Promise<void>}
     * @memberof IStore
     * @throws
     */
    del(k: string, cb?: TCallbackErrorValue): Promise<void>;

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
    put(k: string, v: Buffer | string, cb?: TCallbackError): Promise<void>;
  }

  export default class Cache {
    constructor(store: IStore);

    /**
     *
     *
     * @type {string}
     * @memberof IOrbitDbStoreBase
     */
    status: TCacheStatus;

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
    set(k: string, v: string | Buffer): Promise<void>;

    load(): Promise<void>;
    destroy(): Promise<void>;
  }
}
