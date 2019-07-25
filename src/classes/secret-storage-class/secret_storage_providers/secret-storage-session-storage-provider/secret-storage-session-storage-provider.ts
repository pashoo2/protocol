import { StorageProvider } from '../../secret-storage-class.types';

export class SecretStorageProvideSessionStorage implements StorageProvider {
  private sessionStorage?: Storage;

  public async connect(): Promise<true | Error> {
    try {
      if (!window || !window.sessionStorage) {
        return new Error(
          'There is no sessionStorage available for this context'
        );
      }
      this.sessionStorage = window.sessionStorage; // set the instance to use
      return true;
    } catch (err) {
      console.error('SecretStorageProvidersessionStorage', err);
      return err;
    }
  }

  public async set(key: string, value: string): Promise<Error | true> {
    try {
      const { sessionStorage } = this;

      if (!sessionStorage) {
        return new Error('There is no storage connected');
      }
      sessionStorage.setItem(key, value);
      return true;
    } catch (err) {
      return err;
    }
  }

  public async get(key: string): Promise<Error | string | undefined> {
    try {
      const { sessionStorage } = this;

      if (!sessionStorage) {
        return new Error('There is no storage connected');
      }

      const item = sessionStorage.getItem(key);

      if (typeof item !== 'string') {
        return undefined;
      }
      return item;
    } catch (err) {
      return err;
    }
  }
}
