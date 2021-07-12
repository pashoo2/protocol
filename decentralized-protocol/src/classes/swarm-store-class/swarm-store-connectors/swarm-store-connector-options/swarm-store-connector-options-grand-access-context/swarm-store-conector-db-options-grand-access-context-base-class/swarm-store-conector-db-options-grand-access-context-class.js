import { __awaiter } from "tslib";
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from "../../../swarm-store-connetors.types";
export function getSwarmStoreConectorDbOptionsGrandAccessContextClass(params) {
    class SwarmStoreConectorDbOptionsGrandAccessContext {
        get currentUserId() {
            return params.currentUserId;
        }
        isUserValid(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(yield params.isUserValid(userId))) {
                    throw new Error('The user is not valid');
                }
                return true;
            });
        }
        jsonSchemaValidator(jsonSchema, valueToValidate) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield params.jsonSchemaValidator(jsonSchema, valueToValidate);
            });
        }
    }
    return SwarmStoreConectorDbOptionsGrandAccessContext;
}
//# sourceMappingURL=swarm-store-conector-db-options-grand-access-context-class.js.map