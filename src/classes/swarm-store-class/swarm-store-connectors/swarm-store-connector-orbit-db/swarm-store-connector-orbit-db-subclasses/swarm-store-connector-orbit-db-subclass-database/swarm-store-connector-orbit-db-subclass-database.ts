import * as orbitDbModule from 'orbit-db';
import OrbitDbFeedStore from 'orbit-db-feedstore';
import {
  ISwarmStoreConnectorOrbitDbDatabaseOptions,
  ISwarmStoreConnectorOrbitDbDatabaseEvents,
  ISwarmStoreConnectorOrbitDbDatabaseValue,
  ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions,
  TFeedStoreHash,
} from './swarm-store-connector-orbit-db-subclass-database.types';
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import {
  ESwarmConnectorOrbitDbDatabaseEventNames,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX,
  EOrbidDBFeedSoreEvents,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT,
} from './swarm-store-connector-orbit-db-subclass-database.const';
import {
  COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON,
  COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_OFF,
  COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_UNSET_ALL_LISTENERS,
} from 'const/common-values/common-values';
import { SwarmStoreConnectorOrbitDBSubclassAccessController } from '../swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller';
import { ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions } from '../swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller.types';

export class SwarmStoreConnectorOrbitDBDatabase<
  TFeedStoreType
> extends EventEmitter<
  ISwarmStoreConnectorOrbitDbDatabaseEvents<
    SwarmStoreConnectorOrbitDBDatabase<TFeedStoreType>,
    TFeedStoreType
  >
