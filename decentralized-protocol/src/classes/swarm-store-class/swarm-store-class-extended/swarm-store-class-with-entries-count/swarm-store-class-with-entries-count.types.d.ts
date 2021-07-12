import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import { ISwarmStore, ISwarmStoreConnector, ISwarmStoreConnectorBase, ISwarmStoreConnectorBasic, ISwarmStoreOptionsConnectorFabric, ISwarmStoreOptionsWithConnectorFabric, ISwarmStoreProviderOptions, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType, TSwarmStoreValueTypes } from '../../swarm-store-class.types';
export interface ISwarmStoreConnectorBasicWithEntriesCount<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>> extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO> {
    countEntriesLoaded: number;
    countEntriesAllExists: number;
}
export interface ISwarmStoreConnectorBaseWithEntriesCount<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>> extends ISwarmStoreConnectorBase<P, ItemType, DbType, DBO, ConnectorBasic, PO> {
    getCountEntriesLoaded(dbName: DBO['dbName']): Promise<number | Error>;
    getCountEntriesAllExists(dbName: DBO['dbName']): Promise<number | Error>;
}
export interface ISwarmStoreConnectorWithEntriesCount<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>> extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO> {
    getCountEntriesLoaded(dbName: DBO['dbName']): Promise<number | Error>;
    getCountEntriesAllExists(dbName: DBO['dbName']): Promise<number | Error>;
}
export interface ISwarmStoreWithEntriesCount<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType, DBO>, CO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>, PO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, CO>, ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, CO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>, O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>> extends ISwarmStore<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, O> {
    getCountEntriesLoaded(dbName: DBO['dbName']): Promise<number | Error>;
    getCountEntriesAllExists(dbName: DBO['dbName']): Promise<number | Error>;
}
//# sourceMappingURL=swarm-store-class-with-entries-count.types.d.ts.map