import { __awaiter } from "tslib";
import { SWARM_MESSAGES_CHANNEL_VERSION } from './../../../../const/swarm-messages-channel-classes-params.const';
import { TSwarmStoreDatabaseOptions } from "../../../../../../swarm-store-class/index";
import { ESwarmStoreConnectorOrbitDbDatabaseType } from './../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmMessageSerialized } from "../../../../../../swarm-message/swarm-message-constructor.types";
import { ESwarmStoreConnector } from "../../../../../../swarm-store-class/swarm-store-class.const";
import { ISwarmMessageChannelDescriptionRaw } from "../../../../../types/swarm-messages-channel-instance.types";
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from "../../../../../const/swarm-messages-channels-main.const";
export const SWARM_MESSAGES_CHANNEL_V1_GENERATE_NEW_PUBLIC_KEY_VALUE_CHANNEL_DESCRIPTION_DATABASE_OPTIONS_STUB = {
    isPublic: true,
    write: [],
    grantAccess: function grantAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    },
};
export const SWARM_MESSAGES_CHANNEL_V1_GENERATE_NEW_PUBLIC_KEY_VALUE_CHANNEL_DESCRIPTION_STUB = {
    id: '',
    version: SWARM_MESSAGES_CHANNEL_VERSION.FIRST,
    name: '',
    description: '',
    tags: ['TestChannel'],
    dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
    messageEncryption: SWARM_MESSAGES_CHANNEL_ENCRYPTION.PUBLIC,
    admins: [],
    dbOptions: SWARM_MESSAGES_CHANNEL_V1_GENERATE_NEW_PUBLIC_KEY_VALUE_CHANNEL_DESCRIPTION_DATABASE_OPTIONS_STUB,
};
//# sourceMappingURL=swarm-messages-channel-v1-generate-new-channel-description.const.js.map