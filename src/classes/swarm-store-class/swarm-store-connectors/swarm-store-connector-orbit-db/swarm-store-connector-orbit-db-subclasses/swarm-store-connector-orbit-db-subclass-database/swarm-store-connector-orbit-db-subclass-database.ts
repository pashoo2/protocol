import * as orbitDbModule from 'orbit-db';
import OrbitDbFeedStore from 'orbit-db-feedstore';
import OrbitDbKeyValueStore from 'orbit-db-kvstore';
import {
  ISwarmStoreConnectorOrbitDbDatabaseOptions,
  ISwarmStoreConnectorOrbitDbDatabaseEvents,
  ISwarmStoreConnectorOrbitDbDatabaseValue,
  ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions,
  TSwarmStoreConnectorOrbitDbDatabaseEntityIndex,
} from './swarm-store-connector-orbit-db-subclass-database.types';
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import {
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX,
  EOrbidDBFeedSoreEvents,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT_DEFAULT,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT,
} from './swarm-store-connector-orbit-db-subclass-database.const';
import {
  COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON,
  COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_OFF,
} from 'const/common-values/common-values';
import { SwarmStoreConnectorOrbitDBSubclassAccessController } from '../swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller';
import { ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions } from '../swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller.types';
import {
  ESwarmStoreConnectorOrbitDbDatabaseIteratorOption,
  TSwarmStoreConnectorOrbitDbDatabase,
} from './swarm-store-connector-orbit-db-subclass-database.types';
import {
  EOrbitDbStoreOperation,
  ESwarmStoreConnectorOrbitDbDatabaseType,
} from './swarm-store-connector-orbit-db-subclass-database.const';
import { ESwarmStoreEventNames, ESwarmStoreConnector } from '../../../../swarm-store-class.const';
import { TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad } from './swarm-store-connector-orbit-db-subclass-database.types';
import {
  ISwarmStoreConnectorRequestLoadAnswer,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
} from '../../../../swarm-store-class.types';
import { TSwarmStoreDatabaseEntityAddress, TSwarmStoreDatabaseOptions } from '../../../../swarm-store-class.types';
import { TSwarmStoreConnectorOrbitDbDatabaseStoreHash } from './swarm-store-connector-orbit-db-subclass-database.types';
import {
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_PRELOAD_COUNT_MIN,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_FILTER_OPTIONS,
} from './swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclasses-cache.types';
import { IPromisePending } from '../../../../../../types/promise.types';
import { ISwarmStoreConnectorBasic } from '../../../../swarm-store-class.types';
import { createPromisePending, resolvePromisePending } from '../../../../../../utils/common-utils/commom-utils.promies';
import { validateOrbitDBDatabaseOptionsV1 } from '../../swarm-store-connector-orbit-db-validators/swarm-store-connector-orbit-db-validators-db-options';
import { isDefined } from '../../../../../../utils/common-utils/common-utils-main';
import {
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_VALUES_GETTER,
  ESortFileds,
} from './swarm-store-connector-orbit-db-subclass-database.const';
import { PropsByAliasesGetter } from '../../../../../basic-classes/props-by-aliases-getter/props-by-aliases-getter';
import { Sorter } from '../../../../../basic-classes/sorter-class/sorter-class';
import { IPropsByAliasesGetter } from '../../../../../basic-classes/props-by-aliases-getter/props-by-aliases-getter.types';
import { ESortingOrder } from '../../../../../basic-classes/sorter-class';
import { ISortingOptions } from '../../../../../basic-classes/sorter-class/sorter-class.types';
import { getEventEmitterClass } from '../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base';
import {
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_INT_MS,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_SIZE,
} from './swarm-store-connector-orbit-db-subclass-database.const';
import {
  TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument,
  TSwarmStoreConnectorOrbitDbDatabaseStoreKey,
} from './swarm-store-connector-orbit-db-subclass-database.types';

