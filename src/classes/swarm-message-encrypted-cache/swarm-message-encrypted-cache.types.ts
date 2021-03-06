import { TSwarmMessageBodyRaw, ISwarmMessageConstructor } from '../swarm-message/swarm-message-constructor.types';
import { TSecretStorageAuthOptions } from '../secret-storage-class/secret-storage-class.types';
import { TSwarmMessageConstructorOptions } from '../swarm-message/swarm-message-constructor.types';
import { IStorageCommon } from 'types/storage.types';
import { ISecretStorage, IISecretStorageOptions } from '../secret-storage-class/secret-storage-class.types';

export interface ISwarmMessageEncryptedCacheOptionsStorageProvider {
  storageProvider: ISecretStorage;
}

export interface ISwarmMessageEncryptedCacheOptionsForStorageProvider {
  dbNamePrefix?: string;
  storageProviderOptions?: IISecretStorageOptions;
  storageProviderAuthOptions: TSecretStorageAuthOptions;
}

export type TSwarmMessageEncryptedCacheOptions =
  | ISwarmMessageEncryptedCacheOptionsStorageProvider
  | ISwarmMessageEncryptedCacheOptionsForStorageProvider;

/**
 * This is a cache of the messages decrypted
 * and signatures already validated.
 * It usefully to store messages body decrypted,
 * which was encrypted with a receiver user
 * public key, and sent to it. But this
 * message can't be decrypted cause there is
 * no receiver private key we know.
 *
 * Also it may be usefull to store messages signatures
 * already validated.
 *
 * Also it used as a database list.
 * // TODO - rename it
 *
 * @export
 * @interface ISwarmMessageEncryptedCache
 */
export interface ISwarmMessageEncryptedCache extends IStorageCommon {
  /**
   * is the instance running
   *
   * @type {boolean}
   * @memberof ISwarmMessageEncryptedCache
   */
  isRunning: boolean;
  connect(options?: TSwarmMessageEncryptedCacheOptions): Promise<void>;
  /**
   * get body decrypted for the message with the signature
   *
   * @param {string} sig
   * @returns {(Promise<TSwarmMessageBodyRaw | undefined>)}
   * @memberof ISwarmMessageEncryptedCache
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
   * @memberof ISwarmMessageEncryptedCache
   * @throws
   */
  add(sig: string, message: TSwarmMessageBodyRaw): Promise<boolean>;
  /**
   * Add or replace message in a storage
   * TODO - It's added only to the instance be capatible with IStorageCommon interface
   * This method may be used if the instance is used not for the messages.
   *
   * @param {string} sig
   * @param {TSwarmMessageBodyRaw} [message]
   * @returns {Promise<void>}
   * @memberof ISwarmMessageEncryptedCache
   * @throws
   */
  set(sig: string, message: TSwarmMessageBodyRaw): Promise<void>;
  /**
   * unset mark or body for the messge signature
   *
   * @param {string} sig
   * @returns {Promise<void>}
   * @memberof ISwarmMessageEncryptedCache
   * @throws
   */
  unset(sig: string): Promise<void>;

  /**
   * clear the database and all of it's content
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessageEncryptedCache
   */
  clearDb(): Promise<void>;
}

/**
 * fabric which produces an instance of the SwarmMessageEncryptedStorage
 * connected to the secret storage and ready to use.
 *
 * @export
 * @interface ISwarmMessageEncryptedCacheFabric
 * @throws
 */
export interface ISwarmMessageEncryptedCacheFabric {
  (storageProviderOptions?: IISecretStorageOptions): Promise<ISwarmMessageEncryptedCache>;
}

/**
 * Returns a fabric provides messages consturctors
 * with encrypted cache support.
 *
 * @export
 * @interface ISwarmMessageConstructorWithEncryptedCacheFabric
 */
export interface ISwarmMessageConstructorWithEncryptedCacheFabric {
  (
    swarmMessageConstructorOptions: Partial<TSwarmMessageConstructorOptions>,
    storageProviderOptions?: IISecretStorageOptions
  ): Promise<ISwarmMessageConstructor>;
}
