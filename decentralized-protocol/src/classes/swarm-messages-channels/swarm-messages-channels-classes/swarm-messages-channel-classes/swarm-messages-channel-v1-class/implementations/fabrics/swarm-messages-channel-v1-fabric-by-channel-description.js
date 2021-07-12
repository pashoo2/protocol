import { __awaiter } from "tslib";
import { ISwarmMessagesChannelFabricByChannelDescription } from "../../../../../types/swarm-messages-channel-instance.fabrics.types";
import { getSwarmMessagesChannelV1InstanveWithDefaults } from "./swarm-messages-channel-v1-fabric-async-default";
export function getSwarmMessagesChannelFabricByChannelDescriptionFabric(options) {
    function swarmMessagesChannelFabricByChannelDescription(swarmMessagesChannelDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultFabricOptionsExtendedBySwarmChannelDescription = Object.assign(Object.assign({}, options), { channelConstructorMainOptions: Object.assign(Object.assign({}, options.channelConstructorMainOptions), { swarmMessagesChannelDescription }) });
            return yield getSwarmMessagesChannelV1InstanveWithDefaults(defaultFabricOptionsExtendedBySwarmChannelDescription);
        });
    }
    return swarmMessagesChannelFabricByChannelDescription;
}
//# sourceMappingURL=swarm-messages-channel-v1-fabric-by-channel-description.js.map