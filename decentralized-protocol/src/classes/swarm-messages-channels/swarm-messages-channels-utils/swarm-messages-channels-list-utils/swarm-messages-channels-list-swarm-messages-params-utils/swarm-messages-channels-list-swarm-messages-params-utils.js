export function getChannelsListDatabaseKeyForChannelDescription(channelDescription) {
    return channelDescription.id;
}
export function getSwarmMessagesChannelIdByChannelsListDatabaseKey(keyForChannelDescriptionInDatabase) {
    return keyForChannelDescriptionInDatabase;
}
export function getSwarmMessageWithChannelDescriptionTypeByChannelListDescription(channelsListDescription) {
    const { version } = channelsListDescription;
    return `${version}`;
}
export function getSwarmMessageWithChannelDescriptionIssuerByChannelListDescription(channelsListDescription) {
    return channelsListDescription.id;
}
export function getSwarmMessagesListDatbaseNameByChannelDescription(swarmMessagesListDescription) {
    return swarmMessagesListDescription.id;
}
//# sourceMappingURL=swarm-messages-channels-list-swarm-messages-params-utils.js.map