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
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export function isDbOptionsWithGrandAccess<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  I extends ISwarmMessageInstanceDecrypted,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
>(dbo: DBO): dbo is DBO & Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, I>> {
  return (
    typeof (dbo as DBO & Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, I>>).grantAccess ===
    'function'
  );
}

export function swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptions<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
>(
  dbo: DBO,
  grandAccessCallbackBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, I, CTX>
): DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, I>>
  ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, I, CTX>
  : DBO {
  if (isDbOptionsWithGrandAccess<P, ItemType, DbType, I, DBO>(dbo)) {
    const { grantAccess } = dbo;
    return {
      ...dbo,
      grantAccess: grandAccessCallbackBinder(grantAccess),
    } as DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, I>>
      ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, I, CTX>
      : DBO;
  }
  return dbo as DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, I>>
    ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, I, CTX>
    : DBO;
}
