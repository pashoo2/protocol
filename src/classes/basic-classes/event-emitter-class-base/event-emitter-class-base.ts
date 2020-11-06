import EEmitter from 'events';
import TypedEmitter from 'strict-event-emitter-types';

export class EventEmitter<IEvents extends Record<string, any>> extends EEmitter implements TypedEmitter<EEmitter, IEvents> {}

export function getEventEmitterInstance<IEvents extends Record<string, any>>(): TypedEmitter<EEmitter, IEvents> {
  return new EventEmitter<IEvents>();
}
