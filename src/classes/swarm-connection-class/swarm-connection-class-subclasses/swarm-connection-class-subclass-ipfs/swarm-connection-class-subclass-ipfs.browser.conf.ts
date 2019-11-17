import Multiaddr from 'multiaddr';
import {
  SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_BOOTSTRAP_MULTIADDRS,
  SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_MULTIADDRS,
} from './swarm-connection-class-subclass-ipfs.delegate.conf';
import { SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_SIGNAL_STAR_MULTIADDRESSES } from './swarm-connection-class-subclass-ipfs.signal-star.conf';

export enum SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_ROUTERS {
  FLOODSUB = 'floodsub',
  GOSSIPPSUB = 'gossipsub',
}

//https://github.com/ipfs/js-ipfs/blob/master/doc/config.md#api
export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_FOR_BROWSER_DEFAULT = {
  Addresses: {
    // if a dommain used then '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
    Swarm: [
      // ...SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_SIGNAL_STAR_MULTIADDRESSES,
      ...SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_BOOTSTRAP_MULTIADDRS,
    ],
    API: '',
    Gateway: '',
    Delegates: [
      ...SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_MULTIADDRS,
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
    ...SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_BOOTSTRAP_MULTIADDRS,
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
