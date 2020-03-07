import { ISwarmStoreDatabaseBaseOptions } from '../../../../swarm-store-class.types';
import { ESwarmStoreEventNames } from '../../../../swarm-store-class.const';
import {
  ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback,
  ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptionsWriteAccess,
} from '../swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller.types';

export interface ISwarmStoreConnectorOrbitDbDatabaseOptions<TFeedStoreType>
  extends ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback<
      TFeedStoreType
    >,
    ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptionsWriteAccess,
    ISwarmStoreDatabaseBaseOptions {}

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
    LogEntry<TFeedStoreType>, // entry added
    string, // address of the entry,
    any, // heads
    TSwarmStoreConnectorOrbitDBDatabase
  ];
}

export interface ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValueType> {
  id: string; // id of the user who is store the event
  value: TStoreValueType;
  hash: string;
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

export type TFeedStoreHash = string;

export enum ESwarmStoreConnectorOrbitDbDatabaseMethodNames {
  'get' = 'get',
  'add' = 'add',
  'remove' = 'remove',
  'iterator' = 'iterator',
}

export type TSwarmStoreConnectorOrbitDbDatabaseMethodNames = ESwarmStoreConnectorOrbitDbDatabaseMethodNames;

export type TSwarmStoreConnectorOrbitDbDatabaseMathodArgument<TFeedStoreType> =
  | TFeedStoreHash
  | TFeedStoreType
  | ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions;
