import { ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceConstructor } from '../swarm-store-connector-db-options-helpers.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class.const';
import { SwarmStoreConnectorDbOptionsValidators } from './swarm-store-connector-db-options-validators';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from '../../../swarm-store-class.types';

export function swarmStoreConnectorDbOptionsValidatorsInstanceFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
>(ValidatorsConstructor?: ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceConstructor<P, ItemType, DbType, DBO, DBOS>) {
  const Constructor = ValidatorsConstructor ?? SwarmStoreConnectorDbOptionsValidators;
  return new Constructor();
}
