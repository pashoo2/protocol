import { ESwarmStoreConnector } from '../../../classes/swarm-store-class/swarm-store-class.const';
import {
  TConnectionBridgeOptionsAuthCredentials,
  IConnectionBridgeOptions,
} from '../../../classes/connection-bridge/types/connection-bridge.types';
import { TSwarmMessageSerialized } from '../../../classes/swarm-message/swarm-message-constructor.types';
import { createConnectionBridgeConnectionWithDBOClassByOptions } from '../../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-class-fabrics/connection-bridge-with-dbo-class/connection-bridge-with-dbo-class-fabric';
import { CONNECTION_BRIDGE_WITH_DBO_CLASS_STORAGE_SPECIFIC_OPTIONS } from '../../const/connect-to-swarm-connection-bridge-options.const';
// import { IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountOptions } from '../../../classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-class-fabrics/connection-bridge-with-dbo-class/connection-bridge-with-dbo-class-fabric.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../classes/swarm-store-class/swarm-store-class.types';
import { ISerializer } from '../../../types/serialization.types';

export async function connectToSwarmWithDBOUtil<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  SRLZR extends ISerializer
>(
  options: IConnectionBridgeOptions<
    P,
    T,
    DbType,
    DBO,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    SRLZR
  >,
  credentials: TConnectionBridgeOptionsAuthCredentials
) {
  const storageOptions = {
    ...options.storage,
    ...CONNECTION_BRIDGE_WITH_DBO_CLASS_STORAGE_SPECIFIC_OPTIONS,
  };
  const optionsResulted = {
    ...options,
    storage: storageOptions,
  } as any;
  const connectionBridgeInstance = await createConnectionBridgeConnectionWithDBOClassByOptions(
    optionsResulted,
    credentials,
    true
  );

  return connectionBridgeInstance;
}
