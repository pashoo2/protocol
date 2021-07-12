import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import { ISwarmStore, ISwarmStoreOptionsConnectorFabric, ISwarmStoreOptionsWithConnectorFabric, ISwarmStoreProviderOptions, ISwarmStoreWithConnector, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType, TSwarmStoreValueTypes } from '../../swarm-store-class.types';
import { ISwarmStoreConnectorBasicWithEntriesCount, ISwarmStoreConnectorWithEntriesCount, ISwarmStoreWithEntriesCount } from './swarm-store-class-with-entries-count.types';
import { ConstructorType } from '../../../../types/helper.types';
export declare function extendClassSwarmStoreWithEntriesCount<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>, BC extends ConstructorType<ISwarmStore<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O> & ISwarmStoreWithConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO, ConnectorMain>>>(BaseClass: BC): ConstructorType<InstanceType<BC> & ISwarmStoreWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O>>;
//# sourceMappingURL=swarm-store-class-with-entries-count-mixin.d.ts.map