import {
  TCentralAuthorityCredentialsStorageAuthCredentials,
  TCentralAuthorityUserCryptoCredentials,
  TCACryptoKeyPairs,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import {
  TCAuthProviderIdentifier,
  TCAuthProviderUserIdentifier,
} from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';

export interface ICAStorageCredentialsAuthCredentials {
  login: string;
  password: string;
}

/**
 *
 *
 * @export
 * @interface ICAStorageCredentialsUserCryptoInfo
 * @param {string} login - login of the user on the auth provider
 * @param {string} userIdentity - the user identifier
 * @param {TCACryptoKeyPairs} - the crypto credentials of the user
 * including private and public keys.
 */
export interface ICAStorageCredentialsUserCryptoInfo {
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials;
}

/**
 * the class used to read the public and provate keys
 * or if there is no connection to the auth provider
 *
 * @export
 * @interface ICAStorageCredentials
 */
export interface ICAStorageCredentials {
  /**
   * the auth provider, on which the user is authorized
   *
   * @type {TCAuthProviderIdentifier}
   * @memberof ICAStorageCredentials
   */
  authProvider: TCAuthProviderIdentifier;
  /**
   * connect to the storage with the password and user identity
   *
   * @param {TCentralAuthorityCredentialsStorageAuthCredentials} [credentials]
   * @returns {(Promise<boolean | Error>)}
   * @memberof ICentralAuthorityStorageCredentials
   */
  connect(
    credentials?: ICAStorageCredentialsAuthCredentials
  ): Promise<void | Error>;
  /**
   * disconnect from the storage and clear
   * all cached data from the memory
   *
   * @returns {(Promise<void | Error>)}
   * @memberof ICAStorageCredentials
   */
  disconnect(): Promise<void | Error>;
  /**
   * read user credentials from the storage
   *
   * @returns {(Promise<
   *     TCentralAuthorityUserCryptoCredentials | Error | null
   *   >)}
   * @memberof ICAStorageCredentials
   */
  getUserCryptoInfo(): Promise<
    ICAStorageCredentialsUserCryptoInfo | Error | null
  >;
  /**
   * set credentials for the user, only if
   * there is no credentials exists in the
   * storage.
   *
   * @param {TCACryptoKeyPairs} cryptoKeyPairs
   * @returns {(Promise<Error | boolean>)}
   * @memberof ICAStorageCredentials
   */
  setUserCryptoInfo(
    userCryptoInfo: ICAStorageCredentialsUserCryptoInfo
  ): Promise<Error | boolean>;
}
