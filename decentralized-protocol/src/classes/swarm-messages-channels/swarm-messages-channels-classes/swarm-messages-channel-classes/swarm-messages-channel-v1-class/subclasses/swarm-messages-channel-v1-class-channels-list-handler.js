import { __awaiter } from "tslib";
import { ESwarmStoreConnector } from "../../../../../swarm-store-class/swarm-store-class.const";
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from "../../../../../swarm-message/swarm-message-constructor.types";
import { ISwarmStoreConnector, ISwarmStoreConnectorBasic, ISwarmStoreOptionsConnectorFabric, ISwarmStoreProviderOptions, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType, } from "../../../../../swarm-store-class/swarm-store-class.types";
import { ISwarmMessageStore, ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreOptionsWithConnectorFabric, TSwarmMessagesStoreGrantAccessCallback, } from "../../../../../swarm-message-store/types/swarm-message-store.types";
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from "../../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types";
import { isDeepEqual } from "../../../../../../utils";
import { getEventEmitterInstance } from "../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base";
import { ESwarmMessagesChannelsListEventName, } from '../../../../types/swarm-messages-channels-list-events.types';
export class SwarmMessagesChannelV1ClassChannelsListHandler {
    constructor(__options) {
        this.__options = __options;
        this.__emitter = getEventEmitterInstance();
        this.__channelMarkedAsRemoved = true;
        this._handleChannelDescriptionUpdateListener = (channelDescription) => {
            if (channelDescription.id === this.__actualChannelDescription.id) {
                return;
            }
            if (!this.__channelDescriptionUpdatePromise &&
                this._isTwoChannelsDescriptionsEqual(this.__actualChannelDescription, channelDescription)) {
                this._setChannelDescriptionUpdatePromise(this._updateThisInstanceChannelDescription());
                this._unsetChannelRemovedMark();
                this._emitChannelUpdatedDescription(this.__actualChannelDescription);
            }
        };
        this._handleChannelDescriptionDeleteListener = (channelDeletedId) => __awaiter(this, void 0, void 0, function* () {
            if (channelDeletedId !== this.__actualChannelDescription.id || this.__channelMarkedAsRemoved) {
                return;
            }
            const actualChannelDescription = yield this._readActualChannelDescriptionFromCurrentChannelsList();
            if (!actualChannelDescription) {
                this._emitChannelDescriptionRemoved(this.__actualChannelDescription.id);
                this._setChannelRemovedMark();
            }
        });
        const { channelDescription, chanelsListInstance } = __options;
        this.__actualChannelDescription = channelDescription;
        this.__channelDescriptionUpdatePromise = this._createPromiseAddChannelDescriptionToTheChannelsList(channelDescription, chanelsListInstance);
        this._subscribeOnChannelDescriptionUpdates(chanelsListInstance);
    }
    get emitter() {
        return this.__emitter;
    }
    get _whetherUserIsChannelAdmin() {
        return this.__actualChannelDescription.admins.includes(this.__currentUserId);
    }
    get __chanelsListInstance() {
        return this.__options.chanelsListInstance;
    }
    get __currentUserId() {
        return this.__options.currentUserId;
    }
    updateChannelDescription(channelRawDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._whetherUserCanEditChannelDescription();
            if (!this._isTwoChannelsDescriptionsEqual(channelRawDescription, this.__actualChannelDescription)) {
                yield this._updateChannelDescriptionInChannelsList(channelRawDescription);
            }
        });
    }
    dropChannelDescriptionFromList() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._whetherUserCanEditChannelDescription();
            yield this._dropChannelDescriptionFromTheChannelsList();
        });
    }
    _whetherUserCanEditChannelDescription() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.__channelDescriptionUpdatePromise;
            if (this.__channelMarkedAsRemoved) {
                throw new Error('Channel marked as removed, so it is not allowed any changes');
            }
            if (!this._whetherUserIsChannelAdmin) {
                throw new Error('Only admin of the channel can edit a description of the channel');
            }
        });
    }
    _subscribeOnChannelDescriptionUpdates(swarmMessagesChannelsListInstance) {
        this.__subscribeOrUnsubscribeFromChannelDescriptionUpdates(swarmMessagesChannelsListInstance, true);
    }
    _unsubscribeOnChannelDescriptionUpdates(swarmMessagesChannelsListInstance) {
        this.__subscribeOrUnsubscribeFromChannelDescriptionUpdates(swarmMessagesChannelsListInstance, false);
    }
    _updateChannelDescriptionInChannelsList(swarmChannelDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.__chanelsListInstance.upsertChannel(swarmChannelDescription);
        });
    }
    _dropChannelDescriptionFromTheChannelsList() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.__chanelsListInstance.removeChannelById(this.__actualChannelDescription.id);
        });
    }
    _isTwoChannelsDescriptionsEqual(firstChannelDescription, secondChannelDescription) {
        return isDeepEqual(firstChannelDescription, secondChannelDescription);
    }
    _readChannelDescriptionFromChannelsList(id, swarmMessagesChannelsListInstance) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield swarmMessagesChannelsListInstance.getChannelDescriptionById(id);
        });
    }
    _createPromiseAddChannelDescriptionToTheChannelsList(swarmChannelDescriptionFromOptions, swarmMessagesChannelsListInstance) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelDescriptionFromChannelsList = yield this._readChannelDescriptionFromChannelsList(swarmChannelDescriptionFromOptions.id, swarmMessagesChannelsListInstance);
            if (!channelDescriptionFromChannelsList) {
                yield this._updateChannelDescriptionInChannelsList(swarmChannelDescriptionFromOptions);
            }
            else {
                this._setActualChannelDescription(channelDescriptionFromChannelsList);
            }
        });
    }
    _readActualChannelDescriptionFromCurrentChannelsList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._readChannelDescriptionFromChannelsList(this.__actualChannelDescription.id, this.__chanelsListInstance);
        });
    }
    _setActualChannelDescription(channelDescription) {
        this.__actualChannelDescription = channelDescription;
    }
    _emitChannelUpdatedDescription(channelDescription) {
        this.__emitter.emit(ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE, channelDescription);
    }
    _emitChannelDescriptionRemoved(channelId) {
        this.__emitter.emit(ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED, channelId);
    }
    _updateThisInstanceChannelDescription() {
        return __awaiter(this, void 0, void 0, function* () {
            const actualChannelDescription = yield this._readActualChannelDescriptionFromCurrentChannelsList();
            if (actualChannelDescription) {
                this._setActualChannelDescription(actualChannelDescription);
            }
        });
    }
    _setChannelRemovedMark() {
        this.__channelMarkedAsRemoved = true;
    }
    _unsetChannelRemovedMark() {
        this.__channelMarkedAsRemoved = false;
    }
    _setChannelDescriptionUpdatePromise(channelDescriptionUpdatePromise) {
        this.__channelDescriptionUpdatePromise = channelDescriptionUpdatePromise;
    }
    __subscribeOrUnsubscribeFromChannelDescriptionUpdates(swarmMessagesChannelsListInstance, ifSubscription = true) {
        const methodName = ifSubscription ? 'addListener' : 'removeListener';
        const channelsListEmitter = swarmMessagesChannelsListInstance.emitter;
        channelsListEmitter[methodName](ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE, this._handleChannelDescriptionUpdateListener);
        channelsListEmitter[methodName](ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED, this._handleChannelDescriptionDeleteListener);
    }
}
//# sourceMappingURL=swarm-messages-channel-v1-class-channels-list-handler.js.map