import IPFS from 'ipfs';
import {
  IPFS_UTILS_DEFAULT_OPTIONS,
  IPFS_UTILS_DEFAULT_TIMEOUT_MS,
} from './ipfs-utils.const';

/**
 * create a ready to use connection to IPFS with a basis default options
 */
export const ipfsUtilsConnectBasic = async (
  options?: object,
  timeoutMs: number = IPFS_UTILS_DEFAULT_TIMEOUT_MS
) => {
  let timer: NodeJS.Timeout | undefined;
  try {
    timer = setTimeout(() => {
      throw new Error('Connection timed out');
    }, timeoutMs);
    return await IPFS.create({
      ...IPFS_UTILS_DEFAULT_OPTIONS,
      ...options,
    });
  } finally {
    clearTimeout(timer!);
  }
};
