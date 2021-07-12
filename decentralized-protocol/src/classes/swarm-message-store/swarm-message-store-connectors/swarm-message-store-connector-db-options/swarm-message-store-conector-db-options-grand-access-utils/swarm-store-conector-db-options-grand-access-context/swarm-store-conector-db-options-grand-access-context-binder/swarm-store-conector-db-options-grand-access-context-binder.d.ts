import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreValueTypes } from 'classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound } from 'classes/swarm-message-store/types/swarm-message-store.types';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from 'classes/swarm-store-class/swarm-store-class.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageInstanceDecrypted } from '../../../../../../swarm-message/swarm-message-constructor.types';
export declare function swarmStoreConnectorDbOptionsGrandAccessContextBinder<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext>(grandAccessCallback: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MD>, ctx: CTX): ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, ItemType, MD, CTX>;
//# sourceMappingURL=swarm-store-conector-db-options-grand-access-context-binder.d.ts.map