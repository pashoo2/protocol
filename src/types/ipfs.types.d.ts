/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'events';

declare module 'ipfs' {}

type Callback<T> = (error: Error, result?: T) => void;

export class IPFS extends EventEmitter {
  constructor(options?: Options);

  types: Types;

  init(options: InitOptions, callback: Callback<boolean>): void;
  init(callback: Callback<boolean>): void;

  add(data: FileContent | FileObject, options: any, callback: Callback<IPFSFile[]>): void;
  add(data: FileContent | FileObject, options: any): Promise<IPFSFile[]>;
  add(data: FileContent | FileObject, callback: Callback<IPFSFile[]>): void;
  add(data: FileContent | FileObject): Promise<IPFSFile[]>;

  get(hash: Multihash, callback: Callback<IPFSFile | IPFSGetResult[]>): void;
  get(hash: Multihash): Promise<IPFSFile | IPFSGetResult[]>;

  preStart(callback: Callback<any>): void;
  start(callback?: Callback<any>): void;
  stop(callback?: (error?: Error) => void): Pomise<void>;
  isOnline(): boolean;

  version(options: any, callback: (error: Error, version: Version) => void): void;
  version(options: any): Promise<Version>;
  version(callback: (error: Error, version: Version) => void): void;
  version(): Promise<Version>;

  id(options: any, callback: (error: Error, version: Id) => void): void;
  id(options: any): Promise<Id>;
  id(callback: (error: Error, version: Id) => void): void;
  id(): Promise<Id>;

  ready: Promise<boolean>;
  repo: RepoAPI;
  bootstrap: any;
  config: any;
  block: any;
  object: ObjectAPI;
  dag: DagAPI;
  libp2p: any;
  swarm: SwarmAPI;
  files: FilesAPI;
  bitswap: Bitswap;

  ping(callback: (error: Error) => void): void;
  ping(): Promise<void>;

  pubsub: Pubsub;

  on(event: string, callback: () => void): this;
  on(event: 'error', callback: (error: Error) => void): this;
  once(event: string, callback: () => void): this;
}

export type InstanceIPFS = InstanceType<IPFS>;

export interface Options {
  init?: boolean;
  start?: boolean;
  EXPERIMENTAL?: any;
  repo?: string;
  config?: any;
}

export interface InitOptions {
  emptyRepo?: boolean;
  bits?: number;
  log?: Function;
}

export interface Multiaddr {
  buffer: Uint8Array;
}

export type Multihash = any | string;
export type CID = any;

export interface Types {
  Buffer: any;
  PeerId: string | any;
  PeerInfo: any;
  multiaddr: Multiaddr;
  multihash: Multihash;
  CID: CID;
}

export interface Version {
  version: string;
  repo: string;
  commit: string;
}

export interface Id {
  id: string;
  publicKey: string;
  addresses: Multiaddr[];
  agentVersion: string;
  protocolVersion: string;
}

export interface RepoAPI {
  init(bits: number, empty: boolean, callback: Callback<any>): void;

  version(options: any, callback: Callback<any>): void;
  version(callback: Callback<any>): void;

  gc(): void;
  path(): string;
}

export type UnixTime = { secs: number; nsecs: number };

export type FileObject = {
  path?: string;
  // The contents of the file (see below for definition)
  content?: FileContent;
  // File mode to store the entry with (see https://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation)
  mode?: number | string;
  // The modification time of the entry (see below for definition)
  mtime?: UnixTime | Date;
};

export type FileContent = Record<string, any> | Blob | string;

/** old version? */
export interface IPFSFile {
  path: string;
  hash: string;
  size: number;
  content?: FileContent;
  mtime?: UnixTime;
}

export interface IPFSGetResult {
  depth: number;
  name: string;
  path: string;
  size: number;
  hash: Buffer;
  content: Buffer;
  type: 'file' | string;
  mtime?: UnixTime;
}

export interface FilesAPI {
  createAddStream(options: any, callback: Callback<any>): void;
  createAddStream(callback: Callback<any>): void;

  createPullStream(options: any): any;

  cat(hash: Multihash, callback: Callback<FileContent>): void;
  cat(hash: Multihash): Promise<FileContent>;

  getPull(hash: Multihash, callback: Callback<any>): void;
}

