import { __awaiter } from "tslib";
import { isNonNativeFunction } from "../../../../../../../utils";
import { createImmutableObjectClone } from '../../../../../../../utils/data-immutability-utils/data-immutability-key-value-structure-utils';
import assert from 'assert';
import { AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp, } from '../../types/swarm-messages-channels-list-v1-class-options-setup.types';
export class SwarmMessagesChannelsListVersionOneOptionsSetUp extends AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp {
    constructor(constructorArguments) {
        super();
        this._parseSwarmMessagesChannelDescription = (channelDescription) => {
            return this._getSerializer().parse(channelDescription);
        };
        this._validateConstructorArguments(constructorArguments);
        const { connectionOptions, validators, description, utilities } = constructorArguments;
        this._channelsListDescription = createImmutableObjectClone(description);
        this._connectionOptions = createImmutableObjectClone(connectionOptions);
        this._validators = createImmutableObjectClone(validators);
        this._utilities = createImmutableObjectClone(utilities);
        this._connectorType = connectionOptions.connectorType;
    }
    __resetOptionsSetup() {
        this._channelsListDescription = undefined;
        this._connectionOptions = undefined;
        this._utilities = undefined;
        this._validators = undefined;
        this._connectorType = undefined;
    }
    _validateConstructorArgumentsConnectionOptions(connectionOptions) {
        assert(connectionOptions, 'Conection options should be provided');
        assert(connectionOptions.connectorType, 'Connector type is not provided');
        assert(connectionOptions.dbOptions, 'A database options must be provided');
    }
    _validateConstructorArgumentsValidators(validators) {
        assert(validators, 'Validators should be provided in the arguments');
        assert(typeof validators === 'object', 'Validators argument should be an object');
        const { channelDescriptionSwarmMessageValidator, channelsListDescriptionValidator, swarmMessagesChannelDescriptionFormatValidator, swamChannelsListDatabaseOptionsValidator: validateSwamChannelsListDatabaseOptions, } = validators;
        assert(isNonNativeFunction(channelDescriptionSwarmMessageValidator), '"channelDescriptionSwarmMessageValidator" validator must be a non native functon');
        assert(isNonNativeFunction(channelsListDescriptionValidator), '"channelsListDescriptionValidator" validator must be a non native functon');
        assert(isNonNativeFunction(swarmMessagesChannelDescriptionFormatValidator), '"swarmMessagesChannelDescriptionFormatValidator" validator must be a non native functon');
        assert(isNonNativeFunction(validateSwamChannelsListDatabaseOptions), '"validateSwamChannelsListDatabaseOptions" validator must be a non native functon');
    }
    _validateConstructorArgumentsUtitlities(utilities) {
        assert(utilities, 'Utilities must be passed in the constructor arguments');
        assert(typeof utilities === 'object', 'Utilities option must be an object');
        const { serializer, databaseConnectionFabric, databaseNameGenerator, getDatabaseKeyForChannelDescription, getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription, getTypeForSwarmMessageWithChannelDescriptionByChannelDescription, } = utilities;
        assert(isNonNativeFunction(databaseConnectionFabric), '"databaseConnectionFabric" utility must be a non native functon');
        assert(isNonNativeFunction(databaseNameGenerator), '"databaseNameGenerator" utility must be a non native functon');
        assert(isNonNativeFunction(getDatabaseKeyForChannelDescription), '"getDatabaseKeyForChannelDescription" utility must be a non native functon');
        assert(isNonNativeFunction(getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription), '"getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription" utility must be a non native functon');
        assert(isNonNativeFunction(getTypeForSwarmMessageWithChannelDescriptionByChannelDescription), '"getTypeForSwarmMessageWithChannelDescriptionByChannelDescription" utility must be a non native functon');
        assert(serializer, 'A serializer must be provided in arguments');
    }
    _validateConstructorArguments(constructorArguments) {
        assert(constructorArguments, 'Constructor arguments must be provided');
        const { connectionOptions, validators, description, utilities } = constructorArguments;
        this._validateConstructorArgumentsValidators(validators);
        this._validateConstructorArgumentsConnectionOptions(connectionOptions);
        this._validateConstructorArgumentsUtitlities(utilities);
        validators.swamChannelsListDatabaseOptionsValidator(connectionOptions.dbOptions);
        validators.channelsListDescriptionValidator(description);
    }
    _getChannelsListDescription() {
        const channelsListDescription = this._channelsListDescription;
        if (!channelsListDescription) {
            throw new Error('There is no a description for the swarm channels list');
        }
        return channelsListDescription;
    }
    _getConnectionOptions() {
        const connectionOptions = this._connectionOptions;
        if (!connectionOptions) {
            throw new Error('There is no a swarm connection options defined for the swarm channels list');
        }
        return connectionOptions;
    }
    _getUtilities() {
        const utilities = this._utilities;
        if (!utilities) {
            throw new Error('There is no a helpers functions provided');
        }
        return utilities;
    }
    _getSerializer() {
        return this._getUtilities().serializer;
    }
    _getValidators() {
        const validators = this._validators;
        if (!validators) {
            throw new Error('There is no a helpers functions provided');
        }
        return validators;
    }
    _getJSONSchemaValidator() {
        return this._getValidators().jsonSchemaValidator;
    }
    _getSwarmMessagesChannelDescriptionValidator() {
        const { swarmMessagesChannelDescriptionFormatValidator: swarmMessagesChannelDescriptionValidator } = this._getValidators();
        if (!swarmMessagesChannelDescriptionValidator) {
            throw new Error('"swarmMessagesChannelDescriptionValidator" is not available');
        }
        return swarmMessagesChannelDescriptionValidator;
    }
    _validateChannelDescriptionFormat(channelDescriptionRaw) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._getSwarmMessagesChannelDescriptionValidator()(channelDescriptionRaw, this._getJSONSchemaValidator());
        });
    }
    _serializeChannelDescriptionRaw(channelDescriptionRaw) {
        const serializer = this._getSerializer();
        return serializer.stringify(channelDescriptionRaw);
    }
    _deserializeChannelDescriptionRaw(channelDescriptionSerialized) {
        const serializer = this._getSerializer();
        return serializer.parse(channelDescriptionSerialized);
    }
    _createChannelDescriptionMessageTyp() {
        const { getTypeForSwarmMessageWithChannelDescriptionByChannelDescription } = this._getUtilities();
        const channelsListDescription = this._getChannelsListDescription();
        return getTypeForSwarmMessageWithChannelDescriptionByChannelDescription(channelsListDescription);
    }
    _createChannelDescriptionMessageIssuer() {
        const { getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription } = this._getUtilities();
        const channelsListDescription = this._getChannelsListDescription();
        return getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription(channelsListDescription);
    }
    _getKeyInDatabaseForStoringChannelsListDescription(channelDescriptionRaw) {
        const { getDatabaseKeyForChannelDescription } = this._getUtilities();
        return getDatabaseKeyForChannelDescription(channelDescriptionRaw);
    }
}
export function getIConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp() {
    return SwarmMessagesChannelsListVersionOneOptionsSetUp;
}
//# sourceMappingURL=swarm-messages-channels-list-v1-class-options-setup.js.map