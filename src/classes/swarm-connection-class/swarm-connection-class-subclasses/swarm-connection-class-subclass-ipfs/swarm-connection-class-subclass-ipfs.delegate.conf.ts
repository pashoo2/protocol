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

export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PORT = '5002';



// TODO - if it changes it must be copied from the output of the
// delegate server console from a 'Swarm listening on *'
export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_NODE_ID =
  'QmQe9WCNXGLwsiFjJeMqHqxt8bcqLu5m6ubpZrV1ErhZgD';

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

export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_MULTIADDRS = [
  `/dns4/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST}/tcp/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PORT}/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_HTTP}`,
  `/dns4/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST}/tcp/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PORT}/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_WS}`,
];

export const SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_BOOTSTRAP_MULTIADDRS = [
  `/dns4/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST}/tcp/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PORT}/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_HTTP}/ipfs/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_NODE_ID}`,
  `/dns4/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_HOST}/tcp/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PORT}/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_API_PROTOCOL_WS}/ipfs/${SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DELEGATE_NODE_ID}`,
];

export const BOOTSTRAP_LIST = [
  '/ip4/0.0.0.0/tcp/4002/ipfs/QmWaHbjxSufXpC9fidr2Q24fjEZEAzXiGX4A1QXPA6BpEG',
  // TODO - CORS failed for ws connections '/ip4/0.0.0.0/tcp/4003/ws/ipfs/QmWaHbjxSufXpC9fidr2Q24fjEZEAzXiGX4A1QXPA6BpEG',
];

export const DELEGATE_LIST = [
  '/dns4/0.0.0.0/tcp/4002/http',
  // TODO - CORS FAILED for ws connections '/dns4/0.0.0.0/tcp/4003/ws',
];