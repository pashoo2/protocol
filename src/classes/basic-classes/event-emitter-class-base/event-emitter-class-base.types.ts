import EventEmitterBasic from 'events';
import { StrictEventEmitter as TypedEmitter } from './strict-event-emitter-types.types';

export type TTypedEmitter<IEvents extends Record<string, any>> = TypedEmitter<EventEmitterBasic, IEvents>;

export type EventEmitter<IEvents extends Record<string, any>> = TTypedEmitter<IEvents>;

export interface EventEmitterContructor<IEvents extends Record<string, any>> {
  new (): EventEmitter<IEvents>;
}

/**
 * Allows to forward all events on another emitters.
 *
 * @export
 * @interface ITypedEmitterWithForwarding
 * @template IEvents
 */
export interface ITypedEmitterWithForwarding<IEvents extends Record<string, any>> extends EventEmitter<IEvents> {
  /**
   * Will emit all events also with the emitter
   * passed.
   *
   * @param {TTypedEmitter<IEvents>} emitter
   * @memberof ITypedEmitterForwarded
   */
  startForwardingTo(emitter: TTypedEmitter<IEvents>): void;
  /**
   * Stop forwarding events to the emitter.
   *
   * @param {TTypedEmitter<IEvents>} emitter
   * @memberof ITypedEmitterForwarded
   */
  stopForwardingTo(emitter: TTypedEmitter<IEvents>): void;
}
