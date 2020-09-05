import {
  SWARM_CHANNEL_BASE_SALT_DELIMETER,
  SWARM_CHANNEL_BASE_PWD_HASH_CALC_ALH,
} from '../../swarm-channel-base.const';
import { ISwarmChannelPwdUtilsOptions } from './swarm-channel-pwd.utils.types';

/**
 * Options used within utils module.
 */
export const OPTIONS_PWD_UTILS_DEFAULT: ISwarmChannelPwdUtilsOptions = {
  fieldsDelimeter: SWARM_CHANNEL_BASE_SALT_DELIMETER,
  hashAlh: SWARM_CHANNEL_BASE_PWD_HASH_CALC_ALH,
};
