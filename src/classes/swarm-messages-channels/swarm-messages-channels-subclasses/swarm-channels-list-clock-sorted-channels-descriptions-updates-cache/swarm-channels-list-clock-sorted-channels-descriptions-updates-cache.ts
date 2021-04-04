import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseEntityKey,
} from '../../../swarm-store-class/swarm-store-class.types';
import { IChannelDescriptionBySwarmMessageFabric } from '../../types/swarm-messages-channels-utils.types';
import {
  ISwarmChannelsListClockSortedDatabaseMessagesCachedMap,
  ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory,
} from '../../types/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../types/swarm-messages-channel-instance.types';
import {
  ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache,
  ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams,
} from '../../types/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.types';

export class SwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructor<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted
> implements ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache<P, T, DbType, DBO, MD> {
  protected readonly _getChannelDescriptionBySwarmMessage: IChannelDescriptionBySwarmMessageFabric<P, T, DbType, DBO, MD>;

  protected readonly _channelsDescriptionsChangesHistory: ISwarmChannelsListClockSortedDatabaseMessagesCachedMap<
    P,
    T,
    DbType,
    DBO
  > = new Map();

  constructor(params: ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams<P, T, DbType, DBO, MD>) {
    const { getChannelDescriptionBySwarmMessage } = params;

    this._getChannelDescriptionBySwarmMessage = getChannelDescriptionBySwarmMessage;
  }

  getChannelDescriptionUpdatePreviousByClockTimeOrUndefined(
    channelId: TSwarmStoreDatabaseEntityKey<P>,
    clockTime: number
  ): ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> | undefined {
    const channelDescriptionsUpdatesHistoryOrUndefined = this._getChannelDescriptionsHistoryOrUndefined(channelId);

    if (channelDescriptionsUpdatesHistoryOrUndefined) {
      let messageCachedAddTime: number;
      let previousMessageTime: number = -1;

      for (messageCachedAddTime of channelDescriptionsUpdatesHistoryOrUndefined.keys()) {
        if (messageCachedAddTime < clockTime) {
          // find the closest to the "clockTime"
          if (previousMessageTime < messageCachedAddTime) {
            previousMessageTime = messageCachedAddTime;
          }
        }
      }
      if (previousMessageTime !== -1) {
        const previousMessageDescription = channelDescriptionsUpdatesHistoryOrUndefined.get(previousMessageTime);
        if (!previousMessageDescription) {
          throw new Error(`Previous message can't be gotten by the time key ${previousMessageTime}`);
        }
        return previousMessageDescription;
      }
    }
  }

  async addSwarmMessageWithChannelDescriptionUpdate(
    channelId: TSwarmStoreDatabaseEntityKey<P>,
    clockTime: number,
    swarmMessage: MD
  ): Promise<void> {
    let channelDescriptionUpdatesHistory = this._getChannelDescriptionsHistoryOrUndefined(channelId);
    const channelDescription = await this._getChannelDescriptionBySwarmMessage(swarmMessage);

    if (!channelDescriptionUpdatesHistory) {
      channelDescriptionUpdatesHistory = new Map<number, ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>();
      this._setChannelDescriptionsHistory(channelId, channelDescriptionUpdatesHistory);
    }
    channelDescriptionUpdatesHistory.set(clockTime, channelDescription);
  }

  protected _getChannelDescriptionsHistoryOrUndefined(
    channelId: TSwarmStoreDatabaseEntityKey<P>
  ): ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory<P, T, DbType, DBO> | undefined {
    return this._channelsDescriptionsChangesHistory.get(channelId);
  }

  protected _setChannelDescriptionsHistory(
    channelId: TSwarmStoreDatabaseEntityKey<P>,
    channelDescriptionUpdatesHistory: ISwarmChannelsListClockSortedDatabaseMessagesCachedChannelDescriptionUpdateHistory<
      P,
      T,
      DbType,
      DBO
    >
  ): void {
    this._channelsDescriptionsChangesHistory.set(channelId, channelDescriptionUpdatesHistory);
  }
}
