import { SwarmChannelType } from '../../swarm-channel.const';
import { HASH_CALCULATION_UTILS_HASH_ALHORITHM } from '../../../../utils/hash-calculation-utils/hash-calculation-utils.const';

export const SWARM_CHANNEL_BASE_SALT_DELIMETER = '@-@';

export const SWARM_CHANNEL_BASE_PWD_HASH_CALC_ALH =
  HASH_CALCULATION_UTILS_HASH_ALHORITHM.SHA512;

export const SWARM_CHANNEL_BASE_ID_DEFAULT = '';

export const SWARM_CHANNEL_BASE_CHAMMEL_TYPE_DEFAULT = SwarmChannelType.PUBSUB;
