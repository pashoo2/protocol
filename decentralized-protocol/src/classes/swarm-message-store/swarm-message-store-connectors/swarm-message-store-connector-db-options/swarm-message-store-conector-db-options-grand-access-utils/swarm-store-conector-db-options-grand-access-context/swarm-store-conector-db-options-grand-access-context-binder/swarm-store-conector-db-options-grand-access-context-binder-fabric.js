import { ESwarmStoreConnector } from "../../../../../../swarm-store-class/swarm-store-class.const";
import { TSwarmStoreValueTypes, TSwarmStoreConnectorAccessConrotllerGrantAccessCallback, } from "../../../../../../swarm-store-class/swarm-store-class.types";
import { swarmStoreConnectorDbOptionsGrandAccessContextBinder } from './swarm-store-conector-db-options-grand-access-context-binder';
export function swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric(ctx, contextBinder) {
    const contextBinderToUse = contextBinder !== null && contextBinder !== void 0 ? contextBinder : swarmStoreConnectorDbOptionsGrandAccessContextBinder;
    return (grandAccessCallback) => contextBinderToUse(grandAccessCallback, ctx);
}
//# sourceMappingURL=swarm-store-conector-db-options-grand-access-context-binder-fabric.js.map