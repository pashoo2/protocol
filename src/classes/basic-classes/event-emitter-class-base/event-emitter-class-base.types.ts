import EEmitter from 'events';
import TypedEmitter from 'strict-event-emitter-types';

export type TTypedEmitter<IEvents extends Record<string, any>> = TypedEmitter<
  EEmitter,
  IEvents
>;
