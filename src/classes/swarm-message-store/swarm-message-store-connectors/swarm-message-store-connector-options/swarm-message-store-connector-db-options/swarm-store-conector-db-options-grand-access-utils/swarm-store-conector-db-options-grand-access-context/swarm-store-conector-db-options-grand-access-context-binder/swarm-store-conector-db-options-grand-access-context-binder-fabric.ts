import { ESwarmStoreConnector } from '../../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
} from '../../../../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder } from '../../../swarm-store-connector-db-options.types';
import { swarmStoreConnectorDbOptionsGrandAccessContextBinder } from './swarm-store-conector-db-options-grand-access-context-binder';

export function swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
>(
  ctx: CTX,
  contextBinder?: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>
): ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX> {
  const contextBinderToUse = contextBinder ?? swarmStoreConnectorDbOptionsGrandAccessContextBinder;
  return (grandAccessCallback: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI>) =>
    contextBinderToUse(grandAccessCallback, ctx);
}
