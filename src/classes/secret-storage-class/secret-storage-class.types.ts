export interface ISecretStorageOptions {
  dbName?: string;
}

export interface ISecretStorage {
  // returns true if connected succesfully to
  // a storage and have a vaild crypto key
  isActive: boolean;
  connect(options?: ISecretStorageOptions): Promise<boolean | Error>;
  // authorize and connect to the storage
  authorize(credentials: TSecretStoreCredentials): Promise<boolean | Error>;
  // disconnect from the storage
  disconnect(): Promise<boolean | Error>;
  set(key: string, value: string): Promise<boolean | Error>;
  get(key: string): Promise<string | undefined | Error>;
}

export interface IStorageProviderOptions {
  dbName?: string;
}

export abstract class StorageProvider {
  public abstract connect(options?: IStorageProviderOptions): Promise<boolean | Error>;
  public abstract disconnect(): Promise<boolean | Error>;
  public abstract set(key: string, value: string): Promise<boolean | Error>;
  public abstract get(key: string): Promise<string | undefined | Error>;
}

export type TStorageProvider = typeof StorageProvider;
export interface IStorageProvider {
  new (): StorageProvider;
}

export type TInstanceofStorageProvider = InstanceType<IStorageProvider>;

export type TSecretStorageProviderName = string;

export interface ILocalStorageProviderTable {
  [providerName: string]: IStorageProvider;
}

export type TSecretStoreConfiguration = {
  storageProviderName?: string;
};

export type TSecretStoreCredentials = {
  password: string;
};
