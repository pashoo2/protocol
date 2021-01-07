import {
    ISwarmStoreDatabaseBaseOptionsWithWriteAccess,
    ISwarmStoreDatabaseBaseOptions,
    TSwarmStoreDatabaseEntityUniqueIndex,
    TSwarmStoreDatabaseType,
    TSwarmStoreValueTypes,
} from '../../../../swarm-store-class.types';
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../../../../swarm-store-class.const';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from './swarm-store-connector-orbit-db-subclass-database.const';
import {
  ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback,
} from '../swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller.types';
import OrbitDbFeedStore from 'orbit-db-feedstore';
import OrbitDbKeyValueStore from 'orbit-db-kvstore';
import { ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclasses-cache.types';
import { ESwarmStoreConnectorOrbitDbDatabaseMethodNames } from '../../swarm-store-connector-orbit-db.types';

export type TSwarmStoreConnectorOrbitDbDatabaseStoreHash = string;

export type TSwarmStoreConnectorOrbitDbDatabaseStoreKey = string;

export type TSwarmStoreConnectorOrbitDbDatabaseEntityIndex =
  | TSwarmStoreConnectorOrbitDbDatabaseStoreHash
  | TSwarmStoreConnectorOrbitDbDatabaseStoreKey;

export type TSwarmStoreConnectorOrbitDbDatabase<V> = OrbitDbFeedStore<V> | OrbitDbKeyValueStore<V>;

export interface ISwarmStoreConnectorOrbitDbDatabaseOptions<
  TStoreValueType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
  DbType extends ESwarmStoreConnectorOrbitDbDatabaseType
> extends ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback<TStoreValueType>,
    ISwarmStoreDatabaseBaseOptionsWithWriteAccess,
    ISwarmStoreDatabaseBaseOptions {
  /**
   * Datatbase type, may be feed store or key-value store.
   * By default the feed store type is used.
   *
   * @type {ESwarmStoreConnectorOrbitDbDatabaseType}
   * @memberof ISwarmStoreConnectorOrbitDbDatabaseOptions
   */
  dbType?: DbType;
  cache?: ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore;
}

export interface ISwarmStoreConnectorOrbitDbDatabaseEvents<TSwarmStoreConnectorOrbitDBDatabase, TFeedStoreType> {
  [ESwarmStoreEventNames.FATAL]: [string, Error, TSwarmStoreConnectorOrbitDBDatabase];

  [ESwarmStoreEventNames.ERROR]: [string, Error, TSwarmStoreConnectorOrbitDBDatabase];
  // Database name and percents loaded
  [ESwarmStoreEventNames.LOADING]: [string, number, TSwarmStoreConnectorOrbitDBDatabase];
  [ESwarmStoreEventNames.UPDATE]: [string, TSwarmStoreConnectorOrbitDBDatabase];
  [ESwarmStoreEventNames.CLOSE]: [string, TSwarmStoreConnectorOrbitDBDatabase];
  [ESwarmStoreEventNames.READY]: [string, TSwarmStoreConnectorOrbitDBDatabase];
  [ESwarmStoreEventNames.NEW_ENTRY]: [
    string, // database name
    any, // entry added
    string, // address of the entry,
    any, // heads
    ESwarmStoreConnectorOrbitDbDatabaseType,
    TSwarmStoreConnectorOrbitDBDatabase
  ];
}

export type ISwarmStoreConnectorOrbitDbDatabaseKey = string;

export interface ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValueType> extends LogEntry<TStoreValueType> {}

export enum ESwarmStoreConnectorOrbitDbDatabaseIteratorOption {
  /**
   * not equals to address or key
   */
  neq = 'neq',
  /**
   * equals to address or key
   */
  eq = 'eq',
  /**
   * greater than
   */
  gt = 'gt',
  /**
   * greater than or equals
   */
  gte = 'gte',
  /**
   * less than
   */
  lt = 'lt',
  /**
   * less than or equal
   */
  lte = 'lte',
  /**
   * limit messages count to read
   */
  limit = 'limit',
  /**
   * in reverse order
   */
  reverse = 'reverse',
}

export interface ISwarmStoreConnectorOrbitDbDatabaseIteratorOptionsRequired<
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
> {
  // if the equal operator applyied all other will not be applied
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]:
    | TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType>
    | TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType>[];
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.neq]:
    | TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType>
    | TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType>[];
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gt]: TSwarmStoreDatabaseEntityUniqueIndex<
    ESwarmStoreConnector.OrbitDB,
    DbType
  >;
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gte]: TSwarmStoreDatabaseEntityUniqueIndex<
    ESwarmStoreConnector.OrbitDB,
    DbType
  >;
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lt]: TSwarmStoreDatabaseEntityUniqueIndex<
    ESwarmStoreConnector.OrbitDB,
    DbType
  >;
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lte]: TSwarmStoreDatabaseEntityUniqueIndex<
    ESwarmStoreConnector.OrbitDB,
    DbType
  >;
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: number;
  [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.reverse]: boolean;
}

export interface ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
> extends Partial<ISwarmStoreConnectorOrbitDbDatabaseIteratorOptionsRequired<DbType>> {}

export interface ISwarmStoreConnectorOrbitDbDatabaseIteratorAnswer<T> {
  collect(): T[];
}

export type TSwarmStoreConnectorOrbitDbDatabaseMethodNames = ESwarmStoreConnectorOrbitDbDatabaseMethodNames;

export type TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<TStoreValue> = {
  value: TStoreValue;
  /**
   * Key of the value for Key-Value database store type.
   *
   * @type {TSwarmStoreConnectorOrbitDbDatabaseStoreKey}
   */
  key?: TSwarmStoreConnectorOrbitDbDatabaseStoreKey;
};

export type TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbClose = void;

// how many items to load
export type TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad = number;

export type TSwarmStoreConnectorOrbitDbDatabaseMethodArgument<
  TStoreValue,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
> =
  | TSwarmStoreConnectorOrbitDbDatabaseStoreHash
  | TStoreValue
  | TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<TStoreValue>
  | ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  | TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbClose
  | TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad;
