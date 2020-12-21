import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
} from '../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound } from '../swarm-message-store-connector-db-options-helpers.types';
import { swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptions } from './swarm-store-conector-db-options-grand-access-context-binder-to-database-options';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export function swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptionsFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
>(): ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, MSI, CTX, DBO> {
  return swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptions;
}
