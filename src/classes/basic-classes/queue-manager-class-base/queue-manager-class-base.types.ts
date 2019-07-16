import {
  QUEUE_MANAGER_EVENT_READY,
  QUEUE_MANAGER_EVENT_STOP,
  QUEUE_MANAGER_EVENT_START,
} from './queue-manager-class-base.const';

export type TQueue<T> = T[]; // a queue of an items

export type TMaxItemsInBatch = number | void; // a maximum number items in one batch when emit a READY event

export type TIntervalEmitReadyMs = number; // interval in milliseconds each time emit the 'ready' event

export type TLastEmitReadyTimestamp = number; // timestamp when the last 'ready' event was emitted

export interface IQueueOptions {
  intervalMs: TIntervalEmitReadyMs;
  itemsInBatch?: TMaxItemsInBatch;
}

export type TQueueManagerEvents<T> = {
  // emit a list of an items rready to be processed
  [QUEUE_MANAGER_EVENT_READY]: T[];
  // emit the last list of an items to be processed
  // before the instance will be stopped
  [QUEUE_MANAGER_EVENT_STOP]: T[];
  //emit this event after the instance has
  // started successfully
  [QUEUE_MANAGER_EVENT_START]: void;
};
