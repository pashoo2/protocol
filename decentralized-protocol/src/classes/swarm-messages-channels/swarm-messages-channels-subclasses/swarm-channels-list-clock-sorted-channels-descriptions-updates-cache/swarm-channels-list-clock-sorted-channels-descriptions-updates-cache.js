import { __awaiter } from "tslib";
export class SwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructor {
    constructor(params) {
        this._channelsDescriptionsChangesHistory = new Map();
        const { getChannelDescriptionBySwarmMessage } = params;
        this._getChannelDescriptionBySwarmMessage = getChannelDescriptionBySwarmMessage;
    }
    getChannelDescriptionUpdatePreviousByClockTimeOrUndefined(channelId, clockTime) {
        const channelDescriptionsUpdatesHistoryOrUndefined = this._getChannelDescriptionsHistoryOrUndefined(channelId);
        if (channelDescriptionsUpdatesHistoryOrUndefined) {
            let messageCachedAddTime;
            let previousMessageTime = -1;
            for (messageCachedAddTime of channelDescriptionsUpdatesHistoryOrUndefined.keys()) {
                if (messageCachedAddTime < clockTime) {
                    if (previousMessageTime < messageCachedAddTime) {
                        previousMessageTime = messageCachedAddTime;
                    }
                }
            }
            if (previousMessageTime !== -1) {
                const previousMessageDescription = channelDescriptionsUpdatesHistoryOrUndefined.get(previousMessageTime);
                if (!previousMessageDescription) {
                    throw new Error(`Previous message can't be gotten by the time key ${previousMessageTime}`);
                }
                return previousMessageDescription;
            }
        }
    }
    addSwarmMessageWithChannelDescriptionUpdate(channelId, clockTime, swarmMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let channelDescriptionUpdatesHistory = this._getChannelDescriptionsHistoryOrUndefined(channelId);
            const channelDescription = yield this._getChannelDescriptionBySwarmMessage(swarmMessage);
            if (!channelDescriptionUpdatesHistory) {
                channelDescriptionUpdatesHistory = new Map();
                this._setChannelDescriptionsHistory(channelId, channelDescriptionUpdatesHistory);
            }
            channelDescriptionUpdatesHistory.set(clockTime, channelDescription);
        });
    }
    _getChannelDescriptionsHistoryOrUndefined(channelId) {
        return this._channelsDescriptionsChangesHistory.get(channelId);
    }
    _setChannelDescriptionsHistory(channelId, channelDescriptionUpdatesHistory) {
        this._channelsDescriptionsChangesHistory.set(channelId, channelDescriptionUpdatesHistory);
    }
}
//# sourceMappingURL=swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.js.map