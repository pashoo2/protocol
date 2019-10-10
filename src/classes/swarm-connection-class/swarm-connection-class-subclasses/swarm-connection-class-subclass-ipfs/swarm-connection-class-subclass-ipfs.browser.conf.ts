export enum SWARM_CONNECTION_SUBLASS_IPFS_CONFIG_ROUTERS {
  FLOODSUB = 'floodsub',
  GOSSIPPSUB = 'gossipsub',
}

export const SWARM_CONNECTION_SUBLASS_IPFS_CONFIG_NODES_BOOTSTRAP = [
  '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
  '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
  '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
  '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
  '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
  '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
  '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
  '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
];

//https://github.com/ipfs/js-ipfs/blob/master/doc/config.md#api
export const SWARM_CONNECTION_SUBLASS_IPFS_CONFIG_FOR_BROWSER_DEFAULT = {
  Addresses: {
    Swarm: ['/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star'],
    API: '',
    Gateway: '',
    Delegates: [
      // TODO - use a custoim delegates
      '/dns4/node0.delegate.ipfs.io/tcp/443/https',
      '/dns4/node1.delegate.ipfs.io/tcp/443/https',
    ],
  },
  Discovery: {
    MDNS: {
      Enabled: false,
      Interval: 10,
    },
    webRTCStar: {
      Enabled: true,
    },
  },
  Bootstrap: SWARM_CONNECTION_SUBLASS_IPFS_CONFIG_NODES_BOOTSTRAP,
  Pubsub: {
    Enabled: true,
    Router: SWARM_CONNECTION_SUBLASS_IPFS_CONFIG_ROUTERS.GOSSIPPSUB,
  },
  Swarm: {
    ConnMgr: {
      LowWater: 200,
      HighWater: 500,
    },
  },
};
