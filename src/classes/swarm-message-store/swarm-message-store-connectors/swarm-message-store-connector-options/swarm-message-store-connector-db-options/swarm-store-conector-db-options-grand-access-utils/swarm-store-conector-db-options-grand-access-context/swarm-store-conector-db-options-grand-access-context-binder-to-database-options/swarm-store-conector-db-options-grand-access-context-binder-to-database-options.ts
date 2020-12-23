import { ESwarmStoreConnector } from '../../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorDatabaseAccessControlleGrantCallback,
} from '../../../../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound } from '../../../swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder } from '../../../swarm-store-connector-db-options.types';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export function isDbOptionsWithGrandAccess<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
>(dbo: DBO): dbo is DBO & Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MSI>> {
  return typeof dbo.grantAccess === 'function';
}

export function swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptions<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
>(
  dbo: DBO,
  grandAccessCallbackBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>
): DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MSI>>
  ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>
  : DBO {
  if (isDbOptionsWithGrandAccess<P, ItemType, DbType, MSI, DBO>(dbo)) {
    return {
      ...dbo,
      grantAccess: grandAccessCallbackBinder(dbo.grantAccess),
    } as DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MSI>>
      ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>
      : DBO;
  }
  return dbo as DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MSI>>
    ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>
    : DBO;
}
