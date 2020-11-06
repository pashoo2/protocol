import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import { STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME } from './statused-class-helper.const';

export type TStatusClassHelperStatusChangesEmitter<SCE extends string, Status extends string> = EventEmitter<
  { [key in SCE]: (status: Status, ...other: any[]) => void }
>;

export interface IStatusedClassHelperOptions<SCE extends string, Status extends string> {
  statusChangesEmitter: TStatusClassHelperStatusChangesEmitter<SCE, Status>;
  statusChangedEventName: SCE;
}

/**
 * Events which can be emitted by the inner events emitter
 *
 * @export
 * @interface IStatusedClassHelperStatusEmitterEvents
 * @template Status
 */
export interface IStatusedClassHelperStatusEmitterEvents<Status extends string> {
  /**
   * Status changed event, emits with a new status value
   * or undefined if the instance status was cleared.
   *
   * @memberof IStatusedClassHelperStatusEmitterEvents
   */
  [STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME]: (status: Status | undefined) => void;
}

export interface IStatusedClassHelper<StatusChangedEventName extends string, Status extends string> {
  /**
   * The current status of the instance
   * or undefined if there is no status.
   *
   * @type {(Status | undefined)}
   * @memberof IStatusedClassHelper
   */
  readonly currentStatus: Status | undefined;
  /**
   * Set the current status value and
   * emit an event on the external
   * emitter, that the current
   * status was changed.
   *
   * @param {Status} status
   * @memberof IStatusedClassHelper
   * @throws - e.g. the instance is not ready
   */
  setStatus(status: Status): void;
  /**
   * Retruns a promise which will be resolved
   * when the current status changed from the status provided.
   *
   * @param {(Status | undefined)} status - waiting till the current status value won't changed on something else.
   * @param {number} [timeoutMs = STATUSED_CLASS_HELPER_STATUS_WAITING_TIMEOUT_MS_DEFAULT] - timeout in milliseconds, if not specified the default value will be used
   * @returns {(Promise<Status | undefined>)}
   * @memberof IStatusedClassHelper
   * @throws - e.g. if a status won't change within the time specified
   */
  waitTillStatus(status: Status | undefined, timeoutMs?: number): Promise<Status | undefined>;
  /**
   * Retruns a promise which will be resolved
   * when the current status changed to the target value.
   *
   * @param {(Status | undefined)} status - waiting till the current status value won't changed on the provided.
   * @param {number} [timeoutMs = STATUSED_CLASS_HELPER_STATUS_WAITING_TIMEOUT_MS_DEFAULT] - timeout in milliseconds, if not specified the default value will be used
   * @returns {(Promise<Status | undefined>)}
   * @memberof IStatusedClassHelper
   * @throws - e.g. if a status won't change within the time specified
   */
  waitForStatus(status: Status | undefined, timeoutMs?: number): Promise<Status | undefined>;

  /**
   * Returns a promise which will be resolved
   * when the instance's status changed
   * to another value.
   *
   * @param {number} [timeoutMs=STATUSED_CLASS_HELPER_STATUS_WAITING_TIMEOUT_MS_DEFAULT] - will be rejected after this timeout
   * @returns {(Promise<Status | undefined>)}
   * @memberof IStatusedClassHelper
   * @throws
   */
  listenForStatusChanged(timeoutMs?: number): Promise<Status | undefined>;

  /**
   * Release all emitters and stop listening for events.
   *
   * @memberof IStatusedClassHelper
   */
  stopStatusEmitter(): void;
}
