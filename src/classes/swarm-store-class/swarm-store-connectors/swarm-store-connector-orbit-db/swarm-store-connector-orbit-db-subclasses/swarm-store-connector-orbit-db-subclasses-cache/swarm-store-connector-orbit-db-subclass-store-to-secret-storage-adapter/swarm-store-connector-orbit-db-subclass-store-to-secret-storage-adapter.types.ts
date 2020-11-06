import { IStorageProviderOptions } from '../../../../../../storage-providers/storage-providers.types';

export interface ISwarmStoreConnectorOrbitDbSubclassStoreToSecretStorageAdapterConstructorOptions extends IStorageProviderOptions {
  dbName: Required<IStorageProviderOptions['dbName']>;
}
