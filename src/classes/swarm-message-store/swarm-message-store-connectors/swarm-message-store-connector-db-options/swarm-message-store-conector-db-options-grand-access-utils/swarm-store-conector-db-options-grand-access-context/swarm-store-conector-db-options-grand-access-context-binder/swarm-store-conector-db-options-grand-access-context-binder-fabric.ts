import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
} from 'classes/swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from 'classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder } from '../../../swarm-store-connector-db-options.types';
import { swarmStoreConnectorDbOptionsGrandAccessContextBinder } from './swarm-store-conector-db-options-grand-access-context-binder';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export function swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext
>(
  ctx: CTX,
  contextBinder?: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>
): ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX> {
  const contextBinderToUse = contextBinder ?? swarmStoreConnectorDbOptionsGrandAccessContextBinder;
  return (grandAccessCallback: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI>) =>
    contextBinderToUse(grandAccessCallback, ctx);
}
