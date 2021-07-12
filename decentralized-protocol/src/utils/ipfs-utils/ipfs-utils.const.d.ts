export declare const IPFS_UTILS_DEFAULT_OPTIONS: {
    config: {
        Addresses: {
            Swarm: string[];
        };
    };
    EXPERIMENTAL: {
        ipnsPubsub: boolean;
        sharding: boolean;
    };
    relay: {
        enabled: boolean;
        hop: {
            enabled: boolean;
            active: boolean;
        };
    };
    dht: {
        enabled: boolean;
        kBucketSize: number;
        concurrency: number;
        randomWalk: {
            queriesPerPeriod: number;
            enabled: boolean;
            interval: number;
            timeout: number;
        };
    };
    pubsub: {
        enabled: boolean;
        emitSelf: boolean;
        signMessages: boolean;
        strictSigning: boolean;
    };
};
export declare const IPFS_UTILS_DEFAULT_TIMEOUT_MS = 30000;
//# sourceMappingURL=ipfs-utils.const.d.ts.map