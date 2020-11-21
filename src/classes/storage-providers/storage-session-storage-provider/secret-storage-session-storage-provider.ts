import assert from 'assert';
import { StorageProvider, IStorageProviderOptions } from '../storage-providers.types';

export class SecretStorageProvideSessionStorage implements StorageProvider {
  public static isDbNameSupported = true;
  private sessionStorage?: Storage;

  protected dbName?: string;

  public async connect(options?: IStorageProviderOptions): Promise<true | Error> {
    try {
      if (!window || !window.sessionStorage) {
        return new Error('There is no sessionStorage available for this context');
      }
      this.setOptions(options);
      this.sessionStorage = window.sessionStorage; // set the instance to use
      return true;
    } catch (err) {
      console.error('SecretStorageProvidersessionStorage', err);
      return err;
    }
  }

  public async disconnect(): Promise<true | Error> {
    this.sessionStorage = undefined;
    return true;
  }

  public async clearDb() {
    try {
      const { dbName, sessionStorage } = this;

      if (!dbName) {
        return new Error('There is no database connected to');
      }
      if (!sessionStorage) {
        return new Error('Does not connected to a session storage to remove the database');
      }
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(dbName)) {
          sessionStorage.removeItem(key);
        }
      });
      return true;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  public async set(key: string, value?: string): Promise<Error | true> {
    try {
      const { sessionStorage } = this;

      if (!sessionStorage) {
        return new Error('There is no storage connected');
      }
      if (!value) {
        return await this.unset(key);
      }
      sessionStorage.setItem(this.resolveKey(key), value);
      return true;
    } catch (err) {
      return err;
    }
  }

  public async unset(key: string): Promise<Error | true> {
    try {
      const { sessionStorage } = this;

      if (!sessionStorage) {
        return new Error('There is no storage connected');
      }
      sessionStorage.removeItem(this.resolveKey(key));
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

      const item = sessionStorage.getItem(this.resolveKey(key));

      if (typeof item !== 'string') {
        return undefined;
      }
      return item;
    } catch (err) {
      return err;
    }
  }

  protected setOptions(options?: IStorageProviderOptions) {
    if (options) {
      assert(typeof options === 'object', 'Options provided must be an object');

      const { dbName } = options;

      if (dbName) {
        assert(typeof dbName === 'string', 'dbName must be a string');
        this.dbName = `${dbName}//`;
      }
    }
  }

  protected resolveKey(key: string) {
    if (this.dbName) {
      return `${this.dbName}${key}`;
    }
    return key;
  }
}
