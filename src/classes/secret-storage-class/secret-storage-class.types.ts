import { IStorageProviderOptions, TStorageProviderName } from './../storage-providers/storage-providers.types';
import { ISensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
import { IStorageCommon } from '../../types/storage.types';
export * from 'classes/storage-providers/storage-providers.types';

export interface ISecretStoreConfiguration {
  storageProviderName: TStorageProviderName;
}

export interface IISecretStorageOptions extends IStorageProviderOptions {}

export interface ISecretStorageSessionInfoStored {
  login: string;
  key: string;
}

export interface ISecretStorageSessionInfo {
  login: string;
  key: CryptoKey;
}

export type TSecretStorageProviderName = string;

export interface ISecretStoreCredentialsSession {
  session: ISensitiveDataSessionStorage;
}

export interface ISecretStoreCredentialsPassword {
  login: string;
  password: string;
}

export interface ISecretStoreCredentials extends ISecretStoreCredentialsPassword {}

export interface ISecretStoreCredentialsCryptoKey {
  key: CryptoKey;
}

export type TSecretStorageAuthOptionsCredentials = ISecretStoreCredentials | ISecretStoreCredentialsSession;

export type TSecretStorageAuthOptions = TSecretStorageAuthOptionsCredentials | ISecretStoreCredentialsCryptoKey;

export type TSecretStorageAuthorizeCredentials = ISecretStoreCredentials | ISecretStoreCredentialsSession | ISecretStoreCredentialsCryptoKey;

export interface ISecretStorage extends IStorageCommon {
  // returns true if connected succesfully to
  // a storage and have a vaild crypto key
  isActive: boolean;
  connect(options?: IISecretStorageOptions): Promise<boolean | Error>;
  // authorize and connect to the storage
  authorize(credentials: ISecretStoreCredentials, options?: IISecretStorageOptions): Promise<boolean | Error>;
  authorize(credentials: ISecretStoreCredentialsSession, options?: IISecretStorageOptions): Promise<boolean | Error>;
  authorize(credentials: ISecretStoreCredentialsCryptoKey, options?: IISecretStorageOptions): Promise<boolean | Error>;
  // authorize by the crypto key provided
  authorizeByKey(credentials: ISecretStoreCredentialsCryptoKey, options?: IStorageProviderOptions): Promise<boolean | Error>;
  // disconnect from the storage
  disconnect(): Promise<boolean | Error>;
  /**
   * for the null value the null value will be set in the storage
   *
   * @param {string} key
   * @param {(string | null)} value
   * @returns {(Promise<boolean | Error>)}
   * @memberof ISecretStorage
   */
  set(key: string, value: string | null): Promise<boolean | Error>;
  /**
   * insert value only if there is no value or value.
   * Nullish value is considered to be existing.
   *
   * @param {string} key
   * @param {(string | null)} value
   * @returns {(Promise<boolean | Error>)} - return false if the value was not inserted, true otherwise
   * @memberof ISecretStorage
   */
  insert(key: string, value: string | null): Promise<boolean | Error>;
  /**
   * if the null value was set before, null will be returned
   */
  get(key: string): Promise<string | undefined | null | Error>;

  /**
   * check if a value exists in the storage for
   * the key given
   *
   * @param {string} key
   * @returns {(Promise<boolean | Error>)}
   * @memberof ISecretStorage
   */
  has(key: string): Promise<boolean | Error>;

  /**
   * unset a record with the key
   * provided or a list of records
   * with have the keys provided
   *
   * @param {(string | string[])} key
   * @returns {(Promise<Error | void>)}
   * @memberof ISecretStorage
   */
  unset(key: string | string[]): Promise<Error | void>;
  /**
   * generates crypto key by the credentials provided.
   * it may be used to authorize to the storage
   *
   * @param {(ISecretStoreCredentials
   *       | ISecretStoreCredentialsSession)} credentialsOrSession
   * @returns {(Promise<CryptoKey | Error>)}
   * @memberof ISecretStorage
   */
  generateCryptoKey(credentialsOrSession: ISecretStoreCredentials | ISecretStoreCredentialsSession): Promise<CryptoKey | Error>;
  /**
   * remove all content withting the database
   * connected to.
   *
   * @returns {(Promise<boolean | Error>)}
   * @memberof ISecretStorage
   */
  clearDb(): Promise<Error | boolean>;
}
