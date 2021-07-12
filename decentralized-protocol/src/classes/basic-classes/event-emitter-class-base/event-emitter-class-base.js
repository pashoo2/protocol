import EventEmitterBasic from 'events';
import { ConstructorType } from "../../../types/helper.types";
export function getEventEmitterClass() {
    return EventEmitterBasic;
}
export function getEventEmitterInstance() {
    return new EventEmitterBasic();
}
export function getEventEmitterForwardingClass() {
    class EventEmitterWithForwarding extends getEventEmitterClass() {
        constructor() {
            super();
            this.__forwardEventsTo = new Set();
            const originalEmitMethod = this.emit.bind(this);
            this.emit = (...args) => {
                this.__forwardEventsTo.forEach((emitter) => emitter.emit(...args));
                return Boolean(originalEmitMethod(...args));
            };
        }
        startForwardingTo(emitter) {
            this.__forwardEventsTo.add(emitter);
        }
        stopForwardingTo(emitter) {
            this.__forwardEventsTo.delete(emitter);
        }
    }
    return EventEmitterWithForwarding;
}
export function getEventEmitterForwardingInstance() {
    return new (getEventEmitterForwardingClass())();
}
//# sourceMappingURL=event-emitter-class-base.js.map