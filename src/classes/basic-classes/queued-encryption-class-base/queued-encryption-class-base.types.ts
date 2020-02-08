import { TCRYPTO_UTIL_ENCRYPT_DATA_TYPES } from '../../../utils/encryption-utils/crypto-utils.types';
import { IAsyncQueueBaseClassOptions } from '../async-queue-class-base/async-queue-class-base.types';
import {
  TDATA_SIGN_UTIL_SIGN_DATA_TYPES,
  TDATA_SIGN_UTIL_VERIFY_DATA_TYPES,
} from '../../../utils/data-sign-utils/data-sign-utils.types';

export interface IQueuedEncrypyionClassBaseOptions {
  /** crypto keys used as default keys */
  keys?: {
    /**
     * key used to sign data.
     *
     * @type {CryptoKey}
     * @memberof IQueuedEncrypyionClassBaseOptions
     */
    signKey?: CryptoKey;
    /**
     * the key used data decryption.
     * In assymetric encryption it
     * is the user's private key.
     *
     * @type {CryptoKey}
     * @memberof IQueuedEncrypyionClassBaseOptions
     */
    decryptKey?: CryptoKey;
  };
  queueOptions?: IAsyncQueueBaseClassOptions;
}

/**
 * used for queued encryption/decryption
 * to avoid a performance issues.
 *
 * @export
 * @interface IQueuedEncrypyionClassBase
 */
export interface IQueuedEncrypyionClassBase {
  /**
   * encrypt data provided with the public
   * crypto key provided
   *
   * @param {TCRYPTO_UTIL_ENCRYPT_DATA_TYPES} data
   * @param {CryptoKey} key
   * @returns {Promise<string | Error>}
   * @memberof IQueuedEncrypyionClassBase
   */
  encryptData(
    data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES,
    key: CryptoKey
  ): Promise<string | Error>;
  /**
   * decrypt the data with the
   * private crypto key. If no key
   * provided then a key provided in the
   * constructor will be used.
   *
   * @param {TCRYPTO_UTIL_ENCRYPT_DATA_TYPES} data
   * @param {CryptoKey} key
   * @returns {Promise<string | Error>}
   * @memberof IQueuedEncrypyionClassBase
   */
  decryptData(
    data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES,
    key?: CryptoKey
  ): Promise<string | Error>;
  /**
   * sign data with the key provided. If
   * a key is not provided, then the key provided
   * in constructor will be used
   *
   * @param {TDATA_SIGN_UTIL_SIGN_DATA_TYPES} data
   * @param {CryptoKey} [key]
   * @returns {(Promise<string | Error>)}
   * @memberof IQueuedEncrypyionClassBase
   */
  signData(
    data: TDATA_SIGN_UTIL_SIGN_DATA_TYPES,
    key?: CryptoKey
  ): Promise<string | Error>;
  /**
   * verify data signature with the key provided.
   *
   * @param {TDATA_SIGN_UTIL_VERIFY_DATA_TYPES} data
   * @param {CryptoKey} [key]
   * @returns {(Promise<string | Error>)}
   * @memberof IQueuedEncrypyionClassBase
   */
  verifyData(
    data: TDATA_SIGN_UTIL_VERIFY_DATA_TYPES,
    signature: TDATA_SIGN_UTIL_VERIFY_DATA_TYPES,
    key: CryptoKey
  ): Promise<boolean | Error>;
}
