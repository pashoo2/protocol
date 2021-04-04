import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache,
  ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams,
} from '../../types/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.types';
import { SwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructor } from 'classes/swarm-messages-channels/swarm-messages-channels-subclasses/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache';

export function swarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheInstanceFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted
>(
  params: ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams<P, T, DbType, DBO, MD>
): ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache<P, T, DbType, DBO, MD> {
  return new SwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructor(params);
}
