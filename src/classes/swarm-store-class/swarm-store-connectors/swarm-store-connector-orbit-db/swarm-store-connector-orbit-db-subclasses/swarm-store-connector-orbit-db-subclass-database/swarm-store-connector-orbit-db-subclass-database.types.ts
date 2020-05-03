import { ISwarmStoreDatabaseBaseOptions } from '../../../../swarm-store-class.types';
import { ESwarmStoreEventNames } from '../../../../swarm-store-class.const';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from './swarm-store-connector-orbit-db-subclass-database.const';
import {
  ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback,
  ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptionsWriteAccess,
} from '../swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller.types';
import OrbitDbFeedStore from 'orbit-db-feedstore';
import OrbitDbKeyValueStore from 'orbit-db-kvstore';

export type TSwarmStoreConnectorOrbitDbDatabaseStoreHash = string;

export type TSwarmStoreConnectorOrbitDbDatabaseStoreKey = string;

export type TSwarmStoreConnectorOrbitDbDatabaseKey =
  | TSwarmStoreConnectorOrbitDbDatabaseStoreHash
  | TSwarmStoreConnectorOrbitDbDatabaseStoreKey;

export type TSwarmStoreConnectorOrbitDbDatabase<V> =
  | OrbitDbFeedStore<V>
  | OrbitDbKeyValueStore<V>;

export interface ISwarmStoreConnectorOrbitDbDatabaseOptions<TFeedStoreType>
  extends ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback<
      TFeedStoreType
    >,
    ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptionsWriteAccess,
    ISwarmStoreDatabaseBaseOptions {
  /**
   * Datatbase type, may be feed store or key-value store.
   * By default the feed store type is used.
   *
   * @type {ESwarmStoreConnectorOrbitDbDatabaseType}
   * @memberof ISwarmStoreConnectorOrbitDbDatabaseOptions
   */
  dbType?: ESwarmStoreConnectorOrbitDbDatabaseType;
}

export interface ISwarmStoreConnectorOrbitDbDatabaseEvents<
  TSwarmStoreConnectorOrbitDBDatabase,
  TFeedStoreType
> {
  [ESwarmStoreEventNames.FATAL]: [
    string,
    Error,
    TSwarmStoreConnectorOrbitDBDatabase
  ];

  [ESwarmStoreEventNames.ERROR]: [
    string,
    Error,
    TSwarmStoreConnectorOrbitDBDatabase
  ];
  // Database name and percents loaded
  [ESwarmStoreEventNames.LOADING]: [
    string,
    number,
    TSwarmStoreConnectorOrbitDBDatabase
  ];
  [ESwarmStoreEventNames.UPDATE]: [string, TSwarmStoreConnectorOrbitDBDatabase];
  [ESwarmStoreEventNames.CLOSE]: [string, TSwarmStoreConnectorOrbitDBDatabase];
  [ESwarmStoreEventNames.READY]: [string, TSwarmStoreConnectorOrbitDBDatabase];
  [ESwarmStoreEventNames.NEW_ENTRY]: [
    string, // database name
    any, // entry added
    string, // address of the entry,
    any, // heads
    TSwarmStoreConnectorOrbitDBDatabase
  ];
}

export type ISwarmStoreConnectorOrbitDbDatabaseKey = string;

export interface ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValueType> {
  id: string; // id of the user who stores the value
  value: TStoreValueType;
  hash: TSwarmStoreConnectorOrbitDbDatabaseStoreHash;
}

export enum ESwarmStoreConnectorOrbitDbDatabaseIteratorOption {
  eq = 'eq',
  gt = 'gt',
  gte = 'gte',
  lt = 'lt',
  lte = 'lte',
  limit = 'limit',
  reverse = 'reverse',
}

export interface ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions {
  // if the equal operator applyied all other will not be applied
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]?: string | string[];
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gt]?: string;
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gte]?: string;
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lt]?: string;
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lte]?: string;
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]?: number;
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.reverse]?: boolean;
}

export interface ISwarmStoreConnectorOrbitDbDatabaseIteratorAnswer<T> {
  collect(): T[];
}

export enum ESwarmStoreConnectorOrbitDbDatabaseMethodNames {
  'get' = 'get',
  'add' = 'add',
  'remove' = 'remove',
  'iterator' = 'iterator',
  'close' = 'close',
  'load' = 'load',
}

export type TSwarmStoreConnectorOrbitDbDatabaseMethodNames = ESwarmStoreConnectorOrbitDbDatabaseMethodNames;

export type TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<
  TStoreValue
> = {
  value: TStoreValue;
  key?: TSwarmStoreConnectorOrbitDbDatabaseStoreKey;
};

export type TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbClose = void;

// how many items to load
export type TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad = number;

export type TSwarmStoreConnectorOrbitDbDatabaseMethodArgument<TStoreValue> =
  | TSwarmStoreConnectorOrbitDbDatabaseStoreHash
  | TStoreValue
  | TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<TStoreValue>
  | ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions
  | TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbClose
  | TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad;
