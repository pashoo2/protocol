import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
} from 'classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder } from '../../../swarm-store-connector-db-options.types';
import { swarmStoreConnectorDbOptionsGrandAccessContextBinder } from './swarm-store-conector-db-options-grand-access-context-binder';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageInstanceDecrypted } from '../../../../../../swarm-message/swarm-message-constructor.types';

export function swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext
>(
  ctx: CTX,
  contextBinder?: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, I, CTX>
): ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, I, CTX> {
  const contextBinderToUse = contextBinder ?? swarmStoreConnectorDbOptionsGrandAccessContextBinder;
  return (grandAccessCallback: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, I>) =>
    contextBinderToUse(grandAccessCallback, ctx);
}
