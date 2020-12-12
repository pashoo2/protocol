import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import assert from 'assert';
import { ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator } from '../swarm-store-connector-db-options-helpers/swarm-store-connector-db-options-helpers.types';
import { IStorageCommon } from '../../../../types/storage.types';
import { ISerializer } from '../../../../types/serialization.types';
import { SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_DEFAULT_DATABASES_NAMES_LIST } from './swarm-store-connector-databases-persistent-list.const';
import { IDatabaseOptionsSerializerValidatorConstructor } from '../../swarm-store-class.types';
import { commonUtilsArrayUniq } from '../../../../utils/common-utils/common-utils-array';
import {
  SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_DEFAULT_DATABASE_LIST,
  SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PERFIX_DATABASE_NAME_DELIMETER,
  SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_DATABASES_NAMES,
  SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PERFIX_DATABASES_NAMES_DELIMETER,
} from './swarm-store-connector-databases-persistent-list.const';
import {
  ISwarmStoreConnectorDatabasesPersistentListConstructorParams,
  TSwarmStoreDatabaseOptionsSerialized,
} from '../../swarm-store-class.types';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorDatabasesPersistentList,
} from '../../swarm-store-class.types';

export class SwarmStoreConnectorPersistentList<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CP extends ISwarmStoreConnectorDatabasesPersistentListConstructorParams<P, ItemType, DbType, DBO, DBOS>,
  DBL extends Record<DBO['dbName'], InstanceType<CP['databaseOptionsValidatorSerializerConstructor']>['options']>
