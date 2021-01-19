import { JSONSchema7 } from 'json-schema';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions } from '../../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../../types/swarm-messages-channel.types';
import { createValidatorOfChannelDescriptionObjectStructureByJsonSchema } from '../swarm-messages-channel-validation-utils-common/swarm-messages-channel-validation-utils-common';
import { swarmMessagesChannelValidationDescriptionFormatV1 } from './swarm-messages-channel-validation-description-format-v1';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export function createSwarmMessagesChannelValidationDescriptionFormatV1ByChannelDescriptionJSONSchema<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, any>,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext
>(
  channelDescriptionJSONSchema: JSONSchema7,
  validatorUserList: (usersIdsList: string[], isValidUserId: (userId: string) => Promise<boolean>) => Promise<void>
): (this: CTX, swarmMessagesChannelDescriptionRawV1Format: ISwarmMessageChannelDescriptionRaw<P, T, any, DBO>) => Promise<void> {
  const jsonSchemaValidator = createValidatorOfChannelDescriptionObjectStructureByJsonSchema(channelDescriptionJSONSchema);
  const externalUtilsForSwarmMessagesChannelValidationDescriptionValidator = {
    validateUsersList: validatorUserList,
    validateChannelDescriptionObjectStructure: jsonSchemaValidator,
  };
  return function (
    this: CTX,
    swarmMessagesChannelDescriptionRawV1Format: ISwarmMessageChannelDescriptionRaw<P, T, any, DBO>
  ): Promise<void> {
    return swarmMessagesChannelValidationDescriptionFormatV1.call(
      this,
      swarmMessagesChannelDescriptionRawV1Format,
      externalUtilsForSwarmMessagesChannelValidationDescriptionValidator
    );
  };
}
