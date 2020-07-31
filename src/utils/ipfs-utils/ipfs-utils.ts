import IPFS from 'ipfs';
import {
  IPFS_UTILS_DEFAULT_OPTIONS,
  IPFS_UTILS_DEFAULT_TIMEOUT_MS,
} from './ipfs-utils.const';
import { getLibPeerToPeer } from './ipfs-utils-libp2p/ipfs-utils-libp2p';

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
    const ipfs = await IPFS.create({
      config: {
        Bootstrap: [],
        Addresses: {
          // TODO - it works for now, only for test purposes
          Swarm: [
            '/dns4/p2p.3box.io/tcp/9091/wss/p2p-webrtc-star/',
            '/dns4/stardust.mkg20001.io/tcp/443/wss/p2p-stardust/',
          ],
        },
      },
    });

    let idx = Math.random() * 100;
    const topicName = 'TEST_TOPIC_TEST_______';
    await ipfs.pubsub.subscribe(
      topicName,
      ({
        from,
        seqno,
        data,
      }: {
        from: string;
        seqno: Buffer;
        data: Buffer;
      }) => {
        if (data) {
          console.log(from);
          console.log(data.toString());
        }
      }
    );
    setInterval(async () => {
      if ((window as any).__sending) {
        await ipfs.pubsub.publish(
          'TEST_TOPIC_TEST_______',
          `test data ${idx++}`
        );
      }
    }, 1500);

    return ipfs;
  } finally {
    clearTimeout(timer!);
  }
};
