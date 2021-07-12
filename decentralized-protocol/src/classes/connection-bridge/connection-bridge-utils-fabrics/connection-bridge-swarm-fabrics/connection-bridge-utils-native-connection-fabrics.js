import { __awaiter } from "tslib";
import { ESwarmStoreConnector } from '../../../swarm-store-class';
import { ipfsUtilsConnectBasic } from '../../../../utils/ipfs-utils';
export const createNativeConnectionForOrbitDB = (nativeConnectionOptions) => {
    return ipfsUtilsConnectBasic(nativeConnectionOptions);
};
export const createNativeConnection = (swarmStoreConnectorType, nativeConnectionOptions) => __awaiter(void 0, void 0, void 0, function* () {
    switch (swarmStoreConnectorType) {
        case ESwarmStoreConnector.OrbitDB:
            return (yield createNativeConnectionForOrbitDB(nativeConnectionOptions));
        default:
            throw new Error('Unsupported swarm connector type');
    }
});
//# sourceMappingURL=connection-bridge-utils-native-connection-fabrics.js.map