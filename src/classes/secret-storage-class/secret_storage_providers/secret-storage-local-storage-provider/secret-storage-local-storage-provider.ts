import { StorageProvider } from '../../secret-storage-class.types';

export class SecretStorageProviderLocalStorage implements StorageProvider {
  private localStorage?: Storage;

  public async connect(): Promise<true | Error> {
    try {
      if (!window || !window.localStorage) {
        return new Error('There is no localStorage available for this context');
      }
      this.localStorage = window.localStorage; // set the instance to use
      return true;
    } catch (err) {
      console.error('SecretStorageProviderLocalStorage', err);
      return err;
    }
  }

  public async disconnect(): Promise<true | Error> {
    return true;
  }

  public async set(key: string, value: string): Promise<Error | true> {
    try {
      const { localStorage } = this;

      if (!localStorage) {
        return new Error('There is no storage connected');
      }
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      return err;
    }
  }

  public async get(key: string): Promise<Error | string | undefined> {
    try {
      const { localStorage } = this;

      if (!localStorage) {
        return new Error('There is no storage connected');
      }

      const item = localStorage.getItem(key);

      if (typeof item !== 'string') {
        return undefined;
      }
      return item;
    } catch (err) {
      return err;
    }
  }
}
