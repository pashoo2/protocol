import { __awaiter } from "tslib";
import { IPFS_UTILS_DEFAULT_OPTIONS, IPFS_UTILS_DEFAULT_TIMEOUT_MS } from './ipfs-utils.const';
export function ipfsDevModeUtils(ipfs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV === 'development') {
            const thisUserId = yield ipfs.id();
            console.log('Ipfs user id', thisUserId);
            let idx = Math.random() * 100;
            const topicName = 'TEST_TOPIC_TEST_______';
            yield ipfs.pubsub.subscribe(topicName, ({ from, seqno, data }) => {
                if (data) {
                    console.log(from);
                    console.log(data.toString());
                }
            });
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                if (window.__sending) {
                    yield ipfs.pubsub.publish('TEST_TOPIC_TEST_______', `test data ${idx++}`);
                }
            }), 1500);
        }
    });
}
export function ipfsUtilsConnectBasic(options, timeoutMs = IPFS_UTILS_DEFAULT_TIMEOUT_MS) {
    return __awaiter(this, void 0, void 0, function* () {
        let timer;
        try {
            timer = setTimeout(() => {
                throw new Error('Connection timed out');
            }, timeoutMs);
            const ipfs = (yield require('ipfs').create({
                config: Object.assign({}, IPFS_UTILS_DEFAULT_OPTIONS.config),
            }));
            if (process.env.NODE_ENV === 'development') {
                yield ipfsDevModeUtils(ipfs);
            }
            return ipfs;
        }
        finally {
            clearTimeout(timer);
        }
    });
}
//# sourceMappingURL=ipfs-utils.js.map