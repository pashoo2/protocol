import { __awaiter } from "tslib";
import assert from 'assert';
import { EOrbitDbStoreOperation } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { isValidSwarmMessageDecryptedFormat } from '../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import { validateUsersList } from '../../../swarm-messages-channel-utils/swarm-messages-channel-validation-utils/swarm-messages-channel-validation-description-utils/swarm-messages-channel-validation-utils-common/swarm-messages-channel-validation-utils-common';
export function validatorOfSwrmMessageWithChannelDescription(argument) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this) {
            throw new Error('A context value should be provided in for the grant access callback function');
        }
        const { isDatabaseReady, messageOrHash, senderUserId, keyInDb, operationInDb, timeEntryAdded, channelExistingDescription, channelsListDescription, grandAccessCallbackFromDbOptions, getDatabaseKeyForChannelDescription, getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription, getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription, channelDescriptionFormatValidator, parseChannelDescription, } = argument;
        assert(keyInDb, 'Database key should be defined for a swarm message with channel description');
        if (channelExistingDescription) {
            assert(getDatabaseKeyForChannelDescription(channelExistingDescription) === keyInDb, 'Key in the database is not equals to the existing channel desciption');
            assert(channelExistingDescription.admins.includes(senderUserId), 'The user who sends the channel descriptions should be in the list of the channel administrators');
        }
        assert(yield grandAccessCallbackFromDbOptions.call(this, messageOrHash, senderUserId, keyInDb, operationInDb, timeEntryAdded), 'Failed to get access by the main grand access function');
        if (operationInDb !== EOrbitDbStoreOperation.DELETE) {
            if (!isValidSwarmMessageDecryptedFormat(messageOrHash)) {
                throw new Error('Paylod should be swarm message decrypted');
            }
            assert(!messageOrHash.isPrivate, 'The message should not be a private');
            const { bdy: messageBody } = messageOrHash;
            assert(!messageBody.receiverId, 'Message receiver id should be empty');
            assert(messageBody.iss === getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription(channelsListDescription), 'The issuer of the swarm message with a channel description is not valid');
            assert(messageBody.typ === getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription(channelsListDescription), 'The type of the swarm message with a channel description is not valid');
            const channelDescriptionRaw = yield parseChannelDescription(messageBody.pld);
            const { jsonSchemaValidator, isUserValid } = this;
            yield channelDescriptionFormatValidator(channelDescriptionRaw, jsonSchemaValidator);
            assert(getDatabaseKeyForChannelDescription(channelDescriptionRaw) === keyInDb, 'Key in the database is not equals to the channel desciption');
            if (channelExistingDescription) {
                assert(channelDescriptionRaw.id === channelExistingDescription.id, 'Identity of the channel cannot be changed');
                assert(channelDescriptionRaw.dbType === channelExistingDescription.dbType, 'Type of channel database cannot be changed');
                assert(channelDescriptionRaw.messageEncryption === channelExistingDescription.messageEncryption, 'Message encryption type cant be changed for swarm messages channel');
            }
            else if (isDatabaseReady) {
                assert(channelDescriptionRaw.admins.includes(senderUserId), 'The user who sends the user id should be in the list of the channel administrators');
            }
            const { admins, dbOptions } = channelDescriptionRaw;
            const { write: usersIdsWithWriteAccess } = dbOptions;
            if (isDatabaseReady) {
                try {
                    yield validateUsersList(admins, isUserValid);
                }
                catch (err) {
                    throw new Error(`Admin users identities are not valid: ${err.message}`);
                }
                if (usersIdsWithWriteAccess) {
                    try {
                        yield validateUsersList(usersIdsWithWriteAccess, isUserValid);
                    }
                    catch (err) {
                        throw new Error(`Users identifiers list, which have a write access is not valid: ${err.message}`);
                    }
                }
            }
        }
    });
}
export function getValidatorOfSwrmMessageWithChannelDescription() {
    return validatorOfSwrmMessageWithChannelDescription;
}
//# sourceMappingURL=swarm-messages-channels-list-swarm-messages-validator-v1.js.map