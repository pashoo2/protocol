import { IStorageProviderOptions } from './../storage-providers.types';
import { StorageProvider } from '../storage-providers.types';
import assert from 'assert';

export class SecretStorageProviderLocalStorage implements StorageProvider {
  public static isDbNameSupported = true;
  private localStorage?: Storage;

  protected dbName?: string;

  public async connect(options?: IStorageProviderOptions): Promise<true | Error> {
    try {
      if (!window || !window.localStorage) {
        return new Error('There is no localStorage available for this context');
      }
      this.setOptions(options);
      this.localStorage = window.localStorage; // set the instance to use
      return true;
    } catch (err) {
      console.error('SecretStorageProviderLocalStorage', err);
      return err;
    }
  }

  public async disconnect(): Promise<true | Error> {
    this.localStorage = undefined;
    return true;
  }

  public async clearDb() {
    try {
      const { dbName, localStorage } = this;

      if (!dbName) {
        return new Error('There is no database connected to');
      }
      if (!localStorage) {
        return new Error('Does not connected to a session storage to remove the database');
      }
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(dbName)) {
          localStorage.removeItem(key);
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
      const { localStorage } = this;

      if (!localStorage) {
        return new Error('There is no storage connected');
      }
      if (!value) {
        return await this.unset(key);
      }
      localStorage.setItem(this.resolveKey(key), value);
      return true;
    } catch (err) {
      return err;
    }
  }

  public async unset(key: string): Promise<Error | true> {
    try {
      const { localStorage } = this;

      if (!localStorage) {
        return new Error('There is no storage connected');
      }
      localStorage.removeItem(this.resolveKey(key));
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

      const item = localStorage.getItem(this.resolveKey(key));

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
