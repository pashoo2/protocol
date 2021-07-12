export declare enum SwarmChannelType {
    PUBSUB = "PUBSUB",
    CHANNELS_LIST = "CHANNELS_LIST",
    DIRECT = "DIRECT",
    OWNED = "OWNED",
    MANAGED = "MANAGED"
}
export declare enum SwarmChannelStatus {
    STARTING = "STARTING",
    STARTED = "STARTED",
    INITIALIZING = "INITIALIZING",
    CLOSING = "CLOSING",
    READY = "READY",
    PENDING = "PENDING"
}
export declare enum SwarmChannelEvents {
    MESSAGE = "MESSAGE",
    LOCAL_META_CHANGED = "LOCAL_META_CHANGED",
    SHARED_META_CHANGED = "SHARED_META_CHANGED",
    PARTICIPANT_ADDED = "PARTICIPANT_ADDED",
    PRTICIPANT_REMOVED = "PRTICIPANT_REMOVED",
    CHANNEL_ADDED = "CHANNEL_ADDED",
    CHANNEL_DESCRIPTION_CHANGED = "CHANNEL_DESCRIPTION_CHANGED",
    CHANNEL_REMOVED = "CHANNEL_REMOVED",
    STATUS_CHANGED = "STATUS_CHANGED",
    ERROR = "ERROR"
}
export declare const SWARM_CHANNEL_TYPES: Set<SwarmChannelType>;
//# sourceMappingURL=swarm-channel.const.d.ts.map