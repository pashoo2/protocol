const API_SERVER = {
    host: '127.0.0.1',
    port: '5001',
};
const GATEWAY_SERVER = {
    host: '127.0.0.1',
    port: '8080',
};
const BOOTSTRAP_NODE = {
    host: '127.0.0.1',
    port: '4002',
};
export const IPFS_UTILS_DEFAULT_OPTIONS = {
    config: {
        Addresses: {
            Swarm: [
                '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
            ],
        },
    },
    EXPERIMENTAL: {
        ipnsPubsub: true,
        sharding: true,
    },
    relay: {
        enabled: true,
        hop: {
            enabled: true,
            active: true,
        },
    },
    dht: {
        enabled: true,
        kBucketSize: 20,
        concurrency: 5,
        randomWalk: {
            queriesPerPeriod: 2,
            enabled: true,
            interval: 10e3,
            timeout: 2e3,
        },
    },
    pubsub: {
        enabled: true,
        emitSelf: true,
        signMessages: false,
        strictSigning: false,
    },
};
export const IPFS_UTILS_DEFAULT_TIMEOUT_MS = 30000;
//# sourceMappingURL=ipfs-utils.const.js.map