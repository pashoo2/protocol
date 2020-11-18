import { createConnectrionBridgeConnection } from '../../classes/connection-bridge/connection-bridge-fabric/connection-bridge-fabric';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../classes/swarm-store-class/swarm-store-class.types';
import {
  TConnectionBridgeOptionsAuthCredentials,
  IConnectionBridgeOptionsDefault,
} from '../../classes/connection-bridge/connection-bridge.types';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';

export const connectToSwarmUtil = async <
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  CD extends boolean = false
>(
  options: IConnectionBridgeOptionsDefault<P, T, DbType, CD>,
  credentials: TConnectionBridgeOptionsAuthCredentials
) => {
  const optionsWithCredentials = {
    ...options,
    auth: {
      ...options.auth,
      credentials,
    },
  } as IConnectionBridgeOptionsDefault<P, T, DbType, true>;
  return createConnectrionBridgeConnection<P, T, DbType, true>(optionsWithCredentials, true);
};
