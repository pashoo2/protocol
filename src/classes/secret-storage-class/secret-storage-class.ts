import {
  TInstanceofStorageProvider,
  TSecretStoreConfiguration,
  TStorageProvider,
  IStorageProvider,
} from './secret-storage-class.types';
import {
  SECRET_STORAGE_PROVIDERS,
  SECRET_STORAGE_PROVIDERS_NAME,
  SECRET_STORAGE_PROVIDERS_NAMES,
} from './secret-storage-class.const';
import { ownValueOf, ownKeyOf } from 'types/helper.types';

class SecretStorage {
  private storageProvider?: TInstanceofStorageProvider;

  private storageProviderName?: ownValueOf<
    typeof SECRET_STORAGE_PROVIDERS_NAME
  >;

  private configuration?: TSecretStoreConfiguration;

  constructor(configuration: TSecretStoreConfiguration) {
    this.configuration = configuration;
    this.runStorageProvider();
  }

  private setStorageProviderName(storageProviderName: string): boolean {
    if (SECRET_STORAGE_PROVIDERS_NAMES.includes(storageProviderName)) {
      this.storageProviderName = storageProviderName;
      return true;
    }
    return false;
  }

  private createInstanceOfStorageProvider(
    StorageProviderConstructor: IStorageProvider
  ): TInstanceofStorageProvider {
    return new StorageProviderConstructor();
  }

  private runStorageProvider() {
    const { configuration } = this;

    if (configuration) {
      const { storageProviderName } = configuration;

      if (
        storageProviderName &&
        this.setStorageProviderName(storageProviderName)
      ) {
        const storageProviderConstructor =
          SECRET_STORAGE_PROVIDERS[storageProviderName];

        if (storageProviderConstructor) {
          const storageProviger = this.createInstanceOfStorageProvider(
            storageProviderConstructor
          );

          this.storageProvider = storageProviger;
        }
      }
    }
    throw new Error('There is no storage provider was defined');
  }
}
