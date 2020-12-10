import { OptionsSerializerValidator } from '../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
} from '../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class.const';

export class SwarmStoreConnectorOrbitDBOptionsClass<
  ItemType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>,
  DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>,
  DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>
> extends OptionsSerializerValidator<DBO, TSwarmStoreDatabaseOptionsSerialized> {}