export class SwarmStoreConnectorOrbitDBDatabase<
    ItemType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
    DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
    DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>
  >
  extends getEventEmitterClass<any>()
  implements ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO> {
  // is loaded fully and ready to use
  public isReady: boolean = false;

  // whether is closed
  public isClosed: boolean = false;

  // a name of the database
  public dbName: string = '';

  private isFullyLoaded: boolean = false;

  private options?: ISwarmStoreConnectorOrbitDbDatabaseOptions<ItemType, DbType>;

  protected orbitDb?: orbitDbModule.OrbitDB;

  protected database?: TSwarmStoreConnectorOrbitDbDatabase<ItemType>;

  protected preloadCount: number = SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT_DEFAULT;

  protected newEntriesPending: [string, LogEntry<ItemType>, any][] = [];

  /**
   * Set entities existing (including DELETE operations entities) in the store count.
   *
   * @protected
   * @type {number}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected itemsOverallCountInStorage: number = 0;

  /**
   * entries already received and emitted.
   * { hash: signature }
   *
   * @protected
   * @type {Record<string, string>}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected entriesReceived: Record<string, string> = {};

  /**
   * Is creation of a new instance of the datbase is in progress
   *
   * @protected
   * @type {boolean}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected creatingNewDBInstancePromise: IPromisePending<Error | TSwarmStoreConnectorOrbitDbDatabase<ItemType>> | undefined;

  protected __iteratorSorter: Sorter<LogEntry<ItemType>, ESortFileds> | undefined;

  protected get _iteratorSorter(): Sorter<LogEntry<ItemType>, ESortFileds> {
    const sorter = this.__iteratorSorter;
    if (!sorter) {
      throw new Error('A sorter is not defined');
    }
    return sorter;
  }

  protected get itemsCurrentlyLoaded() {
    return Object.keys(this.entriesReceived).length;
  }

  protected get itemsOverallCount() {
    return Math.max(this.itemsOverallCountInStorage, this.itemsCurrentlyLoaded);
  }

  protected dbType: ESwarmStoreConnectorOrbitDbDatabaseType = ESwarmStoreConnectorOrbitDbDatabaseType.FEED;

  protected emitBatchesInterval?: NodeJS.Timer;

  protected _currentDatabaseRestartSilent?: Promise<TSwarmStoreConnectorOrbitDbDatabase<ItemType>>;

  /**
   * Whether all items from the persistent storage
   * were loaded in cache
   *
   * @readonly
   * @protected
   * @type {boolean}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected get _isAllItemsLoadedFromPersistentStorageToCache(): boolean {
    return this.itemsOverallCount === this.itemsCurrentlyLoaded;
  }

  protected get isKVStore() {
    return this.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
  }

  constructor(options: ISwarmStoreConnectorOrbitDbDatabaseOptions<ItemType, DbType>, orbitDb: orbitDbModule.OrbitDB) {
    super();
    this._validateOptions(options);
    this.setOptions(options);
    this.setOrbitDbInstance(orbitDb);
    this.__createSorter();
    debugger;
  }

  protected _validateOptions(options: ISwarmStoreConnectorOrbitDbDatabaseOptions<ItemType, DbType>): void {
    if (!options) {
      throw new Error('Options must be specified');
    }
    validateOrbitDBDatabaseOptionsV1(options);
  }

  public async connect(): Promise<Error | void> {
    const dbStore = await this.createDb();

    if (dbStore instanceof Error) {
      console.error(dbStore);
      return new Error('Failed to create a new database instance');
    }

    const loadDbResult = await dbStore.load(this.preloadCount);

    if ((loadDbResult as unknown) instanceof Error) {
      console.error(loadDbResult);
      return await this.onFatalError('The fatal error has occurred on databse loading', 'connect');
    }
  }

  public async close(opt?: any): Promise<Error | void> {
    return await this._close(opt);
  }

  public async add(addArg: TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<ItemType>): Promise<string | Error> {
    return await this._add(addArg);
  }

  /**
   * for the key value store a key must be used.
   * for the feed store a hash of the value
   * must be used.
   *
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  public async get(
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): Promise<Error | ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | undefined> {
    const databaseInstanceForQuerying = await this._getDatabaseInstanceForQuering();
    return this._get(keyOrHash, databaseInstanceForQuerying);
  }

  /**
   * Remove a value located in the key provided if it is a key value
   * database.
   * Remove an entry by it's address for a non key-value database.
   *
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} keyOrEntryAddress - key of a value for key-value store or entry address.
   * @returns {(Promise<Error | void>)}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  public async remove(keyOrEntryAddress: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex): Promise<Error | void> {
    return await this._remove(keyOrEntryAddress);
  }

  public async iterator(
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Promise<Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | undefined | Error>> {
    const messagesToReadCountLimitFromOptions =
      typeof options?.limit !== 'number' || options?.limit < -1 ? undefined : options?.limit;
    const iteratorOptionsRes = {
      ...(options || SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT),
      limit: messagesToReadCountLimitFromOptions,
    };
    // before to query the database entities must be preloaded from
    // a persitent storage to the memory cache.
    if (messagesToReadCountLimitFromOptions && !options?.fromCache) {
      await this.preloadEntitiesBeforeIterate(messagesToReadCountLimitFromOptions);
    }

    const databaseInstanceForQuerying = options?.fromCache ? this.database : await this._getDatabaseInstanceForQuering();

    if (!databaseInstanceForQuerying) {
      return new Error('Failed to get a database to read values from');
    }
    return this.iteratorDbOplog(iteratorOptionsRes, databaseInstanceForQuerying);
  }

  public async drop(): Promise<Error | void> {
    const database = this.getDbStoreInstance();

    if (database instanceof Error) {
      return database;
    }
    this.unsetAllListenersForEvents();
    try {
      await database.drop();
    } catch (err) {
      return err;
    }
  }

  /**
   * returns a count of an items loaded or Error
   *
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  public async load(
    count: TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad
  ): Promise<ISwarmStoreConnectorRequestLoadAnswer | Error> {
    const loadResult = await this._load(this.itemsCurrentlyLoaded + count);
    return loadResult;
  }

  public parseValueStored = (
    e: LogEntry<ItemType>
  ):
    | {
        id: LogEntry<ItemType>['identity']['id'];
        value: LogEntry<ItemType>['payload']['value'];
        key: LogEntry<ItemType>['payload']['key'];
        hash: LogEntry<ItemType>['hash'];
      }
    | Error
    | undefined => {
    const { payload, identity, hash } = e;

    if (payload) {
      if (payload.op === EOrbitDbStoreOperation.DELETE) {
        return undefined;
      }
      return {
        id: identity.id,
        value: payload.value,
        hash,
        key: this.isKVStore ? payload.key : undefined,
      };
    } else {
      return new Error('An unknown fromat of the data stored');
    }
  };

  protected createDb(): Promise<Error | TSwarmStoreConnectorOrbitDbDatabase<ItemType>> {
    this.unsetReadyState();
    return this.createDbInstance();
  }

  protected _get = (
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex,
    database: TSwarmStoreConnectorOrbitDbDatabase<ItemType>
  ): Error | ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | undefined => {
    const entryRaw = this.readRawEntry(keyOrHash, database);

    if (!entryRaw || entryRaw instanceof Error) {
      return entryRaw;
    }
    try {
      if (this.isKVStore) {
        if (entryRaw.payload.key !== keyOrHash) {
          return undefined;
        }
      } else if (entryRaw.hash !== keyOrHash) {
        return undefined;
      }
      return entryRaw;
    } catch (err) {
      return err;
    }
  };

  protected async _close(opt?: any): Promise<Error | void> {
    this.unsetAllListenersForEvents();
    this.unsetReadyState();
    this.resetEntriesPending();
    this.resetEntriesReceived();
    this.unsetEmithBatchInterval();
    this.resetItemsOverall();
    this.__unsetSorter();
    this.isClosed = true;

    let result: undefined | Error;

    try {
      const closeCurrentStoreResult = await this.closeCurrentStore();

      if (closeCurrentStoreResult instanceof Error) {
        result = closeCurrentStoreResult;
      }
    } catch (err) {
      result = err;
    }
    this.emitEvent(ESwarmStoreEventNames.CLOSE, this);
    return result;
  }

  protected async _add(addArg: TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<ItemType>): Promise<string | Error> {
    const { value, key } = addArg;
    const database = this.getDbStoreInstance();
    debugger;
    if (database instanceof Error) {
      return database;
    }
    try {
      let hash: TSwarmStoreConnectorOrbitDbDatabaseStoreHash;
      if (this.isKVStore) {
        if (!key) {
          return new Error('Key must be provided for the key-value storage');
        }
        /*
         TODO - https://github.com/orbitdb/orbit-db/blob/master/API.md#setkey-value.
         the 'set' method returns hash of entry added
        */
        hash = ((await (database as OrbitDbKeyValueStore<ItemType>).set(
          key,
          value
        )) as unknown) as TSwarmStoreConnectorOrbitDbDatabaseStoreHash;
      } else {
        hash = await (database as OrbitDbFeedStore<ItemType>).add(value);
      }
      console.log(`ADDED DATA WITH HASH -- ${hash}`);

      if (typeof hash !== 'string') {
        return new Error('An unknown type of hash was returned for the value stored');
      }
      return hash;
    } catch (err) {
      console.trace(err);
      return err;
    }
  }

  protected async _remove(keyOrEntryAddress: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex): Promise<Error | void> {
    try {
      await (this.isKVStore ? this.removeKeyKVStore(keyOrEntryAddress) : this.removeEntry(keyOrEntryAddress));
    } catch (err) {
      return err;
    }
  }

  protected async restartDbInstanceSilent(): Promise<Error | TSwarmStoreConnectorOrbitDbDatabase<ItemType>> {
    const { database } = this;

    // TODO - it's a hack for the custom database's cache provider
    const cacheStore = database && this.getDatabaseCache(database);
    let methodResult: Error | TSwarmStoreConnectorOrbitDbDatabase<ItemType> = new Error('Failed to restart db instance');

    cacheStore && this.setPreventCloseDatabaseCache(cacheStore);
    try {
      this.unsetAllListenersForEvents();

      const result = await this.closeCurrentStore();

      if (result instanceof Error) {
        console.error('Failed to close the instance of store');
        methodResult = result;
        return result;
      }
      methodResult = await this.createDbInstanceSilent();
      if (methodResult instanceof Error) {
        return methodResult;
      }
      cacheStore && this.unsetPreventCloseDatabaseCache(cacheStore);
      return methodResult;
    } catch (err) {
      methodResult = err;
      return err;
    } finally {
      if (cacheStore && methodResult instanceof Error) {
        await this.closeDatabaseCache(cacheStore);
      }
    }
  }

  /**
   * Set count of all(including DELETE operations) the entities existing in the store
   *
   * @protected
   * @param {number} total - all entities, including DELETE entities, count
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected setItemsOverallCount(total: number) {
    const newTotal = Math.max(this.itemsOverallCountInStorage, total);
    if (this.itemsOverallCountInStorage !== newTotal) {
      this.itemsOverallCountInStorage = newTotal;
      console.log('total number of entries', total);
    }
  }

  /**
   * increment the overall count by 1, which are stored in the
   * storage but may be not loaded with the sb.load method
   *
   * @protected
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected incItemsOverallCountByOne() {
    this.setItemsOverallCount(this.itemsOverallCountInStorage + 1);
  }

  protected resetItemsOverall() {
    this.itemsOverallCountInStorage = 0;
  }

  /**
   * returns a count of an items loaded or Error
   *
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected async _load(
    count: TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad
  ): Promise<ISwarmStoreConnectorRequestLoadAnswer | Error> {
    const itemsLoaded = this.itemsCurrentlyLoaded;

    if (count) {
      const result = await this._restartCurrentDbSilentAndPreloadInQueue(count);
      if (!result) {
        throw new Error('Failed to restart and preload the database');
      }
    }
    return {
      count: this.itemsCurrentlyLoaded - itemsLoaded,
      loadedCount: this.itemsCurrentlyLoaded,
      overallCount: this.itemsOverallCount,
    };
  }

  protected getLogEntryHash(logEntry: LogEntry<ItemType>): TSwarmStoreDatabaseEntityAddress<ESwarmStoreConnector.OrbitDB> {
    return logEntry.hash;
  }

  protected getLogEntryKey(
    logEntry: LogEntry<ItemType>
  ): TSwarmStoreDatabaseEntityAddress<ESwarmStoreConnector.OrbitDB> | undefined {
    return logEntry.payload?.key;
  }

  protected _getLodEntryAddedTime(logEntry: LogEntry<ItemType>): number {
    return logEntry.clock.time;
  }

  /**
   * Read a value stored in the database storage
   * by key or value unique hash
   *
   * @protected
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} keyOrHash
   * @returns {(ItemType
   *     | LogEntry<ItemType>
   *     | Error
   *     | undefined)}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected readRawValueFromStorage = (
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex,
    database: TSwarmStoreConnectorOrbitDbDatabase<ItemType>
  ): ItemType | LogEntry<ItemType> | Error | undefined => {
    const entryRawOrStoreValue = database.get(keyOrHash) as ItemType | LogEntry<ItemType> | Error | undefined;

    return entryRawOrStoreValue;
  };

  protected _getAllOplogEntriesOrErrors(database: TSwarmStoreConnectorOrbitDbDatabase<ItemType>): LogEntry<ItemType>[] | Error {
    try {
      return (database as any)._oplog.values as LogEntry<ItemType>[];
    } catch (err) {
      return err;
    }
  }

  protected findAddedEntryForKeyInKeyValueDbOpLog(
    key: TSwarmStoreConnectorOrbitDbDatabaseStoreKey,
    entry: ItemType,
    database: OrbitDbFeedStore<ItemType>
  ): LogEntry<ItemType> | undefined | Error {
    const oplogAllValues = this._getAllOplogEntriesOrErrors(database);

    if (oplogAllValues instanceof Error) {
      return oplogAllValues;
    }
    return oplogAllValues.find((rawEntry) => {
      const pld = rawEntry?.payload;
      return pld?.op === EOrbitDbStoreOperation.PUT && pld.key === key && (pld?.value as ItemType | undefined) === entry;
    });
  }

  protected getAllAddedValuesFromOpLogOrError(
    database: TSwarmStoreConnectorOrbitDbDatabase<ItemType>
  ): LogEntry<ItemType>[] | Error {
    const oplogAllValues = this._getAllOplogEntriesOrErrors(database);

    if (oplogAllValues instanceof Error) {
      return oplogAllValues;
    }
    return oplogAllValues
      .filter((entry) => {
        const pld = entry?.payload;
        return pld?.op === EOrbitDbStoreOperation.PUT;
      })
      .filter(isDefined);
  }

  /**
   * Read the raw entry from the database
   *
   * @protected
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} keyOrHash
   * @returns {(ItemType
   *     | LogEntry<ItemType>
   *     | Error
   *     | undefined)}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected readRawEntry = (
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex,
    database: TSwarmStoreConnectorOrbitDbDatabase<ItemType>
  ): LogEntry<ItemType> | Error | undefined => {
    try {
      // read LogEntry by hash in feed store or by key for KeyValue store
      const entryRawOrStoreValue = this.readRawValueFromStorage(keyOrHash, database);
      const entryRaw = (entryRawOrStoreValue && this.isKVStore
        ? // for a key value store db type read all oplog to find the full log entry into it
          this.findAddedEntryForKeyInKeyValueDbOpLog(
            keyOrHash,
            entryRawOrStoreValue as ItemType,
            database as OrbitDbFeedStore<ItemType>
          )
        : entryRawOrStoreValue) as LogEntry<ItemType> | Error | undefined;

      if (entryRaw instanceof Error) {
        return new Error('An error has occurred on get the data from the key');
      }
      return entryRaw;
    } catch (err) {
      return new Error(`Failed to read a raw entry from the databse: ${err.message}`);
    }
  };

  protected _filterEntryByIteratorOperationCondition<OP extends ESwarmStoreConnectorOrbitDbDatabaseIteratorOption>(
    logEntry: LogEntry<ItemType>,
    operationCondition: OP,
    operationConditionValue: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>[OP]
  ): boolean {
    // TODO - create class for filters
    const logEntryHashOrKey = this.isKVStore ? this.getLogEntryKey(logEntry) : this.getLogEntryHash(logEntry);
    const logEntryAddedTime = this._getLodEntryAddedTime(logEntry);
    switch (operationCondition) {
      case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq:
        if (logEntryHashOrKey && operationConditionValue instanceof Array) {
          return (operationConditionValue as TSwarmStoreDatabaseEntityAddress<ESwarmStoreConnector.OrbitDB>[]).includes(
            logEntryHashOrKey
          );
        }
        return logEntryHashOrKey === operationConditionValue;
      case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.neq:
        if (logEntryHashOrKey && operationConditionValue instanceof Array) {
          return !(operationConditionValue as TSwarmStoreDatabaseEntityAddress<ESwarmStoreConnector.OrbitDB>[]).includes(
            logEntryHashOrKey
          );
        }
        return logEntryHashOrKey !== operationConditionValue;
      case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gt:
        return !!logEntryHashOrKey && logEntryHashOrKey > operationConditionValue;
      case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gte:
        return !!logEntryHashOrKey && logEntryHashOrKey >= operationConditionValue;
      case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lt:
        return !!logEntryHashOrKey && logEntryHashOrKey < operationConditionValue;
      case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lte:
        return !!logEntryHashOrKey && logEntryHashOrKey <= operationConditionValue;
      case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gtT:
        return logEntryAddedTime > operationConditionValue;
      case ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.ltT:
        return logEntryAddedTime < operationConditionValue;
      default:
        // if there is no filters applyed
        return true;
    }
  }

  protected isOplogEntry = (value: any): value is LogEntry<ItemType> => {
    // TODO - create JSONSchema for validation
    return Boolean(
      value &&
        typeof value === 'object' &&
        !(value instanceof Error) &&
        (value as LogEntry<ItemType>).payload &&
        (value as LogEntry<ItemType>).clock &&
        (value as LogEntry<ItemType>).identity?.id &&
        (value as LogEntry<ItemType>).sig
    );
  };

  protected _filterOplogValuesByOplogOperationConditions = (
    logEntriesList: LogEntry<ItemType>[],
    filterOptions: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Array<LogEntry<ItemType>> => {
    return logEntriesList.filter((logEntry) => {
      return Object.entries(filterOptions).every(([operationCondition, operationConditionValue]) => {
        return this._filterEntryByIteratorOperationCondition(
          logEntry,
          operationCondition as ESwarmStoreConnectorOrbitDbDatabaseIteratorOption,
          operationConditionValue
        );
      });
    });
  };

  protected _sortOplogValuesByAddedTime<T extends Array<Error | undefined | LogEntry<ItemType>>>(
    logEntriesList: T,
    direction: ESortingOrder
  ): T {
    return this._sortIteratedItems<T>(logEntriesList, {
      [ESortFileds.TIME]: direction,
    });
  }

  protected getValuesForEqualIteratorOption(
    eqOperand: string | string[],
    database: TSwarmStoreConnectorOrbitDbDatabase<ItemType>
  ): Array<ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | Error | undefined> {
    const pending =
      typeof eqOperand === 'string' ? [this._get(eqOperand, database)] : eqOperand.map((h) => this._get(h, database));

    return pending;
  }

  protected async preloadEntitiesBeforeIterate(count: number): Promise<void> {
    if (this._isAllItemsLoadedFromPersistentStorageToCache) {
      return;
    }
    if (count === -1 || Number(count) > this.itemsCurrentlyLoaded) {
      // before to query the database entities must be preloaded in memory
      await this._load(count);
    }
  }

  protected _getOnlyFilterIteratorOperatorsList(
    iteratorOptions: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): ESwarmStoreConnectorOrbitDbDatabaseIteratorOption[] {
    return (Object.keys(iteratorOptions) as ESwarmStoreConnectorOrbitDbDatabaseIteratorOption[]).filter((option): boolean => {
      return SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_FILTER_OPTIONS.includes(option);
    });
  }

  protected _isExistsFilterByEntryTimeAdded(
    iteratorOptions: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): boolean {
    return Boolean(iteratorOptions.gtT) || Boolean(iteratorOptions.ltT);
  }

  protected _sortIteratedItems<T extends Array<Error | undefined | LogEntry<ItemType>>>(
    iteratedItems: T,
    sortingOptions: Partial<ISortingOptions<LogEntry<any>, ESortFileds>>
  ): T {
    const errorsAndNonDefinedEntries = [] as Array<Error | undefined>;
    const logEntries = [] as Array<LogEntry<ItemType>>;

    for (let index = 0; index < iteratedItems.length; index += 1) {
      const element = iteratedItems[index];

      if (element == null || element instanceof Error) {
        errorsAndNonDefinedEntries.push(element);
      } else {
        logEntries.push(element);
      }
    }

    const orderedItems = this._iteratorSorter.sort(logEntries, sortingOptions);

    // TODO - is it really necessary to merge this arrays
    return (errorsAndNonDefinedEntries.length ? [...orderedItems, ...errorsAndNonDefinedEntries] : orderedItems) as T;
  }

  protected iteratorDbOplog(
    iteratorOptions: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>,
    database: TSwarmStoreConnectorOrbitDbDatabase<ItemType>
  ): Error | Array<LogEntry<ItemType> | undefined | Error> {
    const isExistsFilterByEntryAddedTime = this._isExistsFilterByEntryTimeAdded(iteratorOptions);
    const filterOperatorsList = this._getOnlyFilterIteratorOperatorsList(iteratorOptions);
    let iteratedValues: Array<LogEntry<ItemType> | undefined | Error> = [];
    // TODO - refactor it
    if (iteratorOptions.eq && !isExistsFilterByEntryAddedTime && filterOperatorsList.length === 1) {
      // if only equals condition, then return values only for the equals
      const valuesForEqualOperator = this.getValuesForEqualIteratorOption(iteratorOptions.eq, database);
      if (valuesForEqualOperator instanceof Error) {
        return valuesForEqualOperator;
      }
      iteratedValues = valuesForEqualOperator;
    } else {
      let oplogEntriesOrUndefinedOrErrorsToIterate: Array<LogEntry<ItemType> | undefined | Error> = [];

      if (isExistsFilterByEntryAddedTime) {
        //  use the full oplog instead of .iterator() if we need to filter through all the oplog
        const oplogAddedEntriesWithErrors = this.getAllAddedValuesFromOpLogOrError(database);
        if (oplogAddedEntriesWithErrors instanceof Error) {
          return oplogAddedEntriesWithErrors;
        }
        oplogEntriesOrUndefinedOrErrorsToIterate = oplogAddedEntriesWithErrors;
      } else if (this.isKVStore) {
        // for key value store read only the existsing keys
        oplogEntriesOrUndefinedOrErrorsToIterate = this.getValuesForEqualIteratorOption(
          Object.keys((database as OrbitDbKeyValueStore<ItemType>).all),
          database
        );
      } else {
        // feed store has it's own iterator method
        oplogEntriesOrUndefinedOrErrorsToIterate = (database as OrbitDbFeedStore<ItemType>).iterator(iteratorOptions).collect();
      }
      iteratedValues = filterOperatorsList.length
        ? // if filter operators are exists into the options
          this._filterOplogValuesByOplogOperationConditions(
            oplogEntriesOrUndefinedOrErrorsToIterate.filter(this.isOplogEntry),
            iteratorOptions
          )
        : // if filer operators are not exists into the options, it means that there is nothing to filter
          oplogEntriesOrUndefinedOrErrorsToIterate;
    }
    if (iteratorOptions.reverse) {
      iteratedValues = iteratedValues.reverse();
    }
    if (iteratorOptions.sortBy) {
      iteratedValues = this._sortIteratedItems(iteratedValues, iteratorOptions.sortBy);
      console.log('iteratedValues', iteratedValues);
      console.log('iteratorOptions.sortBy', iteratorOptions.sortBy);
    }
    if (Number(iteratorOptions.limit) > 0) {
      iteratedValues = iteratedValues.slice(0, iteratorOptions.limit);
    }
    return iteratedValues;
  }

  private getDbStoreInstance(): Error | TSwarmStoreConnectorOrbitDbDatabase<ItemType> {
    const { isReady, database } = this;

    if (!isReady) {
      return new Error('The store is not ready to use');
    }
    if (!database) {
      return this.emitError('The database store instance is not exists');
    }
    return database;
  }

  private setReadyState(isReady: boolean = true) {
    this.isReady = isReady;
  }

  private unsetReadyState() {
    this.setReadyState(false);
  }

  protected unsetAllListenersForEvents = () => {
    if (this.database) {
      this.unsetStoreEventListeners(this.database);
    }
  };

  protected emitError(error: Error | string, mehodName?: string, isFatal: boolean = false): Error {
    const err = typeof error === 'string' ? new Error() : error;
    const eventName = isFatal ? ESwarmStoreEventNames.FATAL : ESwarmStoreEventNames.ERROR;

    console.error(`${SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX}::error${mehodName ? `::${mehodName}` : ''}`);
    console.error(error);
    this.emit(eventName, err);
    return err;
  }

  protected async onFatalError(error: Error | string, methodName: string) {
    this.unsetReadyState();
    this.emitError(error, methodName, true);

    const { isClosed } = this;

    if (!isClosed) {
      await this._close();
    }
    return this.emitError('The database closed cause a fatal error', methodName, true);
  }

  protected emitEvent(event: ESwarmStoreEventNames, ...args: any[]) {
    const { options } = this;

    if (!options) {
      throw new Error('Options are not exists');
    }

    const { dbName } = options;

    this.emit(event, dbName, ...args);
  }

  private getStoreOptions(): IStoreOptions | undefined | Error {
    return SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION;
  }

  private emitFullyLoaded() {
    if (!this.isFullyLoaded) {
      this.isFullyLoaded = true;
      this.emitEvent(ESwarmStoreEventNames.LOADING, 100);
    }
  }

  /**
   * Deletes the Object associated with key.
   * Returns a Promise that resolves to a String that is the multihash of the deleted entry.
   *
   * @protected
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} key - key of a value
   * @returns {(Promise<Error | void>)}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   * @throws
   */
  protected async removeKeyKVStore(key: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex): Promise<void> {
    const database = this.getDbStoreInstance() as OrbitDbKeyValueStore<ItemType>;

    if (database instanceof Error) {
      throw database;
    }
    try {
      const hashRemoved = await database.del(key);

      if (typeof hashRemoved !== 'string') {
        throw new Error('An unknown type of hash was returned for the value removed');
      }
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to remove an object by the key ${key}: ${err.message}`);
    }
  }

  /**
   * Remove an entry by it's address provided
   *
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} entryAddress
   * @returns {(Promise<Error | void>)}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   * @throws
   */
  public async removeEntry(entryAddress: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex): Promise<Error | void> {
    const database = this.getDbStoreInstance() as OrbitDbFeedStore<ItemType>;

    if (database instanceof Error) {
      throw database;
    }
    try {
      await database.remove(entryAddress);
    } catch (err) {
      console.error(err);
      return new Error(`Failed to remove an entry by the address ${entryAddress}: ${err.message}`);
    }
  }

  private emitNewEntry = (address: string, entry: LogEntry<ItemType>, heads: any) => {
    console.log('emit new entry', {
      address,
      entry,
      heads,
      itemsCurrentlyLoaded: this.itemsCurrentlyLoaded,
      itemsOverallCount: this.itemsOverallCount,
    });
    this.emit(ESwarmStoreEventNames.NEW_ENTRY, [this.dbName, entry, address, heads, this.dbType, this]);
  };

  private emitEmtriesPending() {
    this.startEmitBatchesInterval();
  }

  /**
   * check was the message received
   *
   * @private
   * @param {LogEntry<ItemType>} entry
   * @returns
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  private checkWasEntryReceived(entry: LogEntry<ItemType>) {
    return this.entriesReceived[entry.hash] === entry.sig;
  }

  private addMessageToReceivedMessages(entry: LogEntry<ItemType>) {
    if (!this.checkWasEntryReceived(entry)) {
      this.entriesReceived[entry.hash] = entry.sig;
    }
  }

  private resetEntriesReceived() {
    this.entriesReceived = {};
  }

  private resetEntriesPending() {
    this.newEntriesPending = [];
  }

  private addMessageToEmitPending(address: string, entry: LogEntry<ItemType>, heads: any): void {
    this.newEntriesPending.push([address, entry, heads]);
  }

  private handleNewEntry = (address: string, entry: LogEntry<ItemType>, heads: any): void => {
    if (!this.checkWasEntryReceived(entry)) {
      this.addMessageToEmitPending(address, entry, heads);
      this.addMessageToReceivedMessages(entry);
    }
  };

  private handleFeedStoreReady = () => {
    this.emitFullyLoaded();
    this.setReadyState();
    this.emitEvent(ESwarmStoreEventNames.READY);
    this.emitEmtriesPending();
  };

  private handleFeedStoreReadySilent = () => {
    this.setReadyState();
    this.emitEmtriesPending();
  };

  private handleFeedStoreLoaded = () => {
    // emit event that the database local copy was fully loaded
    // this.emitFullyLoaded();
  };

  protected handleFeedStoreLoadProgressSilent = (
    address: string,
    hash: string,
    entry: LogEntry<ItemType>,
    progress: number,
    // all entities, including DELETE entities
    total: number
  ) => {
    this.setItemsOverallCount(total);
    this.handleNewEntry(address, entry, {});
  };

  private handleFeedStoreLoadProgress = (
    address: string,
    hash: string,
    entry: LogEntry<ItemType>,
    progress: number,
    total: number
  ) => {
    this.handleFeedStoreLoadProgressSilent(address, hash, entry, progress, total);
    // emit event database local copy loading progress
    this.emitEvent(ESwarmStoreEventNames.LOADING, (progress / (this.preloadCount <= 0 ? total : this.preloadCount)) * 100);
  };

  private handleFeedStoreReplicated = () => {
    // emit event that the db updated, cause it
    // was replicated with another peer db copy
    const { dbName } = this;
    console.log('REPLICATED', { dbName });
    this.emitEvent(ESwarmStoreEventNames.UPDATE, dbName);
    this.emitEmtriesPending();
  };

  private handleFeedStoreClosed = async () => {
    const { isClosed } = this;

    if (!isClosed) {
      this.unsetReadyState();
      this.emitError('The instance was closed unexpected', 'handleFeedStoreClosed');
      await this.restartStore();
    }
  };

  private async closeInstanceOfStore(storeInstance: TSwarmStoreConnectorOrbitDbDatabase<ItemType>): Promise<Error | void> {
    if (!storeInstance) {
      return new Error('An instance of the store must be specified');
    }
    this.unsetStoreEventListeners(storeInstance);
    try {
      await storeInstance.close();
    } catch (err) {
      console.error(err);
      return new Error('Fatal error has occurred on close the instance of the Feed store');
    }
  }

  private async closeCurrentStore(): Promise<Error | void> {
    const { database } = this;

    if (database) {
      const closeStoreResult = await this.closeInstanceOfStore(database);

      if (closeStoreResult instanceof Error) {
        console.error(closeStoreResult);
        return new Error('Failed to close the current instance of the Database store');
      }
      if (database === this.database) {
        this.database = undefined;
      }
    }
  }

  private setPreventCloseDatabaseCache(cache: ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore): void {
    cache.setPreventClose(true);
  }

  private unsetPreventCloseDatabaseCache(cache: ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore): void {
    cache.setPreventClose(false);
  }

  private async closeDatabaseCache(cache: ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore): Promise<void> {
    await cache.close();
  }

  private getDatabaseCache(
    database: OrbitDbFeedStore<ItemType> | OrbitDbKeyValueStore<ItemType>
  ): ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore {
    return (this.database as any)?._cache._store as ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore;
  }

  // restart the store
  private async restartStore(): Promise<Error | void> {
    const { isClosed, database } = this;
    const cacheStore = database && this.getDatabaseCache(database);
    let result: undefined | Error;

    if (isClosed) {
      return new Error('The store was closed previousely');
    }
    cacheStore && this.setPreventCloseDatabaseCache(cacheStore);
    try {
      const currentStoreStopResult = await this.closeCurrentStore();

      if (currentStoreStopResult instanceof Error) {
        console.error(currentStoreStopResult);
        result = await this.onFatalError(
          'Failed to restart the Database cause failed to close the store instance',
          'restartStore'
        );
        return result;
      }
      const connectResult = await this.connect();

      if (connectResult instanceof Error) {
        result = connectResult;
      }
      cacheStore && this.unsetPreventCloseDatabaseCache(cacheStore);
    } catch (err) {
      console.error(err);
      result = err;
    } finally {
      if (result instanceof Error) {
        cacheStore && this.closeDatabaseCache(cacheStore);
      }
    }
  }

  private handleFeedStoreReplicateInProgress = (
    address: string,
    hash: string,
    entry: LogEntry<ItemType>,
    progress: number,
    have: unknown
  ) => {
    console.warn(`handleFeedStoreReplicateInProgress::
      addr: ${address}
      hash: ${hash}
      progress: ${progress}
    `);
    this.handleNewEntry(address, entry, {});
  };

  private handleWrite = (address: string, entry: LogEntry<ItemType>, heads: any) => {
    // otherwise doubling of the overall count will be caused
    if (!this.checkWasEntryReceived(entry)) {
      this.incItemsOverallCountByOne();
    }
    this.handleNewEntry(address, entry, heads);
  };

  private setFeedStoreEventListeners(
    db: TSwarmStoreConnectorOrbitDbDatabase<ItemType>,
    isSet = true,
    isSilent = false
  ): Error | void {
    if (!db) {
      return new Error('An instance of the FeedStore must be specified');
    }
    if (!db.events) {
      return new Error('An unknown API of the FeedStore');
    }
    if (typeof db.events.addListener !== 'function' || typeof db.events.removeListener !== 'function') {
      return new Error('An unknown API of the FeedStore events');
    }

    const methodName = isSet ? COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON : COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_OFF;

    db.events[methodName](EOrbidDBFeedSoreEvents.READY, isSilent ? this.handleFeedStoreReadySilent : this.handleFeedStoreReady);
    db.events[methodName](
      EOrbidDBFeedSoreEvents.LOAD_PROGRESS,
      isSilent ? this.handleFeedStoreLoadProgressSilent : this.handleFeedStoreLoadProgress
    );
    db.events[methodName](EOrbidDBFeedSoreEvents.LOAD, this.handleFeedStoreLoaded);
    db.events[methodName](EOrbidDBFeedSoreEvents.REPLICATED, this.handleFeedStoreReplicated);
    db.events[methodName](EOrbidDBFeedSoreEvents.CLOSE, this.handleFeedStoreClosed);
    db.events[methodName](EOrbidDBFeedSoreEvents.REPLICATE_PROGRESS, this.handleFeedStoreReplicateInProgress);
    db.events[methodName](EOrbidDBFeedSoreEvents.WRITE, this.handleWrite);
  }

  private setFeedStoreEventListenersSilent = (db: TSwarmStoreConnectorOrbitDbDatabase<ItemType>) => {
    this.setFeedStoreEventListeners(db, undefined, true);
  };

  private unsetStoreEventListeners(feedStore: TSwarmStoreConnectorOrbitDbDatabase<ItemType>) {
    this.setFeedStoreEventListeners(feedStore, false);
  }

  private getAccessControllerOptions(): ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<ItemType> {
    const { options: dbOptions } = this;
    const resultedOptions: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<ItemType> = {
      type: SwarmStoreConnectorOrbitDBSubclassAccessController.type,
    };

    if (!dbOptions) {
      return resultedOptions;
    }

    const { isPublic, write } = dbOptions;

    if (isPublic) {
      resultedOptions.write = ['*'];
    } else if (write instanceof Array) {
      resultedOptions.write = write.filter((identity) => identity && typeof identity === 'string');
    }

    if (typeof dbOptions.grantAccess === 'function') {
      resultedOptions.grantAccess = dbOptions.grantAccess;
    }
    return resultedOptions;
  }

  protected createPendingPromiseCreatingNewDBInstance() {
    this.creatingNewDBInstancePromise = createPromisePending();
  }

  protected resolvePendingPromiseCreatingNewDBInstance(result: Error | TSwarmStoreConnectorOrbitDbDatabase<ItemType>) {
    const { creatingNewDBInstancePromise } = this;
    if (creatingNewDBInstancePromise) {
      resolvePromisePending(creatingNewDBInstancePromise, result);
      this.creatingNewDBInstancePromise = undefined;
    }
  }

  protected async _waitTillCurrentDatabaseIsBeingRestarted(): Promise<TSwarmStoreConnectorOrbitDbDatabase<ItemType> | undefined> {
    while (this._currentDatabaseRestartSilent) {
      try {
        return await this._currentDatabaseRestartSilent;
      } catch {}
    }
  }

  protected async _getDatabaseInstanceForQuering() {
    if (this.isClosed) {
      throw new Error('This instance has been closed');
    }
    if (this._currentDatabaseRestartSilent) {
      await this._waitTillCurrentDatabaseIsBeingRestarted();
    }
    if (this.isClosed) {
      throw new Error('This instance has been closed');
    }
    const database = this.database;
    if (!database) {
      throw new Error('There is no acitve database instance');
    }
    return database;
  }

  private async createDbInstance(isSilent: boolean = false): Promise<Error | TSwarmStoreConnectorOrbitDbDatabase<ItemType>> {
    const { creatingNewDBInstancePromise } = this;
    if (creatingNewDBInstancePromise) {
      return await creatingNewDBInstancePromise;
    }

    let methodResult: Error | TSwarmStoreConnectorOrbitDbDatabase<ItemType> = new Error(
      'createDbInstance failed for unknown reason'
    );

    try {
      this.createPendingPromiseCreatingNewDBInstance();

      const { orbitDb, options } = this;

      if (!orbitDb) {
        methodResult = await this.onFatalError('There is no intance of the OrbitDb is specified', 'createDbInstance');
        return methodResult;
      }

      if (!options) {
        methodResult = await this.onFatalError('Options are not defined', 'createDbInstance');
        throw methodResult;
      }

      const { dbName, cache } = options;

      if (!dbName) {
        methodResult = await this.onFatalError('A name of the database must be specified', 'createDbInstance');
        return methodResult;
      }

      const dbStoreOptions = this.getStoreOptions();

      if (dbStoreOptions instanceof Error) {
        methodResult = await this.onFatalError(dbStoreOptions, 'createDbInstance::getStoreOptions');
        return methodResult;
      }

      const storeOptions = {
        ...SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION,
        cache,
        accessController: this.getAccessControllerOptions(),
      };

      const db: Error | TSwarmStoreConnectorOrbitDbDatabase<ItemType> = this.isKVStore
        ? await orbitDb.keyvalue(dbName, storeOptions)
        : await orbitDb.feed(dbName, storeOptions);

      if (db instanceof Error) {
        methodResult = await this.onFatalError(db, 'createDbInstance::feed store creation');
        return methodResult;
      }

      const setStoreListenersResult = isSilent ? this.setFeedStoreEventListenersSilent(db) : this.setFeedStoreEventListeners(db);

      if (setStoreListenersResult instanceof Error) {
        methodResult = await this.onFatalError(setStoreListenersResult, 'createDbInstance::set feed store listeners');
        return methodResult;
      }
      this.database = db;
      methodResult = db;

      return db;
    } catch (err) {
      methodResult = await this.onFatalError(err, 'createDbInstance');
      return methodResult;
    } finally {
      this.resolvePendingPromiseCreatingNewDBInstance(methodResult);
    }
  }

  private createDbInstanceSilent = (): Promise<OrbitDbFeedStore<ItemType> | OrbitDbKeyValueStore<ItemType> | Error> => {
    return this.createDbInstance(true);
  };

  private setOptions(options: ISwarmStoreConnectorOrbitDbDatabaseOptions<ItemType, DbType>): void {
    const { dbName, preloadCount, dbType } = options;

    if (typeof dbName !== 'string') {
      throw new Error('A name of the database must be specified');
    }
    if (preloadCount && typeof preloadCount !== 'number') {
      throw new Error('Preload count must be number');
    }
    if (dbType) {
      if (!Object.values(ESwarmStoreConnectorOrbitDbDatabaseType).includes(dbType)) {
        throw new Error('An unknown db store type');
      }
      this.dbType = dbType;
    }
    // preloadCount must not be 0.
    // If it's equals to 0, the database not firing events which
    // are necessary for the application to continue the work with
    // the database.
    this.preloadCount = (preloadCount ? preloadCount : undefined) || SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_PRELOAD_COUNT_MIN;
    this.options = options;
    this.dbName = dbName;
  }

  private setOrbitDbInstance(orbitDb: orbitDbModule.OrbitDB): void {
    if (!orbitDb) {
      throw new Error('An instance of orbit db must be specified');
    }
    this.orbitDb = orbitDb;
  }

  private emitEntries = (batchSize: number = SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_SIZE) => {
    if (this.newEntriesPending.length) {
      console.log('newEntriesPending count', this.newEntriesPending.length, {
        itemsCurrentlyLoaded: this.itemsCurrentlyLoaded,
        itemsOverallCount: this.itemsOverallCount,
      });
      this.newEntriesPending.splice(0, batchSize).forEach((newEntry) => newEntry && this.emitNewEntry(...newEntry));
    }
  };

  private emitBatch = () => {
    this.emitEntries();
  };

  private startEmitBatchesInterval() {
    this.emitBatchesInterval = setInterval(this.emitBatch, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_INT_MS);
  }

  private unsetEmithBatchInterval() {
    if (this.emitBatchesInterval) {
      clearInterval(this.emitBatchesInterval);
    }
  }

  private _setRestartDatabaseSilent(dbRestartSilentPromise: Promise<TSwarmStoreConnectorOrbitDbDatabase<ItemType>>): void {
    this._currentDatabaseRestartSilent = dbRestartSilentPromise;
  }

  private _unsetCurrentRestartDatabaseSilent() {
    this._currentDatabaseRestartSilent = undefined;
  }

  private async _restartCurrentDbSilentAndPreloadInQueue(
    count: TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad
  ): Promise<TSwarmStoreConnectorOrbitDbDatabase<ItemType> | undefined> {
    await this._waitTillCurrentDatabaseIsBeingRestarted();
    let restartDbSilent: Promise<TSwarmStoreConnectorOrbitDbDatabase<ItemType>> | undefined = undefined;
    try {
      restartDbSilent = this.restartDbInstanceSilent()
        .catch((err) => err)
        .then(async (dbInstance) => {
          if (dbInstance instanceof Error) {
            console.error('Failed to restart the database');
            return dbInstance;
          }
          if (!dbInstance) {
            return;
          }
          if (count) {
            await dbInstance.load(count);
          }
          return dbInstance;
        });
      this._setRestartDatabaseSilent(restartDbSilent);
      return await restartDbSilent;
    } finally {
      if (this._currentDatabaseRestartSilent === restartDbSilent) {
        this._unsetCurrentRestartDatabaseSilent();
      }
    }
  }

  private __createLogEntryFieldsValuesGetter(): IPropsByAliasesGetter<LogEntry<ItemType>> {
    return new PropsByAliasesGetter<LogEntry<ItemType>>(SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_VALUES_GETTER);
  }

  private __setSorter(sorter: Sorter<LogEntry<ItemType>, ESortFileds>): void {
    this.__iteratorSorter = sorter;
  }

  private __unsetSorter(): void {
    this.__iteratorSorter = undefined;
  }

  private __createSorter(): void {
    const logEntryPropsGetter = this.__createLogEntryFieldsValuesGetter();
    const logEntriesLisetSorter = new Sorter<LogEntry<ItemType>, ESortFileds>(logEntryPropsGetter);

    this.__setSorter(logEntriesLisetSorter);
  }
}
