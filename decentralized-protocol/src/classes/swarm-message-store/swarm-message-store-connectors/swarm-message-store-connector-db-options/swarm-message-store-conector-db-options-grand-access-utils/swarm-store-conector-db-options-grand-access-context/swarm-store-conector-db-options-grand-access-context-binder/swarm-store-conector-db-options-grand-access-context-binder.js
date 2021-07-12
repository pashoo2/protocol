import { ESwarmStoreConnector } from "../../../../../../swarm-store-class/swarm-store-class.const";
import { TSwarmStoreValueTypes } from "../../../../../../swarm-store-class/swarm-store-class.types";
import { ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound } from "../../../../../types/swarm-message-store.types";
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from "../../../../../../swarm-store-class/swarm-store-class.types";
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from "../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types";
export function swarmStoreConnectorDbOptionsGrandAccessContextBinder(grandAccessCallback, ctx) {
    if (!ctx) {
        throw new Error('Context should be provided');
    }
    const grandAccessCallbackBound = grandAccessCallback.bind(ctx);
    grandAccessCallbackBound.toString = () => {
        return grandAccessCallback.toString();
    };
    return grandAccessCallbackBound;
}
//# sourceMappingURL=swarm-store-conector-db-options-grand-access-context-binder.js.map