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
  connect(): Promise<boolean | Error>;
}

export enum ESwarmConnectionClassStatus {
  ERROR = 'error',
  CONNECTING = 'connecting',
}
