/// <reference types="node" />
import EventEmitterBasic from 'events';
export declare function forwardEvents<E extends EventEmitterBasic>(eventEmitterSource: E, eventEmitterTarget: E): void;
export declare function stopForwardEvents<E extends EventEmitterBasic>(eventEmitterSource: E, eventEmitterTarget: E): void;
//# sourceMappingURL=event-emitter-class-with-forwarding.utils.d.ts.map