import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import {
  ISwarmStore,
  ISwarmStoreConnector,
  ISwarmStoreConnectorBase,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreOptionsWithConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
} from '../../swarm-store-class.types';

export interface ISwarmStoreConnectorBasicWithEntriesCount<
  TSwarmStoreConnectorType extends ESwarmStoreConnector,
  TStoreValue extends TSwarmStoreValueTypes<TSwarmStoreConnectorType>,
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorType>
> extends ISwarmStoreConnectorBasic<TSwarmStoreConnectorType, TStoreValue, DbType> {
  /**
   * Items loaded from a persistance store
   * to the memory
   *
   * @type {number}
   * @memberof ISwarmStoreConnectorBasicWithEntriesCount
   */
  countEntriesLoaded: number;

  /**
   * All enrties count exists in the persistent storage
   *
   * @type {number}
   * @memberof ISwarmStoreConnectorBasicWithEntriesCount
   */
  countEntriesAllExists: number;
}

export interface ISwarmStoreConnectorBaseWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>
> extends ISwarmStoreConnectorBase<P, ItemType, DbType, ConnectorBasic, PO, DBO> {
  /**
   * Returns items loaded from a persistance store
   * to the memory for the database.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesLoaded(dbName: DBO['dbName']): Promise<number | Error>;

  /**
   * Returns enrties count exists in the persistent storage
   * for the datbase passed in the argument.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesAllExists(dbName: DBO['dbName']): Promise<number | Error>;
}

export interface ISwarmStoreConnectorWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>
> extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO> {
  /**
   * Returns items loaded from a persistance store
   * to the memory for the database.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesLoaded(dbName: DBO['dbName']): Promise<number | Error>;

  /**
   * Returns enrties count exists in the persistent storage
   * for the datbase passed in the argument.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesAllExists(dbName: DBO['dbName']): Promise<number | Error>;
}

export interface ISwarmStoreWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO>
> extends ISwarmStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, CFO, ConnectorMain, O> {
  /**
   * Returns items loaded from a persistance store
   * to the memory for the database.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesLoaded(dbName: DBO['dbName']): Promise<number | Error>;

  /**
   * Returns enrties count exists in the persistent storage
   * for the datbase passed in the argument.
   *
   * @param {TSwarmStoreDatabaseOptions<P, ItemType>['dbName']} dbName
   * @returns {(Promise<number | Error>)}
   * @memberof ISwarmStoreConnectorBaseWithEntriesCount
   */
  getCountEntriesAllExists(dbName: DBO['dbName']): Promise<number | Error>;
}
