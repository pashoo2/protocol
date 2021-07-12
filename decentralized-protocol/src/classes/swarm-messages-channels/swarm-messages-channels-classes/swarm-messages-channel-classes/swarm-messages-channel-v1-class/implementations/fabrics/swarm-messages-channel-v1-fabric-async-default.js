import { __awaiter } from "tslib";
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../../../../../const/swarm-messages-channels-main.const';
import { SwarmMessagesChannelV1Class } from '../swarm-messages-channel-v1-class';
import { SwarmMessagesChannelV1ClassChannelsListHandler } from '../../subclasses/swarm-messages-channel-v1-class-channels-list-handler';
import { SwarmMessagesChannelV1DatabaseHandlerQueued } from '../../subclasses/swarm-messages-channel-v1-class-messages-database-handler-queued';
import assert from 'assert';
import { getQueuedEncryptionClassByPasswordStringAndSalt } from "../../../../../../basic-classes/queued-encryption-class-base/fabrics/queued-encryption-class-base-fabric-by-password";
import { getSwarmMessagesChannelV1DefaultConstructorOptionsUtils } from '../../utils/swarm-messages-channel-v1-constructor-options-default-utils/swarm-messages-channel-v1-constructor-options-default-utils';
export function getSwarmMessagesChannelV1InstanveWithDefaults(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { channelConstructorMainOptions: channelConstructorOptions, channeDatabaseConnectorOptions, SwarmMessagesChannelConstructorWithHelperConstuctorsSupport, SwarmMessagesChannelV1ClassChannelsListHandlerConstructor, SwarmMessagesChannelV1DatabaseHandlerConstructor, encryptionQueueFabricByPasswordAndSalt, passwordForMessagesEncryption, encryptionQueueOptions, defaultConnectionUtils, } = options;
        const { swarmMessagesChannelDescription, passwordEncryptedChannelEncryptionQueue } = channelConstructorOptions;
        const SwarmMessagesChannelConstructorWithHelperConstuctorsSupportToUse = SwarmMessagesChannelConstructorWithHelperConstuctorsSupport || SwarmMessagesChannelV1Class;
        const SwarmMessagesChannelV1ClassChannelsListHandlerConstructorToUse = SwarmMessagesChannelV1ClassChannelsListHandlerConstructor || SwarmMessagesChannelV1ClassChannelsListHandler;
        const SwarmMessagesChannelV1DatabaseHandlerConstructorToUse = SwarmMessagesChannelV1DatabaseHandlerConstructor || SwarmMessagesChannelV1DatabaseHandlerQueued;
        const encryptionQueueFabricByPasswordAndSaltToUse = encryptionQueueFabricByPasswordAndSalt || getQueuedEncryptionClassByPasswordStringAndSalt;
        const constructorUtilsToUse = channelConstructorOptions.utils ||
            getSwarmMessagesChannelV1DefaultConstructorOptionsUtils(Object.assign(Object.assign({}, channeDatabaseConnectorOptions), { user: {
                    userId: channelConstructorOptions.currentUserId,
                } }), defaultConnectionUtils);
        let channelConstructorOptionsResulted = Object.assign(Object.assign({}, channelConstructorOptions), { utils: constructorUtilsToUse });
        if (swarmMessagesChannelDescription.messageEncryption === SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD) {
            assert(passwordForMessagesEncryption, 'A password string must be provided for channels with messages encryption by password');
            const salt = swarmMessagesChannelDescription.id;
            const encryptionQueueForMessagesEncryption = passwordEncryptedChannelEncryptionQueue ||
                (yield encryptionQueueFabricByPasswordAndSaltToUse(passwordForMessagesEncryption, salt, encryptionQueueOptions));
            channelConstructorOptionsResulted = Object.assign(Object.assign({}, channelConstructorOptionsResulted), { passwordEncryptedChannelEncryptionQueue: encryptionQueueForMessagesEncryption });
        }
        return new SwarmMessagesChannelConstructorWithHelperConstuctorsSupportToUse(channelConstructorOptionsResulted, SwarmMessagesChannelV1ClassChannelsListHandlerConstructorToUse, SwarmMessagesChannelV1DatabaseHandlerConstructorToUse);
    });
}
//# sourceMappingURL=swarm-messages-channel-v1-fabric-async-default.js.map