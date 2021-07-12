import { TNativeConnectionOptions, TNativeConnectionType } from '../../types/connection-bridge.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class';
export declare const createNativeConnectionForOrbitDB: (nativeConnectionOptions: TNativeConnectionOptions<ESwarmStoreConnector.OrbitDB>) => Promise<TNativeConnectionType<ESwarmStoreConnector.OrbitDB>>;
export declare const createNativeConnection: <P extends ESwarmStoreConnector>(swarmStoreConnectorType: P, nativeConnectionOptions: TNativeConnectionOptions<P>) => Promise<TNativeConnectionType<P>>;
//# sourceMappingURL=connection-bridge-utils-native-connection-fabrics.d.ts.map