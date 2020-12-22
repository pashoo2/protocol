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
  CO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  O extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
  BC extends ConstructorType<
    ISwarmStore<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, O> &
      ISwarmStoreWithConnector<P, ItemType, DbType, DBO, ConnectorBasic, CO, ConnectorMain>
  >
>(BaseClass: BC, SwarmStoreOptionsClass?: ISwarmStoreOptionsClassConstructor<P, ItemType, DbType, DBO, ConnectorBasic, CO>): BC {
  const SwarmStoreOptionsClassUsed =
    SwarmStoreOptionsClass ?? swarmStoreOptionsClassFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO>();
  return class SwarmStoreWithOptionsConstructor extends BaseClass {
    public connect(swarmStoreOptions: O) {
      const optionsClass = new SwarmStoreOptionsClassUsed({ swarmStoreOptions });
      const swarmStoreOptionsValidated = optionsClass.options as O;
      return super.connect(swarmStoreOptionsValidated);
    }
  };
}
