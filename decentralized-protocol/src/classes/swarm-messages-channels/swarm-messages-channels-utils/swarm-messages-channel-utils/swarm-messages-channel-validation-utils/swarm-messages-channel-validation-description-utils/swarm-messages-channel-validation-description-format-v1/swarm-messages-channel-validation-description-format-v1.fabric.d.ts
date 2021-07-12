import { JSONSchema7 } from 'json-schema';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions } from '../../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesChannelDescriptionFormatValidator } from '../../../../../types/swarm-messages-channels-validation.types';
export declare function createSwarmMessagesChannelValidationDescriptionFormatV1ByChannelDescriptionJSONSchema<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DBO extends TSwarmStoreDatabaseOptions<P, T, any>>(channelDescriptionJSONSchema: JSONSchema7): ISwarmMessagesChannelDescriptionFormatValidator<P, T, any, DBO>;
//# sourceMappingURL=swarm-messages-channel-validation-description-format-v1.fabric.d.ts.map