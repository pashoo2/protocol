import ipfs from 'types/ipfs.types';
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import { STATUS_CLASS_STATUS_CHANGE_EVENT } from 'classes/basic-classes/status-class-base/status-class-base.const';

export enum ESwarmConnectionClassSubclassType {
  IPFS = 'ipfs',
}

// ipfs specific options
export interface IIPFSSpecificOptions {
  addresses?: {
    swarm?: string[];
    delegates?: string[];
    bootstrap?: string[];
  };
  password: string;
}

export type TSwarmConnectionSubclassSpecificOptions = IIPFSSpecificOptions;

export interface ISwarmConnectionOptions {
  type: ESwarmConnectionClassSubclassType;
  subclassOptions: TSwarmConnectionSubclassSpecificOptions;
}

export interface ISwarmConnectionSubclass {
  connect(
    options: TSwarmConnectionSubclassSpecificOptions | void
  ): Promise<boolean | Error>;
  close(): Promise<boolean | Error>;
  isClosed: boolean;
  isConnected: boolean;
  statusEmitter: EventEmitter<{
    [STATUS_CLASS_STATUS_CHANGE_EVENT]: ESwarmConnectionSubclassStatus;
  }>
}

export interface ISwarmConnection {
  connectionType: ESwarmConnectionClassSubclassType | void;
  connect(options: ISwarmConnectionOptions): Promise<boolean | Error>;
  close(): Promise<boolean | Error>;
  isClosed: boolean;
  isConnected: boolean;
  statusEmitter: EventEmitter<{
    [STATUS_CLASS_STATUS_CHANGE_EVENT]: ESwarmConnectionSubclassStatus;
  }>
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

export const ESwarmConnectionClassStatus = ESwarmConnectionSubclassStatus;