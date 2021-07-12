/// <reference types="node" />
import EventEmitterBasic from 'events';
import { StrictEventEmitter as TypedEmitter } from './strict-event-emitter-types.types';
export declare type TTypedEmitter<IEvents extends Record<string, any>> = TypedEmitter<EventEmitterBasic, IEvents>;
export declare type EventEmitter<IEvents extends Record<string, any>> = TTypedEmitter<IEvents>;
export interface EventEmitterContructor<IEvents extends Record<string, any>> {
    new (): EventEmitter<IEvents>;
}
export interface ITypedEmitterWithForwarding<IEvents extends Record<string, any>> extends EventEmitter<IEvents> {
    startForwardingTo(emitter: TTypedEmitter<IEvents>): void;
    stopForwardingTo(emitter: TTypedEmitter<IEvents>): void;
}
//# sourceMappingURL=event-emitter-class-base.types.d.ts.map