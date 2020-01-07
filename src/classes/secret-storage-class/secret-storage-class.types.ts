import {
  IStorageProviderOptions,
  TStorageProviderName,
} from './../storage-providers/storage-providers.types';
export * from 'classes/storage-providers/storage-providers.types';

export interface ISecretStoreConfiguration {
  storageProviderName: TStorageProviderName;
}

export interface ISecretStorage {
  // returns true if connected succesfully to
  // a storage and have a vaild crypto key
  isActive: boolean;
  connect(options?: IStorageProviderOptions): Promise<boolean | Error>;
  // authorize and connect to the storage
  authorize(
    credentials: ISecretStoreCredentials,
    options?: IStorageProviderOptions
  ): Promise<boolean | Error>;
  // disconnect from the storage
  disconnect(): Promise<boolean | Error>;
  set(key: string, value: string): Promise<boolean | Error>;
  get(key: string): Promise<string | undefined | Error>;
}

export type TSecretStorageProviderName = string;

export interface ISecretStoreCredentials {
  login: string;
  password: string;
}

export interface ISecretStoreCredentialsCryptoKey {
  key: CryptoKey;
}
