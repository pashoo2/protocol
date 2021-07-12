import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from "../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types";
import { ConstructorType } from "../../../../../../../../types/helper.types";
export function getSwarmStoreConectorDbOptionsGrandAccessContextClass(BaseContext, params) {
    class SwarmStoreConectorDbOptionsGrandAccessContextExtended extends BaseContext {
        get dbName() {
            return params.dbName;
        }
        get isPublicDb() {
            return params.isPublicDb;
        }
        get usersIdsWithWriteAccess() {
            return params.usersIdsWithWriteAccess;
        }
        get swarmMessageConstructor() {
            return params.swarmMessageConstructor;
        }
    }
    return SwarmStoreConectorDbOptionsGrandAccessContextExtended;
}
//# sourceMappingURL=swarm-message-store-conector-db-options-grand-access-context-class.js.map