import EEmitter from 'events';
import TypedEmitter from 'strict-event-emitter-types';
import { EventEmitterWithForwarding } from './event-emitter-class-with-forwarding';
import { ITypedEmitterWithForwarding } from './event-emitter-class-base.types';

export class EventEmitter<IEvents extends Record<string, any>> extends EEmitter implements TypedEmitter<EEmitter, IEvents> {}

export function getEventEmitterInstance<IEvents extends Record<string, any>>(): TypedEmitter<EEmitter, IEvents> {
  return new EventEmitter<IEvents>();
}

export function getEventEmitterForwardingInstance<IEvents extends Record<string, any>>(): ITypedEmitterWithForwarding<IEvents> {
  return new EventEmitterWithForwarding<IEvents>();
}
