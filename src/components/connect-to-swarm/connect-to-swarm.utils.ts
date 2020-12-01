import { createConnectrionBridgeConnection } from '../../classes/connection-bridge/connection-bridge-fabric/connection-bridge-fabric';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../classes/swarm-store-class/swarm-store-class.types';
import {
  TConnectionBridgeOptionsAuthCredentials,
  IConnectionBridgeOptionsDefault,
} from '../../classes/connection-bridge/connection-bridge.types';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import {
  TConnectionBridgeOptionsConnectorMain,
  TConnectionBridgeOptionsConnectorFabricOptions,
  TConnectionBridgeOptionsSwarmMessageStoreOptionsWithConnectorFabric,
  TConnectionBridgeOptionsSwarmMessageStoreInstance,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';
import {
  TConnectionBridgeOptionsConnectorConnectionOptions,
  TConnectionBridgeOptionsProviderOptions,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';
import {
  TConnectionBridgeOptionsConnectorBasic,
  TConnectionBridgeOptionsConnectorBasicFabric,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';
import {
  TConnectionBridgeOptionsGrandAccessCallback,
  TConnectionBridgeOptionsAccessControlOptions,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';
import {
  TConnectionBridgeOptionsDatabaseOptions,
  TConnectionBridgeOptionsSwarmMessageInstance,
  TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';

export async function connectToSwarmUtil<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  CD extends boolean = false
>(options: IConnectionBridgeOptionsDefault<P, T, DbType, CD>, credentials: TConnectionBridgeOptionsAuthCredentials) {
  const optionsWithCredentials = {
    ...options,
    auth: {
      ...options.auth,
      credentials,
    },
  };
  type CBO = typeof optionsWithCredentials;
  const connectionBridgeInstance = await createConnectrionBridgeConnection<
    P,
    T,
    DbType,
    true,
    TConnectionBridgeOptionsDatabaseOptions<CBO>,
    TConnectionBridgeOptionsSwarmMessageInstance<CBO>,
    TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric<CBO>,
    TConnectionBridgeOptionsGrandAccessCallback<CBO>,
    TConnectionBridgeOptionsAccessControlOptions<CBO>,
    TConnectionBridgeOptionsConnectorBasic<CBO>,
    TConnectionBridgeOptionsConnectorBasicFabric<CBO>,
    TConnectionBridgeOptionsConnectorConnectionOptions<CBO>,
    TConnectionBridgeOptionsProviderOptions<CBO>,
    TConnectionBridgeOptionsConnectorMain<CBO>,
    TConnectionBridgeOptionsConnectorFabricOptions<CBO>,
    TConnectionBridgeOptionsSwarmMessageStoreOptionsWithConnectorFabric<CBO>,
    TConnectionBridgeOptionsSwarmMessageStoreInstance<CBO>
  >(optionsWithCredentials, true);

  return connectionBridgeInstance;
}
