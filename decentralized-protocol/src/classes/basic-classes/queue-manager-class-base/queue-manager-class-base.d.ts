/// <reference types="node" />
import { EventEmitter } from '../event-emitter-class-base';
import { TQueue, TIntervalEmitReadyMs, TLastEmitReadyTimestamp, TQueueManagerEvents, IQueueOptions, TMaxItemsInBatch } from './queue-manager-class-base.types';
import { QUEUE_MANAGER_EVENT_READY, QUEUE_MANAGER_EVENT_STOP } from './queue-manager-class-base.const';
declare const QueueManagerClassBase_base: import("../event-emitter-class-base").EventEmitterContructor<any>;
export declare class QueueManagerClassBase<T> extends QueueManagerClassBase_base implements EventEmitter<TQueueManagerEvents<T>> {
    static logError: (methodName: string, error: Error) => void;
    protected queue: TQueue<T>;
    protected itemsInBatch?: TMaxItemsInBatch;
    protected intervalMs: TIntervalEmitReadyMs;
    protected lastEmitMs: TLastEmitReadyTimestamp;
    protected interval?: NodeJS.Timer;
    constructor(options: IQueueOptions);
    setOptions(options: IQueueOptions): void;
    getTimestamp(): number;
    getBatchOfItems(): T[];
    deleteItemsFromQueue(items: T[]): void;
    emitEvent(event: typeof QUEUE_MANAGER_EVENT_READY | typeof QUEUE_MANAGER_EVENT_STOP): void;
    emitReadyEvent: () => void;
    startInterval(): void;
    clearInterval(): void;
    start(): void;
    stop(): void;
}
export {};
//# sourceMappingURL=queue-manager-class-base.d.ts.map