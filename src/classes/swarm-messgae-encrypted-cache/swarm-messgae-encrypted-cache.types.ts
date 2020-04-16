import { TSwarmMessageBodyRaw } from '../swarm-message/swarm-message-constructor.types';
import { TSecretStorageAuthOptions } from '../secret-storage-class/secret-storage-class.types';
import {
  ISecretStorage,
  IISecretStorageOptions,
} from '../secret-storage-class/secret-storage-class.types';

export interface ISwarmMessgaeEncryptedCacheOptionsStorageProvider {
  storageProvider: ISecretStorage;
}

export interface ISwarmMessgaeEncryptedCacheOptionsForStorageProvider {
  storageProviderOptions: IISecretStorageOptions;
  storageProviderAuthOptions: TSecretStorageAuthOptions;
}

export type TSwarmMessgaeEncryptedCacheOptions =
  | ISwarmMessgaeEncryptedCacheOptionsStorageProvider
  | ISwarmMessgaeEncryptedCacheOptionsForStorageProvider;

/**
 * This is a cache of the messages decrypted
 * and signatures already validated.
 * It usefull to store messages body decrypted,
 * which was encrypted with a receiver user
 * public key, and sent to it. But this
 * message can't be decrypted cause there is
 * no receiver private key we know.
 *
 * Also it may be usefull to store messages signatures
 * already validated.
 *
 * @export
 * @interface ISwarmMessgaeEncryptedCache
 */
export interface ISwarmMessgaeEncryptedCache {
  /**
   * is the instance running
   *
   * @type {boolean}
   * @memberof ISwarmMessgaeEncryptedCache
   */
  isRunning: boolean;
  connect(options?: TSwarmMessgaeEncryptedCacheOptions): Promise<void>;
  /**
   * get body decrypted for the message with the signature
   *
   * @param {string} sig
   * @returns {(Promise<TSwarmMessageBodyRaw | undefined>)}
   * @memberof ISwarmMessgaeEncryptedCache
   * @throws
   */
  get(sig: string): Promise<TSwarmMessageBodyRaw | null | undefined>;
  /**
   * add message body to the storage or simply
   * add mark that the signature is valid.
   *
   * If a record(mark as valid or a full body)
   * for the signature is already
   * existing in the storage, it will not
   * be overwritten with a new value.
   *
   * @param {string} sig
   * @param {TSwarmMessageBodyRaw} [message]
   * @returns {Promise<void>}
   * @memberof ISwarmMessgaeEncryptedCache
   * @throws
   */
  add(sig: string, message: TSwarmMessageBodyRaw): Promise<boolean>;
  /**
   * unset mark or body for the messge signature
   *
   * @param {string} sig
   * @returns {Promise<void>}
   * @memberof ISwarmMessgaeEncryptedCache
   * @throws
   */
  unset(sig: string): Promise<void>;
}
