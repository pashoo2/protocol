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
import {
  ESwarmStoreEventNames,
  ESwarmStoreConnector,
} from '../../../../swarm-store-class.const';
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
} from '../../../../swarm-store-class.types';
import { TSwarmStoreConnectorOrbitDbDatabaseStoreHash } from './swarm-store-connector-orbit-db-subclass-database.types';
import { SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_PRELOAD_COUNT_MIN } from './swarm-store-connector-orbit-db-subclass-database.const';
import {
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_INT_MS,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_SIZE,
} from './swarm-store-connector-orbit-db-subclass-database.const';
import {
  TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument,
  TSwarmStoreConnectorOrbitDbDatabaseStoreKey,
} from './swarm-store-connector-orbit-db-subclass-database.types';

export class SwarmStoreConnectorOrbitDBDatabase<
  TStoreValue extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
> extends EventEmitter<
  ISwarmStoreConnectorOrbitDbDatabaseEvents<
    SwarmStoreConnectorOrbitDBDatabase<TStoreValue, DbType>,
    TStoreValue
  >
> {
  // is loaded fully and ready to use
  public isReady: boolean = false;

  // whether is closed
  public isClosed: boolean = false;

  // a name of the database
  public dbName: string = '';

  private isFullyLoaded: boolean = false;

  private options?: ISwarmStoreConnectorOrbitDbDatabaseOptions<TStoreValue>;

  protected orbitDb?: orbitDbModule.OrbitDB;

  protected database?: TSwarmStoreConnectorOrbitDbDatabase<TStoreValue>;

  protected preloadCount: number = SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT_DEFAULT;

  protected newEntriesPending: [string, LogEntry<TStoreValue>, any][] = [];

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

  protected get itemsCurrentlyLoaded() {
    return Object.keys(this.entriesReceived).length;
  }

  protected get itemsOverallCount() {
    return Math.max(this.itemsOverallCountInStorage, this.itemsCurrentlyLoaded);
  }

  protected dbType: ESwarmStoreConnectorOrbitDbDatabaseType =
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED;

  protected emitBatchesInterval?: NodeJS.Timer;

  protected get isKVStore() {
    return this.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
  }

  constructor(
    options: ISwarmStoreConnectorOrbitDbDatabaseOptions<TStoreValue>,
    orbitDb: orbitDbModule.OrbitDB
  ) {
    super();
    this.setOptions(options);
    this.setOrbitDbInstance(orbitDb);
  }

  public connect = async (): Promise<Error | void> => {
    const dbStore = await this.createDb();

    if (dbStore instanceof Error) {
      console.error(dbStore);
      return new Error('Failed to create a new database instance');
    }

    const loadDbResult = await dbStore.load(this.preloadCount);

    if ((loadDbResult as unknown) instanceof Error) {
      console.error(loadDbResult);
      return this.onFatalError(
        'The fatal error has occurred on databse loading',
        'connect'
      );
    }
  };

  public close = async (opt?: any): Promise<Error | void> => {
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
  };

  public add = async (
    addArg: TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<TStoreValue>
  ): Promise<string | Error> => {
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
        hash = ((await (database as OrbitDbKeyValueStore<TStoreValue>).set(
          key,
          value
        )) as unknown) as TSwarmStoreConnectorOrbitDbDatabaseStoreHash;
      } else {
        hash = await (database as OrbitDbFeedStore<TStoreValue>).add(value);
      }
      console.log(`ADDED DATA WITH HASH -- ${hash}`);
      if (typeof hash !== 'string') {
        return new Error(
          'An unknown type of hash was returned for the value stored'
        );
      }
      return hash;
    } catch (err) {
      console.trace(err);
      return err;
    }
  };

  /**
   * for the key value store a key must be used.
   * for the feed store a hash of the value
   * must be used.
   *
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  public get = async (
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): Promise<
    Error | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue> | undefined
  > => {
    const entryRaw = this.readRawEntry(keyOrHash);

    if (!entryRaw || entryRaw instanceof Error) {
      return entryRaw;
    }
    try {
      if (this.isKVStore && entryRaw.payload.key !== keyOrHash) {
        return undefined;
      } else if (entryRaw.hash !== keyOrHash) {
        return undefined;
      }
      return entryRaw;
    } catch (err) {
      return err;
    }
    return undefined;
  };

  /**
   * Remove a value located in the key provided if it is a key value
   * database.
   * Remove an entry by it's address for a non key-value database.
   *
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} keyOrEntryAddress - key of a value for key-value store or entry address.
   * @returns {(Promise<Error | void>)}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  public async remove(
    keyOrEntryAddress: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): Promise<Error | void> {
    try {
      await (this.isKVStore
        ? this.removeKeyKVStore(keyOrEntryAddress)
        : this.removeEntry(keyOrEntryAddress));
    } catch (err) {
      return err;
    }
  }

  public iterator = async (
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Promise<
    | Error
    | Array<
        | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue>
        | Error
        | undefined
      >
  > => {
    return this.isKVStore
      ? this.iteratorKeyValueStore(options)
      : this.iteratorFeedStore(options);
  };

  public drop = async () => {
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
  };

  /**
   * returns a count of an items loaded or Error
   *
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  public load = async (
    count: TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad
  ): Promise<ISwarmStoreConnectorRequestLoadAnswer | Error> => {
    return this._load(this.itemsCurrentlyLoaded + count);
  };

  public parseValueStored = (
    e: LogEntry<TStoreValue>
  ):
    | {
        id: LogEntry<TStoreValue>['identity']['id'];
        value: LogEntry<TStoreValue>['payload']['value'];
        key: LogEntry<TStoreValue>['payload']['key'];
        hash: LogEntry<TStoreValue>['hash'];
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

  protected createDb(): Promise<
    Error | TSwarmStoreConnectorOrbitDbDatabase<TStoreValue>
  > {
    this.unsetReadyState();
    return this.createDbInstance();
  }

  protected async restartDbInstanceSilent(): Promise<
    Error | TSwarmStoreConnectorOrbitDbDatabase<TStoreValue>
  > {
    const db = this.getDbStoreInstance();

    if (!db) {
      return new Error('There is no an active database instance');
    }
    if (db instanceof Error) {
      return db;
    }
    this.unsetAllListenersForEvents();

    const result = await this.closeInstanceOfStore(db);

    if (result instanceof Error) {
      console.error('Failed to close the instance of store');
      return result;
    }
    return this.createDbInstance();
  }

  protected setItemsOverallCount(total: number) {
    this.itemsOverallCountInStorage = Math.max(
      this.itemsOverallCountInStorage,
      total
    );
    console.log('total number of entries', total);
  }

  /**
   * increment the overall count by 1
   *
   * @protected
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected incItemsOverallCount() {
    this.itemsOverallCountInStorage++;
  }

  protected resetItemsOverall() {
    this.itemsOverallCountInStorage = 0;
  }

  /**
   * returns a count of an items loaded or Error
   *
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected _load = async (
    count: TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad
  ): Promise<ISwarmStoreConnectorRequestLoadAnswer | Error> => {
    const itemsLoaded = this.itemsCurrentlyLoaded;

    if (count) {
      const dbInstance = await this.restartDbInstanceSilent();

      if (dbInstance instanceof Error) {
        console.error('Failed to restart the database');
        return dbInstance;
      }
      await dbInstance.load(count);
      debugger;
    }
    return {
      count: this.itemsCurrentlyLoaded - itemsLoaded,
      loadedCount: this.itemsCurrentlyLoaded,
      overallCount: this.itemsOverallCount,
    };
  };

  protected getLodEntryHash(
    logEntry: LogEntry<TStoreValue>
  ): TSwarmStoreDatabaseEntityAddress<ESwarmStoreConnector.OrbitDB> {
    return logEntry.hash;
  }

  /**
   * Read a value stored in the database storage
   * by key or value unique hash
   *
   * @protected
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} keyOrHash
   * @returns {(TStoreValue
   *     | LogEntry<TStoreValue>
   *     | Error
   *     | undefined)}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected readRawValueFromStorage = (
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): TStoreValue | LogEntry<TStoreValue> | Error | undefined => {
    const database = this.getDbStoreInstance();

    if (database instanceof Error) {
      return new Error(`Failed to get database insatane: ${database.message}`);
    }

    const entryRawOrStoreValue = database.get(keyOrHash) as
      | TStoreValue
      | LogEntry<TStoreValue>
      | Error
      | undefined;
    debugger;
    return entryRawOrStoreValue;
  };

  /**
   * Read the raw entry from the database
   *
   * @protected
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} keyOrHash
   * @returns {(TStoreValue
   *     | LogEntry<TStoreValue>
   *     | Error
   *     | undefined)}
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  protected readRawEntry = (
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): LogEntry<TStoreValue> | Error | undefined => {
    try {
      const entryRawOrStoreValue = this.readRawValueFromStorage(keyOrHash);
      const entryRaw = (entryRawOrStoreValue && this.isKVStore
        ? this.findInOplog(keyOrHash, entryRawOrStoreValue as TStoreValue)
        : entryRawOrStoreValue) as LogEntry<TStoreValue> | Error | undefined;

      if (entryRaw instanceof Error) {
        return new Error('An error has occurred on get the data from the key');
      }
      return entryRaw;
    } catch (err) {
      return new Error(
        `Failed to read a raw entry from the databse: ${err.message}`
      );
    }
  };

  protected findInOplog(
    key: TSwarmStoreConnectorOrbitDbDatabaseStoreKey,
    value: TStoreValue
  ): LogEntry<TStoreValue> | undefined | Error {
    const db = this.getDbStoreInstance();

    if (db instanceof Error) {
      return db;
    }

    return ((db as any)._oplog.values as LogEntry<TStoreValue>[]).find(
      (entry) => {
        const pld = entry?.payload;
        return (
          pld?.op === EOrbitDbFeedStoreOperation.PUT && pld?.value === value
        );
      }
    );
  }

  protected filterRequltsFeedStore = (
    logEntriesList: Array<LogEntry<TStoreValue>>,
    filterOptions: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Array<LogEntry<TStoreValue>> => {
    const { gt, gte, lt, lte, neq } = filterOptions;

    if (!gt && !gte && !lt && !lte && !neq) {
      return logEntriesList;
    }
    return logEntriesList.filter((logEntry) => {
      const logEntryHash = this.getLodEntryHash(logEntry);

      if (neq) {
        if (neq instanceof Array) {
          return !(neq as TSwarmStoreDatabaseEntityAddress<
            ESwarmStoreConnector.OrbitDB
          >[]).includes(logEntryHash);
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
    if (count && Number(count) > this.itemsCurrentlyLoaded) {
      // before to query the database entities must be preloaded in memory
      await this._load(count);
    }
  }

  protected async iteratorFeedStore(
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Promise<
    | Error
    | Array<
        | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue>
        | Error
        | undefined
      >
  > {
    const iteratorOptionsRes =
      options ||
      SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT;
    let limit = iteratorOptionsRes.limit;

    if (typeof limit !== 'number' || limit < 0) {
      limit = undefined;
    }
    // before to query the database entities must be preloaded in memory
    limit && (await this.preloadEntitiesBeforeIterate(limit));
    debugger;
    const eqOperand =
      options?.[ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq];
    // database instance can become another one after load() method call
    const database = this.getDbStoreInstance() as OrbitDbFeedStore<TStoreValue>;

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
      debugger;
    }
    debugger;
    return result;
  }

  protected async iteratorKeyValueStore(
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Promise<
    | Error
    | Array<
        | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue>
        | Error
        | undefined
      >
  > {
    // TODO - check it works
    const iteratorOptionsRes =
      options ||
      SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT;
    let limit = iteratorOptionsRes.limit;

    if (typeof limit !== 'number' || limit < 0) {
      limit = undefined;
    }
    // before to query the database entities must be preloaded in memory
    limit && (await this.preloadEntitiesBeforeIterate(limit));
    debugger;
    const eqOperand =
      options?.[ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq];

    if (eqOperand) {
      // if the equal operand passed within the argument
      // return just values queried by it and
      // ignore all other operators.
      return this.getEqual(eqOperand);
    }
    // database instance can become another one after the load() method call
    const database = this.getDbStoreInstance() as OrbitDbKeyValueStore<
      TStoreValue
    >;
    if (database instanceof Error) {
      return database;
    }
    const keys = Object.keys(database.all);

    const {
      reverse,
    } = iteratorOptionsRes as ISwarmStoreConnectorOrbitDbDatabaseIteratorOptionsRequired<
      DbType
    >;
    let keysList = (reverse ? keys.reverse() : keys).slice(0, limit);

    keysList = this.filterKeys(keysList, iteratorOptionsRes);
    return this.getValuesForKeys(keysList);
  }

  protected getEqual = async (
    eqOperand: string | string[]
  ): Promise<
    | Error
    | Array<
        | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue>
        | Error
        | undefined
      >
  > => {
    if (eqOperand instanceof Array) {
      return Promise.all(eqOperand.map(this.get));
    }
    return [await this.get(eqOperand)];
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
          return !(neq as TSwarmStoreDatabaseEntityKey<
            ESwarmStoreConnector.OrbitDB
          >[]).includes(key);
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
  ): Promise<
    | Error
    | Array<
        | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue>
        | Error
        | undefined
      >
  > => Promise.all(keys.map(this.readRawEntry)) as any;

  protected getValues(
    hash: string | string[],
    database: OrbitDbFeedStore<TStoreValue>
  ): Promise<
    Array<
      ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue> | Error | undefined
    >
  > {
    const pending =
      typeof hash === 'string'
        ? [this.get(hash)]
        : hash.map((h) => this.get(h));

    return Promise.all(pending);
  }

  private getDbStoreInstance():
    | Error
    | TSwarmStoreConnectorOrbitDbDatabase<TStoreValue> {
    const { isReady, database } = this;

    if (!isReady) {
      return new Error('The store is not ready to use');
    }
    if (!database) {
      return this.emitError('The database store instance is empty');
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

  protected emitError(
    error: Error | string,
    mehodName?: string,
    isFatal: boolean = false
  ): Error {
    const err = typeof error === 'string' ? new Error() : error;
    const eventName = isFatal
      ? ESwarmStoreEventNames.FATAL
      : ESwarmStoreEventNames.ERROR;

    console.error(
      `${SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX}::error${
        mehodName ? `::${mehodName}` : ''
      }`,
      err
    );
    this.emit(eventName, err);
    return err;
  }

  protected onFatalError(error: Error | string, methodName: string) {
    this.unsetReadyState();
    this.emitError(error, methodName, true);

    const { isClosed } = this;

    if (!isClosed) {
      this.close();
    }
    return this.emitError(
      'The database closed cause a fatal error',
      methodName,
      true
    );
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
  protected async removeKeyKVStore(
    key: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): Promise<void> {
    const database = this.getDbStoreInstance() as OrbitDbKeyValueStore<
      TStoreValue
    >;

    if (database instanceof Error) {
      throw database;
    }
    try {
      const hashRemoved = await database.del(key);

      if (typeof hashRemoved !== 'string') {
        throw new Error(
          'An unknown type of hash was returned for the value removed'
        );
      }
    } catch (err) {
      console.error(err);
      throw new Error(
        `Failed to remove an object by the key ${key}: ${err.message}`
      );
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
  public async removeEntry(
    entryAddress: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex
  ): Promise<Error | void> {
    const database = this.getDbStoreInstance() as OrbitDbFeedStore<TStoreValue>;

    if (database instanceof Error) {
      throw database;
    }
    try {
      await database.remove(entryAddress);
    } catch (err) {
      console.error(err);
      return new Error(
        `Failed to remove an entry by the address ${entryAddress}: ${err.message}`
      );
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

  private emitNewEntry = (
    address: string,
    entry: LogEntry<TStoreValue>,
    heads: any
  ) => {
    console.log('emit new entry', {
      address,
      entry,
      heads,
      itemsCurrentlyLoaded: this.itemsCurrentlyLoaded,
      itemsOverallCount: this.itemsOverallCount,
    });
    this.emit(ESwarmStoreEventNames.NEW_ENTRY, [
      this.dbName,
      entry,
      address,
      heads,
      this.dbType,
      this,
    ]);
  };

  private emitEmtriesPending() {
    this.startEmitBatchesInterval();
  }

  /**
   * check was the message received
   *
   * @private
   * @param {LogEntry<TStoreValue>} entry
   * @returns
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  private checkWasEntryReceived(entry: LogEntry<TStoreValue>) {
    return this.entriesReceived[entry.hash] === entry.sig;
  }

  private addMessageToReceivedMessages(entry: LogEntry<TStoreValue>) {
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

  private handleNewEntry = (
    address: string,
    entry: LogEntry<TStoreValue>,
    heads: any
  ) => {
    if (!this.checkWasEntryReceived(entry)) {
      this.newEntriesPending.push([address, entry, heads]);
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

  private handleFeedStoreLoaded = () => {
    // emit event that the database local copy was fully loaded
    // this.emitFullyLoaded();
  };

  private handleFeedStoreLoadProgress = (
    address: string,
    hash: string,
    entry: LogEntry<TStoreValue>,
    progress: number,
    total: number
  ) => {
    this.setItemsOverallCount(total);
    this.handleNewEntry(address, entry, {});
    // emit event database local copy loading progress
    this.emitEvent(
      ESwarmStoreEventNames.LOADING,
      (progress / (this.preloadCount <= 0 ? total : this.preloadCount)) * 100
    );
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

  private handleFeedStoreClosed = () => {
    const { isClosed } = this;

    if (!isClosed) {
      this.unsetReadyState();
      this.emitError(
        'The instance was closed unexpected',
        'handleFeedStoreClosed'
      );
      this.restartStore();
    }
  };

  private async closeInstanceOfStore(
    storeInstance: TSwarmStoreConnectorOrbitDbDatabase<TStoreValue>
  ): Promise<Error | void> {
    if (!storeInstance) {
      return new Error('An instance of the store must be specified');
    }
    this.unsetStoreEventListeners(storeInstance);
    try {
      await storeInstance.close();
    } catch (err) {
      console.error(err);
      return new Error(
        'Fatal error has occurred on close the instance of the Feed store'
      );
    }
  }

  private async closeCurrentStore(): Promise<Error | void> {
    const { database } = this;

    if (database) {
      const closeStoreResult = await this.closeInstanceOfStore(database);

      if (closeStoreResult instanceof Error) {
        console.error(closeStoreResult);
        return new Error(
          'Failed to close the current instance of the Database store'
        );
      }
      this.database = undefined;
    }
  }

  // restart the store
  private async restartStore(): Promise<Error | void> {
    const { isClosed } = this;

    if (isClosed) {
      return new Error('The store was closed previousely');
    }

    const currentStoreStopResult = await this.closeCurrentStore();

    if (currentStoreStopResult instanceof Error) {
      console.error(currentStoreStopResult);
      return this.onFatalError(
        'Failed to restart the Database cause failed to close the store instance',
        'restartStore'
      );
    }
    return this.connect();
  }

  private handleFeedStoreReplicateInProgress = (
    address: string,
    hash: string,
    entry: LogEntry<TStoreValue>,
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

  private handleWrite = (
    address: string,
    entry: LogEntry<TStoreValue>,
    heads: any
  ) => {
    this.incItemsOverallCount(); // this must be called before the handleNewEntry,
    // otherwise doubling of the overall count will be caused
    this.handleNewEntry(address, entry, heads);
  };

  private setFeedStoreEventListeners(
    feedStore: TSwarmStoreConnectorOrbitDbDatabase<TStoreValue>,
    isSet = true
  ): Error | void {
    if (!feedStore) {
      return new Error('An instance of the FeedStore must be specified');
    }
    if (!feedStore.events) {
      return new Error('An unknown API of the FeedStore');
    }
    if (
      typeof feedStore.events.addListener !== 'function' ||
      typeof feedStore.events.removeListener !== 'function'
    ) {
      return new Error('An unknown API of the FeedStore events');
    }

    const methodName = isSet
      ? COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON
      : COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_OFF;

    feedStore.events[methodName](
      EOrbidDBFeedSoreEvents.READY,
      this.handleFeedStoreReady
    );
    feedStore.events[methodName](
      EOrbidDBFeedSoreEvents.LOAD,
      this.handleFeedStoreLoaded
    );
    feedStore.events[methodName](
      EOrbidDBFeedSoreEvents.LOAD_PROGRESS,
      this.handleFeedStoreLoadProgress
    );
    feedStore.events[methodName](
      EOrbidDBFeedSoreEvents.REPLICATED,
      this.handleFeedStoreReplicated
    );
    feedStore.events[methodName](
      EOrbidDBFeedSoreEvents.CLOSE,
      this.handleFeedStoreClosed
    );
    feedStore.events[methodName](
      EOrbidDBFeedSoreEvents.REPLICATE_PROGRESS,
      this.handleFeedStoreReplicateInProgress
    );
    feedStore.events[methodName](
      EOrbidDBFeedSoreEvents.WRITE,
      this.handleWrite
    );
  }

  private unsetStoreEventListeners(
    feedStore: TSwarmStoreConnectorOrbitDbDatabase<TStoreValue>
  ) {
    this.setFeedStoreEventListeners(feedStore, false);
  }

  private getAccessControllerOptions(): ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<
    TStoreValue
  > {
    const { options } = this;
    const resultedOptions: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<TStoreValue> = {
      type: SwarmStoreConnectorOrbitDBSubclassAccessController.type,
    };

    if (!options) {
      return resultedOptions;
    }

    const { isPublic, write, grantAccess } = options;

    if (isPublic) {
      resultedOptions.write = ['*'];
    } else if (write instanceof Array) {
      resultedOptions.write = write.filter(
        (identity) => identity && typeof identity === 'string'
      );
    }
    if (typeof grantAccess === 'function') {
      if (grantAccess.length !== 2) {
        console.warn(
          'The grant access callback function must have 2 arguments'
        );
      }
      resultedOptions.grantAccess = grantAccess;
    }
    return resultedOptions;
  }

  private async createDbInstance(): Promise<
    Error | TSwarmStoreConnectorOrbitDbDatabase<TStoreValue>
  > {
    try {
      const { orbitDb, options } = this;

      if (!orbitDb) {
        return this.onFatalError(
          'There is no intance of the OrbitDb is specified',
          'createDbInstance'
        );
      }

      if (!options) {
        throw new Error('Options are not defined');
      }

      const { dbName } = options;

      if (!dbName) {
        return this.onFatalError(
          'A name of the database must be specified',
          'createDbInstance'
        );
      }

      const dbStoreOptions = this.getStoreOptions();

      if (dbStoreOptions instanceof Error) {
        return this.onFatalError(
          dbStoreOptions,
          'createDbInstance::getStoreOptions'
        );
      }

      const storeOptions = {
        ...SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION,
        accessController: this.getAccessControllerOptions(),
      };
      const db: Error | TSwarmStoreConnectorOrbitDbDatabase<TStoreValue> = this
        .isKVStore
        ? await orbitDb.keyvalue(dbName, storeOptions)
        : await orbitDb.feed(dbName, storeOptions);

      if (db instanceof Error) {
        return this.onFatalError(db, 'createDbInstance::feed store creation');
      }

      const setStoreListenersResult = this.setFeedStoreEventListeners(db);

      if (setStoreListenersResult instanceof Error) {
        return this.onFatalError(
          setStoreListenersResult,
          'createDbInstance::set feed store listeners'
        );
      }
      this.database = db;
      return db;
    } catch (err) {
      return this.onFatalError(err, 'createDbInstance');
    }
  }

  private setOptions(
    options: ISwarmStoreConnectorOrbitDbDatabaseOptions<TStoreValue>
  ): void | Error {
    if (!options) {
      return this.onFatalError('Options must be specified', 'setOptions');
    }

    const { dbName, preloadCount, dbType } = options;

    if (typeof dbName !== 'string') {
      return this.onFatalError(
        'A name of the database must be specified',
        'setOptions'
      );
    }
    if (preloadCount && typeof preloadCount !== 'number') {
      return this.onFatalError('Preload count must be number', 'setOptions');
    }
    // preloadCount must not be 0.
    // If it's equals to 0, the database not firing events which
    // are necessary for the application to continue the work with
    // the database.
    this.preloadCount =
      (preloadCount ? preloadCount : undefined) ||
      SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_PRELOAD_COUNT_MIN;
    if (dbType) {
      if (
        !Object.values(ESwarmStoreConnectorOrbitDbDatabaseType).includes(dbType)
      ) {
        return this.onFatalError('An unknown db store type', 'setOptions');
      }
      this.dbType = dbType;
    }
    this.options = options;
    this.dbName = dbName;
  }

  private setOrbitDbInstance(orbitDb: orbitDbModule.OrbitDB): void | Error {
    if (!orbitDb) {
      return this.onFatalError(
        'An instance of orbit db must be specified',
        'setOrbitDbInstance'
      );
    }
    this.orbitDb = orbitDb;
  }

  private emitEntries = (
    batchSize: number = SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_SIZE
  ) => {
    console.log('newEntriesPending count', this.newEntriesPending.length, {
      itemsCurrentlyLoaded: this.itemsCurrentlyLoaded,
      itemsOverallCount: this.itemsOverallCount,
    });
    if (this.newEntriesPending.length) {
      this.newEntriesPending
        .splice(0, batchSize)
        .forEach((newEntry) => newEntry && this.emitNewEntry(...newEntry));
    }
  };

  private emitBatch = () => {
    this.emitEntries();
  };

  private startEmitBatchesInterval() {
    this.emitBatchesInterval = setInterval(
      this.emitBatch,
      SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_INT_MS
    );
  }

  private unsetEmithBatchInterval() {
    if (this.emitBatchesInterval) {
      clearInterval(this.emitBatchesInterval);
    }
  }
}
