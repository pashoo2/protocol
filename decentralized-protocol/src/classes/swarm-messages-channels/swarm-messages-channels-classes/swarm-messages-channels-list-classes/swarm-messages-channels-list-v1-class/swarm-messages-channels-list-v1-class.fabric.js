import { __awaiter } from "tslib";
import { getEventEmitterInstance } from '../../../../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessagesChannelsListEventName } from '../../../types/swarm-messages-channels-list-events.types';
import { forwardEvents, stopForwardEvents, } from '../../../../basic-classes/event-emitter-class-base/event-emitter-class-with-forwarding.utils';
export function getSwarmMessagesChannelsListVersionOneClass(ClassSwarmMessagesChannelsListVersionOneOptionsSetUp) {
    class SwarmMessagesChannelsListVersionOne extends ClassSwarmMessagesChannelsListVersionOneOptionsSetUp {
        constructor(args) {
            super(args);
            this.__emitterChannelsList = getEventEmitterInstance();
            this.__isChannelsListClosed = false;
            this.__handleChannelsListDatabaseConnetorReadyToUse = () => {
                if (this.isReady) {
                    this._emitChannelsListEvent(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_READY);
                }
            };
            this._startEventsForwarding();
            this._startListeningForChannelsListDatabaseEvents();
        }
        get description() {
            return this._getChannelsListDescription();
        }
        get emitter() {
            return this.__emitterChannelsList;
        }
        get isReady() {
            return !this.__isChannelsListClosed && this._isDatabaseReady;
        }
        get swarmChannelsDescriptionsCachedMap() {
            return this._swarmChannelsDescriptionsCachedMap;
        }
        upsertChannel(channelDescriptionRaw) {
            return __awaiter(this, void 0, void 0, function* () {
                this.__validateChannelIsNotClosed();
                yield this._validateChannelDescriptionFormat(channelDescriptionRaw);
                yield this._addChannelDescriptionRawInSwarmDatabase(channelDescriptionRaw);
            });
        }
        removeChannelById(channelId) {
            return __awaiter(this, void 0, void 0, function* () {
                this.__validateChannelIsNotClosed();
                yield this._removeValueForDbKey(channelId);
            });
        }
        getAllChannelsDescriptions() {
            return __awaiter(this, void 0, void 0, function* () {
                this.__validateChannelIsNotClosed();
                return yield this._readAllChannelsDescriptionsWithMeta();
            });
        }
        getChannelDescriptionById(channelId) {
            return __awaiter(this, void 0, void 0, function* () {
                this.__validateChannelIsNotClosed();
                return yield this._readSwarmMessagesChannelDescriptionOrUndefinedForDbKey(channelId);
            });
        }
        close() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.__isChannelsListClosed) {
                    return;
                }
                this._stopEventsForwarding();
                this.__setChannelsListIsClosed();
                yield this._closeDatabase();
                this._emitChannelsListEvent(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_CLOSED);
                this.__resetOptionsSetup();
            });
        }
        drop() {
            return __awaiter(this, void 0, void 0, function* () {
                this.__validateChannelIsNotClosed();
                this._stopEventsForwarding();
                yield this._dropDatabase();
                this._emitChannelsListEvent(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_CLOSED);
                this.__resetOptionsSetup();
            });
        }
        _emitChannelsListEvent(eventName, ...args) {
            this.__emitterChannelsList.emit(eventName, ...args);
        }
        _startEventsForwarding() {
            forwardEvents(this._emitterDatabaseHandler, this.__emitterChannelsList);
        }
        _stopEventsForwarding() {
            stopForwardEvents(this._emitterDatabaseHandler, this.__emitterChannelsList);
        }
        _startListeningForChannelsListDatabaseEvents() {
            this._emitterDatabaseHandler.addListener(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_DATABASE_READY, this.__handleChannelsListDatabaseConnetorReadyToUse);
        }
        _createMessageBodyForChannelDescription(channelDescriptionRaw) {
            const messageTyp = this._createChannelDescriptionMessageTyp();
            const messageIss = this._createChannelDescriptionMessageIssuer();
            const messagePayload = this._serializeChannelDescriptionRaw(channelDescriptionRaw);
            return {
                typ: messageTyp,
                iss: messageIss,
                pld: messagePayload,
            };
        }
        _addChannelDescriptionRawInSwarmDatabase(channelDescriptionRaw) {
            return __awaiter(this, void 0, void 0, function* () {
                const swarmMessageWithChannelDescription = this._createMessageBodyForChannelDescription(channelDescriptionRaw);
                const keyInDatabaseForChannelDescription = this._getKeyInDatabaseForStoringChannelsListDescription(channelDescriptionRaw);
                yield this._addSwarmMessageBodyInDatabase(keyInDatabaseForChannelDescription, swarmMessageWithChannelDescription);
            });
        }
        _getExistingChannelDescription(channelId) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._readSwarmMessagesChannelDescriptionOrUndefinedForDbKey(channelId);
            });
        }
        __setChannelsListIsClosed() {
            this.__isChannelsListClosed = true;
        }
        __validateChannelIsNotClosed() {
            if (this.__isChannelsListClosed) {
                throw new Error('The channel is closed and cannot perform any operations');
            }
        }
    }
    return SwarmMessagesChannelsListVersionOne;
}
//# sourceMappingURL=swarm-messages-channels-list-v1-class.fabric.js.map