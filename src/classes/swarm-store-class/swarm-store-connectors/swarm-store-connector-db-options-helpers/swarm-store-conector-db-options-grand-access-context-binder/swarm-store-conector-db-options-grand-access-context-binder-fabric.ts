import { ESwarmStoreConnector } from '../../../swarm-store-class.const';
import { TSwarmStoreValueTypes } from '../../../swarm-store-class.types';
import { TSwarmMessageInstance } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../swarm-store-connector-db-options-helpers.types';
import { ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder } from '../swarm-store-connector-db-options-helpers.types';
import { swarmStoreConnectorDbOptionsGrandAccessContextBinder } from './swarm-store-conector-db-options-grand-access-context-binder';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from '../../../swarm-store-class.types';

export function swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
>(
  ctx: CTX,
  contextBinder?: ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>
): ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX> {
  const contextBinderToUse = contextBinder ?? swarmStoreConnectorDbOptionsGrandAccessContextBinder;
  return (grandAccessCallback: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI>) =>
    contextBinderToUse(grandAccessCallback, ctx);
}
