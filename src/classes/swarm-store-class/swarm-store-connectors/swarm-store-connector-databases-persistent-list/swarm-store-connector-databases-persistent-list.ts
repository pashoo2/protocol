import { commonUtilsArrayUniq, createPromisePendingRejectable } from 'utils';

import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import assert from 'assert';
import { IStorageCommon } from '../../../../types/storage.types';
import { ISerializer } from '../../../../types/serialization.types';
import { SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_ATTEMPTS_TO_SAVE_ON_FAIL } from './swarm-store-connector-databases-persistent-list.const';
import {
  SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_DEFAULT_DATABASE_LIST,
  SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PREFIX_DATABASE_NAME_DELIMITER,
  SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_DATABASES_NAMES,
  SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PREFIX_DATABASES_NAMES_DELIMITER,
} from './swarm-store-connector-databases-persistent-list.const';
import { ISwarmStoreConnectorDatabasesPersistentListConstructorParams } from '../../swarm-store-class.types';
import {
  ConcurrentAsyncQueueWithAutoExecution,
  IAsyncQueueConcurrentWithAutoExecution,
} from '../../../basic-classes/async-queue-class-base';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorDatabasesPersistentList,
} from '../../swarm-store-class.types';

//  TODO - create class which works with a database options class
export class SwarmStoreConnectorPersistentList<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBL extends Record<DBO['dbName'], DBO>
> implements ISwarmStoreConnectorDatabasesPersistentList<P, ItemType, DbType, DBO, DBL>
{
  public get databasesKnownOptionsList(): DBL | undefined {
    return this._databasesList;
  }

  protected _databaseListPersistentStorage: IStorageCommon | undefined;
  protected _keyPrefixInStorageForSerializedDbList: string | undefined;

  protected _serializer: ISerializer | undefined;

  protected _databasesList: DBL | undefined;

  private _asyncOperationsQueue: IAsyncQueueConcurrentWithAutoExecution<void, Error> | undefined;

  /**
   * Whether the instance has been closing and cannot perfom
   * any new operations.
   *
   * @private
   * @type {(boolean | undefined)}
   * @memberof SwarmStoreConnectorPersistentList
   */
  private _wasClosed: boolean | undefined;

  protected readonly _maxFailsOfersistentStorageOperation =
    SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_ATTEMPTS_TO_SAVE_ON_FAIL;

  protected get _databasesUniqNamesList(): Array<DBO['dbName']> | undefined {
    const databasesList = this._databasesList;
    if (!databasesList) {
      return undefined;
    }
    return Object.keys(databasesList);
  }

  constructor(params: ISwarmStoreConnectorDatabasesPersistentListConstructorParams) {
    this._validateParams(params);
    this._setParams(params);
    this._initializeAsyncQueue();
  }

  public async loadDatabasesListFromPersistentStorage(): Promise<DBL> {
    this._checkInstanceIsNotClosed();
    const dbsList = await this._loadDatabasesListFromStorageIfExists();

    if (!dbsList) {
      this._setDefaultDatabasesList();
    } else {
      this._setDatabasesList(dbsList);
    }
    return this._getDatabasesListClone();
  }

  public async getDatabaseOptions(dbName: DBO['dbName']): Promise<DBO | undefined> {
    this._checkInstanceIsNotClosed();
    await this._loadDatabasesListIfNotLoaded();
    return this._getDatabasesListClone()[dbName];
  }

  public async addDatabase(dbName: DBO['dbName'], dbOptions: DBO): Promise<void> {
    this._checkInstanceIsNotClosed();
    await this._loadDatabasesListIfNotLoaded();
    await this._waitQueueAndRunOperationInTransaction(this._createAddDatabaseToTheListInStorageOperation(dbName, dbOptions));
  }

  public async addDatabaseSerializedOptions(dbName: DBO['dbName'], dbOptions: string): Promise<void> {
    this._checkInstanceIsNotClosed();
    await this._loadDatabasesListIfNotLoaded();
  }

  public async removeDatabase(dbName: DBO['dbName']): Promise<void> {
    this._checkInstanceIsNotClosed();
    await this._loadDatabasesListIfNotLoaded();
    await this._waitQueueAndRunOperationInTransaction(this._createRemoveDatabaseFromTheListAndStorageOperation(dbName));
  }

  public async close(): Promise<void> {
    this._checkInstanceIsNotClosed();
    this._setInstanceClosed();
    await this._waitAllPendingAsyncEndedAndExecute(async (): Promise<void> => {
      await this._destroyAsyncOperationsQueue();
      this._resetTheInstance();
    });
  }

  protected _validateParams(
    params: ISwarmStoreConnectorDatabasesPersistentListConstructorParams
  ): params is ISwarmStoreConnectorDatabasesPersistentListConstructorParams {
    assert(params, 'Parameters should be defined');
    assert(
      params.keyPrefixForDatabasesLisInPersistentStorage,
      'Key prefix in storage which should be used for storing the serialized list of databases ("databasesLisPersistantKey") should be defined in the params'
    );
    assert(params.persistentStorage, 'Persistent storage for storing the list of a databases should be defined');
    assert(params.serializer, 'A serializer should be passed in params');
    return true;
  }

  protected _setParams(params: ISwarmStoreConnectorDatabasesPersistentListConstructorParams): void {
    this._databaseListPersistentStorage = params.persistentStorage;
    this._keyPrefixInStorageForSerializedDbList = params.keyPrefixForDatabasesLisInPersistentStorage;
    this._serializer = params.serializer;
  }

  protected _initializeAsyncQueue() {
    this._asyncOperationsQueue = new ConcurrentAsyncQueueWithAutoExecution<void, Error>(createPromisePendingRejectable);
  }

  protected _setInstanceClosed(): void {
    this._wasClosed = true;
  }

  protected _unsetParams(): void {
    this._databaseListPersistentStorage = undefined;
    this._keyPrefixInStorageForSerializedDbList = undefined;
    this._serializer = undefined;
  }

  protected _unsetAsyncQueue(): void {
    this._asyncOperationsQueue = undefined;
  }

  protected _resetTheInstance(): void {
    this._unsetAsyncQueue();
    this._unsetParams();
  }

  protected _checkInstanceIsNotClosed(): void {
    if (this._wasClosed) {
      throw new Error('The instance was closed and can not perform any operations');
    }
  }

  protected _getAsyncOperationsQueue(): IAsyncQueueConcurrentWithAutoExecution<void, Error> {
    if (!this._asyncOperationsQueue) {
      throw new Error('Failed to initialize the async queue instance');
    }
    return this._asyncOperationsQueue;
  }

  protected async _destroyAsyncOperationsQueue(): Promise<void> {
    await this._getAsyncOperationsQueue().destroy(new Error('The database persistent list was closed'));
  }

  protected _getDatabasesListClone(): DBL {
    const databasesList = this._databasesList;
    if (!databasesList) {
      throw new Error('Databases list is not defined');
    }
    return { ...databasesList };
  }

  protected _getDatabaseListPersistentStorage(): IStorageCommon {
    const databaseListPersistentStorage = this._databaseListPersistentStorage;
    if (!databaseListPersistentStorage) {
      throw new Error('There is no persistant storage instance');
    }
    return databaseListPersistentStorage;
  }

  protected _getKeyPrefixForSerializedDbListInStorage(): string {
    const keyInStorageForSerializedDbList = this._keyPrefixInStorageForSerializedDbList;
    if (!keyInStorageForSerializedDbList) {
      throw new Error('There is no a storage key prefix for the value of a databases list serialized');
    }
    return keyInStorageForSerializedDbList;
  }

  protected _getSerializer(): ISerializer {
    const databasesListSerializer = this._serializer;
    if (!databasesListSerializer) {
      throw new Error('Databases list serializer is not defined');
    }
    return databasesListSerializer;
  }

  protected _getStorageKeyForDatabasesNamesList(): string {
    return `${this._getKeyPrefixForSerializedDbListInStorage()}//${SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PREFIX_DATABASES_NAMES_DELIMITER}${SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_DATABASES_NAMES}`;
  }

  protected _getStorageKeyForDatabase(dbName: string): string {
    return `${this._getKeyPrefixForSerializedDbListInStorage()}${SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PREFIX_DATABASE_NAME_DELIMITER}${dbName}`;
  }

  protected _isTheLastFailedOperationAllowed(attempt: number): boolean {
    return attempt > this._maxFailsOfersistentStorageOperation;
  }

  protected async _readValueForKeyFromStore(keyInStore: string): Promise<string | undefined> {
    const valueReadResult = await this._getDatabaseListPersistentStorage().get(keyInStore);

    if (valueReadResult instanceof Error) {
      throw valueReadResult;
    }
    return valueReadResult ?? undefined;
  }

  private async _setValueForKeyInStorage(keyInStore: string, value: string | undefined): Promise<void> {
    const valueSetResult = await this._getDatabaseListPersistentStorage().set(keyInStore, value);

    if (valueSetResult instanceof Error) {
      throw valueSetResult;
    }
  }

  protected async _addValueForKeyInStorage(keyInStore: string, value: string): Promise<void> {
    await this._setValueForKeyInStorage(keyInStore, value);
  }

  protected async _removeValueForKeyFromStorage(keyInStore: string): Promise<void> {
    await this._setValueForKeyInStorage(keyInStore, undefined);
  }

  protected async _loadDatabasesListNamesSerializedFromStorage(): Promise<string | undefined> {
    const keyInStorageForDatabasesNamesList = this._getStorageKeyForDatabasesNamesList();
    return await this._readValueForKeyFromStore(keyInStorageForDatabasesNamesList);
  }

  protected async _loadDatabasesListNamesFromStorage(): Promise<Array<string> | undefined> {
    const databasesNamesListSerialized = await this._loadDatabasesListNamesSerializedFromStorage();

    if (databasesNamesListSerialized) {
      return this._getSerializer().parse(databasesNamesListSerialized);
    }
  }

  protected async _loadDatabaseOptionsSerializedOrUndefinedFromStorage(dbName: DBO['dbName']): Promise<string | undefined> {
    return await this._readValueForKeyFromStore(this._getStorageKeyForDatabase(dbName));
  }

  protected _parseDatabaseOptions(dbOptionsSerialized: string): DBO {
    return this._getSerializer().parse(dbOptionsSerialized);
  }

  protected _serializeDatabaseOptions(dbOptionsUnserialized: DBO): string {
    return this._getSerializer().stringify(dbOptionsUnserialized);
  }

  protected async _loadDatabaseOptionsParsedOrUndefinedFromStorage(dbName: DBO['dbName']): Promise<DBO | undefined> {
    const dbOptionsSerialized = await this._loadDatabaseOptionsSerializedOrUndefinedFromStorage(dbName);

    if (!dbOptionsSerialized) {
      return;
    }
    return this._parseDatabaseOptions(dbOptionsSerialized);
  }

  protected async _loadDatabaseOptionsParsedFromStorage(dbName: DBO['dbName']): Promise<DBO> {
    const dbOptions = await this._loadDatabaseOptionsParsedOrUndefinedFromStorage(dbName);
    if (!dbOptions) {
      throw new Error(`Thereis no options for the database ${dbName} in the persistent storage`);
    }
    return dbOptions;
  }

  protected async _loadDatabasesOptionsFromStorage(dbsNames: Array<DBO['dbName']>): Promise<Array<[DBO['dbName'], DBO]>> {
    const databasesOptionsParsed = await Promise.all(
      dbsNames.map(async (dbName: DBO['dbName']) => [dbName, await this._loadDatabaseOptionsParsedFromStorage(dbName)])
    );

    return databasesOptionsParsed as Array<[DBO['dbName'], DBO]>;
  }

  protected async _loadDatabasesListFromStorage(dbsNames: Array<string>): Promise<DBL> {
    const uniqDatabasesNames = commonUtilsArrayUniq(dbsNames);
    const databasesOptions = await this._loadDatabasesOptionsFromStorage(uniqDatabasesNames);
    return databasesOptions.reduce((databasesList, [dbName, dbOptions]): DBL => {
      databasesList[dbName] = dbOptions as DBL[DBO['dbName']];
      return databasesList;
    }, {} as DBL);
  }

  protected async _loadDatabasesListFromStorageIfExists(): Promise<DBL | undefined> {
    const databasesNamesList = await this._loadDatabasesListNamesFromStorage();

    if (!databasesNamesList) {
      return;
    }
    return await this._loadDatabasesListFromStorage(databasesNamesList);
  }

  protected _setDatabasesList(databasesList: DBL): void {
    this._databasesList = databasesList;
  }

  protected _setDefaultDatabasesList(): void {
    this._setDatabasesList(SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_DEFAULT_DATABASE_LIST as DBL);
  }

  protected async _loadDatabasesListIfNotLoaded(): Promise<void> {
    this._databasesList ?? (await this.loadDatabasesListFromPersistentStorage());
  }

  protected _getDatabasesNamesListStringified(): string {
    const databasesNamesListNotSerialized = this._databasesUniqNamesList;
    if (!databasesNamesListNotSerialized) {
      throw new Error('There is no databases names list');
    }
    return this._getSerializer().stringify(databasesNamesListNotSerialized);
  }

  protected async _saveDatabasesNamesListInPersistentStorage(): Promise<void> {
    const keyInStorageForDatabasesNamesList = this._getStorageKeyForDatabasesNamesList();
    await this._addValueForKeyInStorage(keyInStorageForDatabasesNamesList, this._getDatabasesNamesListStringified());
  }

  protected async _removeDatabaseOptionsFromStorage(dbName: DBO['dbName']): Promise<void> {
    return await this._removeValueForKeyFromStorage(this._getStorageKeyForDatabase(dbName));
  }

  protected async _addDatabaseOptionsSerializedToStorage(dbName: DBO['dbName'], dbOptionsSerialized: string): Promise<void> {
    return await this._addValueForKeyInStorage(this._getStorageKeyForDatabase(dbName), dbOptionsSerialized);
  }

  protected async _addDatabaseOptionsToStorage(dbName: DBO['dbName'], dbOptions: DBO): Promise<void> {
    return await this._addDatabaseOptionsSerializedToStorage(dbName, this._serializeDatabaseOptions(dbOptions));
  }

  protected _setDatabasesListValue(databaseList: DBL): void {
    this._databasesList = databaseList;
  }

  protected _removeDatabaseFromTheCacheList(dbName: DBO['dbName']): void {
    const databasesListCloned = this._getDatabasesListClone();
    delete databasesListCloned[dbName];
    this._setDatabasesListValue(databasesListCloned);
  }

  protected _addDatabaseToTheCacheList(dbName: DBO['dbName'], dbOptions: DBO): void {
    const databasesListCloned = this._getDatabasesListClone();
    databasesListCloned[dbName] = dbOptions as DBL[DBO['dbName']];
    this._setDatabasesListValue(databasesListCloned);
  }

  /**
   * just remove the database name from the list and leave the options
   * @param dbName
   */
  protected async _removeDatabaseFromListAndSaveInStorage(dbName: DBO['dbName']): Promise<void> {
    this._removeDatabaseFromTheCacheList(dbName);
    await this._saveDatabasesNamesListInPersistentStorage();
  }

  protected async _addDatabaseToTheListAndSaveInStorage(dbName: DBO['dbName'], dbOptions: DBO): Promise<void> {
    this._addDatabaseToTheCacheList(dbName, dbOptions);
    await Promise.all([this._addDatabaseOptionsToStorage(dbName, dbOptions), this._saveDatabasesNamesListInPersistentStorage()]);
  }

  protected async _setDatabasesListValueAndSaveDatabasesNamesListInStorage(
    databasesList: DBL,
    attempt: number = 1
  ): Promise<void> {
    this._setDatabasesListValue(databasesList);
    try {
      await this._saveDatabasesNamesListInPersistentStorage();
    } catch (err) {
      if (this._isTheLastFailedOperationAllowed((attempt += 1))) {
        throw err;
      }
      console.log(err);
      await this._setDatabasesListValueAndSaveDatabasesNamesListInStorage(databasesList, attempt + 1);
    }
  }

  protected async _runStorageOperationInTransaction<T>(runOperationInTransaction: () => Promise<T>): Promise<T> {
    const databasesListCurrentValueClone = this._getDatabasesListClone();
    let attempt = 0;
    let operationResultError: Error | undefined;
    while (!this._isTheLastFailedOperationAllowed((attempt += 1))) {
      try {
        const operationResult = await runOperationInTransaction();
        operationResultError = undefined;
        return operationResult;
      } catch (err) {
        console.error(err);
        operationResultError = err as Error;
      }
    }
    // restore the original value of the list if the operaion failed
    await this._setDatabasesListValueAndSaveDatabasesNamesListInStorage(databasesListCurrentValueClone);
    throw operationResultError;
  }

  protected async _waitAllPendingAsyncEndedAndExecute(runAsyncOperation: () => Promise<void>): Promise<void> {
    return await this._getAsyncOperationsQueue().executeQueued(runAsyncOperation);
  }

  protected async _waitQueueAndRunOperationInTransaction(runOperationInTransaction: () => Promise<void>): Promise<void> {
    return await this._waitAllPendingAsyncEndedAndExecute(
      async () => await this._runStorageOperationInTransaction<void>(runOperationInTransaction)
    );
  }

  protected _createRemoveDatabaseFromTheListAndStorageOperation(dbName: DBO['dbName'], attempt = 1): () => Promise<void> {
    return async () => await this._removeDatabaseFromListAndSaveInStorage(dbName);
  }

  protected _createAddDatabaseToTheListInStorageOperation(dbName: DBO['dbName'], dbOptions: DBO): () => Promise<void> {
    return async () => await this._addDatabaseToTheListAndSaveInStorage(dbName, dbOptions);
  }
}
