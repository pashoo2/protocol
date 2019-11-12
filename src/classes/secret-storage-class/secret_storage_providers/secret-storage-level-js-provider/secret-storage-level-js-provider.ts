import levelup, { LevelUp } from 'levelup';
import leveljs from 'level-js';
import encodingDown from 'encoding-down';
import { StorageProvider, IStorageProviderOptions } from '../../secret-storage-class.types';
import { SECRET_STORAGE_LEVELJS_PROVIDER_DEFAULTS_DB_NAME } from './secret-storage-level-js-provider.const';

export class SecretStorageProviderLevelJS implements StorageProvider {
  private levelStorage?: LevelUp;

  private dbName: string = SECRET_STORAGE_LEVELJS_PROVIDER_DEFAULTS_DB_NAME;
  
  private options?: IStorageProviderOptions;

  public async connect(options?: IStorageProviderOptions): Promise<true | Error> {
    try {
      this.setOptions(options);
      
      const res = await this.createInstanceOfLevelDB();
      
      if (res instanceof Error) {
        console.error('SecretStorageProviderLevelJS', res);
        return res;
      }
      return true;
    } catch (err) {
      console.error('SecretStorageProviderLevelJS', err);
      return err;
    }
  }

  public async disconnect(): Promise<true | Error> {
    return true;
  }

  public async set(key: string, value: string): Promise<Error | true> {
    try {
      const { levelStorage } = this;

      if (!levelStorage) {
        return new Error('There is no storage connected');
      }
      await levelStorage.put(key, value);
      return true;
    } catch (err) {
      return err;
    }
  }

  public async get(key: string): Promise<Error | string | undefined> {
    try {
      const { levelStorage } = this;

      if (!levelStorage) {
        return new Error('There is no storage connected');
      }

      const item = await levelStorage.get(key);

      if (typeof item !== 'string') {
        return undefined;
      }
      return item;
    } catch (err) {
      return err;
    }
  }

  protected setOptions(options?: IStorageProviderOptions): void {
    if (options && typeof options === 'object') {
      this.options = options;
      
      const { dbName } = options;

      if (dbName && typeof dbName === 'string') {
        this.dbName = dbName;
      }
    }
  }

  protected async createInstanceOfLevelDB(): Promise<void | Error> {
    const { dbName } = this;
    const dbNameRes = dbName || SECRET_STORAGE_LEVELJS_PROVIDER_DEFAULTS_DB_NAME;
    
    const levelStorage = levelup(encodingDown(leveljs(dbNameRes)));

    try {
      await levelStorage.open();
    } catch(err) {
      return err;
    }
    this.levelStorage = levelup(leveljs(dbNameRes));
  }
}
