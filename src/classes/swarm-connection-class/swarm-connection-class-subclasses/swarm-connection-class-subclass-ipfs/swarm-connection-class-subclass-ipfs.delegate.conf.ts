/**
 * how to run a delegate node
 * https://github.com/libp2p/js-libp2p/tree/master/examples/delegated-routing
 * delegate routing not works at now
 * https://github.com/libp2p/js-libp2p/pull/371/files - pull request to
 * make it works
 */

// TODO
// export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST =
//   'geochat-wrtc-start.herokuapp.com';

// export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_HTTP =
//   'https';

// export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_WS =
//   'wss';

// export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PORT = '443';

export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST =
  '0.0.0.0';

export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_HTTP =
  'http';

export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_WS =
  'ws';

/**
 * the address and the port which is configured
 * in the configuration of the server's ipfs node:
 *  `config: {
 *     Addresses: {
 *      .....
 *     }`
 * must be used on here
 *  */
export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_BOOTSTRAP_NODE_HTTP_PORT =
  '4001';
export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_BOOTSTRAP_NODE_WS_PORT =
  '4003';

// the address which API server of the delegate node is listening must be used
export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PORT = '8080';

// TODO - if it changes it must be copied from the output of the
// delegate server console from a 'Swarm listening on *'
export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_NODE_ID =
  'QmTBLWYaga41UGo2isbJNfXQCwYxwoeF2GuJX2ugCUUKMX';

// TODO - this is fo go-ipfs daemon
// export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_NODE_ID = 'QmdZCfnz1qcZiSER1w5pv4LU6kfdL6fX91ZkozUwSGTpnn'

// this is used for the libp2p delegate peer router and content router libs
// 'libp2p-delegated-peer-routing';
// 'libp2p-delegated-content-routing';
export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_HTTP = {
  host: SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST,
  protocol: SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_HTTP,
  port: SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PORT,
};
export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_OPTIONS_WS = {
  host: SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST,
  protocol: SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_WS,
  port: SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PORT,
};

/**
 * this is used in the preload section of the ipfs config:
 * `
 * preload: {
 *    enabled: true,
 *    addresses: [
 *      ...,
 *    ],
 * },
 * `
 * and in the Addresses-Delegates section
 * `
 *  Addresses: {
 *      Delegates: [
 *        ...,
 *      ],
 *   },
 * `
 * e.g. ['/dns4/0.0.0.0/tcp/5002/http']
 *  */
export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_MULTIADDRS = [
  `/dns4/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST}/tcp/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PORT}/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_HTTP}`,
];

/**
 * this is used in the Addresses-Swarm section
 * `
 *   Addresses: {
 *    Swarm: [
 *     ....
 *    ]
 *   }
 * `
 * and the Bootstrap section
 * `
 *  Bootstrap: [
 *    ...BOOTSTRAP_LIST,
 *  ],
 * `
 * * e.g. ['/ip4/0.0.0.0/tcp/4002/ipfs/QmWaHbjxSufXpC9fidr2Q24fjEZEAzXiGX4A1QXPA6BpEG']
 */
export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_BOOTSTRAP_MULTIADDRS = [
  `/dns4/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST}/tcp/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_BOOTSTRAP_NODE_HTTP_PORT}/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_HTTP}/ipfs/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_NODE_ID}`,
  `/dns4/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST}/tcp/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PORT}/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_HTTP}/p2p/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_NODE_ID}`,
  // `/dns4/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST}/tcp/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_BOOTSTRAP_NODE_WS_PORT}/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_WS}/ipfs/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_NODE_ID}`,
];
