import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
} from 'classes/swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from 'classes/swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound } from '../../../swarm-store-connector-db-options.types';
import { swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptions } from './swarm-store-conector-db-options-grand-access-context-binder-to-database-options';

export function swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptionsFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
>(): ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, MSI, CTX, DBO> {
  return swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptions;
}
