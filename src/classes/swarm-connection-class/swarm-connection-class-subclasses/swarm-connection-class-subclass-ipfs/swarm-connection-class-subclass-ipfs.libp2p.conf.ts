// example https://github.com/ipfs/js-ipfs/blob/master/examples/custom-libp2p/index.js
// TODO use https://github.com/libp2p/js-libp2p-webrtc-star as transport
// https://pdos.csail.mit.edu/papers/chord:sigcomm01/chord_sigcomm.pdf
// TODO - use https://github.com/daviddias/webrtc-explorer
// about libp2p-secio https://github.com/auditdrivencrypto/secure-channel/blob/master/prior-art.md#ipfss-secure-channel
import * as Libp2p from 'libp2p';
import * as KadDHT from 'libp2p-kad-dht';
import * as WebSocketStar from 'libp2p-websocket-star';
import * as SPDY from 'libp2p-spdy';
import * as MPLEX from 'pull-mplex';
import * as Bootstrap from 'libp2p-bootstrap';
import * as SECIO from 'libp2p-secio';
import * as WStar from 'libp2p-webrtc-star';
import * as PubSubGossip from 'libp2p-gossipsub';
import DelegatedPeerRouter from 'libp2p-delegated-peer-routing';
import DelegatedContentRouter from 'libp2p-delegated-content-routing';
import {
  SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_HTTP,
  SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_WS,
} from './swarm-connection-class-subclass-ipfs.delegate.conf';

export const getLibPeerToPeer = (opts: any) => {
  // Set convenience variables to clearly showcase some of the useful things that are available
  const peerInfo = opts.peerInfo;
  const peerBook = opts.peerBook;
  const bootstrapList = opts.config.Bootstrap;
  const { multiaddr } = (window as any).Ipfs;

  // Create our WebSocketStar transport and give it our PeerId, straight from the ipfs node
  const wstar = new WStar({
    id: peerInfo.id,
  });
  const wsstar = new WebSocketStar({
    id: peerInfo.id,
  });
  const delegatePeerRouter = new DelegatedPeerRouter(
    SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_HTTP
  );
  const delegatePeerRouterWS = new DelegatedPeerRouter(
    SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_WS
  );
  const delegateContentRouter = new DelegatedContentRouter(
    peerInfo.id,
    SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_HTTP
  );
  const delegateContentRouterWS = new DelegatedContentRouter(
    peerInfo.id,
    SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_WS
  );

  debugger;
  // Build and return our libp2p node
  return new Libp2p({
    peerInfo,
    peerBook,
    // Lets limit the connection managers peers and have it check peer health less frequently
    connectionManager: {
      minPeers: 25,
      maxPeers: 100,
      pollInterval: 5000,
    },
    modules: {
      transport: [wstar, wsstar],
      streamMuxer: [MPLEX, SPDY],
      connEncryption: [SECIO],
      peerDiscovery: [Bootstrap, wstar.discovery, wsstar.discovery],
      dht: KadDHT,
      pubsub: PubSubGossip,
      contentRouting: [delegateContentRouter, delegateContentRouterWS],
      peerRouting: [delegatePeerRouter, delegatePeerRouterWS],
    },
    config: {
      peerDiscovery: {
        autoDial: true, // auto dial to peers we find when we have less peers than `connectionManager.minPeers`
        mdns: {
          interval: 10000,
          enabled: true,
        },
        bootstrap: {
          interval: 30e3,
          enabled: true,
          list: bootstrapList,
        },
      },
      // Turn on relay with hop active so we can connect to more peers
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
        randomWalk: {
          enabled: true,
          interval: 10e3, // This is set low intentionally, so more peers are discovered quickly. Higher intervals are recommended
          timeout: 2e3, // End the query quickly since we're running so frequently
        },
      },
      pubsub: {
        enabled: true,
        emitSelf: true,
        signMessages: true,
        strictSigning: true,
      },
    },
  });
};
