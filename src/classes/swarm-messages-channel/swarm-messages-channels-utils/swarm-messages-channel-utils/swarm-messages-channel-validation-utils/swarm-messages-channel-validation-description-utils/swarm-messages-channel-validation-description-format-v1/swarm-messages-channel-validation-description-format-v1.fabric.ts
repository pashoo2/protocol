import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions } from '../../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesChannelValidationContext } from '../../../../../types/swarm-messages-channel-validation.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../../types/swarm-messages-channel.types';
import { JSONSchema7 } from 'json-schema';
import {
  createValidatorOfChannelDescriptionObjectStructureByJsonSchema,
  validateUsersList,
} from './swarm-messages-channel-validation-description-format-v1.utils';
import { swarmMessagesChannelValidationDescriptionFormatV1 } from './swarm-messages-channel-validation-description-format-v1';

export function createSwarmMessagesChannelValidationDescriptionFormatV1ByChannelDescriptionJSONSchema<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, any>,
  SMCVCTX extends ISwarmMessagesChannelValidationContext
>(channelDescriptionJSONSchema: JSONSchema7) {
  const jsonSchemaValidator = createValidatorOfChannelDescriptionObjectStructureByJsonSchema(channelDescriptionJSONSchema);
  const additionalParams = {
    validateUsersList,
    validateChannelDescriptionObjectStructure: jsonSchemaValidator,
  };
  return function (
    this: SMCVCTX,
    swarmMessagesChannelDescriptionRawV1Format: ISwarmMessageChannelDescriptionRaw<P, T, any, DBO>
  ): Promise<boolean> {
    return swarmMessagesChannelValidationDescriptionFormatV1.call(
      this,
      swarmMessagesChannelDescriptionRawV1Format,
      additionalParams
    );
  };
}
