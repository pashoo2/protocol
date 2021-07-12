import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseEntityKey } from '../../../swarm-store-class/swarm-store-class.types';
import { IChannelDescriptionBySwarmMessageFabric } from '../../types/swarm-messages-channels-utils.types';
import { ISwarmChannelsListClockSortedDatabaseMessagesCachedMap, ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory } from '../../types/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../types/swarm-messages-channel-instance.types';
import { ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache, ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams } from '../../types/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.types';
export declare class SwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructor<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted> implements ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache<P, T, DbType, DBO, MD> {
    protected readonly _getChannelDescriptionBySwarmMessage: IChannelDescriptionBySwarmMessageFabric<P, T, DbType, DBO, MD>;
    protected readonly _channelsDescriptionsChangesHistory: ISwarmChannelsListClockSortedDatabaseMessagesCachedMap<P, T, DbType, DBO>;
    constructor(params: ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams<P, T, DbType, DBO, MD>);
    getChannelDescriptionUpdatePreviousByClockTimeOrUndefined(channelId: TSwarmStoreDatabaseEntityKey<P>, clockTime: number): ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> | undefined;
    addSwarmMessageWithChannelDescriptionUpdate(channelId: TSwarmStoreDatabaseEntityKey<P>, clockTime: number, swarmMessage: MD): Promise<void>;
    protected _getChannelDescriptionsHistoryOrUndefined(channelId: TSwarmStoreDatabaseEntityKey<P>): ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory<P, T, DbType, DBO> | undefined;
    protected _setChannelDescriptionsHistory(channelId: TSwarmStoreDatabaseEntityKey<P>, channelDescriptionUpdatesHistory: ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory<P, T, DbType, DBO>): void;
}
//# sourceMappingURL=swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.d.ts.map