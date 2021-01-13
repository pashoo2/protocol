import { ISwarmMessagesChannelsListDescription } from '../../../../types/swarm-messages-channels-list.types';
import { validateVerboseBySchema } from '../../../../../../utils/validation-utils/validation-utils';
import jsonSchemaForChannelsListDescriptionV1 from '../../../../const/swarm-messages-channels-list/swarm-messages-channels-list-description/schemas/swarm-messages-channels-list-description-v1-format-schema.json';
import { IValidatorOfSwarmMessagesChannelsListDescription } from '../../../../types/swarm-messages-channels-validation.types';

export function validateSwarmChannelsListDescriptionV1(
  swarmChannelsListDescription: ISwarmMessagesChannelsListDescription
): void {
  const validationErrors = validateVerboseBySchema(jsonSchemaForChannelsListDescriptionV1, swarmChannelsListDescription);
  if (validationErrors) {
    throw validationErrors;
  }
}

export function getSwarmMessagesChannelDescriptionFormatValidatorISwarmMessagesChannelDescriptionFormatValidator() {
  return validateSwarmChannelsListDescriptionV1 as IValidatorOfSwarmMessagesChannelsListDescription;
}
