export interface ISwarmConnection {
  connect(options: ISwarmConnectionOptions): Promise<boolean | Error>;
}

export enum ESwarmConnectionClassSubclassType {
  IPFS = 'ipfs',
}

export interface ISwarmConnectionOptions {
  type: ESwarmConnectionClassSubclassType;
}

export interface ISwarmConnectionSubclass {
  connect(): Promise<boolean | Error>;
}

export enum ESwarmConnectionClassStatus {
  ERROR = 'error',
  CONNECTING = 'connecting',
}
