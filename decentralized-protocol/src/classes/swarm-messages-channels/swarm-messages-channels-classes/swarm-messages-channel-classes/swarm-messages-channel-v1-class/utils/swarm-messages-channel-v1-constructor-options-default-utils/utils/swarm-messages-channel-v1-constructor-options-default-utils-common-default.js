export function getSwarmMessageIssuerByChannelDescriptionUtilityDefault(getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType, getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType, joinParts) {
    function getSwarmMessageIssuerByChannelDescription(channelDescription) {
        const { id, version, dbType, messageEncryption } = channelDescription;
        const encryptionTypeCode = getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType(messageEncryption);
        const databaseTypeCode = getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType(dbType);
        return joinParts('ch', id, version, databaseTypeCode, encryptionTypeCode);
    }
    return getSwarmMessageIssuerByChannelDescription;
}
export function getDatabaseNameByChannelDescriptionUtilityDefault(getSwarmMessagesIssuerByChannelDescription, joinParts) {
    return function getDatabaseNameByChannelDescription(channelDescription) {
        const swarmMessagesIssuer = getSwarmMessagesIssuerByChannelDescription(channelDescription);
        return joinParts('db', swarmMessagesIssuer);
    };
}
//# sourceMappingURL=swarm-messages-channel-v1-constructor-options-default-utils-common-default.js.map