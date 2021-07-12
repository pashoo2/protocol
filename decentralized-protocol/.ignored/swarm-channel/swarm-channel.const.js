export var SwarmChannelType;
(function (SwarmChannelType) {
    SwarmChannelType["PUBSUB"] = "PUBSUB";
    SwarmChannelType["CHANNELS_LIST"] = "CHANNELS_LIST";
    SwarmChannelType["DIRECT"] = "DIRECT";
    SwarmChannelType["OWNED"] = "OWNED";
    SwarmChannelType["MANAGED"] = "MANAGED";
})(SwarmChannelType || (SwarmChannelType = {}));
export var SwarmChannelStatus;
(function (SwarmChannelStatus) {
    SwarmChannelStatus["STARTING"] = "STARTING";
    SwarmChannelStatus["STARTED"] = "STARTED";
    SwarmChannelStatus["INITIALIZING"] = "INITIALIZING";
    SwarmChannelStatus["CLOSING"] = "CLOSING";
    SwarmChannelStatus["READY"] = "READY";
    SwarmChannelStatus["PENDING"] = "PENDING";
})(SwarmChannelStatus || (SwarmChannelStatus = {}));
export var SwarmChannelEvents;
(function (SwarmChannelEvents) {
    SwarmChannelEvents["MESSAGE"] = "MESSAGE";
    SwarmChannelEvents["LOCAL_META_CHANGED"] = "LOCAL_META_CHANGED";
    SwarmChannelEvents["SHARED_META_CHANGED"] = "SHARED_META_CHANGED";
    SwarmChannelEvents["PARTICIPANT_ADDED"] = "PARTICIPANT_ADDED";
    SwarmChannelEvents["PRTICIPANT_REMOVED"] = "PRTICIPANT_REMOVED";
    SwarmChannelEvents["CHANNEL_ADDED"] = "CHANNEL_ADDED";
    SwarmChannelEvents["CHANNEL_DESCRIPTION_CHANGED"] = "CHANNEL_DESCRIPTION_CHANGED";
    SwarmChannelEvents["CHANNEL_REMOVED"] = "CHANNEL_REMOVED";
    SwarmChannelEvents["STATUS_CHANGED"] = "STATUS_CHANGED";
    SwarmChannelEvents["ERROR"] = "ERROR";
})(SwarmChannelEvents || (SwarmChannelEvents = {}));
export const SWARM_CHANNEL_TYPES = new Set(Object.values(SwarmChannelType));
//# sourceMappingURL=swarm-channel.const.js.map