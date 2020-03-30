import IPFS from 'ipfs';
import {
  IPFS_UTILS_DEFAULT_OPTIONS,
  IPFS_UTILS_DEFAULT_TIMEOUT_MS,
} from './ipfs-utils.const';

/**
 * create connection to IPFS with a basis default options
 */
export const ipfsUtilsConnectBasic = async (
  options?: object,
  timeoutMs: number = IPFS_UTILS_DEFAULT_TIMEOUT_MS
) => {
  return IPFS.create(IPFS_UTILS_DEFAULT_OPTIONS);
};
