import {
  TCentralAuthorityUserCryptoCredentials,
  TCentralAuthorityUserIdentity,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';

export interface ICAStorageCurrentUserCredentialsOptions {
  credentials: ISecretStoreCredentials;
}

export interface ICAStorageCurrentUserCredentials {
  connect(
    options: ICAStorageCurrentUserCredentialsOptions
  ): Promise<Error | void>;
  disconnect(): Promise<Error | void>;
  set(
    userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<Error | void>;
  unset(userId: TCentralAuthorityUserIdentity): Promise<Error | void>;
  get(
    userId: TCentralAuthorityUserIdentity
  ): Promise<Error | TCentralAuthorityUserCryptoCredentials | void>;
  getByAuthProvider(
    authProviderUrl: string
  ): Promise<Error | TCentralAuthorityUserCryptoCredentials | void>;
}
