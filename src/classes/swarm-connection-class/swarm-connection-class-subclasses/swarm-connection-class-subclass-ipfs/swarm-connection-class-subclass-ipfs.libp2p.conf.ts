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

// libp2p configuration for browsers
// https://github.com/ipfs/js-ipfs/blob/master/src/core/runtime/libp2p-browser.js
export const getLibPeerToPeer = (opts: any) => {
  // Set convenience variables to clearly showcase some of the useful things that are available
  const peerInfo = opts.peerInfo;
  const peerBook = opts.peerBook;
  // bootstrap peers in the main configuration
  const bootstrapList = opts.config.Bootstrap;

  // Create our WebSocketStar transport and give it our PeerId, straight from the ipfs node
  const wstar = new WStar({
    id: peerInfo.id,
  });
  const wsstar = new WebSocketStar({
    id: peerInfo.id,
  });
  // Content and peer routing
  // https://github.com/libp2p/js-libp2p/tree/master/examples/peer-and-content-routing
  // https://github.com/libp2p/js-libp2p/tree/master/examples/delegated-routing
  const delegatePeerRouter = new DelegatedPeerRouter(
    SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_HTTP
  );
  const delegateContentRouter = new DelegatedContentRouter(
    peerInfo.id,
    SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_HTTP
  );
  // Websocket connections failed cause CORS policy
  // const delegatePeerRouterWS = new DelegatedPeerRouter(
  //   SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_WS
  // );
  // const delegateContentRouterWS = new DelegatedContentRouter(
  //   peerInfo.id,
  //   SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_WS
  // );

  console.warn('IPFS delegate node config HTTP');
  console.warn(SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_HTTP);
  console.warn('IPFS delegate node config HTTP-WS');
  console.warn(SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_WS);

  // Build and return our libp2p node
  return new Libp2p({
    peerInfo,
    peerBook,
    /**
     *  https://github.com/libp2p/js-libp2p/tree/master/src/switch
     * bp2p-switch is a dialer machine, it leverages the multiple libp2p transports, stream muxers, crypto channels and other connection upgrades to dial to peers in the libp2p network. It also supports Protocol Multiplexing through a multicodec and multistream-select handshake.
     * libp2p-switch supports private networking. In order to enabled private networks, the switch.protector must be set and must contain a protect method. 
     * denyTTL: - number of ms a peer should not be dialable to after it errors. Each successive deny will increase the TTL from the base value. Defaults to 5 minutes
       denyAttempts: - number of times a peer can be denied before they are permanently denied. Defaults to 5.
       maxParallelDials: - number of concurrent dials the switch should allow. Defaults to 100
       maxColdCalls: - number of queued cold calls that are allowed. Defaults to 50
       dialTimeout: - number of ms a dial to a peer should be allowed to run. Defaults to 30000 (30 seconds)
     * 
     */
    switch: {
      denyTTL: 2 * 60 * 1e3, // 2 minute base
      denyAttempts: 5, // back off 5 times
      maxParallelDials: 100,
      maxColdCalls: 25,
      dialTimeout: 20e3,
    },
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
      // https://github.com/libp2p/specs/tree/master/pubsub/gossipsub
      pubsub: PubSubGossip,
      contentRouting: [
        delegateContentRouter,
        // TODO - CORS failed for websocket // delegateContentRouterWS,
      ],
      peerRouting: [
        delegatePeerRouter,
        // TODO - CORS failed for websocket // delegatePeerRouterWS,
      ],
    },
    config: {
      peerDiscovery: {
        // auto dial to peers we find when we have less peers than `connectionManager.minPeers`
        autoDial: true,
        mdns: {
          interval: 10000,
          enabled: true,
        },
        bootstrap: {
          interval: 30e3,
          enabled: true,
          list: bootstrapList,
        },
        webrtcStar: {
          // webrtc-star options
          interval: 1000, // ms
          enabled: true,
        },
        webSocketStar: {
          // webrtc-star options
          interval: 1000, // ms
          enabled: true,
        },
      },
      // Turn on relay with hop active so we can connect to more peers
      // implements the circuit-relay mechanism that allows nodes that
      // don't speak the same protocol to communicate using a third relay node.
      // https://github.com/libp2p/js-libp2p-circuit - DEPRECATED, but docs
      // can be forund on here
      // https://github.com/libp2p/specs/tree/master/relay
      /**
       * The circuit relay is a means to establish connectivity between libp2p nodes (e.g. IPFS nodes) that wouldn't otherwise be able to establish a direct connection to each other.
       *
       * Relay is needed in situations where nodes are behind NAT, reverse proxies, firewalls and/or simply don't support the same transports (e.g. go-ipfs vs. browser-ipfs). Even though libp2p has modules for NAT traversal (go-libp2p-nat), piercing through NATs isn't always an option. The circuit relay protocol exists to overcome those scenarios.
       * Unlike a transparent tunnel, where a libp2p peer would just proxy a communication stream to a destination (the destination being unaware of the original source), a circuit relay makes the destination aware of the original source and the circuit followed to establish communication between the two.
       */
      relay: {
        enabled: true,
        hop: {
          enabled: true,
          active: true,
        },
      },
      /**
       * Create a new KadDHT.
       *
       * @param {Switch} sw libp2p-switch instance
       * @param {object} options DHT options
       * @param {number} options.kBucketSize k-bucket size (default 20)
       * @param {number} options.concurrency alpha concurrency of queries (default 3) limiting the scope of queries to k closest peers
       * @param {Datastore} options.datastore datastore (default MemoryDatastore)
       * @param {object} options.validators validators object with namespace as keys and function(key, record, callback)
       * @param {object} options.selectors selectors object with namespace as keys and function(key, records)
       * @param {randomWalkOptions} options.randomWalk randomWalk options
       */
      /**
       * Random walk options
       *
       * @typedef {Object} randomWalkOptions
       * @property {boolean} enabled discovery enabled (default: true)
       * @property {number} queriesPerPeriod how many queries to run per period (default: 1)
       * @property {number} interval how often to run the the random-walk process, in milliseconds (default: 300000)
       * @property {number} timeout how long to wait for the the random-walk query to run, in milliseconds (default: 30000)
       * @property {number} delay how long to wait before starting the first random walk, in milliseconds (default: 10000)
       */
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
        signMessages: true,
        strictSigning: true,
      },
    },
  });
};
