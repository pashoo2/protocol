import { SWARM_MESSAGES_CHANNEL_V1_GENERATE_NEW_PUBLIC_KEY_VALUE_CHANNEL_DESCRIPTION_STUB } from './swarm-messages-channel-v1-generate-new-channel-description.const';
import { TSwarmStoreDatabaseOptions } from "../../../../../../swarm-store-class";
import { ESwarmStoreConnector } from "../../../../../../swarm-store-class/swarm-store-class.const";
import { TSwarmMessageSerialized } from "../../../../../../swarm-message/swarm-message-constructor.types";
import { ISwarmMessageChannelDescriptionRaw } from "../../../../../types/swarm-messages-channel-instance.types";
import { extend, generateUUID } from "../../../../../../../utils";
export function swarmMessagesChannelV1GenerateNewSwarmChannelDescription(channelDescriptionPartial) {
    return extend(Object.assign(Object.assign({}, SWARM_MESSAGES_CHANNEL_V1_GENERATE_NEW_PUBLIC_KEY_VALUE_CHANNEL_DESCRIPTION_STUB), { id: generateUUID(), name: 'New channel', description: 'New channel description' }), channelDescriptionPartial);
}
//# sourceMappingURL=swarm-messages-channel-v1-generate-new-channel-description.js.map