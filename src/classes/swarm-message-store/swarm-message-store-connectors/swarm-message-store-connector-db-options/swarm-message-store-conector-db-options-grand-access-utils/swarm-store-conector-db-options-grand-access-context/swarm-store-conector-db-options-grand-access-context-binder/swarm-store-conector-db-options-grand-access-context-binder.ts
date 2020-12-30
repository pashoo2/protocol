import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreValueTypes } from 'classes/swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from 'classes/swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from 'classes/swarm-store-class/swarm-store-class.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export function swarmStoreConnectorDbOptionsGrandAccessContextBinder<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext
>(
  grandAccessCallback: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI>,
  ctx: CTX
): ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, ItemType, MSI, CTX> {
  if (!ctx) {
    throw new Error('Context should be provided');
  }

  const grandAccessCallbackBound = grandAccessCallback.bind(ctx);

  // to make the function's body serializable
  // becuase a bound functions can't be serialized
  grandAccessCallbackBound.toString = (): string => {
    return grandAccessCallback.toString();
  };
  return grandAccessCallbackBound;
}
