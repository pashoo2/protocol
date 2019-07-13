export abstract class StorageProvider {
  public abstract set(key: string, value: string): Promise<boolean | Error>;
  public abstract get(key: string): Promise<string | Error>;
}

export type TStorageProvider = typeof StorageProvider;
export interface IStorageProvider {
  new (): StorageProvider;
}

export type TInstanceofStorageProvider = InstanceType<IStorageProvider>;

export interface ILocalStorageProviderTable {
  [providerName: string]: IStorageProvider;
}

export type TSecretStoreConfiguration = {
  storageProviderName: string;
};
