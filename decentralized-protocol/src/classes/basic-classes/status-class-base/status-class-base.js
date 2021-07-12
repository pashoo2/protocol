import { ownValueOf } from "../../../types/helper.types";
import { STATUS_CLASS_STATUS_CHANGE_EVENT } from './status-class-base.const';
import { getEventEmitterInstance } from '../event-emitter-class-base/event-emitter-class-base';
export const STATUS_EVENT = STATUS_CLASS_STATUS_CHANGE_EVENT;
export const getStatusClass = ({ errorStatus, instanceName, initialStatus, }) => class StatusClassBase {
    constructor() {
        this.status = initialStatus ? initialStatus : undefined;
        this.statusEmitter = getEventEmitterInstance();
        this.setStatus = (status) => {
            const { statusEmitter, status: prevStatus } = this;
            this.status = status;
            statusEmitter.emit('status', status);
            return () => {
                this.status = prevStatus;
            };
        };
        this.setErrorStatus = (err) => {
            if (err) {
                const errorOccurred = StatusClassBase.error(err);
                this.errorOccurred = errorOccurred;
                return errorOccurred;
            }
            this.setStatus(errorStatus);
            return new Error('Unknown error');
        };
    }
    static error(err) {
        let errorInstance;
        if (err instanceof Error) {
            errorInstance = err;
        }
        else {
            errorInstance = new Error(String(err));
        }
        console.error(instanceName, errorInstance);
        return errorInstance;
    }
    clearError() {
        this.errorOccurred = undefined;
    }
    clearStatus() {
        this.status = undefined;
    }
    clearState() {
        this.clearStatus();
        this.clearError();
    }
};
//# sourceMappingURL=status-class-base.js.map