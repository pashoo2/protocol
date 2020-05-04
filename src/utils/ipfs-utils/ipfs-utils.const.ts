// export const IPFS_UTILS_DEFAULT_OPTIONS = {
//   config: {
//     Addresses: {
//       Swarm: [
//         '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
//         '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star',
//       ],
//     },
//   },
// };

import { WEB_RTC_STAR_SERVER } from './ipfs-utils-libp2p/ipfs-utils-libp2p.const';

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
        `/ip4/${WEB_RTC_STAR_SERVER.host}/tcp/${WEB_RTC_STAR_SERVER.port}/ws/p2p-webrtc-star`,
      ],
      API: `/ip4/${API_SERVER.host}/tcp/${API_SERVER.port}`,
      Gateway: `/ip4/${GATEWAY_SERVER.host}/tcp/${GATEWAY_SERVER.port}`,
    },
    Bootstrap: [
      `/ip4/${BOOTSTRAP_NODE.host}/tcp/${BOOTSTRAP_NODE.port}/ws/ipfs/Qma6wr1oVavRghh4QDXxx1R1Ngo5ahreRRwkZgeYaUPKXs`,
    ],
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
  preload: {
    // TODO - caused errors https://github.com/ipfs/go-ipfs/issues/6204
    enabled: false,
    addresses: [`/ip4/${API_SERVER.host}/tcp/${API_SERVER.port}`],
  },
  dht: {
    enabled: true,
    kBucketSize: 20,
    concurrency: 5,
    randomWalk: {
      queriesPerPeriod: 2,
      enabled: true,
      interval: 10e3, // This is set low intentionally, so more peers are discovered quickly. Higher intervals are recommended
      timeout: 2e3, // End the query quickly since we're running so frequently
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
