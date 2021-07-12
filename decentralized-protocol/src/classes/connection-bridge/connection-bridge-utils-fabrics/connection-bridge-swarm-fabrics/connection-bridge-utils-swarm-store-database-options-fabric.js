import { getSwarmMessageStoreDBOClass } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-class/swarm-message-store-connector-db-options-class-fabric';
import { swarmStoreConnectorDbOptionsValidatorsWithGACValidationClassFabric, SwarmStoreConnectorDbOptionsValidators, } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-validators';
import { validateGrantAccessCallbackWithContextSerializable } from '../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-grant-access-callback';
import { SwarmMessageStoreDBOptionsClass } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-class/swarm-message-store-connector-db-options-class';
export function getSwarmMessageStoreConnectorDBOClass(ContextBaseClass, swarmMessageStoreDBOGrandAccessCallbackContextFabric, DBOBaseClassSerializerValidator, additionalParams) {
    const grandAccessCallbackContextFabric = (dbOptions, swarmMessageConstructor) => {
        const params = {
            dbName: dbOptions.dbName,
            isPublicDb: Boolean(dbOptions.isPublic),
            usersIdsWithWriteAccess: dbOptions.write || [],
            swarmMessageConstructor,
        };
        const SwarmMessagesStoreDBOGrandAccessCallbackContextClass = swarmMessageStoreDBOGrandAccessCallbackContextFabric(ContextBaseClass, params);
        return new SwarmMessagesStoreDBOGrandAccessCallbackContextClass();
    };
    const SwarmMessageStoreDBOClass = getSwarmMessageStoreDBOClass(Object.assign(Object.assign({}, additionalParams), { grandAccessCallbackContextFabric }), DBOBaseClassSerializerValidator);
    return SwarmMessageStoreDBOClass;
}
export function getSwarmMessageStoreConnectorDBOClassFabric(serializer) {
    const DboValidatorClass = swarmStoreConnectorDbOptionsValidatorsWithGACValidationClassFabric(SwarmStoreConnectorDbOptionsValidators, validateGrantAccessCallbackWithContextSerializable);
    const dboFabric = (ContextBaseClass, swarmMessageStoreDBOGrandAccessCallbackContextFabric, additionalParams) => {
        const fabricDBOValidator = () => new DboValidatorClass();
        const additionalParamsResulted = Object.assign(Object.assign({}, additionalParams), { optionsSerializer: serializer, validatorsFabric: fabricDBOValidator });
        class SwarmMessageStoreDBOptionsBaseClass extends SwarmMessageStoreDBOptionsClass {
        }
        const SwarmMessageStoreConnectorDBOClassCreated = getSwarmMessageStoreConnectorDBOClass(ContextBaseClass, swarmMessageStoreDBOGrandAccessCallbackContextFabric, SwarmMessageStoreDBOptionsBaseClass, additionalParamsResulted);
        return SwarmMessageStoreConnectorDBOClassCreated;
    };
    return dboFabric;
}
//# sourceMappingURL=connection-bridge-utils-swarm-store-database-options-fabric.js.map