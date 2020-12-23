import { ESwarmStoreConnector } from '../../../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreValueTypes } from '../../../../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from '../../../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export function swarmStoreConnectorDbOptionsGrandAccessContextBinder<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
>(
  grandAccessCallback: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI>,
  ctx: CTX
): ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, ItemType, MSI, CTX> {
  if (!ctx) {
    throw new Error('Context should be provided');
  }
  return grandAccessCallback.bind(ctx);
}
