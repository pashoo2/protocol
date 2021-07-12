import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessagesChannelId } from './swarm-messages-channel-instance.types';
import { TTypedEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ISwarmMessageChannelDescriptionRaw } from './swarm-messages-channel-instance.types';
import { TSwarmMessageSerialized } from '../../swarm-message/swarm-message-constructor.types';
export declare enum ESwarmMessagesChannelsListEventName {
    CHANNELS_LIST_READY = "CHANNELS_LIST_READY",
    CHANNELS_LIST_CLOSED = "CHANNELS_LIST_CLOSED",
    CHANNELS_LIST_DATABASE_READY = "CHANNELS_LIST_DATABASE_READY",
    CHANNEL_DESCRIPTION_UPDATE = "CHANNEL_DESCRIPTION_UPDATE",
    CHANNEL_DESCRIPTION_REMOVED = "CHANNEL_DESCRIPTION_REMOVED",
    CHANNELS_CACHE_UPDATED = "CHANNELS_CACHE_UPDATED"
}
export interface ISwarmMessagesChannelsListDatabaseEvents<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>> {
    [ESwarmMessagesChannelsListEventName.CHANNELS_LIST_DATABASE_READY]: () => unknown;
    [ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE]: (channelDescriptionUpdatadOrNew: ISwarmMessageChannelDescriptionRaw<P, T, DbType, TSwarmStoreDatabaseOptions<P, T, DbType>>) => unknown;
    [ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED]: (channelRemovedId: TSwarmMessagesChannelId) => unknown;
    [ESwarmMessagesChannelsListEventName.CHANNELS_CACHE_UPDATED]: (channelsMapCached: Readonly<Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>>) => unknown;
}
export interface ISwarmMessagesChannelsListStatusEvents {
    [ESwarmMessagesChannelsListEventName.CHANNELS_LIST_READY]: () => unknown;
    [ESwarmMessagesChannelsListEventName.CHANNELS_LIST_CLOSED]: () => unknown;
}
export interface ISwarmMessagesChannelsListEvents<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>> extends ISwarmMessagesChannelsListStatusEvents, ISwarmMessagesChannelsListDatabaseEvents<P, T, DbType> {
}
export declare type ISwarmMessagesChannelsListNotificationEmitter<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>> = TTypedEmitter<ISwarmMessagesChannelsListEvents<P, T, DbType>>;
//# sourceMappingURL=swarm-messages-channels-list-events.types.d.ts.map