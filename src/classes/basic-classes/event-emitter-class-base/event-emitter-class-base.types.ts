import EEmitter from 'events';
import TypedEmitter from 'strict-event-emitter-types';

export type TTypedEmitter<IEvents extends Record<string, any>> = TypedEmitter<EEmitter, IEvents>;

/**
 * Allows to forward all events on another emitters.
 *
 * @export
 * @interface ITypedEmitterWithForwarding
 * @template IEvents
 */
export interface ITypedEmitterWithForwarding<IEvents extends Record<string, any>> extends TTypedEmitter<IEvents> {
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
