import {
  TCentralAuthorityUserCryptoCredentials,
  TCentralAuthorityUserIdentity,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';

export interface ICAStorageCurrentUserCredentialsOptions {
  credentials: ISecretStoreCredentials;
}

/**
 * is allows to set credentials of the in app
 * authorized user,
 *
 * @export
 * @interface ICAStorageCurrentUserCredentials
 */
export interface ICAStorageCurrentUserCredentials {
  connect(
    options: ICAStorageCurrentUserCredentialsOptions
  ): Promise<Error | void>;
  disconnect(): Promise<Error | void>;
  /**
   * set the credentials for the current app user.
   *
   * @param {TCentralAuthorityUserCryptoCredentials} userCryptoCredentials
   * @returns {(Promise<Error | void>)}
   * @memberof ICAStorageCurrentUserCredentials
   */
  set(
    userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<Error | void>;
  /**
   * unset credentials for the current user by the user id.
   *
   * @param {TCentralAuthorityUserIdentity} userId
   * @returns {(Promise<Error | void>)}
   * @memberof ICAStorageCurrentUserCredentials
   */
  unset(userId: TCentralAuthorityUserIdentity): Promise<Error | void>;
  /**
   * userId - is identity of the current authorized user.
   *
   * @param {TCentralAuthorityUserIdentity} userId
   * @returns {(Promise<Error | TCentralAuthorityUserCryptoCredentials | void>)}
   * @memberof ICAStorageCurrentUserCredentials
   */
  get(
    userId: TCentralAuthorityUserIdentity
  ): Promise<Error | TCentralAuthorityUserCryptoCredentials | void>;
  // get the user's crypto credentials by the auth provider url
  // he is authorized on
  getByAuthProvider(
    authProviderUrl: string
  ): Promise<Error | TCentralAuthorityUserCryptoCredentials | void>;
}