export interface PeersOptions {
  v?: boolean;
  verbose?: boolean;
}

export type PeerId = any;

export interface PeerInfo {
  id: PeerId;
  multiaddr: Multiaddr;
  multiaddrs: Multiaddr[];
  distinctMultiaddr(): Multiaddr[];
}

export interface Peer {
  addr: Multiaddr;
  peer: PeerInfo;
}

export interface SwarmAPI {
  peers(options: PeersOptions, callback: Callback<Peer[]>): void;
  peers(options: PeersOptions): Promise<Peer[]>;
  peers(callback: Callback<Peer[]>): void;
  peers(): Promise<Peer[]>;

  addrs(callback: Callback<PeerInfo[]>): void;
  addrs(): Promise<PeerInfo[]>;

  localAddrs(callback: Callback<Multiaddr[]>): void;
  localAddrs(): Promise<Multiaddr[]>;

  connect(maddr: Multiaddr | string, callback: Callback<any>): void;
  connect(maddr: Multiaddr | string): Promise<any>;

  disconnect(maddr: Multiaddr | string, callback: Callback<any>): void;
  disconnect(maddr: Multiaddr | string): Promise<any>;

  filters(callback: Callback<void>): never;
}

export type DAGNode = any;
export type DAGLink = any;
export type DAGLinkRef = DAGLink | any;
export type Obj = BufferSource | Record<string, any>;

export interface ObjectStat {
  Hash: Multihash;
  NumLinks: number;
  BlockSize: number;
  LinksSize: number;
  DataSize: number;
  CumulativeSize: number;
}

export interface PutObjectOptions {
  enc?: any;
}

export interface GetObjectOptions {
  enc?: any;
}

export interface ObjectPatchAPI {
  addLink(multihash: Multihash, link: DAGLink, options: GetObjectOptions, callback: Callback<any>): void;
  addLink(multihash: Multihash, link: DAGLink, options: GetObjectOptions): Promise<any>;
  addLink(multihash: Multihash, link: DAGLink, callback: Callback<any>): void;
  addLink(multihash: Multihash, link: DAGLink): Promise<any>;

  rmLink(multihash: Multihash, linkRef: DAGLinkRef, options: GetObjectOptions, callback: Callback<any>): void;
  rmLink(multihash: Multihash, linkRef: DAGLinkRef, options: GetObjectOptions): Promise<any>;
  rmLink(multihash: Multihash, linkRef: DAGLinkRef, callback: Callback<any>): void;
  rmLink(multihash: Multihash, linkRef: DAGLinkRef): Promise<any>;

  appendData(multihash: Multihash, data: any, options: GetObjectOptions, callback: Callback<any>): void;
  appendData(multihash: Multihash, data: any, options: GetObjectOptions): Promise<any>;
  appendData(multihash: Multihash, data: any, callback: Callback<any>): void;
  appendData(multihash: Multihash, data: any): Promise<any>;

  setData(multihash: Multihash, data: any, options: GetObjectOptions, callback: Callback<any>): void;
  setData(multihash: Multihash, data: any, options: GetObjectOptions): Promise<any>;
  setData(multihash: Multihash, data: any, callback: Callback<any>): void;
  setData(multihash: Multihash, data: any): Promise<any>;
}

export interface ObjectAPI {
  'new'(template: 'unixfs-dir', callback: Callback<DAGNode>): void;
  'new'(callback: Callback<DAGNode>): void;
  'new'(): Promise<DAGNode>;

  put(obj: Obj, options: PutObjectOptions, callback: Callback<any>): void;
  put(obj: Obj, options: PutObjectOptions): Promise<any>;
  put(obj: Obj, callback: Callback<any>): void;
  put(obj: Obj): Promise<any>;

  get(multihash: Multihash, options: GetObjectOptions, callback: Callback<any>): void;
  get(multihash: Multihash, options: GetObjectOptions): Promise<any>;
  get(multihash: Multihash, callback: Callback<any>): void;
  get(multihash: Multihash): Promise<any>;

  data(multihash: Multihash, options: GetObjectOptions, callback: Callback<any>): void;
  data(multihash: Multihash, options: GetObjectOptions): Promise<any>;
  data(multihash: Multihash, callback: Callback<any>): void;
  data(multihash: Multihash): Promise<any>;