> implements ISwarmStoreConnectorDatabasesPersistentList<P, ItemType, DbType, DBO, DBL> {
  public get databasesKnownOptionsList(): DBL | undefined {
    return this._databasesList;
  }

  protected _databaseListPersistentStorage: IStorageCommon | undefined;
  protected _databaseOptionsValidatorSerializer:
    | IDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, DBO, DBOS>
    | undefined;
  protected _keyPrefixInStorageForSerializedDbList: string | undefined;

  protected _databasesListSerializer: ISerializer | undefined;

  protected _databasesList: DBL | undefined;

  protected get _databasesNamesList(): Array<DBO['dbName']> | undefined {
    const databasesList = this._databasesList;
    if (!databasesList) {
      return undefined;
    }
    return Object.keys(databasesList);
  }

  constructor(params: CP) {
    this._validateParams(params);
    this._setParams(params);
  }

  public async loadDatabasesListFromPersistentStorage(): Promise<DBL> {
    const dbsList = await this._loadDatabasesListFromStorageIfExists();

    if (!dbsList) {
      this._setDefaultDatabasesList();
    } else {
      this._setDatabasesList(dbsList);
    }
    return this._getDatabasesList();
  }

  public async getDatabaseOptions(dbName: DBO['dbName']): Promise<DBO | undefined> {
    await this._loadDatabasesListIfNotLoaded();
    return this._getDatabasesList()[dbName];
  }

  public addDatabase(dbName: DBO['dbName'], dbOptions: DBO): Promise<void> {
    await this._loadDatabasesListIfNotLoaded();
  }

  protected _validateParams(
    params: ISwarmStoreConnectorDatabasesPersistentListConstructorParams<P, ItemType, DbType, DBO, DBOS>
  ): void {
    assert(params, 'Parameters should be defined');
    assert(
      params.keyPrefixForDatabasesLisInPersistentStorage,
      'Key prefix in storage which should be used for storing the serialized list of databases ("databasesLisPersistantKey") should be defined in the params'
    );
    assert(
      params.databaseOptionsValidatorSerializerConstructor,
      'Serializer/validator of a database options (databaseOptionsValidatorSerializer) should be passed in the params'
    );
    assert(params.databasePersistantListStorage, 'Persistent storage for storing the list of a databases should be defined');
    assert(params.databasesListSerializer, 'A serializer should be passed in params');
  }

  protected _setParams(
    params: ISwarmStoreConnectorDatabasesPersistentListConstructorParams<P, ItemType, DbType, DBO, DBOS>
  ): void {
    this._databaseListPersistentStorage = params.databasePersistantListStorage;
    this._databaseOptionsValidatorSerializer = params.databaseOptionsValidatorSerializerConstructor;
    this._keyPrefixInStorageForSerializedDbList = params.keyPrefixForDatabasesLisInPersistentStorage;
    this._databasesListSerializer = params.databasesListSerializer;
  }

  protected _getDatabasesList(): DBL {
    const databasesList = this._databasesList;
    if (!databasesList) {
      throw new Error('Databases list is not defined');
    }
    return databasesList;
  }

  protected _getDatabaseListPersistentStorage(): IStorageCommon {
    const databaseListPersistentStorage = this._databaseListPersistentStorage;
    if (!databaseListPersistentStorage) {
      throw new Error('There is no persistant storage instance');
    }
    return databaseListPersistentStorage;
  }

  protected _getDatabaseOptionsValidatorSerializerConstructor(): IDatabaseOptionsSerializerValidatorConstructor<
    P,
    ItemType,
    DbType,
    DBO,
    DBOS
  > {
    const databaseOptionsValidatorSerializer = this._databaseOptionsValidatorSerializer;
    if (!databaseOptionsValidatorSerializer) {
      throw new Error('There is no validator serializer instance');
    }
    return databaseOptionsValidatorSerializer;
  }
  protected _getKeyPrefixForSerializedDbListInStorage(): string {
    const keyInStorageForSerializedDbList = this._keyPrefixInStorageForSerializedDbList;
    if (!keyInStorageForSerializedDbList) {
      throw new Error('There is no a storage key prefix for the value of a databases list serialized');
    }
    return keyInStorageForSerializedDbList;
  }

  protected _getDatabasesListSerializer(): ISerializer {
    const databasesListSerializer = this._databasesListSerializer;
    if (!databasesListSerializer) {
      throw new Error('Databases list serializer is not defined');
    }
    return databasesListSerializer;
  }

  protected _getStorageKeyForDatabasesNamesList(): string {
    return `${this._getKeyPrefixForSerializedDbListInStorage()}//${SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PERFIX_DATABASES_NAMES_DELIMETER}${SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_DATABASES_NAMES}`;
  }

  protected _getStorageKeyForDatabase(dbName: string): string {
    return `${this._getKeyPrefixForSerializedDbListInStorage()}${SWARM_STORE_CONNECTOR_DATABASES_PERSISTENT_LIST_STORAGE_KEY_PERFIX_DATABASE_NAME_DELIMETER}${dbName}`;
  }

  protected async _readValueForKeyFromStore(keyInStore: string): Promise<string | undefined> {
    const valueReadResult = await this._getDatabaseListPersistentStorage().get(keyInStore);

    if (valueReadResult instanceof Error) {
      throw valueReadResult;
    }
    return valueReadResult ?? undefined;
  }

  protected async _addValueForKeyInStorage(keyInStore: string, value: string): Promise<void> {
    const valueReadResult = await this._getDatabaseListPersistentStorage().set(keyInStore, value);

    if (valueReadResult instanceof Error) {
      throw valueReadResult;
    }
  }

  protected async _loadDatabasesListNamesSerializedFromStorage(): Promise<string | undefined> {
    return await this._readValueForKeyFromStore(this._getKeyPrefixForSerializedDbListInStorage());
  }

  protected async _loadDatabasesListNamesFromStorage(): Promise<Array<string> | undefined> {
    const databasesNamesListSerialized = await this._loadDatabasesListNamesSerializedFromStorage();

    if (databasesNamesListSerialized) {
      return this._getDatabasesListSerializer().parse(databasesNamesListSerialized);
    }
  }

  protected async _loadDatabaseOptionsSerializedOrUndefinedFromStorage(dbName: DBO['dbName']): Promise<string | undefined> {
    return this._readValueForKeyFromStore(this._getStorageKeyForDatabase(dbName));
  }

  protected _parseDatabaseOptions(dbOptionsSerialized: DBOS): DBO {
    const DbOptionsConstructor = this._getDatabaseOptionsValidatorSerializerConstructor();
    const dbOptionsConstructed = new DbOptionsConstructor({ options: dbOptionsSerialized });
    return dbOptionsConstructed.options;
  }

  protected async _loadDatabaseOptionsParsedOrUndefinedFromStorage(dbName: DBO['dbName']): Promise<DBO | undefined> {
    const dbOptionsSerialized = await this._loadDatabaseOptionsSerializedOrUndefinedFromStorage(dbName);

    if (!dbOptionsSerialized) {
      return;
    }
    return this._parseDatabaseOptions((dbOptionsSerialized as unknown) as DBOS);
  }

  protected async _loadDatabaseOptionsParsedFromStorage(dbName: DBO['dbName']): Promise<DBO> {
    const dbOptions = await this._loadDatabaseOptionsParsedOrUndefinedFromStorage(dbName);
    if (!dbOptions) {
      throw new Error(`Thereis no options for the database ${dbName} in the persistent storage`);
    }
    return dbOptions;
  }

  protected async _loadDatabasesOptionsFromStorage(dbsNames: Array<DBO['dbName']>): Promise<Array<[DBO['dbName'], DBO]>> {
    return Promise.all(
      dbsNames.map(async (dbName: DBO['dbName']) => [dbName, await this._loadDatabaseOptionsParsedFromStorage(dbName)])
    ) as Promise<Array<[DBO['dbName'], DBO]>>;
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

  protected async _removeDatabaseNameFromStorage(dbName: DBO['dbName']): Promise<void> {}
  protected async _addDatabaseNameToStorage(dbName: DBO['dbName']): Promise<void> {}

  protected async _removeDatabaseOptionsFromStorage(dbName: DBO['dbName']): Promise<void> {}

  protected async _addDatabaseOptionsToStorage(dbName: DBO['dbName'], dbOptionsSerialized: string): Promise<void> {
    return await this._addValueForKeyInStorage(this._getStorageKeyForDatabase(dbName), dbOptionsSerialized);
  }
}
