import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorDatabaseAccessControlleGrantCallback,
} from 'classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessageInstanceDecrypted } from 'classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound } from '../../../swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder } from '../../../swarm-store-connector-db-options.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from '../../../../../../swarm-store-class/swarm-store-class.types';

export function swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptions<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
>(
  dbo: DBO & {
    grantAccess?: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MD>;
  },
  grandAccessCallbackBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>
): DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MD>>
  ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MD, CTX>
  : DBO {
  const { grantAccess } = dbo;
  if (typeof grantAccess === 'function') {
    return {
      ...dbo,
      grantAccess: grandAccessCallbackBinder(grantAccess),
    } as DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MD>>
      ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MD, CTX>
      : DBO;
  }
  return dbo as DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MD>>
    ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MD, CTX>
    : DBO;
}