  links(multihash: Multihash, options: GetObjectOptions, callback: Callback<DAGLink[]>): void;
  links(multihash: Multihash, options: GetObjectOptions): Promise<DAGLink[]>;
  links(multihash: Multihash, callback: Callback<DAGLink[]>): void;
  links(multihash: Multihash): Promise<DAGLink[]>;

  stat(multihash: Multihash, options: GetObjectOptions, callback: Callback<ObjectStat>): void;
  stat(multihash: Multihash, options: GetObjectOptions): Promise<ObjectStat>;
  stat(multihash: Multihash, callback: Callback<ObjectStat>): void;
  stat(multihash: Multihash): Promise<ObjectStat>;

  patch: ObjectPatchAPI;
}

export interface DagAPI {
  put(dagNode: any, options: any, callback: Callback<any>): void;
  put(dagNode: any, options: any): Promise<any>;

  get(cid: string | CID, path: string, options: any, callback: Callback<any>): void;
  get(cid: string | CID, path: string, options: any): Promise<any>;
  get(cid: string | CID, path: string, callback: Callback<any>): void;
  get(cid: string | CID, path: string): Promise<any>;
  get(cid: string | CID, callback: Callback<any>): void;
  get(cid: string | CID): Promise<any>;

  tree(cid: string | CID, path: string, options: any, callback: Callback<any>): void;
  tree(cid: string | CID, path: string, options: any): Promise<any>;
  tree(cid: string | CID, path: string, callback: Callback<any>): void;
  tree(cid: string | CID, path: string): Promise<any>;
  tree(cid: string | CID, options: any, callback: Callback<any>): void;
  tree(cid: string | CID, options: any): Promise<any>;
  tree(cid: string | CID, callback: Callback<any>): void;
  tree(cid: string | CID): Promise<any>;
}

type TPubSubTopic = string;

type TpubSubTopicHandler = (msg: any) => void;

type TPubSubTopicOptions = {
  discover: boolean;
};

type TPubSubData = string | Buffer;

export interface Pubsub {
  subscribe(topic: TPubSubTopic, handler: TpubSubTopicHandler, options: TPubSubTopicOptions, callback: Callback<any>): void;
  subscribe(topic: TPubSubTopic, handler: TpubSubTopicHandler, options: TPubSubTopicOptions): Promise<void>;
  subscribe(topic: TPubSubTopic, handler: TpubSubTopicHandler): Promise<void>;

  unsubscribe(topic: TPubSubTopic, handler: TpubSubTopicHandler, callback: Callback<void>): void;
  unsubscribe(topic: TPubSubTopic, handler: TpubSubTopicHandler): Promise<void>;

  publish(topic: TPubSubTopic, data: TPubSubData, callback: Callback<any>): void;
  publish(topic: TPubSubTopic, data: TPubSubData): Promise<any>;

  ls(callback: Callback<any>): void;
  ls(): Promise<any>;

  peers(topic: TPubSubTopic, callback: Callback<any>): void;
  peers(topic: TPubSubTopic): Promise<any>;

  setMaxListeners(n: number): void;
}

export interface WantListItem {
  '/': string;
}
export interface WantList {
  Keys: WantListItem[];
}

/* class object */
export type Big = any;
export interface Stat {
  provideBufLen: number;
  blocksReceived: Big;
  wantlist: WantListItem[];
  peers: string[];
  dupBlksReceived: Big;
  dupDataReceived: Big;
  dataReceived: Big;
  blocksSent: Big;
  dataSent: Big;
}

export type KeyType = string | Buffer | CID | any;
export interface Bitswap {
  wantlist(peerId: string, callback: Callback<WantList>): void;
  wantlist(peerId: string): Promise<WantList>;
  wantlist(callback: Callback<WantList>): void;
  wantlist(): Promise<WantList>;

  stat(callback: Callback<Stat>): void;
  stat(): Promise<Stat>;

  unwant(keys: KeyType | KeyType[], callback: Callback<any>): void;
  unwant(keys: KeyType | KeyType[]): Promise<any>;
}

export function create(options: Options): Promise<IPFS>;

export as namespace Ipfs;
