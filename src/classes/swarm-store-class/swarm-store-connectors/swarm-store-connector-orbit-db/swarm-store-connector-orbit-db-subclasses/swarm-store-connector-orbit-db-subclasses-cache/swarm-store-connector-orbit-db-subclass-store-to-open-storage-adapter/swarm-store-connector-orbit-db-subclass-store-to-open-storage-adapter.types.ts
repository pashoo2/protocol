import { IStorageProviderOptions } from '../../../../../../storage-providers/storage-providers.types';

export interface ISwarmStoreConnectorOrbitDBSubclassStoreToOpenStorageAdapterConstructorOptions
  extends IStorageProviderOptions {
  dbName: Required<IStorageProviderOptions['dbName']>;
}
