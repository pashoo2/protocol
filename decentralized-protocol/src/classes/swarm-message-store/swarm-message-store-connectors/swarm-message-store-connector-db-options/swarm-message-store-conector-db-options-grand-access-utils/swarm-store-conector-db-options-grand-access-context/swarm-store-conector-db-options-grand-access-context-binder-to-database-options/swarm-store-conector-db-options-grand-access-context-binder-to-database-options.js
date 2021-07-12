import { ESwarmStoreConnector } from "../../../../../../swarm-store-class/swarm-store-class.const";
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, ISwarmStoreConnectorDatabaseAccessControlleGrantCallback, } from "../../../../../../swarm-store-class/swarm-store-class.types";
import { ISwarmMessageInstanceDecrypted } from "../../../../../../swarm-message/swarm-message-constructor.types";
export function swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptions(dbo, grandAccessCallbackBinder) {
    const { grantAccess } = dbo;
    if (typeof grantAccess === 'function') {
        return Object.assign(Object.assign({}, dbo), { grantAccess: grandAccessCallbackBinder(grantAccess) });
    }
    return dbo;
}
//# sourceMappingURL=swarm-store-conector-db-options-grand-access-context-binder-to-database-options.js.map