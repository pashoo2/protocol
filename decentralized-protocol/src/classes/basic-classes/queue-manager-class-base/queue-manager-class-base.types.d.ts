import { QUEUE_MANAGER_EVENT_READY, QUEUE_MANAGER_EVENT_STOP, QUEUE_MANAGER_EVENT_START } from './queue-manager-class-base.const';
export declare type TQueue<T> = T[];
export declare type TMaxItemsInBatch = number | void;
export declare type TIntervalEmitReadyMs = number;
export declare type TLastEmitReadyTimestamp = number;
export interface IQueueOptions {
    intervalMs: TIntervalEmitReadyMs;
    itemsInBatch?: TMaxItemsInBatch;
}
export declare type TQueueManagerEvents<T> = {
    [QUEUE_MANAGER_EVENT_READY]: T[];
    [QUEUE_MANAGER_EVENT_STOP]: T[];
    [QUEUE_MANAGER_EVENT_START]: void;
};
//# sourceMappingURL=queue-manager-class-base.types.d.ts.map