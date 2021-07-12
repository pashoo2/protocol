import { join } from 'path';
import { extend } from "../../../../../../../utils";
import { getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType, getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType, } from '../swarm-messages-channel-v1-class-common.utils';
import { SWARM_MESSAGES_CHANNEL_V1_CONSTRUCTOR_OPTIONS_DEFAULT_UTILS_DEFAULT_CONNECTION_UTILS } from './const/swarm-messages-channel-v1-constructor-options-default-utils.const';
export function getSwarmMessagesChannelV1DefaultConstructorOptionsUtils(options, defaultUtils) {
    const { getSwarmMessagesDatabaseConnectorInstanceDefaultFabric, getSwarmMessageIssuerByChannelDescriptionUtilityDefault, getDatabaseNameByChannelDescriptionUtilityDefault, } = extend(defaultUtils || {}, SWARM_MESSAGES_CHANNEL_V1_CONSTRUCTOR_OPTIONS_DEFAULT_UTILS_DEFAULT_CONNECTION_UTILS);
    const swarmMessagesDatabaseConnectedByDatabaseOptionsDefaultFabric = getSwarmMessagesDatabaseConnectorInstanceDefaultFabric(options);
    const getSwarmMessagesChannelMessagesIssuerByChannelDescription = getSwarmMessageIssuerByChannelDescriptionUtilityDefault(getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType, getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType, join);
    const getSwarmMessagesChannelDatabaseNameByChannelDescription = getDatabaseNameByChannelDescriptionUtilityDefault(getSwarmMessagesChannelMessagesIssuerByChannelDescription, join);
    return {
        getDatabaseNameByChannelDescription: getSwarmMessagesChannelDatabaseNameByChannelDescription,
        getSwarmMessageIssuerByChannelDescription: getSwarmMessagesChannelMessagesIssuerByChannelDescription,
        swarmMessagesDatabaseConnectorInstanceByDBOFabric: swarmMessagesDatabaseConnectedByDatabaseOptionsDefaultFabric,
    };
}
//# sourceMappingURL=swarm-messages-channel-v1-constructor-options-default-utils.js.map