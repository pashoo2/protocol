import { ESwarmStoreConnector } from '../../../classes/swarm-store-class/swarm-store-class.const';
import {
  TConnectionBridgeOptionsAuthCredentials,
  IConnectionBridgeOptions,
} from '../../../classes/connection-bridge/types/connection-bridge.types';
import { TSwarmMessageSerialized } from '../../../classes/swarm-message/swarm-message-constructor.types';
import { createConnectionBridgeConnectionWithDBOClassByOptions } from '../../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-class-fabrics/connection-bridge-with-dbo-class/connection-bridge-with-dbo-class-fabric';
import { CONNECTION_BRIDGE_WITH_DBO_CLASS_STORAGE_SPECIFIC_OPTIONS } from '../../const/connect-to-swarm-connection-bridge-options.const';
import { StorageProviderInMemory } from '../../../classes/storage-providers/storage-in-memory-provider/storage-in-memory-provider';
// import { IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountOptions } from '../../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-class-fabrics/connection-bridge-with-dbo-class/connection-bridge-with-dbo-class-fabric.types';

export async function connectToSwarmWithDBOUtil<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized>(
  options: IConnectionBridgeOptions<P, any, T, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>,
  credentials: TConnectionBridgeOptionsAuthCredentials
) {
  const storageOptions = {
    ...options.storage,
    ...CONNECTION_BRIDGE_WITH_DBO_CLASS_STORAGE_SPECIFIC_OPTIONS,
    cache: options.storage.cache ?? new StorageProviderInMemory(),
  };
  const optionsResulted = {
    ...options,
    storage: storageOptions,
  };
  const connectionBridgeInstance = await createConnectionBridgeConnectionWithDBOClassByOptions(
    optionsResulted,
    credentials,
    true
  );

  return connectionBridgeInstance;
}
