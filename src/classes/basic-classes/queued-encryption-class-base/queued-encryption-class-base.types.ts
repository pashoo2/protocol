import { TCryptoUtilEncryptDataTypes, TDataSignUtilSignDataTypes, TDataSignUtilVerifyDataTypes } from '@pashoo2/crypto-utilities';
import { IAsyncQueueBaseClassOptions } from '../async-queue-class-base';

export interface IQueuedEncryptionClassBaseOptions {
  /** crypto keys used as default keys */
  keys?: {
    /**
     * key used to sign data.
     *
     * @type {CryptoKey}
     * @memberof IQueuedEncryptionClassBaseOptions
     */
    signKey?: CryptoKey;
    /**
     * the key used data decryption.
     * In asymmetric encryption it
     * is the user's private key.
     *
     * @type {CryptoKey}
     * @memberof IQueuedEncryptionClassBaseOptions
     */
    decryptKey?: CryptoKey;
    /**
     * Encryption key which will be used for data encryption.
     *
     * @type {CryptoKey}
     */
    encryptKey?: CryptoKey;
  };
  queueOptions?: IAsyncQueueBaseClassOptions;
}

/**
 * used for queued encryption/decryption
 * to avoid a performance issues.
 *
 * @export
 * @interface IQueuedEncryptionClassBase
 */
export interface IQueuedEncryptionClassBase {
  /**
   * encrypt data provided with the public
   * crypto key provided
   *
   * @param {TCryptoUtilEncryptDataTypes} data
   * @param {CryptoKey} key
   * @returns {Promise<string | Error>}
   * @memberof IQueuedEncryptionClassBase
   */
  encryptData(data: TCryptoUtilEncryptDataTypes, key?: CryptoKey): Promise<string | Error>;
  /**
   * decrypt the data with the
   * private crypto key. If no key
   * provided then a key provided in the
   * constructor will be used.
   *
   * @param {TCryptoUtilEncryptDataTypes} data
   * @param {CryptoKey} key
   * @returns {Promise<string | Error>}
   * @memberof IQueuedEncryptionClassBase
   */
  decryptData(data: TCryptoUtilEncryptDataTypes, key?: CryptoKey): Promise<string | Error>;
  /**
   * sign data with the key provided. If
   * a key is not provided, then the key provided
   * in constructor will be used
   *
   * @param {TDataSignUtilSignDataTypes} data
   * @param {CryptoKey} [key]
   * @returns {(Promise<string | Error>)}
   * @memberof IQueuedEncryptionClassBase
   */
  signData(data: TDataSignUtilSignDataTypes, key?: CryptoKey): Promise<string | Error>;
  /**
   * verify data signature with the key provided.
   *
   * @param {TDataSignUtilVerifyDataTypes} data
   * @param {CryptoKey} [key]
   * @returns {(Promise<string | Error>)}
   * @memberof IQueuedEncryptionClassBase
   */
  verifyData(
    data: TDataSignUtilVerifyDataTypes,
    signature: TDataSignUtilVerifyDataTypes,
    key: CryptoKey
  ): Promise<boolean | Error>;
}
