import { SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_FOR_BROWSER_DEFAULT } from './swarm-connection-class-subclass-ipfs.browser.conf';
import { getLibPeerToPeer } from './swarm-connection-class-subclass-ipfs.libp2p.conf';
import {
  SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_MULTIADDRS,
  SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_BOOTSTRAP_MULTIADDRS,
} from './swarm-connection-class-subclass-ipfs.delegate.conf';

export const SWARM_CONNECTION_SUBCLASS_IPFS_CDN_SCRIPT_URL =
  'https://cdn.jsdelivr.net/npm/ipfs/dist/index.js';

export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DEFALT = {
  init: {
    emptyRepo: true, // TODO - set to false
    //privateKey TODO - create PeerId instance by the user's public and private keys
  },
  start: true,
  pass: '', // TODO - use the password for it,
  silent: false, // TODO - set true on production
  relay: {
    enabled: true,
    hop: {
      enabled: true,
      active: true,
    },
  },
  preload: {
    enabled: true,
    addresses: [
      ...SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_MULTIADDRS,
    ],
  },
  EXPERIMENTAL: {
    ipnsPubsub: true,
    sharding: true,
  },
  config: SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_FOR_BROWSER_DEFAULT,
  // libp2p: getLibPeerToPeer,
};

export const SWARM_CONNECTION_SUBCLASS_IPFS_NODE_START_TIMEOUT = 2000;

export const SWARM_CONNECTION_SUBCLASS_IPFS_NODE_RECONNECTION_MAX_ATTEMPTS = 3;
