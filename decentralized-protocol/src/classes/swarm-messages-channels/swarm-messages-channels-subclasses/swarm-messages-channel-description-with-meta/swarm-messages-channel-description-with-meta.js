export class SwarmMessagesChannelDescriptionWithMeta {
    constructor(__requestWithMetadata, __swarmMessagesChannelDescription) {
        this.__requestWithMetadata = __requestWithMetadata;
        this.__swarmMessagesChannelDescription = __swarmMessagesChannelDescription;
    }
    get channelDescription() {
        return this.__swarmMessagesChannelDescription;
    }
    get message() {
        return this.__requestWithMetadata.message;
    }
    get dbName() {
        return this.__requestWithMetadata.dbName;
    }
    get messageAddress() {
        return this.__requestWithMetadata.messageAddress;
    }
    get key() {
        return this.__requestWithMetadata.key;
    }
}
//# sourceMappingURL=swarm-messages-channel-description-with-meta.js.map