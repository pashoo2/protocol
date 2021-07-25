import {
  CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS,
  CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_WITH_STORE_META_OPTIONS,
} from './connect-to-swarm.const';
import { IConnectToSwarmOrbitDbWithChannelsConstructorOptions } from '../../classes/connection-helpers/connect-to-swarm-orbitdb-with-channels/types/connect-to-swarm-orbitdb-with-channels-constructor.types';

export const CONNECT_TO_SWARM_HELPER_OPTIONS: IConnectToSwarmOrbitDbWithChannelsConstructorOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> = {
  connectionBridgeOptions: CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS,
  swarmMessagesDatabaseCacheOptions: CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_WITH_STORE_META_OPTIONS,
};
