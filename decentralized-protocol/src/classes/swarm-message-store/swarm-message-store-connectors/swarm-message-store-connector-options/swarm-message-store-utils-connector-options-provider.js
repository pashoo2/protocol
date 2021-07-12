import { __awaiter } from "tslib";
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ipfsUtilsConnectBasic } from '../../../../utils/ipfs-utils/ipfs-utils';
function swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB(options, extendWithAccessControlOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const ipfsConnection = options.providerConnectionOptions && options.providerConnectionOptions.ipfs
            ? options.providerConnectionOptions.ipfs
            : yield ipfsUtilsConnectBasic();
        const databases = options.databases.map(extendWithAccessControlOptions);
        return Object.assign(Object.assign({}, options), { providerConnectionOptions: Object.assign(Object.assign({}, options.providerConnectionOptions), { ipfs: ipfsConnection }), databases });
    });
}
export function swarmMessageStoreUtilsConnectorOptionsProvider(options, extendWithAccessControlOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const { provider } = options;
        switch (provider) {
            case ESwarmStoreConnector.OrbitDB:
                return (yield swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB(options, extendWithAccessControlOptions));
            default:
                throw new Error(`Failed to transform options cause the provider "${provider}" is unknown`);
        }
    });
}
//# sourceMappingURL=swarm-message-store-utils-connector-options-provider.js.map