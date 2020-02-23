import { ESwarmConnectorOrbitDbDatabaseEventNames } from './swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmStoreDatabaseOptions } from '../../../../swarm-store-class.types';
import {
  ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback,
  ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptionsWriteAccess,
} from '../swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller.types';

export interface ISwarmStoreConnectorOrbitDbDatabaseOptions<TFeedStoreType>
  extends ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback<
      TFeedStoreType
    >,
    ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptionsWriteAccess,
    ISwarmStoreDatabaseOptions {}

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

export interface ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions {
  gt?: string;
  gte?: string;
  lt?: string;
  lte?: string;
  limit?: number;
  reverse?: boolean;
}

export type TFeedStoreHash = string;

export type TSwarmStoreConnectorOrbitDbDatabaseMethodNames =
  | 'get'
  | 'add'
  | 'remove'
  | 'iterator';

export type TSwarmStoreConnectorOrbitDbDatabaseMathodArgument<TFeedStoreType> =
  | TFeedStoreHash
  | TFeedStoreType
  | ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions;
