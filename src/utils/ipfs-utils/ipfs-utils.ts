import { IPFS_UTILS_DEFAULT_OPTIONS, IPFS_UTILS_DEFAULT_TIMEOUT_MS } from './ipfs-utils.const';

/**
 * create a ready to use connection to IPFS with a basis default options
 */
export const ipfsUtilsConnectBasic = async (options?: object, timeoutMs: number = IPFS_UTILS_DEFAULT_TIMEOUT_MS) => {
  let timer: NodeJS.Timeout | undefined;
  try {
    timer = setTimeout(() => {
      throw new Error('Connection timed out');
    }, timeoutMs);
    const ipfs = await require('ipfs').create({
      config: {
        ...IPFS_UTILS_DEFAULT_OPTIONS.config,
      },
    });
    const thisUserId = await ipfs.id();
    console.log('Ipfs user id', thisUserId);
    debugger;
    // TODO can test that the pubsub works well. OrbitDB fully depended on it
    let idx = Math.random() * 100;
    const topicName = 'TEST_TOPIC_TEST_______';
    await ipfs.pubsub.subscribe(topicName, ({ from, seqno, data }: { from: string; seqno: Buffer; data: Buffer }) => {
      if (data) {
        console.log(from);
        console.log(data.toString());
      }
    });
    console.log('Ipfs id is ');
    setInterval(async () => {
      if ((window as any).__sending) {
        await ipfs.pubsub.publish('TEST_TOPIC_TEST_______', `test data ${idx++}`);
      }
    }, 1500);

    return ipfs;
  } finally {
    clearTimeout(timer!);
  }
};
