import ipfs from 'types/ipfs.types';

export interface ISwarmConnection {
  connect(options: ISwarmConnectionOptions): Promise<boolean | Error>;
}

export enum ESwarmConnectionClassSubclassType {
  IPFS = 'ipfs',
}

// ipfs specific options
export interface IIPFSSpecificOptions {
  addresses: {
    swarm?: string[];
    delegates?: string[];
    bootstrap?: string[];
  };
}

export interface ISwarmConnectionOptions {
  type: ESwarmConnectionClassSubclassType;
  specificOptions: IIPFSSpecificOptions;
}

export interface ISwarmConnectionSubclass {
  connect(): Promise<boolean | ipfs.IpfsNode | Error>;
  close(): Promise<boolean | Error>;
  isClosed: boolean;
}

export enum ESwarmConnectionClassStatus {
  ERROR = 'error',
  CONNECTING = 'connecting',
}

export enum ESwarmConnectionSubclassStatus {
  ERROR = 'error', // an error has occurred for an unknown reason
  LOADING = 'loading', // preloading all necessary script and other
  INITIALIZED = 'initialized', // preloading all necessary script and other
  CONNECTING = 'connecting', // connecting to the swarm
  CONECTED = 'connected', // connected to the swarm
  STOP = 'stop', // connectionn was stopped
  CLOSE = 'close', // connectionn was closed and released
  CONNECTION_FAILED = 'connection failed', // connectionn was closed and released
}
