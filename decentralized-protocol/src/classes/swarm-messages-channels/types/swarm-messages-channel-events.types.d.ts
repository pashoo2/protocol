import { ESwarmStoreConnector, TSwarmStoreDatabaseType } from '../../swarm-store-class';
import { ESwarmMessagesChannelsListEventName, ISwarmMessagesChannelsListEvents } from './swarm-messages-channels-list-events.types';
import { ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw, TSwarmMessagesChannelId } from './swarm-messages-channel-instance.types';
import { TTypedEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { TSwarmMessageSerialized } from '../../swarm-message/swarm-message-constructor.types';
export declare enum ESwarmMessagesChannelEventName {
    CHANNEL_OPEN = "CHANNEL_OPEN",
    CHANNEL_CLOSED = "CHANNEL_CLOSED"
}
export interface ISwarmMessagesChannelEvents<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>> extends ISwarmMessagesChannelsListEvents<P, T, DbType> {
    [ESwarmMessagesChannelEventName.CHANNEL_OPEN]: (channelId: TSwarmMessagesChannelId) => unknown;
    [ESwarmMessagesChannelEventName.CHANNEL_CLOSED]: (channelId: TSwarmMessagesChannelId) => unknown;
    [ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE]: (channelDescription: ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<P, DbType>) => unknown;
    [ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED]: (channelId: TSwarmMessagesChannelId) => unknown;
}
export declare type ISwarmMessagesChannelNotificationEmitter<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>> = TTypedEmitter<ISwarmMessagesChannelEvents<P, T, DbType>>;
//# sourceMappingURL=swarm-messages-channel-events.types.d.ts.map