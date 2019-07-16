import { EventEmitter } from '../event-emitter-class-base';
import {
  TQueue,
  TIntervalEmitReadyMs,
  TLastEmitReadyTimestamp,
  TQueueManagerEvents,
  IQueueOptions,
  TMaxItemsInBatch,
} from './queue-manager-class-base.types';
import {
  QUEUE_MANAGER_EVENT_START,
  DEFAULT_INTERVAL_MS,
  QUEUE_MANAGER_EVENT_READY,
  QUEUE_MANAGER_EVENT_STOP,
} from './queue-manager-class-base.const';

export class QueueManagerClassBase<T> extends EventEmitter<
  TQueueManagerEvents<T>
> {
  public static logError = (methodName: string, error: Error) => {
    console.error(`QueueManagerClassBase::${methodName}`, error);
  };

  protected queue: TQueue<T> = [];
  protected itemsInBatch?: TMaxItemsInBatch;
  protected intervalMs: TIntervalEmitReadyMs = DEFAULT_INTERVAL_MS;
  protected lastEmitMs: TLastEmitReadyTimestamp = 0;
  protected interval?: NodeJS.Timer;

  constructor(options: IQueueOptions) {
    super();
    this.setOptions(options);
  }

  setOptions(options: IQueueOptions) {
    const { intervalMs, itemsInBatch } = options;

    this.intervalMs = intervalMs;
    this.itemsInBatch = itemsInBatch;
  }

  getTimestamp() {
    return Date.now();
  }

  getBatchOfItems(): T[] {
    const { queue, itemsInBatch } = this;

    return queue.slice(0, itemsInBatch || undefined);
  }

  /**
   * @memberof QueueManagerClassBase
   * @param items - items to remove from queue
   */
  deleteItemsFromQueue(items: T[]): void {
    this.queue = this.queue.filter(itemQueued => items.includes(itemQueued));
  }

  emitEvent(
    event: typeof QUEUE_MANAGER_EVENT_READY | typeof QUEUE_MANAGER_EVENT_STOP
  ) {
    const itemsInBatch = this.getBatchOfItems();

    this.lastEmitMs = this.getTimestamp();
    try {
      this.emit(event, itemsInBatch);
    } catch (err) {
      QueueManagerClassBase.logError('emitReadyEvent', err);
    }
    this.deleteItemsFromQueue(itemsInBatch);
  }

  /**
   * emit 'ready' event with a next batched
   * items, wich are will be removed from the
   * queue if there will no errors while
   * handling the event
   * @memberof QueueManagerClassBase
   */
  emitReadyEvent = () => {
    this.emit(QUEUE_MANAGER_EVENT_READY);
  };

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
