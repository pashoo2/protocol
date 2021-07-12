import { __awaiter } from "tslib";
import { EOrbitDbStoreOperation } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
export function getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator({ payload, userId, key, operation, time, }) {
    if (!key) {
        throw new Error('A key must be provided for swarm messages channel description');
    }
    if (!operation) {
        throw new Error('A database operation must be provided for any changing of swarm messages channel description');
    }
    return {
        keyInDb: key,
        messageOrHash: payload,
        operationInDb: operation,
        senderUserId: userId,
        timeEntryAdded: time,
    };
}
export function getArgumentsForSwarmMessageWithChannelDescriptionValidator(constantArguments, variableArguments, channelExistingDescription) {
    return Object.assign(Object.assign(Object.assign({}, constantArguments), variableArguments), { channelExistingDescription });
}
export function createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator({ constantArguments, swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache, channelDescriptionSwarmMessageValidator, getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator, getArgumentsForSwarmMessageWithChannelDescriptionValidator, }) {
    function channelsListGrantAccessCallbackFunction(payload, userId, databaseName, key, operation, time) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'development') {
                if (window.__skipValidationChannelDescription) {
                    return true;
                }
            }
            if (!key) {
                throw new Error('Key should be provided for a message with a swarm messages channel description');
            }
            const isDELETE = operation === EOrbitDbStoreOperation.DELETE;
            const variableArguments = getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator({
                payload,
                userId,
                key,
                operation,
                time,
            });
            const previousChannelDescription = swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache.getChannelDescriptionUpdatePreviousByClockTimeOrUndefined(key, time);
            if (isDELETE) {
                if (!previousChannelDescription) {
                    throw new Error('This is an unknown channel and can not be deleted');
                }
            }
            const argumentsForChannelDescriptionSwarmMessageValidator = getArgumentsForSwarmMessageWithChannelDescriptionValidator(constantArguments, variableArguments, previousChannelDescription);
            yield channelDescriptionSwarmMessageValidator.call(this, argumentsForChannelDescriptionSwarmMessageValidator);
            if (!isDELETE) {
                if (typeof payload === 'string') {
                    throw new Error('Paylod of a database non-delete operation must be a swarm message decrypted');
                }
                yield swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache.addSwarmMessageWithChannelDescriptionUpdate(key, time, payload);
            }
            return true;
        });
    }
    channelsListGrantAccessCallbackFunction.toString = constantArguments.grandAccessCallbackFromDbOptions.toString.bind(constantArguments.grandAccessCallbackFromDbOptions);
    return channelsListGrantAccessCallbackFunction;
}
//# sourceMappingURL=swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.utils.js.map