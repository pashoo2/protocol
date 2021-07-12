import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../../../../const/swarm-messages-channels-main.const';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
export function getOptionsForChannelsListHandlerByContstructorOptions(swarmMessagesChannelconstructorOptions) {
    const { currentUserId, swarmMessagesChannelsListInstance, swarmMessagesChannelDescription } = swarmMessagesChannelconstructorOptions;
    return {
        currentUserId,
        chanelsListInstance: swarmMessagesChannelsListInstance,
        channelDescription: swarmMessagesChannelDescription,
    };
}
export function getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType(channelEncryptionType) {
    switch (channelEncryptionType) {
        case SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD:
            return 'pwd';
        case SWARM_MESSAGES_CHANNEL_ENCRYPTION.PRIVATE:
            return 'pri';
        case SWARM_MESSAGES_CHANNEL_ENCRYPTION.PUBLIC:
            return 'pub';
        default:
            throw new Error(`An unknown swarm messages channel encryption type: ${channelEncryptionType}`);
    }
}
export function getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType(channelDatabaseType) {
    switch (channelDatabaseType) {
        case ESwarmStoreConnectorOrbitDbDatabaseType.FEED:
            return 'fd';
        case ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE:
            return 'kv';
        default:
            throw new Error(`An unknown swarm messages channel database type: ${channelDatabaseType}`);
    }
}
//# sourceMappingURL=swarm-messages-channel-v1-class-common.utils.js.map