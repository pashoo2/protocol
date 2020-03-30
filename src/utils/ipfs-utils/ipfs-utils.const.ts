export const IPFS_UTILS_DEFAULT_OPTIONS = {
  preload: {
    enabled: false,
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
      ],
    },
  },
};

export const IPFS_UTILS_DEFAULT_TIMEOUT_MS = 30000;
