import { ISwarmMessageChannelDescriptionRaw } from './swarm-messages-channel-instance.types';
import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../swarm-store-class/swarm-store-class.types';
import { IChannelDescriptionBySwarmMessageFabric } from './swarm-messages-channels-utils.types';
export interface ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> extends Map<number, ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>> {
}
export interface ISwarmChannelsListClockSortedDatabaseMessagesCachedMap<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> extends Map<TSwarmStoreDatabaseEntityKey<P>, ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory<P, T, DbType, DBO>> {
}
export interface ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted> {
    getChannelDescriptionBySwarmMessage: IChannelDescriptionBySwarmMessageFabric<P, T, DbType, DBO, MD>;
}
export interface ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted> {
    getChannelDescriptionUpdatePreviousByClockTimeOrUndefined(channelId: TSwarmStoreDatabaseEntityKey<P>, clockTime: number): ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> | undefined;
    addSwarmMessageWithChannelDescriptionUpdate(channelId: TSwarmStoreDatabaseEntityKey<P>, clockTime: number, swarmMessage: MD): Promise<void>;
}
export interface ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructor<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted> {
    new (params: ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams<P, T, DbType, DBO, MD>): ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache<P, T, DbType, DBO, MD>;
}
//# sourceMappingURL=swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.types.d.ts.map