> {
  // is loaded fully and ready to use
  public isReady: boolean = false;

  // whether is closed
  public isClosed: boolean = false;

  // a name of the database
  public dbName: string = '';

  private isFullyLoaded: boolean = false;

  private options?: ISwarmStoreConnectorOrbitDbDatabaseOptions<TFeedStoreType>;

  protected orbitDb?: orbitDbModule.OrbitDB;

  protected database?: OrbitDbFeedStore<TFeedStoreType>;

  constructor(
    options: ISwarmStoreConnectorOrbitDbDatabaseOptions<TFeedStoreType>,
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

    const loadDbResult = await dbStoreCreationResult.load(
      SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT
    );

    if ((loadDbResult as unknown) instanceof Error) {
      console.error(loadDbResult);
      return this.onFatalError(
        'The fatal error has occurred on databse loading',
        'connect'
      );
    }
  }

  public async close(): Promise<Error | void> {
    const closeCurrentStoreResult = await this.closeCurrentStore();

    this.unsetReadyState();
    this.isClosed = true;
    this.emitEvent(ESwarmConnectorOrbitDbDatabaseEventNames.CLOSE, this);
    this.unsetAllListenersForEvents();
    if (closeCurrentStoreResult instanceof Error) {
      return closeCurrentStoreResult;
    }
  }

  public async add(value: TFeedStoreType): Promise<string | Error> {
    const database = this.getDbStoreInstance();

    if (database instanceof Error) {
      return database;
    }
    try {
      const hash = await database.add(value);

      if (typeof hash !== 'string') {
        return new Error(
          'An unknown type of hash was returned for the value stored'
        );
      }
      return hash;
    } catch (err) {
      return err;
    }
  }

  public async get(
    hash: TFeedStoreHash
  ): Promise<
    Error | ISwarmStoreConnectorOrbitDbDatabaseValue<TFeedStoreType> | void
  > {
    const database = this.getDbStoreInstance();

    if (database instanceof Error) {
      return database;
    }

    try {
      const e = database.get(hash);

      if (e instanceof Error) {
        return new Error('An error has occurred on get the data from the key');
      }
      if (e) {
        return this.parseValueStored(e);
      }
    } catch (err) {
      return err;
    }
    return undefined;
  }

  public async remove(hash: TFeedStoreHash): Promise<Error | void> {
    const database = this.getDbStoreInstance();

    if (database instanceof Error) {
      return database;
    }
    try {
      const hashRemoved = await database.remove(hash);

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
        ISwarmStoreConnectorOrbitDbDatabaseValue<TFeedStoreType> | Error | void
      >
  > {
    const database = this.getDbStoreInstance();

    if (database instanceof Error) {
      return database;
    }

    const iteratorOptionsRes =
      options ||
      SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT;

    return database
      .iterator(iteratorOptionsRes)
      .collect()
      .map(this.parseValueStored);
  }

  protected parseValueStored = (
    e: LogEntry<TFeedStoreType>
  ):
    | ISwarmStoreConnectorOrbitDbDatabaseValue<TFeedStoreType>
    | Error
    | void => {
    const { payload, identity, hash } = e;

    if (payload) {
      return {
        id: identity.id,
        value: payload.value,
        hash,
      };
    } else {
      return new Error('An unknown fromat of the data stored');
    }
  };

  private getDbStoreInstance(): Error | OrbitDbFeedStore<TFeedStoreType> {
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
    Object.values(EOrbidDBFeedSoreEvents).forEach(
      this[COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_UNSET_ALL_LISTENERS].bind(
        this
      )
    );
  };

  protected emitError(
    error: Error | string,
    mehodName?: string,
    isFatal: boolean = false
  ): Error {
    const err = typeof error === 'string' ? new Error() : error;
    const eventName = isFatal
      ? ESwarmConnectorOrbitDbDatabaseEventNames.FATAL
      : ESwarmConnectorOrbitDbDatabaseEventNames.ERROR;

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

  protected emitEvent(
    event: ESwarmConnectorOrbitDbDatabaseEventNames,
    ...args: any[]
  ) {
    const { options } = this;
    const { dbName } = options!;

    this.emit(event, dbName, ...args);
  }

  private getFeedStoreOptions(): IStoreOptions | undefined | Error {
    return SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION;
  }

  private emitFullyLoaded() {
    if (!this.isFullyLoaded) {
      this.isFullyLoaded = true;
      this.emitEvent(ESwarmConnectorOrbitDbDatabaseEventNames.LOADING, 100);
    }
  }

  protected logStore = () => {
    const { database } = this;
    const posts = database!.iterator({ limit: -1 }).collect();

    console.log('STORE::READY--');
    posts.forEach((post: any) => {
      if (post && post.identity) {
        console.log(post.identity.id);
      }
    });
    console.log('--STORE::READY');
  };

  private handleFeedStoreReady = () => {
    this.emitFullyLoaded();
    this.setReadyState();
    this.emitEvent(ESwarmConnectorOrbitDbDatabaseEventNames.READY);
    this.logStore();
  };

  private handleFeedStoreLoaded = () => {
    // emit event that the database local copy was fully loaded
    this.emitFullyLoaded();
  };

  private handleFeedStoreLoadProgress = (
    address: string,
    hash: string,
    entry: LogEntry<TFeedStoreType>,
    progress: number,
    total: number
  ) => {
    // emit event database local copy loading progress
    this.emitEvent(ESwarmConnectorOrbitDbDatabaseEventNames.LOADING, progress);
  };

  private handleFeedStoreReplicated = () => {
    // emit event that the db updated, cause it
    // was replicated with another peer db copy
    const { dbName } = this;

    this.emitEvent(ESwarmConnectorOrbitDbDatabaseEventNames.UPDATE, dbName);
    this.logStore();
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
    storeInstance: OrbitDbFeedStore<TFeedStoreType>
  ): Promise<Error | void> {
    if (!storeInstance) {
      return new Error('An instance of the store must be specified');
    }
    this.unsetFeedStoreEventListeners(storeInstance);
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
    entry: LogEntry<TFeedStoreType>,
    progress: number,
    have: unknown
  ) => {
    console.warn(`handleFeedStoreReplicateInProgress::
            addr: ${address}
            hash: ${hash}
            progress: ${progress}
        `);
    this.logStore();
  };

  private handleNewEntry = (
    address: string,
    entry: LogEntry<TFeedStoreType>,
    heads: any
  ) => {
    this.emit(ESwarmConnectorOrbitDbDatabaseEventNames.NEW_ENTRY, [
      this.dbName,
      entry,
      address,
      heads,
      this,
    ]);
  };

  private setFeedStoreEventListeners(
    feedStore: OrbitDbFeedStore<TFeedStoreType>,
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
      EOrbidDBFeedSoreEvents.NEW_ENTRY,
      this.handleNewEntry
    );
  }

  private unsetFeedStoreEventListeners(
    feedStore: OrbitDbFeedStore<TFeedStoreType>
  ) {
    this.setFeedStoreEventListeners(feedStore, false);
  }

  private getAccessControllerOptions(): ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<
    TFeedStoreType
  > {
    const { options } = this;
    const resultedOptions: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<TFeedStoreType> = {
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
    Error | OrbitDbFeedStore<TFeedStoreType>
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

      const dbFeedStoreOptions = this.getFeedStoreOptions();

      if (dbFeedStoreOptions instanceof Error) {
        return this.onFatalError(
          dbFeedStoreOptions,
          'createDbInstance::getFeedStoreOptions'
        );
      }

      const db = await orbitDb.feed<TFeedStoreType>(dbName, {
        ...SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION,
        accessController: this.getAccessControllerOptions(),
      });

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
    options: ISwarmStoreConnectorOrbitDbDatabaseOptions<TFeedStoreType>
  ): void | Error {
    if (!options) {
      return this.onFatalError('Options must be specified', 'setOptions');
    }

    const { dbName } = options;

    if (typeof dbName !== 'string') {
      return this.onFatalError(
        'A name of the database must be specified',
        'setOptions'
      );
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
