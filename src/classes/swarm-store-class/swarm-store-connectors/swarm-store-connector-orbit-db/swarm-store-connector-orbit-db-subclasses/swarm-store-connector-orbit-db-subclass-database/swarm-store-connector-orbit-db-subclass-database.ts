import * as orbitDbModule from 'orbit-db';
import OrbitDbFeedStore from 'orbit-db-feedstore';
import OrbitDbKeyValueStore from 'orbit-db-kvstore';
import {
  ISwarmStoreConnectorOrbitDbDatabaseOptions,
  ISwarmStoreConnectorOrbitDbDatabaseEvents,
  ISwarmStoreConnectorOrbitDbDatabaseValue,
  ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions,
  TSwarmStoreConnectorOrbitDbDatabaseKey,
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
import { ESwarmStoreEventNames } from '../../../../swarm-store-class.const';
import {
  TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument,
  TSwarmStoreConnectorOrbitDbDatabaseStoreKey,
} from './swarm-store-connector-orbit-db-subclass-database.types';

export class SwarmStoreConnectorOrbitDBDatabase<
  TStoreValue
> extends EventEmitter<
  ISwarmStoreConnectorOrbitDbDatabaseEvents<
    SwarmStoreConnectorOrbitDBDatabase<TStoreValue>,
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

  protected dbType: ESwarmStoreConnectorOrbitDbDatabaseType =
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED;

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

  public async connect(): Promise<Error | void> {
    this.unsetReadyState();

    const dbStoreCreationResult = await this.createDbInstance();

    if (dbStoreCreationResult instanceof Error) {
      return dbStoreCreationResult;
    }

    const loadDbResult = await dbStoreCreationResult.load(this.preloadCount);

    if ((loadDbResult as unknown) instanceof Error) {
      console.error(loadDbResult);
      return this.onFatalError(
        'The fatal error has occurred on databse loading',
        'connect'
      );
    }
  }

  public async close(): Promise<Error | void> {
    this.unsetAllListenersForEvents();
    this.unsetReadyState();
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

  public async add(
    addArg: TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<TStoreValue>
  ): Promise<string | Error> {
    const { value, key } = addArg;
    const database = this.getDbStoreInstance();

    if (database instanceof Error) {
      return database;
    }
    try {
      if (this.isKVStore && !key) {
        return new Error('Key must be provided for the key-value storage');
      }
      const hash = await (this.isKVStore
        ? (database as OrbitDbKeyValueStore<TStoreValue>).set(key!, value)
        : (database as OrbitDbFeedStore<TStoreValue>).add(value));
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
  }

  /**
   * for the key value store a key must be used.
   * for the feed store a hash of the value
   * must be used.
   *
   * @memberof SwarmStoreConnectorOrbitDBDatabase
   */
  public get = async (
    keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseKey
  ): Promise<
    Error | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue> | undefined
  > => {
    const database = this.getDbStoreInstance();

    if (database instanceof Error) {
      return database;
    }

    try {
      let e:
        | TStoreValue
        | LogEntry<TStoreValue>
        | Error
        | undefined = database.get(keyOrHash);

      if (e instanceof Error) {
        return new Error('An error has occurred on get the data from the key');
      }
      if (e && this.isKVStore) {
        e = this.findInOplog(keyOrHash, e as TStoreValue);
      } else if ((e as LogEntry<TStoreValue>).hash !== keyOrHash) {
        return undefined;
      }
      if (e instanceof Error) {
        return new Error(
          'An error has occurred when finding value in the oplog'
        );
      }
      if (e) {
        return this.parseValueStored(e as LogEntry<TStoreValue>);
      }
    } catch (err) {
      return err;
    }
    return undefined;
  };

  public async remove(
    hash: TSwarmStoreConnectorOrbitDbDatabaseKey
  ): Promise<Error | void> {
    const database = this.getDbStoreInstance();

    if (database instanceof Error) {
      return database;
    }
    try {
      const hashRemoved = this.isKVStore
        ? (database as OrbitDbKeyValueStore<TStoreValue>).del(hash)
        : (database as OrbitDbFeedStore<TStoreValue>).remove(hash);

      if (typeof hashRemoved !== 'string') {
        return new Error(
          'An unknown type of hash was returned for the value removed'
        );
      }
    } catch (err) {
      return err;
    }
  }

  public async iterator(
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions
  ): Promise<
    | Error
    | Array<
        | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue>
        | Error
        | undefined
      >
  > {
    return this.isKVStore
      ? this.iteratorKeyValueStore(options)
      : this.iteratorFeedStore(options);
  }

  public async drop() {
    const database = this.getDbStoreInstance();

    if (database instanceof Error) {
      return database;
    }
    this.unsetAllListenersForEvents();
    try {
      await database.drop();
      // TODO drop the database in the secret storage
    } catch (err) {
      return err;
    }
  }

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

  protected async iteratorFeedStore(
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions
  ): Promise<
    | Error
    | Array<
        | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue>
        | Error
        | undefined
      >
  > {
    const database = this.getDbStoreInstance() as OrbitDbFeedStore<TStoreValue>;

    if (database instanceof Error) {
      return database;
    }

    const eqOperand =
      options && options[ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq];

    if (eqOperand) {
      return this.getValues(eqOperand, database);
    }

    const iteratorOptionsRes =
      options ||
      SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT;

    return database
      .iterator(iteratorOptionsRes)
      .collect()
      .map(this.parseValueStored);
  }

  protected async iteratorKeyValueStore(
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions
  ): Promise<
    | Error
    | Array<
        | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue>
        | Error
        | undefined
      >
  > {
    const database = this.getDbStoreInstance() as OrbitDbKeyValueStore<
      TStoreValue
    >;

    if (database instanceof Error) {
      return database;
    }

    const eqOperand =
      options && options[ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq];

    if (eqOperand) {
      if (eqOperand instanceof Array) {
        return Promise.all(eqOperand.map(this.get));
      }
      return [await this.get(eqOperand)];
    }

    const iteratorOptionsRes =
      options ||
      SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT;
    const keys = (database as any).all as string[];
    let limit = (iteratorOptionsRes as any).limit;

    if (limit < 0 || typeof limit !== 'number') {
      limit = undefined;
    }
    return Promise.all(
      keys
        .slice(0, limit)
        .filter((key) => {
          const { gt, gte } = iteratorOptionsRes as any;
          const isInclusive = !!gte;

          if (!gt || !gte || (isInclusive ? key >= gte : key > gt)) {
            return true;
          }
          return false;
        })
        .map(this.get)
    );
  }
  protected parseValueStored = (
    e: LogEntry<TStoreValue>
  ):
    | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue>
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
      };
    } else {
      return new Error('An unknown fromat of the data stored');
    }
  };

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
    const { dbName } = options!;

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
    });
    this.emit(ESwarmStoreEventNames.NEW_ENTRY, [
      this.dbName,
      entry,
      address,
      heads,
      this,
    ]);
  };

  private emitEmtriesPending() {
    const newEntriesPending = this.newEntriesPending;

    console.log('emitEmtriesPending');
    newEntriesPending.forEach((newEntry) => this.emitNewEntry(...newEntry));
    this.newEntriesPending.splice(0, newEntriesPending.length);
  }

  private handleNewEntry = (
    address: string,
    entry: LogEntry<TStoreValue>,
    heads: any
  ) => {
    console.trace('add entry pending', {
      address,
      entry,
      heads,
    });
    this.newEntriesPending.push([address, entry, heads]);
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
    this.handleNewEntry(address, entry, {});
    // emit event database local copy loading progress
    this.emitEvent(
      ESwarmStoreEventNames.LOADING,
      (progress / this.preloadCount) * 100
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
    console.log('WRITE', {
      address,
      entry,
      heads,
    });
    this.emitNewEntry(address, entry, heads);
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

      const { dbName } = options!;

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
    if (typeof preloadCount === 'number') {
      this.preloadCount = preloadCount;
    } else if (preloadCount) {
      return this.onFatalError('Preload count must be number', 'setOptions');
    }
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
}
