import { __decorate } from "tslib";
import { SwarmMessagesChannelV1DatabaseHandler } from './swarm-messages-channel-v1-class-messages-database-handler';
import { SWARM_MESSAGES_CHANNEL_V1_DATABASE_CONNECTOR_OPERATIONS_TIMEOUT_DEFAULT_MS } from '../const/swarm-messages-channel-v1-class-timeouts.const';
import { decoratorAsyncQueueConcurentMixinDefault } from '../../../../../basic-classes/async-queue-class-base';
let SwarmMessagesChannelV1DatabaseHandlerQueued = class SwarmMessagesChannelV1DatabaseHandlerQueued extends SwarmMessagesChannelV1DatabaseHandler {
};
SwarmMessagesChannelV1DatabaseHandlerQueued = __decorate([
    decoratorAsyncQueueConcurentMixinDefault(SWARM_MESSAGES_CHANNEL_V1_DATABASE_CONNECTOR_OPERATIONS_TIMEOUT_DEFAULT_MS, 'restartDatabaseConnectorInstanceWithDbOptions', 'addMessage', 'deleteMessage', 'collect', 'collectWithMeta')
], SwarmMessagesChannelV1DatabaseHandlerQueued);
export { SwarmMessagesChannelV1DatabaseHandlerQueued };
//# sourceMappingURL=swarm-messages-channel-v1-class-messages-database-handler-queued.js.map