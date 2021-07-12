import { createSwarmMessagesChannelValidationDescriptionFormatV1ByChannelDescriptionJSONSchema } from '../../../../../swarm-messages-channels-utils/swarm-messages-channel-utils/swarm-messages-channel-validation-utils/swarm-messages-channel-validation-description-utils/swarm-messages-channel-validation-description-format-v1/swarm-messages-channel-validation-description-format-v1.fabric';
import { getChannelsListDatabaseKeyForChannelDescription, getSwarmMessagesListDatbaseNameByChannelDescription, getSwarmMessageWithChannelDescriptionIssuerByChannelListDescription, getSwarmMessageWithChannelDescriptionTypeByChannelListDescription, } from '../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-swarm-messages-params-utils/swarm-messages-channels-list-swarm-messages-params-utils';
import swarmMessageChannelDescriptionFormatSchema from "../../../../../const/validation/swarm-messages-channel/swarm-messages-channel-description/schemas/swarm-message-channel-description-v1-format-schema.json";
import jsonSchemaForChannelsListDescriptionV1 from "../../../../../const/swarm-messages-channels-list/swarm-messages-channels-list-description/schemas/swarm-messages-channels-list-description-v1-format-schema.json";
import { validatorOfSwrmMessageWithChannelDescription } from "../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-validators/swarm-messages-channels-list-swarm-messages-validator-v1/index";
import { getSwarmMessagesChannelDescriptionFormatValidatorISwarmMessagesChannelDescriptionFormatValidator } from '../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-validators/swarm-messages-channels-list-description-validator-v1/swarm-messages-channels-list-description-validator-v1';
import { getValidatorSwarmChannelsListDatabaseOptions } from '../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-validators/swarm-messages-channels-list-dbo-validator-v1/swarm-messages-channels-list-dbo-validator-v1';
import { validateGrantAccessCallback } from '../../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-grant-access-callback';
import { getSwarmMessagesChannelIdByChannelsListDatabaseKey } from '../../../../../swarm-messages-channels-utils/swarm-messages-channels-list-utils/swarm-messages-channels-list-swarm-messages-params-utils/swarm-messages-channels-list-swarm-messages-params-utils';
import { swarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheInstanceFabric } from '../../../../../swarm-messages-channels-subclasses/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.fabric';
export function getSwarmMessagesChannelsListVersionOneConstructorOptionsDefault(optionsPartial) {
    const utilsDefault = {
        databaseNameGenerator: getSwarmMessagesListDatbaseNameByChannelDescription,
        getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription: getSwarmMessageWithChannelDescriptionIssuerByChannelListDescription,
        getTypeForSwarmMessageWithChannelDescriptionByChannelDescription: getSwarmMessageWithChannelDescriptionTypeByChannelListDescription,
        getDatabaseKeyForChannelDescription: getChannelsListDatabaseKeyForChannelDescription,
        getChannelIdByDatabaseKey: getSwarmMessagesChannelIdByChannelsListDatabaseKey,
        getSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache: swarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheInstanceFabric,
    };
    const swarmMessagesChannelDescriptionFormatValidator = createSwarmMessagesChannelValidationDescriptionFormatV1ByChannelDescriptionJSONSchema(swarmMessageChannelDescriptionFormatSchema);
    const validatorsDefault = {
        swarmMessagesChannelDescriptionFormatValidator: swarmMessagesChannelDescriptionFormatValidator,
        channelDescriptionSwarmMessageValidator: validatorOfSwrmMessageWithChannelDescription,
        channelsListDescriptionValidator: getSwarmMessagesChannelDescriptionFormatValidatorISwarmMessagesChannelDescriptionFormatValidator(jsonSchemaForChannelsListDescriptionV1),
        swamChannelsListDatabaseOptionsValidator: getValidatorSwarmChannelsListDatabaseOptions(validateGrantAccessCallback),
    };
    const options = Object.assign(Object.assign({}, optionsPartial), { validators: Object.assign(Object.assign({}, validatorsDefault), optionsPartial.validators), utilities: Object.assign(Object.assign(Object.assign({}, utilsDefault), optionsPartial.utilities), { databaseConnectionFabric: optionsPartial.databaseConnectionFabric }) });
    return options;
}
//# sourceMappingURL=swarm-messages-channels-list-v1-constructor-arguments-fabric.js.map