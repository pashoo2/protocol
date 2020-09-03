import { ownKeyOf } from 'types/helper.types';
import { any } from 'prop-types';

/**
 * the source code is based on
 * https://github.com/andywer/typed-emitter
 */

type Arguments<T> = [T] extends [(...args: infer U) => any]
  ? U
  : [T] extends [void]
  ? []
  : [T];

export type TEventsList = { [key in string | symbol]: any };

type keyOf<T extends TEventsList> = ownKeyOf<T> extends string | symbol
  ? keyof T
  : never;

type TEvent<E> = keyOf<E>;

export interface TypedEventEmitter<Events extends TEventsList> {
  addListener<E extends TEvent<Events>>(event: E, listener: Events[E]): this;
  on<E extends TEvent<Events>>(event: E, listener: Events[E]): this;
  once<E extends TEvent<Events>>(event: E, listener: Events[E]): this;
  prependListener<E extends TEvent<Events>>(
    event: E,
    listener: Events[E]
  ): this;
  prependOnceListener<E extends TEvent<Events>>(
    event: E,
    listener: Events[E]
  ): this;

  removeAllListeners<E extends TEvent<Events>>(event: E): this;
  removeListener<E extends TEvent<Events>>(event: E, listener: Events[E]): this;

  emit<E extends TEvent<Events>>(
    event: E,
    ...args: Arguments<Events[E]>
  ): boolean;
  eventNames(): TEvent<Events>[];
  listeners<E extends TEvent<Events>>(event: E): Function[];
  listenerCount<E extends TEvent<Events>>(event: E): number;

  getMaxListeners(): number;
  setMaxListeners(maxListeners: number): this;
}

export default TypedEventEmitter;
