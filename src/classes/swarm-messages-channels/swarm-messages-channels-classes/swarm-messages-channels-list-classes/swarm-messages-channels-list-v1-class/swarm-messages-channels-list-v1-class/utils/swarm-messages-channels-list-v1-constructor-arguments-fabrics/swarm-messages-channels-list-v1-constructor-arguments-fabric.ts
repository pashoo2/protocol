import { JSONSchema7 } from 'json-schema';
import { ESwarmStoreConnector } from '../../../../../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
} from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { createSwarmMessagesChannelValidationDescriptionFormatV1ByChannelDescriptionJSONSchema } from '../../../../../../swarm-messages-channels-utils/swarm-messages-channel-utils/swarm-messages-channel-validation-utils/swarm-messages-channel-validation-description-utils/swarm-messages-channel-validation-description-format-v1/swarm-messages-channel-validation-description-format-v1.fabric';
import {
  getChannelsListDatabaseKeyForChannelDescription,
  getSwarmMessagesListDatbaseNameByChannelDescription,
  getSwarmMessageWithChannelDescriptionIssuerByChannelListDescription,
  getSwarmMessageWithChannelDescriptionTypeByChannelListDescription,
} from '../../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-swarm-messages-params-utils/swarm-messages-channels-list-swarm-messages-params-utils';
import {
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
  TSwrmMessagesChannelsListDBOWithGrantAccess,
} from '../../../../../../types/swarm-messages-channels-list.types';
import swarmMessageChannelDescriptionFormatSchema from 'classes/swarm-messages-channels/const/swarm-messages-channel/swarm-messages-channel-description/schemas/swarm-message-channel-description-v1-format-schema.json';
import jsonSchemaForChannelsListDescriptionV1 from 'classes/swarm-messages-channels/const/swarm-messages-channels-list/swarm-messages-channels-list-description/schemas/swarm-messages-channels-list-description-v1-format-schema.json';
import { validateUsersList } from '../../../../../../swarm-messages-channels-utils/swarm-messages-channel-utils/swarm-messages-channel-validation-utils/swarm-messages-channel-validation-description-utils/swarm-messages-channel-validation-utils-common/swarm-messages-channel-validation-utils-common';
import { validatorOfSwrmMessageWithChannelDescription } from 'classes/swarm-messages-channels/swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-validators/swarm-messages-channels-list-swarm-messages-validator-v1';
import { getSwarmMessagesChannelDescriptionFormatValidatorISwarmMessagesChannelDescriptionFormatValidator } from '../../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-validators/swarm-messages-channels-list-description-validator-v1/swarm-messages-channels-list-description-validator-v1';
import { getValidatorSwarmChannelsListDatabaseOptions } from '../../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-validators/swarm-messages-channels-list-dbo-validator-v1/swarm-messages-channels-list-dbo-validator-v1';
import { validateGrantAccessCallback } from '../../../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-grant-access-callback';
import { ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric } from '../../../../../../types/swarm-messages-channels-list.types';

export function getSwarmMessagesChannelsListVersionOneConstructorOptionsDefault<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>
>(
  optionsPartial: Pick<
    ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>,
    'description' | 'serializer'
  > &
    Pick<
      ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>,
      'description' | 'serializer' | 'connectionOptions'
    > &
    Pick<
      ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['utilities'],
      'databaseConnectionFabric'
    >
): ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF> {
  const utilsDefault: Omit<
    ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['utilities'],
    'databaseConnectionFabric'
  > = {
    databaseNameGenerator: getSwarmMessagesListDatbaseNameByChannelDescription,
    getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription: getSwarmMessageWithChannelDescriptionIssuerByChannelListDescription,
    getTypeForSwarmMessageWithChannelDescriptionByChannelDescription: getSwarmMessageWithChannelDescriptionTypeByChannelListDescription,
    getDatabaseKeyForChannelDescription: getChannelsListDatabaseKeyForChannelDescription,
  };
  const swarmMessagesChannelDescriptionFormatValidator = createSwarmMessagesChannelValidationDescriptionFormatV1ByChannelDescriptionJSONSchema(
    swarmMessageChannelDescriptionFormatSchema as JSONSchema7,
    validateUsersList
  );
  const validatorsDefault: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['validators'] = {
    swarmMessagesChannelDescriptionFormatValidator: swarmMessagesChannelDescriptionFormatValidator,
    channelDescriptionSwarmMessageValidator: validatorOfSwrmMessageWithChannelDescription,
    channelsListDescriptionValidator: getSwarmMessagesChannelDescriptionFormatValidatorISwarmMessagesChannelDescriptionFormatValidator(
      jsonSchemaForChannelsListDescriptionV1 as JSONSchema7
    ),
    swamChannelsListDatabaseOptionsValidator: getValidatorSwarmChannelsListDatabaseOptions(validateGrantAccessCallback),
  };
  const options = {
    ...optionsPartial,
    validators: validatorsDefault,
    utilities: {
      ...utilsDefault,
      databaseConnectionFabric: optionsPartial.databaseConnectionFabric,
    },
  };
  return options;
}
