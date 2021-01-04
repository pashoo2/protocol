import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
} from 'classes/swarm-store-class/swarm-store-class.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound } from '../../../swarm-store-connector-db-options.types';
import { swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptions } from './swarm-store-conector-db-options-grand-access-context-binder-to-database-options';
import { ISwarmMessageInstanceDecrypted } from '../../../../../../swarm-message/swarm-message-constructor.types';

export function swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptionsFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
>(): ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, I, CTX, DBO> {
  return swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptions;
}
