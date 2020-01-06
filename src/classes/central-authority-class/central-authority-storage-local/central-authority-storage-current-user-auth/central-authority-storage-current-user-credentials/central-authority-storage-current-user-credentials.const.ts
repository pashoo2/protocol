import { TSecretStoreConfiguration } from 'classes/secret-storage-class/secret-storage-class.types';
import { SECRET_STORAGE_PROVIDERS_NAME } from 'classes/secret-storage-class/secret-storage-class.const';

export const CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_PROVIDER =
  SECRET_STORAGE_PROVIDERS_NAME.LOCAL_FORAGE;

export const CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_PREFIX =
  '__CA_STORAGE_CURRENT_USER_CREDENTIALS_';

export const CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_CONFIGURATION: TSecretStoreConfiguration = {
  storageProviderName: CA_STORAGE_CURRENT_USER_CREDENTIALS_SECRET_STORAGE_PROVIDER,
};
