import { getEventEmitterClass } from '../event-emitter-class-base/event-emitter-class-base';
import { QUEUE_MANAGER_EVENT_START, DEFAULT_INTERVAL_MS, QUEUE_MANAGER_EVENT_READY, QUEUE_MANAGER_EVENT_STOP, } from './queue-manager-class-base.const';
export class QueueManagerClassBase extends getEventEmitterClass() {
    constructor(options) {
        super();
        this.queue = [];
        this.intervalMs = DEFAULT_INTERVAL_MS;
        this.lastEmitMs = 0;
        this.emitReadyEvent = () => {
            this.emit(QUEUE_MANAGER_EVENT_READY);
        };
        this.setOptions(options);
    }
    setOptions(options) {
        const { intervalMs, itemsInBatch } = options;
        this.intervalMs = intervalMs;
        this.itemsInBatch = itemsInBatch;
    }
    getTimestamp() {
        return Date.now();
    }
    getBatchOfItems() {
        const { queue, itemsInBatch } = this;
        return queue.slice(0, itemsInBatch || undefined);
    }
    deleteItemsFromQueue(items) {
        this.queue = this.queue.filter((itemQueued) => items.includes(itemQueued));
    }
    emitEvent(event) {
        const itemsInBatch = this.getBatchOfItems();
        this.lastEmitMs = this.getTimestamp();
        try {
            this.emit(event, itemsInBatch);
        }
        catch (err) {
            QueueManagerClassBase.logError('emitReadyEvent', err);
        }
        this.deleteItemsFromQueue(itemsInBatch);
    }
    startInterval() {
        this.interval = setInterval(this.emitReadyEvent, this.intervalMs);
    }
    clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
    start() {
        this.startInterval();
        this.emit(QUEUE_MANAGER_EVENT_START);
    }
    stop() {
        this.clearInterval();
        this.emit(QUEUE_MANAGER_EVENT_STOP);
        this.queue = [];
    }
}
QueueManagerClassBase.logError = (methodName, error) => {
    console.error(`QueueManagerClassBase::${methodName}`, error);
};
//# sourceMappingURL=queue-manager-class-base.js.map