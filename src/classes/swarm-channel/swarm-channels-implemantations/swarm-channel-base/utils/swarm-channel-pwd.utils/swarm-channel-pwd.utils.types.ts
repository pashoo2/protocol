import { HASH_CALCULATION_UTILS_HASH_ALHORITHM } from '../../../../../../utils/hash-calculation-utils/hash-calculation-utils.const';

/**
 * Interface for options used across the module's
 * functions.
 *
 * @export
 * @interface ISwarmChannelPwdUtilsOptions
 */
export interface ISwarmChannelPwdUtilsOptions {
  fieldsDelimeter: string;
  hashAlh: HASH_CALCULATION_UTILS_HASH_ALHORITHM;
}
