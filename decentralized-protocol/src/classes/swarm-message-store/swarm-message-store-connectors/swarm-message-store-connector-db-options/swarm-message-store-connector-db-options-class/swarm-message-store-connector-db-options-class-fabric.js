import { ESwarmStoreConnector } from "../../../../swarm-store-class/swarm-store-class.const";
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseOptionsSerialized, } from "../../../../swarm-store-class/swarm-store-class.types";
import { IOptionsSerializerValidatorSerializer } from "../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types";
import { swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric } from '../swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-binder/swarm-store-conector-db-options-grand-access-context-binder-fabric';
import { swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptionsFabric } from '../swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-binder-to-database-options/swarm-store-conector-db-options-grand-access-context-binder-to-database-options-fabric';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext, ISwarmStoreConnectorUtilsDatabaseOptionsValidators, } from "../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types";
export function getSwarmMessageStoreDBOClass(params, DBOBaseClassSerializerValidator) {
    const getDbOptionsSerializer = () => { var _a; return (_a = params.optionsSerializer) !== null && _a !== void 0 ? _a : JSON; };
    const createDBOValidators = () => {
        const validatorsFabric = params.validatorsFabric;
        return validatorsFabric();
    };
    const createGrandAccessCallbackContextBinder = (dbOptions, swarmMessageConstructor) => {
        const context = params.grandAccessCallbackContextFabric(dbOptions, swarmMessageConstructor);
        const grandAccessContextBinderFabric = params.grandAccessBinderFabric || swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric;
        return grandAccessContextBinderFabric(context);
    };
    const createGrandAccessCallbackBinderForDBOptions = () => {
        var _a;
        const grandAccessBinderForDBOptionsFabric = (_a = params.grandAccessBinderForDBOptionsFabric) !== null && _a !== void 0 ? _a : swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptionsFabric;
        return grandAccessBinderForDBOptionsFabric();
    };
    const extendDatabaseOptions = (options) => {
        const { meta: { swarmMessageConstructor }, options: dbOptions, } = options;
        if (!swarmMessageConstructor) {
            throw new Error('There is no swarm message constructor instance passed in the meta data');
        }
        const dbOptionsSerializer = getDbOptionsSerializer();
        const dbOptionsParsed = typeof dbOptions === 'string' ? dbOptionsSerializer.parse(dbOptions) : dbOptions;
        return {
            options: dbOptionsParsed,
            serializer: dbOptionsSerializer,
            validators: createDBOValidators(),
            grandAccessBinder: createGrandAccessCallbackContextBinder(dbOptionsParsed, swarmMessageConstructor),
            grandAccessBinderForDBOptions: createGrandAccessCallbackBinderForDBOptions(),
        };
    };
    class SwarmMessageStoreDBOptionsClassCreated extends DBOBaseClassSerializerValidator {
        constructor(options) {
            super(extendDatabaseOptions(options));
        }
    }
    return SwarmMessageStoreDBOptionsClassCreated;
}
//# sourceMappingURL=swarm-message-store-connector-db-options-class-fabric.js.map