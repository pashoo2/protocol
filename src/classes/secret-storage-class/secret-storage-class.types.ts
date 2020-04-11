import {
  IStorageProviderOptions,
  TStorageProviderName,
} from './../storage-providers/storage-providers.types';
import { ISensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
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

export interface ISecretStoreCredentials
  extends ISecretStoreCredentialsPassword {}

export interface ISecretStoreCredentialsCryptoKey {
  key: CryptoKey;
}

export interface ISecretStorage {
  // returns true if connected succesfully to
  // a storage and have a vaild crypto key
  isActive: boolean;
  connect(options?: IISecretStorageOptions): Promise<boolean | Error>;
  // authorize and connect to the storage
  authorize(
    credentials: ISecretStoreCredentials,
    options?: IISecretStorageOptions
  ): Promise<boolean | Error>;
  authorize(
    credentials: ISecretStoreCredentialsSession,
    options?: IISecretStorageOptions
  ): Promise<boolean | Error>;
  // disconnect from the storage
  disconnect(): Promise<boolean | Error>;
  set(key: string, value: string): Promise<boolean | Error>;
  get(key: string): Promise<string | undefined | Error>;
}
