import EventEmitterBasic from 'events';

const emittersForwarded = new WeakMap<EventEmitterBasic, Set<EventEmitterBasic>>();

/**
 * Forwards all events from
 *
 * @export
 * @param {EventEmitterBasic} eventEmitterSource
 * @param {EventEmitterBasic} eventEmitterTarget
 */
export function forwardEvents<E extends EventEmitterBasic>(eventEmitterSource: E, eventEmitterTarget: E): void {
  let emittersForwardedToSet = emittersForwarded.get(eventEmitterSource);

  if (emittersForwardedToSet) {
    emittersForwardedToSet.add(eventEmitterTarget);
  } else {
    emittersForwardedToSet = new Set<EventEmitterBasic>();
    emittersForwarded.set(eventEmitterSource, emittersForwardedToSet);
    eventEmitterSource.emit = function emit(
      this: {
        eventEmitterSourceEmitMethodOrigin: E['emit'];
        eventEmitterSource: E;
        emittersForwardedToSet: Set<EventEmitterBasic>;
      },
      ...args: Parameters<EventEmitterBasic['emit']>
    ): ReturnType<EventEmitterBasic['emit']> {
      emittersForwardedToSet?.forEach((emitter) => emitter.emit(...args));
      return this.eventEmitterSourceEmitMethodOrigin.apply(this.eventEmitterSource, args);
      // eslint-disable-next-line @typescript-eslint/unbound-method
    }.bind({ eventEmitterSource, eventEmitterSourceEmitMethodOrigin: eventEmitterSource.emit, emittersForwardedToSet });
  }
}

export function stopForwardEvents<E extends EventEmitterBasic>(eventEmitterSource: E, eventEmitterTarget: E): void {
  const emittersForwardedToSet = emittersForwarded.get(eventEmitterSource);
  emittersForwardedToSet?.delete(eventEmitterTarget);
}
