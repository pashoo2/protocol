import { __awaiter } from "tslib";
import { swarmMessagesChannelValidationDescriptionFormatV1 } from './swarm-messages-channel-validation-description-format-v1';
export function createSwarmMessagesChannelValidationDescriptionFormatV1ByChannelDescriptionJSONSchema(channelDescriptionJSONSchema) {
    return (swarmMessagesChannelDescriptionRawV1Format, jsonSchemaValidator) => __awaiter(this, void 0, void 0, function* () {
        yield jsonSchemaValidator(channelDescriptionJSONSchema, swarmMessagesChannelDescriptionRawV1Format);
        swarmMessagesChannelValidationDescriptionFormatV1(swarmMessagesChannelDescriptionRawV1Format);
    });
}
//# sourceMappingURL=swarm-messages-channel-validation-description-format-v1.fabric.js.map