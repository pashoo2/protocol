import { StorageProvider } from '../../secret-storage-class.types';

export class SecretStorageProviderLocalStorage implements StorageProvider {
  public async connect() {
    return true;
  }

  public async set(key: string, value: string) {
    return true;
  }

  public async get(key: string) {
    return key;
  }
}
