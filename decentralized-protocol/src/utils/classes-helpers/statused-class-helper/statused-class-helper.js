import { __awaiter } from "tslib";
import { getEventEmitterInstance } from "../../../classes/basic-classes/event-emitter-class-base/event-emitter-class-base";
import assert from 'assert';
import { STATUSED_CLASS_HELPER_STATUS_WAITING_TIMEOUT_MS_DEFAULT, STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME, } from './statused-class-helper.const';
export class StatusedClassHelper {
    constructor(options) {
        this.__isReadyStatusedClassHelper = false;
        this.__emitterInnerStatusChanged = getEventEmitterInstance();
        this.waitTillStatus = (currentStatus, timeoutMs = STATUSED_CLASS_HELPER_STATUS_WAITING_TIMEOUT_MS_DEFAULT) => __awaiter(this, void 0, void 0, function* () {
            this.__checkIsStatusedClassHelperReady();
            if (this.__currentStatus !== currentStatus) {
                return this.__currentStatus;
            }
            return this.__resolveOnCondition((newStatus) => newStatus !== currentStatus, timeoutMs);
        });
        this.waitForStatus = (trgetStatus, timeoutMs = STATUSED_CLASS_HELPER_STATUS_WAITING_TIMEOUT_MS_DEFAULT) => __awaiter(this, void 0, void 0, function* () {
            this.__checkIsStatusedClassHelperReady();
            if (this.__currentStatus === trgetStatus) {
                return this.__currentStatus;
            }
            return this.__resolveOnCondition((newStatus) => newStatus === trgetStatus, timeoutMs);
        });
        this.__handleEmitterStatusChanged = (statusName) => {
            this.__setNewStatus(statusName);
            this.__emitStatusChaned(statusName);
        };
        this.__getEmitterEventStatusChanged = () => {
            const emitterEventStatusChanged = this.__emitterEventStatusChanged;
            if (!emitterEventStatusChanged) {
                throw new Error('emitterEventStatusChanged must not be empty');
            }
            return emitterEventStatusChanged;
        };
        this.__resolveOnCondition = (resolver, timeoutMs) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                let timer;
                const listenerStatusChanged = (newStatus) => {
                    if (this.__isReadyStatusedClassHelper) {
                        timer && clearTimeout(timer);
                        rej(new Error('The instance was closed'));
                    }
                    if (resolver(newStatus) === true) {
                        timer && clearTimeout(timer);
                        res(newStatus);
                    }
                };
                this.__emitterInnerStatusChanged.once(STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME, listenerStatusChanged);
                if (timeoutMs) {
                    timer = setTimeout(() => {
                        timer = undefined;
                        this.__emitterInnerStatusChanged.removeListener(STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME, listenerStatusChanged);
                        rej(new Error(`Timed out waiting for a status`));
                    }, timeoutMs);
                }
            });
        });
        this.__validateOptionsStatusClassHelper(options);
        this.__setOptionsStatusClassHelper(options);
        this.__setListenerForStatusChanges();
        this.__setIsReady();
    }
    get currentStatus() {
        return this.__currentStatus || undefined;
    }
    setStatus(status) {
        this.__checkIsStatusedClassHelperReady();
        this.__setNewStatus(status);
        this.__emitExternalEmitterNewStatus(status);
    }
    listenForStatusChanged(timeoutMs = STATUSED_CLASS_HELPER_STATUS_WAITING_TIMEOUT_MS_DEFAULT) {
        this.__checkIsStatusedClassHelperReady();
        return this.__resolveOnCondition(() => true, timeoutMs);
    }
    clearStatus() {
        this.__clearStatus();
    }
    stopStatusEmitter() {
        this.__clearStatus();
        this.__unsetIsReady();
        this.__clearEventEmitters();
        this.__clearOptions();
    }
    __setIsReady() {
        this.__isReadyStatusedClassHelper = true;
    }
    __unsetIsReady() {
        this.__isReadyStatusedClassHelper = false;
    }
    __emitStatusChaned(statusName) {
        this.__emitterInnerStatusChanged.emit(STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME, statusName);
    }
    __setListenerForStatusChanges() {
        var _a;
        (_a = this.__emitterExternal) === null || _a === void 0 ? void 0 : _a.addListener(this.__getEmitterEventStatusChanged(), this.__handleEmitterStatusChanged);
    }
    __validateOptionsStatusClassHelper(options) {
        assert(!!options, 'Options must be provided');
        assert(typeof options === 'object', 'Options must be an object');
        const { statusChangedEventName, statusChangesEmitter: statusChanesEmitter } = options;
        assert(!!statusChangedEventName, 'Status changed event name must be provided and not empty');
        assert(typeof statusChangedEventName === 'string', 'Status changed event name must be a string');
        assert(!!statusChanesEmitter, 'An event emitter must be provided for listening an event leads to a status chage');
        assert(typeof statusChanesEmitter === 'object', 'An event emitter instance must be an object');
        assert(typeof statusChanesEmitter.addListener === 'function', 'An event emitter instance must have "addListener" method');
        assert(statusChanesEmitter.addListener.length > 0, 'An event emitter instance must have "addListener" method which accepts an event name');
        assert(typeof statusChanesEmitter.emit === 'function', 'An event emitter instance must have "emit" method');
        assert(statusChanesEmitter.emit.length > 1, 'An event emitter instance must have "emit" method which accepts an event name with a new status');
    }
    __setOptionsStatusClassHelper(options) {
        this.__emitterEventStatusChanged = options.statusChangedEventName;
        this.__emitterExternal = options.statusChangesEmitter;
    }
    __checkIsStatusedClassHelperReady() {
        if (!this.__isReadyStatusedClassHelper) {
            throw new Error('The instance is not ready to be used');
        }
    }
    __setNewStatus(statusName) {
        this.__currentStatus = statusName;
    }
    __emitExternalEmitterNewStatus(statusName) {
        var _a;
        (_a = this.__emitterExternal) === null || _a === void 0 ? void 0 : _a.emit(this.__getEmitterEventStatusChanged(), statusName);
    }
    __clearEventEmitters() {
        var _a;
        (_a = this.__emitterExternal) === null || _a === void 0 ? void 0 : _a.removeListener(this.__getEmitterEventStatusChanged(), this.__handleEmitterStatusChanged);
        this.__emitterInnerStatusChanged.removeAllListeners();
        this.__emitterInnerStatusChanged = undefined;
        this.__emitterExternal = undefined;
    }
    __clearOptions() {
        this.__emitterEventStatusChanged = undefined;
    }
    __clearStatus() {
        this.__emitExternalEmitterNewStatus(undefined);
        this.__currentStatus = undefined;
    }
}
//# sourceMappingURL=statused-class-helper.js.map