export interface ISensitiveDataSessionStorageOptions {
  /**
   * pincode value used to encrypt and decrypt a sensitive information
   *
   * @type {string}
   * @memberof ISensitiveDataSessionStorageOptions
   */
  pinCode?: string;
  storagePrefix?: string;
  /**
   * clear values in the session storage
   * after connection to it.
   *
   * @type {boolean}
   * @memberof ISensitiveDataSessionStorageOptions
   */
  clearStorageAfterConnect?: boolean;
}
/**
 * used to store data in the session storage.
 * A data may be secured with a pin code value.
 *
 * @export
 * @interface ISensitiveDataSessionStorage
 */
export interface ISensitiveDataSessionStorage {
  /**
   * connect to the storage
   *
   * @param {ISensitiveDataSessionStorageOptions} options
   * @returns {Promise<void>}
   * @memberof ISensitiveDataSessionStorage
   * @throws
   */
  connect(options: ISensitiveDataSessionStorageOptions): Promise<void>;
  /**
   * add item to the storage
   *
   * @param {string} key
   * @param {*} value
   * @returns {Promise<void>}
   * @memberof ISensitiveDataSessionStorage
   */
  setItem(key: string, value: any): Promise<void>;
  getItem(key: string): Promise<any>;
}
