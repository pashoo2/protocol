import { TNativeConnectionOptions, TNativeConnectionType } from '../../connection-bridge.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class';
import { ipfsUtilsConnectBasic } from '../../../../utils/ipfs-utils';

export const createNativeConnectionForOrbitDB = (
  nativeConnectionOptions: TNativeConnectionOptions<ESwarmStoreConnector.OrbitDB>
): Promise<TNativeConnectionType<ESwarmStoreConnector.OrbitDB>> => {
  return ipfsUtilsConnectBasic(nativeConnectionOptions);
};
export const createNativeConnection = async <P extends ESwarmStoreConnector>(
  swarmStoreConnectorType: P,
  nativeConnectionOptions: TNativeConnectionOptions<P>
): Promise<TNativeConnectionType<P>> => {
  switch (swarmStoreConnectorType) {
    case ESwarmStoreConnector.OrbitDB:
      return (await createNativeConnectionForOrbitDB(nativeConnectionOptions)) as TNativeConnectionType<P>;
    default:
      throw new Error('Unsupported swarm connector type');
  }
};
