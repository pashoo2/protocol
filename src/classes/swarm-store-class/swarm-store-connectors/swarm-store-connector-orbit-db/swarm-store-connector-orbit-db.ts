import OrbitDB from 'orbit-db';
import Identities from 'orbit-db-identity-provider';
import AccessControllers from 'orbit-db-access-controllers';
import { Keystore } from 'orbit-db-keystore';
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import {
  SWARM_STORE_CONNECTOR_ORBITDB_CONNECTION_TIMEOUT_MS,
  SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS,
  SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_RECONNECTION_ATTEMPTS_MAX,
  SWARM_STORE_CONNECTOR_ORBITDB_IDENTITY_TYPE,
  SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DBNAME,
  SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DIRECTORY,
} from './swarm-store-connector-orbit-db.const';
import { IPFS } from 'types/ipfs.types';
import { SwarmStoreConnectorOrbitDBSubclassIdentityProvider } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-identity-provider/swarm-store-connector-orbit-db-subclass-identity-provider';
import { SwarmStoreConnectorOrbitDBSubclassAccessController } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller';
import {
  ISwarmStoreConnectorOrbitDBOptions,
  ISwarmStoreConnectorOrbitDBConnectionOptions,
  ISwarmStoreConnectorOrbitDBEvents,
} from './swarm-store-connector-orbit-db.types';
import { timeout, delay } from 'utils/common-utils/common-utils-timer';
import { SwarmStoreConnectorOrbitDBDatabase } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database';
import {
  ISwarmStoreConnectorOrbitDbDatabaseOptions,
  TSwarmStoreConnectorOrbitDbDatabaseMethodNames,
  TSwarmStoreConnectorOrbitDbDatabaseMethodArgument,
} from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { commonUtilsArrayDeleteFromArray } from 'utils/common-utils/common-utils';
import {
  COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON,
  COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_OFF,
  COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_UNSET_ALL_LISTENERS,
} from 'const/common-values/common-values';
import { SwarmStorageConnectorOrbitDBSublassKeyStore } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-keystore/swarm-store-connector-orbit-db-subclass-keystore';
import {
  ISwarmStoreConnectorOrbitDBSubclassStorageFabric,
  ISwarmStoreConnectorOrbitDbSubclassStorageFabricConstructorOptions,
} from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-storage-fabric/swarm-store-connector-orbit-db-subclass-storage-fabric.types';
import { SwarmStoreConnectorOrbitDBSubclassStorageFabric } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-storage-fabric/swarm-store-connector-orbit-db-subclass-storage-fabric';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreDatabaseType } from '../../swarm-store-class.types';
import { ISwarmStoreConnectorOrbitDbUtilsAddressCreateRootPathOptions } from './swarm-store-connector-orbit-db-utils/swarm-store-connector-orbit-db-utils-address/swarm-store-connector-orbit-db-utils-address.types';
import { swarmStoreConnectorOrbitDbUtilsAddressCreateRootPath } from './swarm-store-connector-orbit-db-utils/swarm-store-connector-orbit-db-utils-address/swarm-store-connector-orbit-db-utils-address';
import { ISecretStoreCredentials } from '../../../secret-storage-class/secret-storage-class.types';
import { SwarmStoreConnectorOrbitDBDatabaseQueued } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database-classes-extended/swarm-store-connector-orbit-db-subclass-database-queued/swarm-store-connector-orbit-db-subclass-database-queued';
import {
  ISwarmStoreConnector,
  TSwarmStoreValueTypes,
} from '../../swarm-store-class.types';
import {
  ESwarmStoreConnector,
  ESwarmStoreEventNames,
} from '../../swarm-store-class.const';

export class SwarmStoreConnectorOrbitDB<
  ISwarmDatabaseValueTypes extends TSwarmStoreValueTypes<
    ESwarmStoreConnector.OrbitDB
  >,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>
