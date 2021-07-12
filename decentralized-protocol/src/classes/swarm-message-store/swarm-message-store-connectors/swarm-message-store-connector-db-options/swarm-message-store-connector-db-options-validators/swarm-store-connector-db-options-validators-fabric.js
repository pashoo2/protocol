import { ESwarmStoreConnector } from "../../../../swarm-store-class/swarm-store-class.const";
import { ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceConstructor } from "../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types";
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseOptionsSerialized, } from "../../../../swarm-store-class/swarm-store-class.types";
export function swarmStoreConnectorDbOptionsValidatorsWithGACValidationClassFabric(ValidatorsClass, grantAccessCallbackValidator) {
    class DBOValidators extends ValidatorsClass {
        isValidOptions(dbo) {
            const isValidOptions = super.isValidOptions.call(this, dbo);
            if (!isValidOptions) {
                return false;
            }
            return grantAccessCallbackValidator(dbo.grantAccess);
        }
    }
    return DBOValidators;
}
//# sourceMappingURL=swarm-store-connector-db-options-validators-fabric.js.map