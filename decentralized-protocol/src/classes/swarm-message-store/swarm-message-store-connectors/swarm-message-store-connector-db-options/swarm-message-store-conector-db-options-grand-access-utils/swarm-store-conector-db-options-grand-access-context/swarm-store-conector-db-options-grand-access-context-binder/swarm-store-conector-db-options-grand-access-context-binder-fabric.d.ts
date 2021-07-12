import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreValueTypes } from 'classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder } from '../../../swarm-store-connector-db-options.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageInstanceDecrypted } from '../../../../../../swarm-message/swarm-message-constructor.types';
export declare function swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext>(ctx: CTX, contextBinder?: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>): ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>;
//# sourceMappingURL=swarm-store-conector-db-options-grand-access-context-binder-fabric.d.ts.map