import Multiaddr from 'multiaddr';
import {
  SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_MULTIADDRS,
  SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_BOOTSTRAP_MULTIADDRS,
  BOOTSTRAP_LIST,
  DELEGATE_LIST,
} from './swarm-connection-class-subclass-ipfs.delegate.conf';
import { SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_SIGNAL_STAR_MULTIADDRESSES } from './swarm-connection-class-subclass-ipfs.signal-star.conf';

export enum SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_ROUTERS {
  FLOODSUB = 'floodsub',
  GOSSIPPSUB = 'gossipsub',
}

export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_NODES_BOOTSTRAP = [
  '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
  '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
  '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
  '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
  '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
  '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
  // '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
  // '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
  // TODO - use a custom bootstrap node
  //...SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_BOOTSTRAP_MULTIADDRS,
  ...BOOTSTRAP_LIST,
];

//https://github.com/ipfs/js-ipfs/blob/master/doc/config.md#api
export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_FOR_BROWSER_DEFAULT = {
  Addresses: {
    // if a dommain used then '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
    Swarm: [
      ...SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_SIGNAL_STAR_MULTIADDRESSES,
      ...BOOTSTRAP_LIST,
      // ...SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_NODES_BOOTSTRAP  ,
    ],
    API: '',
    Gateway: '',
    Delegates: [
      // TODO - use delegates only for a weak devices
      // '/dns4/node0.delegate.ipfs.io/tcp/443/https',
      // '/dns4/node1.delegate.ipfs.io/tcp/443/https',
      // ...DELEGATE_LIST,
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
  Bootstrap: [
    // ...SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_NODES_BOOTSTRAP,
    ...BOOTSTRAP_LIST,
  ],
  Pubsub: {
    Enabled: true,
    Router: SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_ROUTERS.GOSSIPPSUB,
  },
  Swarm: {
    ConnMgr: {
      LowWater: 200,
      HighWater: 500,
    },
  },
};
