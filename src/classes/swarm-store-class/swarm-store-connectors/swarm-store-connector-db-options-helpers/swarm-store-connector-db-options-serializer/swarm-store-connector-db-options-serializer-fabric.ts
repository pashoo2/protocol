import { ESwarmStoreConnector } from '../../../swarm-store-class.const';
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType } from '../../../swarm-store-class.types';
import { TSwarmMessageInstance } from '../../../../swarm-message/swarm-message-constructor.types';
import { SwarmStoreConnectorDBOptionsSerializer } from './swarm-store-connector-db-options-serializer';
import { ISwarmStoreConnectorUtilsOptionsSerializer } from '../swarm-store-connector-db-options-helpers.types';
import {
  ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams,
  ISwarmStoreConnectorUtilsOptionsSerializerConstructor,
} from '../swarm-store-connector-db-options-helpers.types';

export function swarmStoreConnectorDbOptionsSerializerInstanceFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
>(
  params: ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams<P, ItemType, MSI, CTX>,
  Constructor?: ISwarmStoreConnectorUtilsOptionsSerializerConstructor<P, ItemType, DbType, MSI, CTX>
): ISwarmStoreConnectorUtilsOptionsSerializer<P, ItemType, DbType, MSI, CTX> {
  const ConstructorToUse = Constructor || SwarmStoreConnectorDBOptionsSerializer;
  return new ConstructorToUse(params);
}
