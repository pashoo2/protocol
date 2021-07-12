import { ConstructorType } from 'types/helper.types';
import { EventEmitter, EventEmitterContructor, ITypedEmitterWithForwarding } from './event-emitter-class-base.types';
export declare function getEventEmitterClass<IEvents extends Record<string, any>>(): EventEmitterContructor<IEvents>;
export declare function getEventEmitterInstance<IEvents extends Record<string, any>>(): EventEmitter<IEvents>;
export declare function getEventEmitterForwardingClass<IEvents extends Record<string, any>>(): ConstructorType<ITypedEmitterWithForwarding<IEvents>>;
export declare function getEventEmitterForwardingInstance<IEvents extends Record<string, any>>(): ITypedEmitterWithForwarding<IEvents>;
//# sourceMappingURL=event-emitter-class-base.d.ts.map