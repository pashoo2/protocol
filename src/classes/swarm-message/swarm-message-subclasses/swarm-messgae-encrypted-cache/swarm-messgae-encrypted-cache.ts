import {
  ISwarmMessgaeEncryptedCacheOptions,
  ISwarmMessgaeEncryptedCache,
} from './swarm-messgae-encrypted-cache.types';
import assert from 'assert';
import { ISecretStorage } from '../../../secret-storage-class/secret-storage-class.types';
import { SecretStorage } from '../../../secret-storage-class/secret-storage-class';
import { TSwarmMessageBodyRaw } from '../../swarm-message-constructor.types';

export class SwarmMessageEncryptedCache implements ISwarmMessgaeEncryptedCache {
  protected options?: ISwarmMessgaeEncryptedCacheOptions = undefined;

  protected storageProvider?: ISecretStorage = undefined;

  public isRunning: boolean = false;

  public async connect(options: ISwarmMessgaeEncryptedCacheOptions) {
    this.setOptions(options);
    await this.runStorageConnection();
    this.setIsRunning();
  }

  public add = async (sig: string, message?: TSwarmMessageBodyRaw) => {
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

  public isValid = async (sig: string) => {
    const result = await this.readValue(sig);

    if (result === null || typeof result === 'string') {
      return true;
    }
  };

  public unset = async (sig: string) => {
    this.checkIsActive();

    const resutl = await this.storageProvider!.unset(sig);

    if (resutl instanceof Error) {
      throw resutl;
    }
  };

  protected setOptions(options: ISwarmMessgaeEncryptedCacheOptions) {
    assert(options, 'Options must be provided');
    assert(typeof options === 'object', 'Options must be an object');
    if (options.storageProvider) {
      assert(
        typeof options.storageProvider === 'object',
        'Storage provider must be an object'
      );
      assert(
        typeof options.storageProvider.connect === 'function' &&
          typeof options.storageProvider.get === 'function' &&
          typeof options.storageProvider.get === 'function',
        'Storage provider provided is not valid'
      );
    } else {
      assert(
        options.storageProviderOptions,
        'Options for connection to the storage provider must be provided'
      );
    }

    this.options = options;
  }

  protected setStorageProvider(provider: ISecretStorage) {
    this.storageProvider = provider;
  }

  protected async runStorageConnection() {
    const { options } = this;

    if (options?.storageProvider) {
      this.setStorageProvider(options?.storageProvider);
      return;
    }

    const storageProvider = new SecretStorage();

    await storageProvider.connect(options?.storageProviderOptions);
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