> extends EventEmitter<ISwarmStoreConnectorOrbitDBEvents>
  implements
    ISwarmStoreConnector<
      ESwarmStoreConnector.OrbitDB,
      ISwarmDatabaseValueTypes,
      DbType
    > {
  private static isLoadedCustomIdentityProvider: boolean = false;

  private static isLoadedCustomAccessController: boolean = false;

  private static loadCustomIdentityProvider() {
    if (!SwarmStoreConnectorOrbitDB.isLoadedCustomIdentityProvider) {
      Identities.addIdentityProvider(
        SwarmStoreConnectorOrbitDBSubclassIdentityProvider
      );
      SwarmStoreConnectorOrbitDB.isLoadedCustomIdentityProvider = true;
    }
  }

  private static loadCustomAccessController() {
    if (!SwarmStoreConnectorOrbitDB.isLoadedCustomAccessController) {
      AccessControllers.addAccessController({
        AccessController: SwarmStoreConnectorOrbitDBSubclassAccessController,
      });
      SwarmStoreConnectorOrbitDB.isLoadedCustomAccessController = true;
    }
  }

  public isReady: boolean = false;

  public isClosed: boolean = false;

  protected userId: string = '';

  protected directory: string = SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DIRECTORY;

  protected rootPath?: string;

  protected identity?: any;

  protected connectionOptions?: ISwarmStoreConnectorOrbitDBConnectionOptions;

  protected options?: ISwarmStoreConnectorOrbitDBOptions<
    ISwarmDatabaseValueTypes
  >;

  protected ipfs?: IPFS; // instance of the IPFS connected through

  protected orbitDb?: OrbitDB; // instance of the OrbitDB

  protected databases: SwarmStoreConnectorOrbitDBDatabase<
    ISwarmDatabaseValueTypes,
    DbType
  >[] = [];

  protected identityKeystore?: Keystore;

  protected storage?: ISwarmStoreConnectorOrbitDBSubclassStorageFabric;

  protected initializationPromise: Promise<void> | undefined;

  private dbCloseListeners: ((...args: any[]) => any)[] = [];

  public constructor(
    options: ISwarmStoreConnectorOrbitDBOptions<ISwarmDatabaseValueTypes>
  ) {
    super();
    SwarmStoreConnectorOrbitDB.loadCustomIdentityProvider();
    SwarmStoreConnectorOrbitDB.loadCustomAccessController();
    this.applyOptions(options);
    this.createInitializationPromise(options);
  }

  /**
     * waiting for the connection to the swarm, load the database locally
     * and ready to use it
    /**
     *
     *
     * @param {ISwarmStoreConnectorOrbitDBConnectionOptions} connectionOptions
     * @returns {(Promise<void | Error>)}
     * @memberof SwarmStoreConnectorOrbitDB
     */
  public async connect(
    connectionOptions: ISwarmStoreConnectorOrbitDBConnectionOptions
  ): Promise<void | Error> {
    // waiting for the instance initialization
    await this.initializationPromise;
    const resultCreateIdentity = await this.createIdentity();

    if (resultCreateIdentity instanceof Error) {
      console.error(resultCreateIdentity);
      return this.emitError('Failed to create an identity');
    }

    const disconnectFromSwarmResult = await this.disconnectFromSwarm();

    if (disconnectFromSwarmResult instanceof Error) {
      return disconnectFromSwarmResult;
    }

    const setConnectionOptionsResult = this.setConnectionOptions(
      connectionOptions
    );

    if (setConnectionOptionsResult instanceof Error) {
      return setConnectionOptionsResult;
    }

    const connectToSwarmResult = await this.connectToSwarm();

    if (connectToSwarmResult instanceof Error) {
      return connectToSwarmResult;
    }

    // close the current connections to the databases if exists
    const closeExistingDatabaseesOpened = await this.closeDatabases();

    if (closeExistingDatabaseesOpened instanceof Error) {
      return this.emitError(closeExistingDatabaseesOpened, 'openDatabases');
    }

    // stop the current instance of OrbitDB
    // if it exists
    const stopOrbitDBResult = await this.stopOrbitDBInsance();

    if (stopOrbitDBResult instanceof Error) {
      return stopOrbitDBResult;
    }

    // create a new OrbitDB instance
    const createOrbitDbResult = await this.createOrbitDBInstance();

    if (createOrbitDbResult instanceof Error) {
      return createOrbitDbResult;
    }

    // create OrbitDB databases
    const createDatabases = await this.openDatabases();

    if (createDatabases instanceof Error) {
      return createDatabases;
    }
    // set the database is ready to query
    this.setReady();
  }

  public async openDatabase(
    dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<
      ISwarmDatabaseValueTypes
    >,
    openAttempt: number = 0,
    checkOptionsIsExists: boolean = true
  ): Promise<void | Error> {
    const { orbitDb, isClosed } = this;

    if (!orbitDb) {
      return new Error('There is no instance of OrbitDB');
    }
    if (isClosed) {
      return new Error("Can't open a database for the connection opened");
    }

    // add options in the main setting only
    // if options are not exists already
    // in the list. If options are exists
    // this may mean that the database was
    // opened but still not ready to use and
    // waiting when it will be ready to use.
    const checkDbOptionsResult = checkOptionsIsExists
      ? this.setDbOptionsIfNotExists(dbOptions)
      : this.setDbOptions(dbOptions);

    // options checked and set for valid
    // calculation of the progress percent
    if (checkDbOptionsResult instanceof Error) {
      return checkDbOptionsResult;
    }

    const { dbName, useEncryptedStorage } = dbOptions;
    const db = this.getDbConnectionExists(dbName);

    if (db) {
      this.unsetOptionsForDatabase(dbName);
      return new Error(`A database named as ${dbName} is already exists`);
    }

    if (useEncryptedStorage) {
      await this.addDatabaseNameToListOfUsingSecretStorage(dbName);
    }

    const optionsWithCachestore = await this.extendDatabaseOptionsWithCache(
      dbOptions,
      dbName
    );
    const database = new SwarmStoreConnectorOrbitDBDatabaseQueued<
      ISwarmDatabaseValueTypes,
      DbType
    >(optionsWithCachestore, orbitDb);

    this.setListenersDatabaseEvents(database);

    const databaseOpenResult = await this.waitDatabaseOpened(database);

    if (databaseOpenResult instanceof Error) {
      await this.closeDb(database, false); // close the connection to the database
      await delay(300);
      if (
        openAttempt >
        SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_RECONNECTION_ATTEMPTS_MAX
      ) {
        return this.handleErrorOnDbOpen(
          database,
          'The max nunmber of connection attempts has reached'
        );
      }

      const openDatabaseResult = await this.openDatabase(
        dbOptions,
        (openAttempt += 1)
      );

      if (openDatabaseResult instanceof Error) {
        return this.handleErrorOnDbOpen(database, openDatabaseResult);
      }
    }
    console.log('openDatabase', dbName);
    this.databases.push(database);
    this.emit(ESwarmStoreEventNames.READY, dbOptions.dbName);
  }

  public async dropDatabase(dbName: string) {
    const db = this.getDbConnection(dbName);

    if (!db) {
      return new Error(`The database named ${dbName} was not found`);
    }
    try {
      this.unsetListenersDatabaseEvents(db);
      await db.drop();
      await this.closeDb(db);
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  public async closeDatabase(dbName: string): Promise<Error | void> {
    const db = this.getDbConnection(dbName);

    if (db) {
      return this.closeDb(db);
    }
    return new Error(`The database named ${dbName} was not found`);
  }

  /**
   * make a request to a database by it's name
   * and a method to execute
   * @memberof SwarmStoreConnctotOrbitDB
   */
  public request = async <ISwarmDatabaseValueTypes>(
    dbName: string,
    dbMethod: TSwarmStoreConnectorOrbitDbDatabaseMethodNames,
    arg: TSwarmStoreConnectorOrbitDbDatabaseMethodArgument<
      ISwarmDatabaseValueTypes,
      DbType
    >
  ): Promise<Error | any> => {
    const { isClosed } = this;

    if (isClosed) {
      return new Error('The Swarm connection was closed');
    }

    const dbConnection = await this.waitingDbOpened(dbName);

    if (dbConnection instanceof Error) {
      console.error(dbConnection);
      return this.emitError(
        new Error('Failed to get an opened connection to the database')
      );
    }
    return dbConnection[dbMethod](arg as any);
  };

  /**
   * close all connections with databases
   * and the Swarm store
   * @memberof SwarmStoreConnctotOrbitDB
   */
  public close = async (): Promise<Error | void> => {
    this.setIsClosed();

    const closeAllDatabasesResult = await this.closeDatabases();
    const stopOrbitDBResult = await this.stopOrbitDBInsance();
    let err;

    if (closeAllDatabasesResult instanceof Error) {
      err = true;
      console.error(closeAllDatabasesResult);
      this.emitError('Failed to close all databases connections');
    }
    if (stopOrbitDBResult instanceof Error) {
      err = true;
      console.error(closeAllDatabasesResult);
      this.emitError('Failed to close the current instanceof OrbitDB');
    }
    this.unsetAllListenersForEvents();
    if (err) {
      return this.emitError(
        'Failed to close normally the connection to the swarm store'
      );
    }
  };

  protected setIsClosed = () => {
    this.setNotReady();
    this.isClosed = true;
    this.emit(ESwarmStoreEventNames.CLOSE, true);
  };

  /**
   * return an opened connection with the database by it's name
   * if exists and undefined if it is not exists
   * @readonly
   * @protected
   * @type {(SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabaseValueTypes> | void)}
   * @memberof SwarmStoreConnctotOrbitDB
   */
  protected getDbConnection = (
    dbName: string,
    checkIsOpen: boolean = true
  ): SwarmStoreConnectorOrbitDBDatabase<
    ISwarmDatabaseValueTypes,
    DbType
  > | void => {
    const { databases } = this;

    return databases.find((db) => {
      return (
        db &&
        db.dbName === dbName &&
        (!checkIsOpen || (!db.isClosed && !!db.isReady))
      );
    });
  };

  /**
   * returns a database if exists into the list
   * of the databases which were opened.
   * This method do not check whether db
   * closed and ready.
   * @protected
   * @param {string} dbName
   * @returns
   * @memberof SwarmStoreConnectorOrbitDB
   */
  protected getDbConnectionExists(dbName: string) {
    return this.getDbConnection(dbName, false);
  }

  protected handleDbClose(
    database: SwarmStoreConnectorOrbitDBDatabase<
      ISwarmDatabaseValueTypes,
      DbType
    >
  ): void {
    if (database) {
      const { dbName } = database;

      this.unsetListenersDatabaseEvents(database);
      this.unsetOptionsForDatabase(dbName);
      this.deleteDatabaseFromList(database);
    }
  }

  protected handleErrorOnDbOpen(
    database: SwarmStoreConnectorOrbitDBDatabase<
      ISwarmDatabaseValueTypes,
      DbType
    >,
    error: Error | string
  ): Error {
    if (database) {
      const { dbName } = database;

      this.handleDbClose(database);
      console.error(
        `An error has occurred while database named ${dbName} opening`
      );
      console.error(error);
    }
    return this.emitError(error);
  }

  /**
   * waiting till connection to the database
   * will be opened or failed. If a db will
   * not be ready during a timeout return error.
   * @protected
   * @param {string} dbName
   * @returns {(Promise<Error | SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabaseValueTypes>>)}
   * @memberof SwarmStoreConnectorOrbitDB
   */
  protected async waitingDbOpened(
    dbName: string
  ): Promise<
    Error | SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabaseValueTypes, DbType>
  > {
    const { getDbConnection } = this;
    const db = getDbConnection(dbName);
    const dbOptsIdx = this.getIdxDbOptions(dbName);

    if (db) {
      return db;
    } else if (dbOptsIdx === -1) {
      return new Error(`A database with the name ${dbName} was not found`);
    } else {
      const removeListener = this.removeListener.bind(this);

      return new Promise((res) => {
        let timeout: undefined | NodeJS.Timer;
        function removeListners() {
          if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
          }
          removeListener(ESwarmStoreEventNames.READY, onReady);
          removeListener(ESwarmStoreEventNames.CLOSE, onClose);
        }
        function onReady(dbNameReady: string) {
          if (dbNameReady === dbName) {
            const db = getDbConnection(dbName);

            if (db) {
              removeListners();
              res(db);
            }
          }
        }
        function onClose() {
          removeListners();
          res(new Error('The Swarm store was closed'));
        }

        timeout = setTimeout(() => {
          removeListners();
          res(new Error());
        }, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS);
        this.once(ESwarmStoreEventNames.READY, onReady);
        this.once(ESwarmStoreEventNames.CLOSE, onClose);
      });
    }
  }

  protected unsetAllListenersForEvents = () => {
    Object.values(ESwarmStoreEventNames).forEach(
      this[COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_UNSET_ALL_LISTENERS].bind(
        this
      )
    );
  };

  protected emitDatabaseClose(
    database: SwarmStoreConnectorOrbitDBDatabase<
      ISwarmDatabaseValueTypes,
      DbType
    >
  ) {
    if (database) {
      const { dbName } = database;

      console.warn(`Database named ${dbName} was closed`);
      this.emit(ESwarmStoreEventNames.CLOSE_DATABASE, dbName, database);
    }
  }

  protected emitError(error: Error | string, mehodName?: string): Error {
    const err = typeof error === 'string' ? new Error(error) : error;

    console.error(
      `${SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX}::error${
        mehodName ? `::${mehodName}` : ''
      }`,
      err
    );
    this.emit(ESwarmStoreEventNames.ERROR, err);
    return err;
  }

  private setIsReady(isReady: boolean = false) {
    this.isReady = isReady;
    this.emit(ESwarmStoreEventNames.STATE_CHANGE, isReady);
  }

  /**
   * set the flag this instance
   * is not ready to make a
   * request to databases
   * @protected
   * @memberof SwarmStoreConnectorOrbitDB
   */
  protected setReady() {
    this.setIsReady(true);
  }

  protected setNotReady() {
    this.setIsReady(false);
  }

  /**
   * delete the database from the list
   * of opened databases
   * @protected
   * @param {SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabaseValueTypes>} database
   * @memberof SwarmStoreConnectorOrbitDB
   */
  protected deleteDatabaseFromList(
    database: SwarmStoreConnectorOrbitDBDatabase<
      ISwarmDatabaseValueTypes,
      DbType
    >
  ) {
    const { databases } = this;

    if (databases && databases instanceof Array) {
      commonUtilsArrayDeleteFromArray<
        SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabaseValueTypes, DbType>
      >(databases, database);
    }
  }

  protected checkDbOptions(
    options: unknown
  ): options is ISwarmStoreConnectorOrbitDbDatabaseOptions<
    ISwarmDatabaseValueTypes
  > {
    if (options != null && typeof options === 'object') {
      const { dbName } = options as { dbName: string };

      return !!dbName && typeof dbName === 'string';
    }
    return false;
  }

  /**
   * apply options provided for the
   * instance
   *
   * @private
   * @param {ISwarmStoreConnectorOrbitDBOptions} options
   * @memberof SwarmStoreConnectorOrbitDB
   * @throws Error - throw an error if the options are not valid
   */
  private applyOptions(
    options: ISwarmStoreConnectorOrbitDBOptions<ISwarmDatabaseValueTypes>
  ) {
    if (!options || typeof options !== 'object') {
      throw new Error('The options must be an object');
    }
    this.options = options;

    const { userId, directory } = options;

    if (!userId) {
      console.warn(new Error('The user id is not provided'));
    } else {
      this.userId = userId;
    }
    if (typeof directory === 'string') {
      this.directory = directory;
    }
  }

  private createStorages(credentials?: ISecretStoreCredentials): void {
    if (credentials) {
      // if credentials provided, then
      // create the secret keystorage
      this.createIdentityKeystores(credentials);
    }
    // create secret storage fabric
    this.createStorageFabric(credentials);
  }

  protected getParamsForStoreRootPath(): ISwarmStoreConnectorOrbitDbUtilsAddressCreateRootPathOptions {
    return {
      directory: this.directory,
      userId: String(this.userId),
    };
  }

  protected async createStoreRootPath(): Promise<void> {
    const rootPathParams = this.getParamsForStoreRootPath();
    this.rootPath = await swarmStoreConnectorOrbitDbUtilsAddressCreateRootPath(
      rootPathParams
    );
  }

  protected async initialize(
    credentials?: ISecretStoreCredentials
  ): Promise<void> {
    await this.createStoreRootPath();
    this.createStorages(credentials);
  }

  protected unsetInitializationPromise = (): void => {
    this.initializationPromise = undefined;
  };

  protected createInitializationPromise(
    options: ISwarmStoreConnectorOrbitDBOptions<ISwarmDatabaseValueTypes>
  ): void {
    this.initializationPromise = this.initialize(options.credentials).finally(
      this.unsetInitializationPromise
    );
  }

  /**
   * create keystores for identity provider
   * throw an error if not valid
   *
   * @private
   * @param {(ISwarmStoreConnectorOrbitDBOptions<ISwarmDatabaseValueTypes>)['credentials']} credentials
   * @returns {void}
   * @memberof SwarmStoreConnectorOrbitDB
   * @throws Error
   */
  private createIdentityKeystores(
    credentials: ISwarmStoreConnectorOrbitDBOptions<
      ISwarmDatabaseValueTypes
    >['credentials']
  ): void {
    const { directory, userId } = this;
    const identityKeystorePrefix = `${directory}/${userId}`;
    const identityKeystore = this.createKeystore(
      credentials,
      identityKeystorePrefix
    );

    if (identityKeystore instanceof Error) {
      console.error(identityKeystore);
      throw new Error('Failed on create identity keystore');
    }
    this.identityKeystore = identityKeystore;
  }

  private getOptionsForSwarmStoreConnectorOrbitDBSubclassStorageFabric(
    credentials?: ISwarmStoreConnectorOrbitDBOptions<
      ISwarmDatabaseValueTypes
    >['credentials']
  ): ISwarmStoreConnectorOrbitDbSubclassStorageFabricConstructorOptions {
    const { rootPath } = this;

    if (typeof rootPath !== 'string') {
      throw new Error('createIdentityKeystores::rootPath must be a string');
    }
    return {
      rootPath,
      credentials,
    };
  }

  /**
   * create a Storage fabric which is
   * used by the OrbitDB instance
   * to generate Cache for a
   * Keystore and various databases
   * to read/write values from the
   * local persistent Cache
   *
   * @private
   * @param {(ISwarmStoreConnectorOrbitDBOptions<ISwarmDatabaseValueTypes>)['credentials']} credentials
   * @memberof SwarmStoreConnectorOrbitDB
   * @throws
   */
  private createStorageFabric(
    credentials?: ISwarmStoreConnectorOrbitDBOptions<
      ISwarmDatabaseValueTypes
    >['credentials']
  ): void {
    const options = this.getOptionsForSwarmStoreConnectorOrbitDBSubclassStorageFabric(
      credentials
    );
    this.storage = new SwarmStoreConnectorOrbitDBSubclassStorageFabric(options);
  }

  protected createKeystore(
    credentials: ISwarmStoreConnectorOrbitDBOptions<
      ISwarmDatabaseValueTypes
    >['credentials'],
    keystoreNamePrefix?: string
  ): Keystore | Error {
    const keystoreName = `${keystoreNamePrefix ||
      ''}${SWARM_STORE_CONNECTOR_ORBITDB_KEYSTORE_DEFAULT_DBNAME}`;

    if (!credentials) {
      return this.emitError('createKeystore::A Credentials must be provided');
    }
    return new SwarmStorageConnectorOrbitDBSublassKeyStore({
      credentials, // TODO - why does the credentials without login
      store: keystoreName,
    }) as Keystore;
  }

  /**
   * create identity for the user. If the userid
   * is provided then the identity will be created
   * by the value of the user id.
   *
   * @private
   * @returns {(Promise<Error | void>)}
   * @memberof SwarmStoreConnectorOrbitDB
   */
  private async createIdentity(): Promise<Error | void> {
    const { userId } = this;

    try {
      const identity = await Identities.createIdentity({
        type: SWARM_STORE_CONNECTOR_ORBITDB_IDENTITY_TYPE,
        id: userId ? userId : undefined,
        keystore: this.identityKeystore,
      });

      if (!userId) {
        this.userId = identity.id;
        console.warn(`The user id created automatically is ${userId}`);
      }
      if (identity instanceof Error) {
        return identity;
      }
      this.identity = identity;
    } catch (err) {
      return err;
    }
  }

  /**
   * return index of the options
   * for a database name is exists
   * in the main databases options
   * (in this.options.databases)
   * @protected
   * @param {string} dbName
   * @returns {number | -1}
   * @memberof SwarmStoreConnectorOrbitDB
   */
  protected getIdxDbOptions(dbName: string): number {
    const { options } = this;

    if (options) {
      const { databases } = options;

      if (databases instanceof Array) {
        return databases.findIndex(
          (db) => !!db && typeof db === 'object' && db.dbName === dbName
        );
      }
    }
    return -1;
  }

  protected unsetOptionsForDatabase(dbName: string) {
    const { options } = this;

    if (options) {
      const { databases } = options;

      if (databases instanceof Array) {
        const idx = this.getIdxDbOptions(dbName);

        databases.splice(idx, 1);
      }
    }
  }

  /**
   * set the Database store options in
   * the main options (this.options.databases)
   * of all databases
   * @protected
   * @param {ISwarmStoreConnectorOrbitDbDatabaseOptions} dbOptions
   * @param {boolean} [checkIfExists=false]
   * @returns {(void | Error)}
   * @memberof SwarmStoreConnectorOrbitDB
   */
  protected setDbOptions(
    dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<
      ISwarmDatabaseValueTypes
    >,
    checkIfExists: boolean = false
  ): void | Error {
    if (!this.checkDbOptions(dbOptions)) {
      return new Error('The database options have a wrong format');
    }

    if (checkIfExists) {
      const { dbName } = dbOptions;
      const idxExisting = this.getIdxDbOptions(dbName);

      if (idxExisting !== -1) {
        return new Error(`
          Options for the database ${dbName} is already exists.
          May be the database was opened but still not be in ready state
        `);
      }
    }

    const { options } = this;

    if (!options) {
      this.applyOptions({
        ...this.options,
        userId: '',
        databases: [dbOptions],
      } as ISwarmStoreConnectorOrbitDBOptions<ISwarmDatabaseValueTypes>);
      return;
    }

    const { databases } = options;

    if (databases instanceof Array) {
      const { dbName } = dbOptions;

      this.unsetOptionsForDatabase(dbName);
      databases.push(dbOptions);
    } else {
      options.databases = [dbOptions];
    }
  }

  protected setDbOptionsIfNotExists(
    dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<
      ISwarmDatabaseValueTypes
    >
  ): void | Error {
    return this.setDbOptions(dbOptions, true);
  }

  /**
   *
   *
   * @private
   * @param {SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabaseValueTypes>} database - db to close
   * @param {boolean} [flEmit=true] - whether to emit an events during execution
   * @returns {(Promise<Error | void>)}
   * @memberof SwarmStoreConnectorOrbitDB
   */
  private async closeDb(
    database: SwarmStoreConnectorOrbitDBDatabase<
      ISwarmDatabaseValueTypes,
      DbType
    >,
    flEmit: boolean = true
  ): Promise<Error | void> {
    this.unsetListenersDatabaseEvents(database);

    const { dbName } = database;

    this.unsetOptionsForDatabase(dbName);
    this.deleteDatabaseFromList(database);

    const closeDatabaseResult = await database.close();

    if (closeDatabaseResult instanceof Error) {
      if (flEmit) {
        return this.emitError(closeDatabaseResult);
      }
      return closeDatabaseResult;
    }
    if (flEmit) {
      this.emitDatabaseClose(database);
    }
  }

  private setConnectionOptions(
    connectionOptions: ISwarmStoreConnectorOrbitDBConnectionOptions
  ): void | Error {
    if (!connectionOptions) {
      return this.emitError('Connection options must be specified');
    }

    const { ipfs } = connectionOptions;

    if (!ipfs) {
      return this.emitError(
        'An instance of ipfs must be specified in the connection options'
      );
    }
    this.ipfs = ipfs;
  }

  private unsetSwarmConnectionOptions() {
    this.ipfs = undefined;
    this.connectionOptions = undefined;
  }

  private async disconnectFromSwarm(): Promise<Error | void> {
    console.warn(
      `${SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX}::disconnectFromTheSwarm`
    );
    this.unsetSwarmConnectionOptions();
    this.setNotReady();
  }

  private async connectToSwarm(): Promise<Error | void> {
    const { ipfs } = this;

    if (!ipfs) {
      return this.emitError('An instance of the IPFS must be specified');
    }
    try {
      // wait when the ipfs will be ready to use
      await Promise.race([
        ipfs.ready,
        timeout(SWARM_STORE_CONNECTOR_ORBITDB_CONNECTION_TIMEOUT_MS),
      ]);
    } catch (err) {
      return this.emitError(err);
    }
  }

  private async stopOrbitDBInsance(): Promise<Error | void> {
    const { orbitDb } = this;

    if (orbitDb) {
      try {
        await orbitDb.stop();
        this.setNotReady();
        this.orbitDb = undefined;
      } catch (err) {
        return this.emitError(err, 'stopOrbitDBInsance');
      }
    }
  }

  private async createOrbitDBInstance(): Promise<Error | void> {
    const { ipfs, identity, storage } = this;

    if (!ipfs) {
      return this.emitError(
        'An instance of IPFS must exists',
        'createOrbitDBInstance'
      );
    }
    try {
      if (!OrbitDB) {
        return this.emitError('A constructor of the OrbitDb is not provided');
      }
      if (!identity) {
        return this.emitError('An identity must be specified');
      }

      const instanceOfOrbitDB = await OrbitDB.createInstance(ipfs, {
        identity,
        storage,
      } as any); // TODO - correct typing must be specified

      if (instanceOfOrbitDB instanceof Error) {
        return this.emitError(
          instanceOfOrbitDB,
          'createOrbitDBInstance::error has occurred in the "createInstance" method'
        );
      }
      this.orbitDb = instanceOfOrbitDB;
    } catch (err) {
      return this.emitError(
        err,
        'createOrbitDBInstance::failed to create the instance of OrbitDB'
      );
    }
  }

  protected getDbOptions(
    dbName: string
  ):
    | ISwarmStoreConnectorOrbitDbDatabaseOptions<ISwarmDatabaseValueTypes>
    | void
    | Error {
    const { options } = this;

    if (!options) {
      return this.emitError(
        'An options is not specified for the database',
        `getDbOptions::${dbName}`
      );
    }

    const { databases } = options;

    return databases.find((option) => option && option.dbName === dbName);
  }

  protected stop(): Promise<Error | void> {
    this.setNotReady();
    return this.closeDatabases();
  }

  /**
   * open database and not check if an options are
   * exists for the database (replace if exists)
   * @private
   * @param {ISwarmStoreConnectorOrbitDbDatabaseOptions} optionsForDb
   * @returns
   * @memberof SwarmStoreConnectorOrbitDB
   */
  private openDatabaseNotCheckOptionsExists(
    optionsForDb: ISwarmStoreConnectorOrbitDbDatabaseOptions<
      ISwarmDatabaseValueTypes
    >
  ): Promise<void | Error> {
    return this.openDatabase(optionsForDb, 0, false);
  }

  private async restartDbConnection(
    dbName: string,
    database: SwarmStoreConnectorOrbitDBDatabase<
      ISwarmDatabaseValueTypes,
      DbType
    >
  ): Promise<void | Error> {
    //try to restart the database
    const optionsForDb = this.getDbOptions(dbName);

    this.unsetListenersDatabaseEvents(database);
    if (optionsForDb instanceof Error || !optionsForDb) {
      this.emitError(
        'Failed to get options to open a new db store',
        `restartDbConnection::${dbName}`
      );
      return this.stop();
    }

    const startDbResult = await this.openDatabaseNotCheckOptionsExists(
      optionsForDb
    );

    if (startDbResult instanceof Error) {
      this.emitError(
        'Failed to open a new db store',
        `restartDbConnection::${dbName}`
      );
      return this.stop();
    }
  }

  protected removeDbFromList(
    database: SwarmStoreConnectorOrbitDBDatabase<
      ISwarmDatabaseValueTypes,
      DbType
    >
  ) {
    if (this.databases instanceof Array) {
      commonUtilsArrayDeleteFromArray<
        SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabaseValueTypes, DbType>
      >(this.databases, database);
    }
  }

  private handleDatabaseStoreClosed = (
    database: SwarmStoreConnectorOrbitDBDatabase<
      ISwarmDatabaseValueTypes,
      DbType
    >,
    error: Error
  ) => {
    if (database) {
      const { dbName } = database;

      this.emitError(
        `Database closed unexpected: ${error.message}`,
        `handleDatabaseStoreClosed::${dbName}`
      );
      this.handleDbClose(database);
      this.restartDbConnection(dbName, database);
    }
  };

  private handleLoadingProgress = (dbName: string, progress: number): void => {
    /* 
            databases - is a list of the databases opened already
            it means that the loading progress for this databases
            is 100%
        */
    const { databases, options } = this;
    let currentProgressInPercent = 0;

    if (options) {
      /* 
                overallDatabases - is a list of all databases
                which are must be opened
            */
      const { databases: overallDatabases } = options;
      // the progress which will be reached
      // on all the databases will be opened
      const overallProgressToReach = overallDatabases.length * 100;
      // progress reached at this time
      const currentProgress =
        (databases ? databases.length : 0) * 100 + progress;
      // the progress reached at this time in a percentage
      currentProgressInPercent = currentProgress
        ? (overallProgressToReach / currentProgress) * 100
        : 0;
    }
    console.log(
      `Swarm store connector::handleLoadingProgress::${dbName}::progress::${progress}`
    );
    this.emit(ESwarmStoreEventNames.LOADING, currentProgressInPercent);
    this.emit(ESwarmStoreEventNames.DB_LOADING, [dbName, progress]);
  };

  private handleDatabaseUpdated = (dbName: string) => {
    this.emit(ESwarmStoreEventNames.UPDATE, dbName);
  };

  /**
   * write
   * db.events.on('write', (address, entry, heads) => ... )
   * Emitted after an entry was added locally to the database. hash is the IPFS hash of the latest state of the database.
   * entry is the added database op.
   *
   * @private
   * @memberof SwarmStoreConnectorOrbitDB
   */
  private handleNewEntryAddedToDatabase = ([
    dbName,
    entry,
    address,
    heads,
    dbType,
  ]: [
    string,
    LogEntry<ISwarmDatabaseValueTypes>,
    string,
    any,
    ESwarmStoreConnectorOrbitDbDatabaseType
  ]) => {
    // TODO - FOR KEY VALUE STOE. If added two different values for the same key,
    // then two messages related to this values will be emitted anyway
    // not just one, which is the latest one, but both messages.
    // Both two messages will be emitted after the instance was preloaded
    console.log(
      `SwarmStoreConnectorOrbitDB::handleNewEntryAddedToDatabase:emit NEW_ENTRY`,
      {
        dbName,
        entry,
        address,
        heads,
      }
    );
    this.emit(ESwarmStoreEventNames.NEW_ENTRY, [
      dbName,
      entry,
      address,
      heads,
      dbType,
    ]);
  };

  private async setListenersDatabaseEvents(
    database: SwarmStoreConnectorOrbitDBDatabase<
      ISwarmDatabaseValueTypes,
      DbType
    >,
    isSet: boolean = true
  ): Promise<Error | void> {
    const methodName = isSet
      ? COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON
      : COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_OFF;

    if (isSet) {
      const dbCloseHandler = (err: Error) => {
        this.handleDatabaseStoreClosed(database, err);
      };

      database[methodName](ESwarmStoreEventNames.CLOSE, dbCloseHandler);
      database[methodName](ESwarmStoreEventNames.FATAL, dbCloseHandler);
      this.dbCloseListeners.push(dbCloseHandler);
    } else {
      this.dbCloseListeners.forEach((dbCloseHandler) => {
        database[methodName](ESwarmStoreEventNames.CLOSE, dbCloseHandler);
        database[methodName](ESwarmStoreEventNames.FATAL, dbCloseHandler);
      });
    }
    database[methodName](
      ESwarmStoreEventNames.LOADING,
      this.handleLoadingProgress
    );
    database[methodName](
      ESwarmStoreEventNames.UPDATE,
      this.handleDatabaseUpdated
    );
    database[methodName](
      ESwarmStoreEventNames.NEW_ENTRY,
      this.handleNewEntryAddedToDatabase
    );
  }

  private async unsetListenersDatabaseEvents(
    database: SwarmStoreConnectorOrbitDBDatabase<
      ISwarmDatabaseValueTypes,
      DbType
    >
  ): Promise<Error | void> {
    this.setListenersDatabaseEvents(database, false);
  }

  private async closeDatabases(): Promise<Error | void> {
    const { databases } = this;

    // set that the orbit db is not ready to use
    this.setNotReady();
    if (!databases || !databases.length) {
      return;
    }

    try {
      let idx = 0;
      const databasesToClose = [...databases];
      const len = databasesToClose.length;

      for (; idx < len; idx += 1) {
        const db = databasesToClose[idx];
        const dbCloseResult = await this.closeDb(db);

        if (dbCloseResult instanceof Error) {
          console.error(this.emitError(dbCloseResult));
          this.emitError(
            'An error has occurred on closing the database',
            'closeDatabases'
          );
        }
      }
      this.databases = [];
    } catch (err) {
      return err;
    }
  }

  private waitDatabaseOpened(
    database: SwarmStoreConnectorOrbitDBDatabase<
      ISwarmDatabaseValueTypes,
      DbType
    >
  ): Promise<Error | boolean> {
    return new Promise<Error | boolean>(async (res) => {
      let timeout: NodeJS.Timer | undefined = undefined;

      function usetListeners() {
        database.removeListener(ESwarmStoreEventNames.READY, res);
        database.removeListener(ESwarmStoreEventNames.CLOSE, res);
        database.removeListener(ESwarmStoreEventNames.FATAL, res);
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = undefined;
      }

      timeout = setTimeout(async () => {
        usetListeners();
        res(
          new Error('Failed to open the database cause the timeout has reached')
        );
      }, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONNECTION_TIMEOUT_MS);
      try {
        database.once(ESwarmStoreEventNames.CLOSE, () => {
          usetListeners();
          res(new Error('Database was closed'));
        });
        database.once(ESwarmStoreEventNames.FATAL, () => {
          usetListeners();
          res(new Error('A fatal error has occurred while open the database'));
        });
        database.once(ESwarmStoreEventNames.READY, () => {
          usetListeners();
          console.log('dbReady', database.dbName);
          res(true);
        });

        //connect to the database
        // and wait for an events from it
        const connectResult = await database.connect();

        if (connectResult instanceof Error) {
          usetListeners();
          console.error(connectResult);
          return this.emitError('The database.connect method was failed');
        }
      } catch (err) {
        console.error(err);
        usetListeners();
        res(err);
      }
    });
  }

  private async openDatabases(): Promise<Error | void> {
    const { options } = this;

    if (!options) {
      return this.emitError(
        'The options must be specified to open the databases'
      );
    }

    const { databases } = options;
    const databasesOptions = [...databases];

    if (!(databasesOptions instanceof Array)) {
      return this.emitError('The options for databases must be specified');
    }
    if (!databasesOptions.length) {
      return;
    }
    try {
      let idx = 0;
      const len = databasesOptions.length;

      for (; idx < len; idx += 1) {
        const options = databasesOptions[idx];
        const startResultStatus = await this.openDatabaseNotCheckOptionsExists(
          options
        );

        if (startResultStatus instanceof Error) {
          console.error(startResultStatus);
          await this.closeDatabases();
          return new Error('Failed to open the database');
        }
      }
    } catch (err) {
      await this.closeDatabases();
      return this.emitError(err);
    }
  }

  protected async extendDatabaseOptionsWithCache(
    dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<
      ISwarmDatabaseValueTypes
    >,
    dbName: string
  ): Promise<
    ISwarmStoreConnectorOrbitDbDatabaseOptions<ISwarmDatabaseValueTypes>
  > {
    const { storage } = this;

    if (!storage) {
      throw new Error('Storage is not exists in the connector');
    }
    return {
      ...dbOptions,
      cache: await storage.createStoreForDb(dbName),
    };
  }

  protected async addDatabaseNameToListOfUsingSecretStorage(
    dbName: string
  ): Promise<void> {
    if (!this.storage) {
      throw new Error('There is no storage instance');
    }

    // Add the database name in the Storage fabric
    // as the enctypted db. The storage fabric
    // will create the encrypted storage
    // for this database
    await this.storage.addSecretDatabaseName(dbName);
  }
}
