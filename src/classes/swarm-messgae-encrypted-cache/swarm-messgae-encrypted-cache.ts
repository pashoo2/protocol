import {
  TSwarmMessgaeEncryptedCacheOptions,
  ISwarmMessgaeEncryptedCache,
} from './swarm-messgae-encrypted-cache.types';
import assert from 'assert';
import { ISecretStorage } from '../secret-storage-class/secret-storage-class.types';
import { SecretStorage } from '../secret-storage-class/secret-storage-class';
import { TSwarmMessageBodyRaw } from '../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessgaeEncryptedCacheOptionsStorageProvider,
  ISwarmMessgaeEncryptedCacheOptionsForStorageProvider,
} from './swarm-messgae-encrypted-cache.types';
import {
  SWARM_MESSGAE_ENCRYPTED_CACHE_DEFAULT_STORAGE_DATABASE_NAME,
  SWARM_MESSGAE_ENCRYPTED_CACHE_DEFAULT_STORAGE_DATABASE_NAME_HASH,
} from './swarm-messgae-encrypted-cache.const';
import { calculateHash } from '../../utils/hash-calculation-utils/hash-calculation-utils';

export class SwarmMessageEncryptedCache implements ISwarmMessgaeEncryptedCache {
  public isRunning: boolean = false;

  protected options?: TSwarmMessgaeEncryptedCacheOptions = undefined;

  protected storageProvider?: ISecretStorage = undefined;

  protected get dbNamePrefix() {
    return (
      (this.options as ISwarmMessgaeEncryptedCacheOptionsForStorageProvider)
        ?.dbNamePrefix || ''
    );
  }

  protected get dbName() {
    return `${(this
      .options as ISwarmMessgaeEncryptedCacheOptionsForStorageProvider)
      ?.storageProviderOptions?.dbName ||
      SWARM_MESSGAE_ENCRYPTED_CACHE_DEFAULT_STORAGE_DATABASE_NAME}`;
  }

  public async connect(options: TSwarmMessgaeEncryptedCacheOptions) {
    this.setOptions(options);
    await this.runStorageConnection();
    this.setIsRunning();
  }

  /**
   * just an alias for the add method
   *
   * @memberof SwarmMessageEncryptedCache
   */
  public set = (sig: string, message: TSwarmMessageBodyRaw) => {
    return this.add(sig, message);
  };

  public add = async (sig: string, message: TSwarmMessageBodyRaw) => {
    this.checkIsActive();

    const value = message || null;
    const result = await this.storageProvider!.insert(sig, value);

    if (result instanceof Error) {
      throw result;
    }
    return result;
  };
  public get = async (sig: string) => {
    const result = await this.readValue(sig);

    if (!result) {
      return undefined;
    }
    return result;
  };

  public unset = async (sig: string) => {
    this.checkIsActive();

    const resutl = await this.storageProvider!.unset(sig);

    if (resutl instanceof Error) {
      throw resutl;
    }
  };

  public async clearDb() {
    const clearDbResult = await this.storageProvider?.clearDb();

    if (clearDbResult instanceof Error) {
      throw clearDbResult;
    }
  }

  protected setOptions(options: TSwarmMessgaeEncryptedCacheOptions) {
    assert(options, 'Options must be provided');
    assert(typeof options === 'object', 'Options must be an object');

    const optsWithStorageProvider = options as ISwarmMessgaeEncryptedCacheOptionsStorageProvider;

    if (optsWithStorageProvider.storageProvider) {
      assert(
        typeof optsWithStorageProvider.storageProvider === 'object',
        'Storage provider must be an object'
      );
      assert(
        typeof optsWithStorageProvider.storageProvider.connect === 'function' &&
          typeof optsWithStorageProvider.storageProvider.get === 'function' &&
          typeof optsWithStorageProvider.storageProvider.get === 'function',
        'Storage provider provided is not valid'
      );
    } else {
      const optsWithConfForStorageProviderConnection = options as ISwarmMessgaeEncryptedCacheOptionsForStorageProvider;

      assert(
        optsWithConfForStorageProviderConnection.storageProviderAuthOptions,
        'Options for authorization to the storage provider must be provided'
      );
    }

    this.options = options;
  }

  protected setStorageProvider(provider: ISecretStorage) {
    this.storageProvider = provider;
  }

  protected async runStorageConnection() {
    const { options } = this;
    const optsWithStorageProvider = options as ISwarmMessgaeEncryptedCacheOptionsStorageProvider;

    if (optsWithStorageProvider.storageProvider) {
      this.setStorageProvider(optsWithStorageProvider.storageProvider);
      return;
    }

    const optsWithConfForStorageProviderConnection = options as ISwarmMessgaeEncryptedCacheOptionsForStorageProvider;

    if (!optsWithConfForStorageProviderConnection.storageProviderAuthOptions) {
      throw new Error(
        'Auth options was not provided to connect with the secret storage provider'
      );
    }

    const {
      storageProviderOptions,
      storageProviderAuthOptions,
    } = optsWithConfForStorageProviderConnection;

    const storageProvider = new SecretStorage();
    const dbName = await calculateHash(
      this.dbName,
      SWARM_MESSGAE_ENCRYPTED_CACHE_DEFAULT_STORAGE_DATABASE_NAME_HASH
    );

    if (dbName instanceof Error) {
      console.error(
        `Failed to calculate hash for the database name ${this.dbName}`
      );
      throw dbName;
    }
    await storageProvider.authorize(storageProviderAuthOptions, {
      ...storageProviderOptions,
      dbName,
    });
    this.setStorageProvider(storageProvider);
  }

  protected setIsRunning() {
    this.isRunning = true;
  }

  protected checkIsActive() {
    if (!this.isRunning) {
      throw new Error('The instance is not running');
    }
    if (!this.storageProvider || !this.storageProvider.isActive) {
      throw new Error('There is no running storage provider');
    }
    return true;
  }

  protected async readValue(
    sig: string
  ): Promise<TSwarmMessageBodyRaw | undefined | null> {
    this.checkIsActive();

    const result = await this.storageProvider!.get(sig);

    if (result instanceof Error) {
      throw result;
    }
    if (result === null) {
      return undefined;
    }
    if (!result) {
      return undefined;
    }
    if (typeof result !== 'string') {
      throw new Error('There is a wrong result');
    }
    return result;
  }
}
