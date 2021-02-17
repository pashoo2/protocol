import EventEmitterBasic from 'events';
import { TTypedEmitter, ITypedEmitterWithForwarding } from './event-emitter-class-base.types';
import TypedEmitter from 'strict-event-emitter-types';

export class EventEmitterWithForwarding<IEvents extends Record<string, any>>
  extends EventEmitterBasic
  implements ITypedEmitterWithForwarding<IEvents>, TypedEmitter<EventEmitterBasic, IEvents> {
  private __forwardEventsTo = new Set<EventEmitterBasic>();

  public startForwardingTo(emitter: TTypedEmitter<IEvents>): void {
    this.__forwardEventsTo.add(emitter);
  }

  public stopForwardingTo(emitter: TTypedEmitter<IEvents>): void {
    this.__forwardEventsTo.delete(emitter);
  }

  public emit(...args: Parameters<EventEmitterBasic['emit']>): ReturnType<EventEmitterBasic['emit']> {
    this.__forwardEventsTo.forEach((emitter) => emitter.emit(...args));
    return super.emit(...args);
  }
}
