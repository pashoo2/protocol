import { StorageProvider } from '../../secret-storage-class.types';

export class SecretStorageProviderLocalStorage implements StorageProvider {
  public set(key: string, value: string) {
    return Promise.resolve(true);
  }

  public get(key: string) {
    return Promise.resolve(key);
  }
}
