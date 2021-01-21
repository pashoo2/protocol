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
    T extends TSwarmStoreValueTypes<P>,
    DbType extends TSwarmStoreDatabaseType<P>,
    DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
    ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
    CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
    SSO extends ISwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO>
  >
  extends OptionsSerializerValidator<SSO, TSwarmStoreOptionsSerialized>
  implements ISwarmStoreOptionsClass<P, T, DbType, DBO, ConnectorBasic, CO, SSO> {}
