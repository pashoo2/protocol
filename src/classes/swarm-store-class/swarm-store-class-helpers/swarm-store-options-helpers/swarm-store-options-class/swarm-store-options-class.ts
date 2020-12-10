import { ESwarmStoreConnector } from '../../../swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreConnectorBasic,
  TSwarmStoreOptionsSerialized,
  ISwarmStoreOptions,
  ISwarmStoreOptionsClass,
} from '../../../swarm-store-class.types';
import { OptionsSerializerValidator } from '../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class';

export class SwarmStoreOptions<
    P extends ESwarmStoreConnector,
    ItemType extends TSwarmStoreValueTypes<P>,
    DbType extends TSwarmStoreDatabaseType<P>,
    DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
    ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
    PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
  >
  extends OptionsSerializerValidator<
    ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
    TSwarmStoreOptionsSerialized
  >
  implements ISwarmStoreOptionsClass<P, ItemType, DbType, DBO, ConnectorBasic, PO> {}
