import { ESwarmConnectorOrbitDbDatabaseEventNames } from './swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmStoreDatabaseBaseOptions } from '../../../../swarm-store-class.types';
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
  [ESwarmConnectorOrbitDbDatabaseEventNames.FATAL]: [
    string,
    Error,
    TSwarmStoreConnectorOrbitDBDatabase
  ];

  [ESwarmConnectorOrbitDbDatabaseEventNames.ERROR]: [
    string,
    Error,
    TSwarmStoreConnectorOrbitDBDatabase
  ];
  // Database name and percents loaded
  [ESwarmConnectorOrbitDbDatabaseEventNames.LOADING]: [
    string,
    number,
    TSwarmStoreConnectorOrbitDBDatabase
  ];
  [ESwarmConnectorOrbitDbDatabaseEventNames.UPDATE]: [
    string,
    TSwarmStoreConnectorOrbitDBDatabase
  ];
  [ESwarmConnectorOrbitDbDatabaseEventNames.CLOSE]: [
    string,
    TSwarmStoreConnectorOrbitDBDatabase
  ];
  [ESwarmConnectorOrbitDbDatabaseEventNames.READY]: [
    string,
    TSwarmStoreConnectorOrbitDBDatabase
  ];
  [ESwarmConnectorOrbitDbDatabaseEventNames.NEW_ENTRY]: [
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
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]?: string;
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
