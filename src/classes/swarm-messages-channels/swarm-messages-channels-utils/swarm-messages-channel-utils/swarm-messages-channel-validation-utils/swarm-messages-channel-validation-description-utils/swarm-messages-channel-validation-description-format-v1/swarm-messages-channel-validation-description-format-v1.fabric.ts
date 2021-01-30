import { JSONSchema7 } from 'json-schema';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions } from '../../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../../types/swarm-messages-channel.types';
import { swarmMessagesChannelValidationDescriptionFormatV1 } from './swarm-messages-channel-validation-description-format-v1';
import { ISwarmMessagesChannelDescriptionFormatValidator } from '../../../../../types/swarm-messages-channels-validation.types';

export function createSwarmMessagesChannelValidationDescriptionFormatV1ByChannelDescriptionJSONSchema<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, any>
>(channelDescriptionJSONSchema: JSONSchema7): ISwarmMessagesChannelDescriptionFormatValidator<P, T, any, DBO> {
  return async (
    swarmMessagesChannelDescriptionRawV1Format: ISwarmMessageChannelDescriptionRaw<P, T, any, DBO>,
    jsonSchemaValidator: (jsonSchema: JSONSchema7, channelDescription: any) => Promise<void>
  ) => {
    await jsonSchemaValidator(channelDescriptionJSONSchema, swarmMessagesChannelDescriptionRawV1Format);
    swarmMessagesChannelValidationDescriptionFormatV1<P, T, DBO>(swarmMessagesChannelDescriptionRawV1Format);
  };
}
