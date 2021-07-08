/* eslint-disable @typescript-eslint/no-var-requires */
import { IPFS } from 'types/ipfs.types';
import { IPFS_UTILS_DEFAULT_OPTIONS, IPFS_UTILS_DEFAULT_TIMEOUT_MS } from './ipfs-utils.const';

export async function ipfsDevModeUtils(ipfs: IPFS): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    const thisUserId = await ipfs.id();
    console.log('Ipfs user id', thisUserId);
    // TODO can test that the pubsub works well. OrbitDB fully depended on it
    let idx = Math.random() * 100;
    const topicName = 'TEST_TOPIC_TEST_______';
    await ipfs.pubsub.subscribe(topicName, ({ from, seqno, data }: { from: string; seqno: Buffer; data: Buffer }) => {
      if (data) {
        console.log(from);
        console.log(data.toString());
      }
    });
    setInterval(async () => {
      if ((window as any).__sending) {
        await ipfs.pubsub.publish('TEST_TOPIC_TEST_______', `test data ${idx++}`);
      }
    }, 1500);
  }
}

/**
 * create a ready to use connection to IPFS with a basis default options
 */
export async function ipfsUtilsConnectBasic(options?: object, timeoutMs: number = IPFS_UTILS_DEFAULT_TIMEOUT_MS): Promise<IPFS> {
  let timer: NodeJS.Timeout | undefined;
  try {
    timer = setTimeout(() => {
      throw new Error('Connection timed out');
    }, timeoutMs);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const ipfs = (await require('ipfs').create({
      config: {
        ...IPFS_UTILS_DEFAULT_OPTIONS.config,
      },
    })) as IPFS;

    if (process.env.NODE_ENV === 'development') {
      await ipfsDevModeUtils(ipfs);
    }
    return ipfs;
  } finally {
    clearTimeout(timer);
  }
}
