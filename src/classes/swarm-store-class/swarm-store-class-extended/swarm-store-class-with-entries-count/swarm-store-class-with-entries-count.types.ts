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
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
> extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO> {
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
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
> extends ISwarmStoreConnectorBase<P, ItemType, DbType, DBO, ConnectorBasic, PO> {
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
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
> extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO> {
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
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>
> extends ISwarmStore<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, O> {
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
