import { validateVerboseBySchema } from '../../../../../../utils/validation-utils/validation-utils';
export function getSwarmMessagesChannelDescriptionFormatValidatorISwarmMessagesChannelDescriptionFormatValidator(jsonSchemaForChannelsListDescriptionV1) {
    function validateSwarmChannelsListDescriptionV1(swarmChannelsListDescription) {
        const validationErrors = validateVerboseBySchema(jsonSchemaForChannelsListDescriptionV1, swarmChannelsListDescription);
        if (validationErrors) {
            throw validationErrors;
        }
    }
    return validateSwarmChannelsListDescriptionV1;
}
//# sourceMappingURL=swarm-messages-channels-list-description-validator-v1.js.map