import EventEmitterBasic from 'events';
import { ConstructorType } from 'types/helper.types';
import { EventEmitter, EventEmitterContructor, ITypedEmitterWithForwarding } from './event-emitter-class-base.types';

export function getEventEmitterClass<IEvents extends Record<string, any>>(): EventEmitterContructor<IEvents> {
  return (EventEmitterBasic as unknown) as EventEmitterContructor<IEvents>;
}

export function getEventEmitterInstance<IEvents extends Record<string, any>>(): EventEmitter<IEvents> {
  return new EventEmitterBasic() as EventEmitter<IEvents>;
}

export function getEventEmitterForwardingClass<IEvents extends Record<string, any>>(): ConstructorType<
  ITypedEmitterWithForwarding<IEvents>
> {
  class EventEmitterWithForwarding<IEvents extends Record<string, any>> extends getEventEmitterClass<Record<any, any>>() {
    private __forwardEventsTo = new Set<EventEmitterBasic>();

    constructor() {
      super();
      const originalEmitMethod = this.emit.bind(this);
      this.emit = (...args: Parameters<EventEmitterBasic['emit']>): ReturnType<EventEmitterBasic['emit']> => {
        this.__forwardEventsTo.forEach((emitter) => emitter.emit(...args));
        return Boolean(originalEmitMethod(...args));
      };
    }

    public startForwardingTo(emitter: EventEmitter<IEvents>): void {
      this.__forwardEventsTo.add(emitter);
    }

    public stopForwardingTo(emitter: EventEmitter<IEvents>): void {
      this.__forwardEventsTo.delete(emitter);
    }
  }

  return (EventEmitterWithForwarding as unknown) as ConstructorType<ITypedEmitterWithForwarding<IEvents>>;
}

export function getEventEmitterForwardingInstance<IEvents extends Record<string, any>>(): ITypedEmitterWithForwarding<IEvents> {
  return new (getEventEmitterForwardingClass<IEvents>())();
}
