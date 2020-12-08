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
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
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
  EOrbitDbFeedStoreOperation,
  ESwarmStoreConnectorOrbitDbDatabaseType,
} from './swarm-store-connector-orbit-db-subclass-database.const';
import { ESwarmStoreEventNames, ESwarmStoreConnector } from '../../../../swarm-store-class.const';
import {
  TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad,
  ISwarmStoreConnectorOrbitDbDatabaseIteratorOptionsRequired,
} from './swarm-store-connector-orbit-db-subclass-database.types';
import {
  ISwarmStoreConnectorRequestLoadAnswer,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
} from '../../../../swarm-store-class.types';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseOptions,
} from '../../../../swarm-store-class.types';
import { TSwarmStoreConnectorOrbitDbDatabaseStoreHash } from './swarm-store-connector-orbit-db-subclass-database.types';
import { SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_PRELOAD_COUNT_MIN } from './swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclasses-cache.types';
import { IPromisePending } from '../../../../../../types/promise.types';
import { ISwarmStoreConnectorBasic } from '../../../../swarm-store-class.types';
import { createPromisePending, resolvePromisePending } from '../../../../../../utils/common-utils/commom-utils.promies';
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
  extends EventEmitter<
    ISwarmStoreConnectorOrbitDbDatabaseEvents<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>, ItemType>
  >
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
   * set items overall count
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

  protected get itemsCurrentlyLoaded() {
    return Object.keys(this.entriesReceived).length;
  }

  protected get itemsOverallCount() {
    return Math.max(this.itemsOverallCountInStorage, this.itemsCurrentlyLoaded);
  }

  protected dbType: ESwarmStoreConnectorOrbitDbDatabaseType = ESwarmStoreConnectorOrbitDbDatabaseType.FEED;

  protected emitBatchesInterval?: NodeJS.Timer;

  protected get isKVStore() {
    return this.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
  }

  constructor(options: ISwarmStoreConnectorOrbitDbDatabaseOptions<ItemType, DbType>, orbitDb: orbitDbModule.OrbitDB) {
    super();
    this.setOptions(options);
    this.setOrbitDbInstance(orbitDb);
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
      return this.onFatalError('The fatal error has occurred on databse loading', 'connect');
    }
  }

  public async close(opt?: any): Promise<Error | void> {
    return this._close(opt);
  }

  public async add(addArg: TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<ItemType>): Promise<string | Error> {
    return this._add(addArg);
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
    return this._get(keyOrHash);
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
    return this._remove(keyOrEntryAddress);
  }

  public async iterator(
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Promise<Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | Error | undefined>> {
    return this.isKVStore ? this.iteratorKeyValueStore(options) : this.iteratorFeedStore(options);
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
    return this._load(this.itemsCurrentlyLoaded + count);
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
      if (payload.op === EOrbitDbFeedStoreOperation.DELETE) {
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

  protected _get = async (
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): Promise<Error | ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | undefined> => {
    const entryRaw = this.readRawEntry(keyOrHash);

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
      const dbInstance = await this.restartDbInstanceSilent();

      if (dbInstance instanceof Error) {
        console.error('Failed to restart the database');
        return dbInstance;
      }
      await dbInstance.load(count);
    }
    return {
      count: this.itemsCurrentlyLoaded - itemsLoaded,
      loadedCount: this.itemsCurrentlyLoaded,
      overallCount: this.itemsOverallCount,
    };
  }

  protected getLodEntryHash(logEntry: LogEntry<ItemType>): TSwarmStoreDatabaseEntityAddress<ESwarmStoreConnector.OrbitDB> {
    return logEntry.hash;
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
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): ItemType | LogEntry<ItemType> | Error | undefined => {
    const database = this.getDbStoreInstance();

    if (database instanceof Error) {
      return new Error(`Failed to get database insatane: ${database.message}`);
    }

    const entryRawOrStoreValue = database.get(keyOrHash) as ItemType | LogEntry<ItemType> | Error | undefined;

    return entryRawOrStoreValue;
  };

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
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): LogEntry<ItemType> | Error | undefined => {
    try {
      const entryRawOrStoreValue = this.readRawValueFromStorage(keyOrHash);
      const entryRaw = (entryRawOrStoreValue && this.isKVStore
        ? this.findInOplog(keyOrHash, entryRawOrStoreValue as ItemType)
        : entryRawOrStoreValue) as LogEntry<ItemType> | Error | undefined;

      if (entryRaw instanceof Error) {
        return new Error('An error has occurred on get the data from the key');
      }
      return entryRaw;
    } catch (err) {
      return new Error(`Failed to read a raw entry from the databse: ${err.message}`);
    }
  };

  protected findInOplog(
    key: TSwarmStoreConnectorOrbitDbDatabaseStoreKey,
    value: ItemType
  ): LogEntry<ItemType> | undefined | Error {
    const db = this.getDbStoreInstance();

    if (db instanceof Error) {
      return db;
    }

    return ((db as any)._oplog.values as LogEntry<ItemType>[]).find((entry) => {
      const pld = entry?.payload;
      return pld?.op === EOrbitDbFeedStoreOperation.PUT && pld?.value === value;
    });
  }

  protected filterRequltsFeedStore = (
    logEntriesList: Array<LogEntry<ItemType>>,
    filterOptions: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Array<LogEntry<ItemType>> => {
    const { gt, gte, lt, lte, neq } = filterOptions;

    if (!gt && !gte && !lt && !lte && !neq) {
      return logEntriesList;
    }
    return logEntriesList.filter((logEntry) => {
      // TODO - create class for filters
      const logEntryHash = this.getLodEntryHash(logEntry);

      if (neq) {
        if (neq instanceof Array) {
          return !(neq as TSwarmStoreDatabaseEntityAddress<ESwarmStoreConnector.OrbitDB>[]).includes(logEntryHash);
        }
        return neq !== logEntryHash;
      } else if (gte && logEntryHash >= gte) {
        return true;
      } else if (gt && logEntryHash > gt) {
        return true;
      } else if (lte && logEntryHash <= lte) {
        return true;
      } else if (lt && logEntryHash < lt) {
        return true;
      }
      return false;
    });
  };

  protected async preloadEntitiesBeforeIterate(count: number): Promise<void> {
    if (Number(count) > this.itemsCurrentlyLoaded) {
      // before to query the database entities must be preloaded in memory
      await this._load(count);
    }
  }

  protected async iteratorFeedStore(
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Promise<Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | Error | undefined>> {
    const iteratorOptionsRes = options || SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT;
    let limit = iteratorOptionsRes.limit;

    if (typeof limit !== 'number' || limit < 0) {
      limit = undefined;
    }
    // before to query the database entities must be preloaded in memory
    limit && (await this.preloadEntitiesBeforeIterate(limit));
    const eqOperand = options?.[ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq];
    // database instance can become another one after load() method call
    const database = this.getDbStoreInstance() as OrbitDbFeedStore<ItemType>;

    if (database instanceof Error) {
      return database;
    }
    if (eqOperand) {
      // if the equal operand passed within the argument
      // return just values queried by it and
      // ignore all other operators.
      return this.getValues(eqOperand, database);
    }

    let result = database.iterator(iteratorOptionsRes).collect();

    if (options) {
      result = this.filterRequltsFeedStore(result, options);
    }
    return result;
  }

  protected async iteratorKeyValueStore(
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Promise<Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | Error | undefined>> {
    // TODO - check it works
    const iteratorOptionsRes = options || SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT;
    let limit = iteratorOptionsRes.limit;

    if (typeof limit !== 'number' || limit < 0) {
      limit = undefined;
    }
    // before to query the database entities must be preloaded in memory
    limit && (await this.preloadEntitiesBeforeIterate(limit));

    const eqOperand = options?.[ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq];

    if (eqOperand) {
      // if the equal operand passed within the argument
      // return just values queried by it and
      // ignore all other operators.
      return this.getEqual(eqOperand);
    }
    // database instance can become another one after the load() method call
    const database = this.getDbStoreInstance() as OrbitDbKeyValueStore<ItemType>;
    if (database instanceof Error) {
      return database;
    }
    const keys = Object.keys(database.all);

    const { reverse } = iteratorOptionsRes as ISwarmStoreConnectorOrbitDbDatabaseIteratorOptionsRequired<DbType>;
    let keysList = (reverse ? keys.reverse() : keys).slice(0, limit);

    keysList = this.filterKeys(keysList, iteratorOptionsRes);
    return this.getValuesForKeys(keysList);
  }

  protected getEqual = async (
    eqOperand: string | string[]
  ): Promise<Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | Error | undefined>> => {
    if (eqOperand instanceof Array) {
      return Promise.all(eqOperand.map(this._get));
    }
    return [await this._get(eqOperand)];
  };

  protected filterKeys = (
    keysList: string[],
    filterOptions: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): string[] => {
    const { gt, gte, lt, lte, neq } = filterOptions;

    if (!gt && !gte && !lt && !lte && !neq) {
      return keysList;
    }
    return keysList.filter((key) => {
      if (neq) {
        if (neq instanceof Array) {
          return !(neq as TSwarmStoreDatabaseEntityKey<ESwarmStoreConnector.OrbitDB>[]).includes(key);
        }
        return neq !== key;
      } else if (gte && key >= gte) {
        return true;
      } else if (gt && key > gt) {
        return true;
      } else if (lte && key <= lte) {
        return true;
      } else if (lt && key < lt) {
        return true;
      }
      return false;
    });
  };

  protected getValuesForKeys = (
    keys: string[]
  ): Promise<Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | Error | undefined>> =>
    Promise.all(keys.map(this.readRawEntry)) as any;

  protected getValues(
    hash: string | string[],
    database: OrbitDbFeedStore<ItemType>
  ): Promise<Array<ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | Error | undefined>> {
    const pending = typeof hash === 'string' ? [this._get(hash)] : hash.map((h) => this._get(h));

    return Promise.all(pending);
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

    console.error(`${SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX}::error${mehodName ? `::${mehodName}` : ''}`, err);
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

  protected logStore = () => {
    // TODO
    // const database = this.getDbStoreInstance();
    // const posts = database!.iterator({ limit: -1 }).collect();
    // console.log('STORE::READY--');
    // posts.forEach((post: any) => {
    //   if (post && post.identity) {
    //     console.log(post.identity.id);
    //   }
    // });
    // console.log('--STORE::READY');
  };

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
    this.logStore();
    this.emitEmtriesPending();
  };

  private handleFeedStoreReadySilent = () => {
    this.setReadyState();
    this.logStore();
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
    this.logStore();
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
    this.logStore();
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
    const { options } = this;
    const resultedOptions: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<ItemType> = {
      type: SwarmStoreConnectorOrbitDBSubclassAccessController.type,
    };

    if (!options) {
      return resultedOptions;
    }

    const { isPublic, write, grantAccess } = options;

    if (isPublic) {
      resultedOptions.write = ['*'];
    } else if (write instanceof Array) {
      resultedOptions.write = write.filter((identity) => identity && typeof identity === 'string');
    }
    if (typeof grantAccess === 'function') {
      if (grantAccess.length !== 2) {
        console.warn('The grant access callback function must have 2 arguments');
      }
      resultedOptions.grantAccess = grantAccess;
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

  private async createDbInstance(isSilent: boolean = false): Promise<Error | TSwarmStoreConnectorOrbitDbDatabase<ItemType>> {
    const { creatingNewDBInstancePromise } = this;
    if (creatingNewDBInstancePromise) {
      return creatingNewDBInstancePromise;
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
    if (!options) {
      throw new Error('Options must be specified');
    }

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
}
