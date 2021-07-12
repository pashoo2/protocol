import { getSwarmMessagesChannelsListVersionOneInstance } from '../../swarm-messages-channels-list-v1-instance.fabric';
import { getSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandlerClass } from '../../subclasses/swarm-messages-channels-list-v1-db-connection-initializer-and-handler/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.fabric';
import { getSwarmMessagesChannelsListVersionOneConstructorOptionsDefault } from '../swarm-messages-channels-list-v1-constructor-arguments-fabrics/swarm-messages-channels-list-v1-constructor-arguments-fabric';
import { getIConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp as getConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp } from '../../subclasses/swarm-messages-channels-list-v1-class-options-setup/swarm-messages-channels-list-v1-class-options-setup';
import { getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator, getArgumentsForSwarmMessageWithChannelDescriptionValidator, createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator, } from '../../subclasses/swarm-messages-channels-list-v1-db-connection-initializer-and-handler/utils/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.utils';
export function getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters(databaseConnectionFabric, optionsForConstructorArgumentsFabric) {
    const createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorUtil = createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator;
    const additionalUtils = {
        getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator: getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator,
        getArgumentsForSwarmMessageWithChannelDescriptionValidator: getArgumentsForSwarmMessageWithChannelDescriptionValidator,
        createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator: createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorUtil,
    };
    const SwarmMessagesChannelsListVersionOneOptionsSetUp = getConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp();
    const SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler = getSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandlerClass(SwarmMessagesChannelsListVersionOneOptionsSetUp, additionalUtils);
    const options = Object.assign(Object.assign({}, optionsForConstructorArgumentsFabric), { databaseConnectionFabric });
    const constructorArguments = getSwarmMessagesChannelsListVersionOneConstructorOptionsDefault(options);
    const swarmMessagesChannelsListV1Instance = getSwarmMessagesChannelsListVersionOneInstance(constructorArguments, SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler);
    return swarmMessagesChannelsListV1Instance;
}
//# sourceMappingURL=swarm-messages-channels-list-v1-instance-fabric-default.js.map