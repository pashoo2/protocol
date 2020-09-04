import { ownKeyOf } from 'types/helper.types';

/**
 * the source code is based on
 * https://github.com/andywer/typed-emitter
 */

type Arguments<T> = [T] extends [(...args: infer U) => any]
  ? U
  : [T] extends [void]
  ? []
  : [T];

export type TEventsList<T = any> = { [key in string | symbol]: T };

type keyOf<T, E extends TEventsList<T>> = ownKeyOf<E> extends string | symbol
  ? keyof E
  : never;

type TEvent<T, E extends TEventsList<T>> = keyOf<T, E>;

/**
 *
 *
 * @export
 * @interface TypedEventEmitter
 * @template T - types of events arguments
 * @template Events - desription of events and it's arguments
 */
export interface TypedEventEmitter<Events extends TEventsList, T = any> {
  addListener<E extends TEvent<T, Events>>(event: E, listener: Events[E]): this;
  on<E extends TEvent<T, Events>>(event: E, listener: Events[E]): this;
  once<E extends TEvent<T, Events>>(event: E, listener: Events[E]): this;
  prependListener<E extends TEvent<T, Events>>(
    event: E,
    listener: Events[E]
  ): this;
  prependOnceListener<E extends TEvent<T, Events>>(
    event: E,
    listener: Events[E]
  ): this;

  removeAllListeners<E extends TEvent<T, Events>>(event: E): this;
  removeListener<E extends TEvent<T, Events>>(
    event: E,
    listener: Events[E]
  ): this;

  emit<E extends TEvent<T, Events>>(
    event: E,
    ...args: Arguments<Events[E]>
  ): boolean;
  eventNames(): TEvent<T, Events>[];
  listeners<E extends TEvent<T, Events>>(event: E): Function[];
  listenerCount<E extends TEvent<T, Events>>(event: E): number;

  getMaxListeners(): number;
  setMaxListeners(maxListeners: number): this;
}

export default TypedEventEmitter;
