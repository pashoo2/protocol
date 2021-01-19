import { ISwarmMessagesChannelsListDescription } from '../../../../types/swarm-messages-channels-list.types';
import { validateVerboseBySchema } from '../../../../../../utils/validation-utils/validation-utils';
import { IValidatorOfSwarmMessagesChannelsListDescription } from '../../../../types/swarm-messages-channels-validation.types';
import { JSONSchema7 } from 'json-schema';

export function getSwarmMessagesChannelDescriptionFormatValidatorISwarmMessagesChannelDescriptionFormatValidator(
  jsonSchemaForChannelsListDescriptionV1: JSONSchema7
) {
  function validateSwarmChannelsListDescriptionV1(swarmChannelsListDescription: ISwarmMessagesChannelsListDescription): void {
    const validationErrors = validateVerboseBySchema(jsonSchemaForChannelsListDescriptionV1, swarmChannelsListDescription);
    if (validationErrors) {
      throw validationErrors;
    }
  }
  return validateSwarmChannelsListDescriptionV1 as IValidatorOfSwarmMessagesChannelsListDescription;
}
