import ipfs from 'types/ipfs.types';

export enum ESwarmConnectionClassSubclassType {
  IPFS = 'ipfs',
}

export interface ISwarmConnection {
  connectionType: ESwarmConnectionClassSubclassType | void;
  connect(options: ISwarmConnectionOptions): Promise<boolean | Error>;
}

// ipfs specific options
export interface ISwarmConnectionSubclassSpecificOptions {
  addresses: {
    swarm?: string[];
    delegates?: string[];
    bootstrap?: string[];
  };
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
  subclassOptions: ISwarmConnectionSubclassSpecificOptions;
}

export interface ISwarmConnectionSubclass {
  connect(
    options: ISwarmConnectionSubclassSpecificOptions | void
  ): Promise<boolean | Error>;
  close(): Promise<boolean | Error>;
  isClosed: boolean;
  isConnected: boolean;
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
  STARTED = 'started', // node has started listening for connections
  CONNECTED = 'connected', // connected to the swarm and is ready to use
  STOP = 'stop', // connectionn was stopped
  CLOSE = 'close', // connectionn was closed and released
  CONNECTION_FAILED = 'connection failed', // connectionn was closed and released
}
