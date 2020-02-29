import { IPFS } from 'ipfs';
import { SWARM_MESSSAGE_STORE_UTILS_IPFS_DEFAULT_OPTIONS } from './swarm-messge-store-utils-connector-ipfs.const';

/**
 * create connection to IPFS
 */
export const swarmMesssageStoreUtilsIPFSConnect = (
  timeoutMs: number = 30000
): Promise<typeof IPFS> => {
  const ipfs = new IPFS(SWARM_MESSSAGE_STORE_UTILS_IPFS_DEFAULT_OPTIONS);

  return new Promise((res, rej) => {
    const unsetListeners = () => {
      ipfs.off('ready', listenerOnReady);
      ipfs.off('error', linenerOnError);
      clearTimeout(timer);
    };
    // eslint-disable-next-line prefer-const
    let linenerOnError = (err: Error) => {
      console.error(err);
      unsetListeners();
      rej(err);
    };
    // eslint-disable-next-line prefer-const
    let listenerOnReady = () => {
      ipfs.off('error', linenerOnError);
      res(ipfs);
    };
    // eslint-disable-next-line prefer-const
    let timer = setTimeout(() => {
      unsetListeners();
      rej(new Error('Timeout'));
    }, timeoutMs);

    ipfs.on('error', linenerOnError);
    ipfs.on('ready', listenerOnReady);
  });
};
