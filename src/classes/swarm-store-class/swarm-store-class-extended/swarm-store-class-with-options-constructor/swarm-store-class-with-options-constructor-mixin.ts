import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import {
  ISwarmStore,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreOptionsWithConnectorFabric,
  ISwarmStoreProviderOptions,
  ISwarmStoreWithConnector,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
} from '../../swarm-store-class.types';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmStoreOptionsClassConstructor } from '../../swarm-store-class.types';
import { swarmStoreOptionsClassFabric } from '../../swarm-store-class-helpers/swarm-store-options-helpers/swarm-store-options-class-fabric/swarm-store-options-class-fabric';

export function extendClassSwarmStoreWithOptionsConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>
>(
  BaseClass: ConstructorType<
    ISwarmStore<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O> &
      ISwarmStoreWithConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO, ConnectorMain>
  >,
  SwarmStoreOptionsClass?: ISwarmStoreOptionsClassConstructor<P, ItemType, DbType, DBO, ConnectorBasic, PO>
): ConstructorType<
  InstanceType<typeof BaseClass> & ISwarmStore<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O>
> {
  type TBaseClassConnectMethodType = InstanceType<typeof BaseClass>['connect'];
  const SwarmStoreOptionsClassUsed = SwarmStoreOptionsClass ?? swarmStoreOptionsClassFabric();
  return (class SwarmStoreWithOptionsConstructor extends BaseClass {
    public async connect(...args: Parameters<TBaseClassConnectMethodType>): ReturnType<TBaseClassConnectMethodType> {
      const optionsClass = new SwarmStoreOptionsClassUsed({
        swarmStoreOptions: args[0],
      });
      const newConnectOptions = ([optionsClass.options, args.slice(1)] as unknown) as Parameters<TBaseClassConnectMethodType>;
      return ((await super.connect(...newConnectOptions)) as unknown) as ReturnType<TBaseClassConnectMethodType>;
    }
  } as unknown) as ConstructorType<
    InstanceType<typeof BaseClass> & ISwarmStore<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O>
  >;
}
