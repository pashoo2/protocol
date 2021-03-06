import { JSONSchema7 } from 'json-schema';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';
import { createSwarmMessagesChannelValidationDescriptionFormatV1ByChannelDescriptionJSONSchema } from '../../../../../swarm-messages-channels-utils/swarm-messages-channel-utils/swarm-messages-channel-validation-utils/swarm-messages-channel-validation-description-utils/swarm-messages-channel-validation-description-format-v1/swarm-messages-channel-validation-description-format-v1.fabric';
import {
  getChannelsListDatabaseKeyForChannelDescription,
  getSwarmMessagesListDatbaseNameByChannelDescription,
  getSwarmMessageWithChannelDescriptionIssuerByChannelListDescription,
  getSwarmMessageWithChannelDescriptionTypeByChannelListDescription,
} from '../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-swarm-messages-params-utils/swarm-messages-channels-list-swarm-messages-params-utils';
import {
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
  TSwarmMessagesChannelsListDBOWithGrantAccess,
} from '../../../../../types/swarm-messages-channels-list-instance.types';
import swarmMessageChannelDescriptionFormatSchema from 'classes/swarm-messages-channels/const/validation/swarm-messages-channel/swarm-messages-channel-description/schemas/swarm-message-channel-description-v1-format-schema.json';
import jsonSchemaForChannelsListDescriptionV1 from 'classes/swarm-messages-channels/const/swarm-messages-channels-list/swarm-messages-channels-list-description/schemas/swarm-messages-channels-list-description-v1-format-schema.json';
import { validatorOfSwrmMessageWithChannelDescription } from 'classes/swarm-messages-channels/swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-validators/swarm-messages-channels-list-swarm-messages-validator-v1/index';
import { getSwarmMessagesChannelDescriptionFormatValidatorISwarmMessagesChannelDescriptionFormatValidator } from '../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-validators/swarm-messages-channels-list-description-validator-v1/swarm-messages-channels-list-description-validator-v1';
import { getValidatorSwarmChannelsListDatabaseOptions } from '../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-validators/swarm-messages-channels-list-dbo-validator-v1/swarm-messages-channels-list-dbo-validator-v1';
import { validateGrantAccessCallback } from '../../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-grant-access-callback';
import { ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric } from '../../../../../types/swarm-messages-channels-list-instance.types';
import { getSwarmMessagesChannelIdByChannelsListDatabaseKey } from '../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-swarm-messages-params-utils/swarm-messages-channels-list-swarm-messages-params-utils';
import { swarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheInstanceFabric } from '../../../../../swarm-messages-channels-subclasses/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.fabric';

export function getSwarmMessagesChannelsListVersionOneConstructorOptionsDefault<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>,
  OFCAF extends Pick<
    ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>,
    'description' | 'connectionOptions'
  > & {
    utilities: {
      serializer: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['utilities']['serializer'];
    };
    validators: {
      jsonSchemaValidator: ISwarmMessagesChannelsDescriptionsListConstructorArguments<
        P,
        T,
        MD,
        CTX,
        DBO,
        CF
      >['validators']['jsonSchemaValidator'];
    };
  }
>(
  optionsPartial: OFCAF &
    Pick<
      ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['utilities'],
      'databaseConnectionFabric'
    >
): ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF> {
  const utilsDefault: Omit<
    ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['utilities'],
    'databaseConnectionFabric' | 'serializer'
  > = {
    databaseNameGenerator: getSwarmMessagesListDatbaseNameByChannelDescription,
    getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription:
      getSwarmMessageWithChannelDescriptionIssuerByChannelListDescription,
    getTypeForSwarmMessageWithChannelDescriptionByChannelDescription:
      getSwarmMessageWithChannelDescriptionTypeByChannelListDescription,
    getDatabaseKeyForChannelDescription: getChannelsListDatabaseKeyForChannelDescription,
    getChannelIdByDatabaseKey: getSwarmMessagesChannelIdByChannelsListDatabaseKey,
    getSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache:
      swarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheInstanceFabric,
  };
  const swarmMessagesChannelDescriptionFormatValidator =
    createSwarmMessagesChannelValidationDescriptionFormatV1ByChannelDescriptionJSONSchema(
      swarmMessageChannelDescriptionFormatSchema as JSONSchema7
    );
  const validatorsDefault = {
    swarmMessagesChannelDescriptionFormatValidator: swarmMessagesChannelDescriptionFormatValidator,
    channelDescriptionSwarmMessageValidator: validatorOfSwrmMessageWithChannelDescription,
    channelsListDescriptionValidator:
      getSwarmMessagesChannelDescriptionFormatValidatorISwarmMessagesChannelDescriptionFormatValidator(
        jsonSchemaForChannelsListDescriptionV1 as JSONSchema7
      ),
    swamChannelsListDatabaseOptionsValidator: getValidatorSwarmChannelsListDatabaseOptions(validateGrantAccessCallback),
  };
  const options = {
    ...optionsPartial,
    validators: {
      ...validatorsDefault,
      ...optionsPartial.validators,
    },
    utilities: {
      ...utilsDefault,
      ...optionsPartial.utilities,
      databaseConnectionFabric: optionsPartial.databaseConnectionFabric,
    },
  };
  return options;
}
