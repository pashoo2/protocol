const emittersForwarded = new WeakMap();
export function forwardEvents(eventEmitterSource, eventEmitterTarget) {
    let emittersForwardedToSet = emittersForwarded.get(eventEmitterSource);
    if (emittersForwardedToSet) {
        emittersForwardedToSet.add(eventEmitterTarget);
    }
    else {
        emittersForwardedToSet = new Set([eventEmitterTarget]);
        emittersForwarded.set(eventEmitterSource, emittersForwardedToSet);
        eventEmitterSource.emit = function emit(...args) {
            emittersForwardedToSet === null || emittersForwardedToSet === void 0 ? void 0 : emittersForwardedToSet.forEach((emitter) => emitter.emit(...args));
            return this.eventEmitterSourceEmitMethodOrigin.apply(this.eventEmitterSource, args);
        }.bind({ eventEmitterSource, eventEmitterSourceEmitMethodOrigin: eventEmitterSource.emit, emittersForwardedToSet });
    }
}
export function stopForwardEvents(eventEmitterSource, eventEmitterTarget) {
    const emittersForwardedToSet = emittersForwarded.get(eventEmitterSource);
    emittersForwardedToSet === null || emittersForwardedToSet === void 0 ? void 0 : emittersForwardedToSet.delete(eventEmitterTarget);
}
//# sourceMappingURL=event-emitter-class-with-forwarding.utils.js.map