import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import {
  IStatusedClassHelperOptions,
  TStatusClassHelperStatusChangesEmitter,
  IStatusedClassHelperStatusEmitterEvents,
  IStatusedClassHelper,
} from './statused-class-helper.types';
import assert from 'assert';
import {
  STATUSED_CLASS_HELPER_STATUS_WAITING_TIMEOUT_MS_DEFAULT,
  STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME,
} from './statused-class-helper.const';

export class StatusedClassHelper<StatusChangedEventName extends string, Status extends string>
  implements IStatusedClassHelper<StatusChangedEventName, Status> {
  public get currentStatus(): Status | undefined {
    return this.__currentStatus || undefined;
  }
  protected __currentStatus?: Status;
  /**
   * is this instance ready to use.
   *
   * @protected
   * @type {boolean}
   * @memberof StatusedClassHelper
   */
  protected __isReadyStatusedClassHelper: boolean = false;
  /**
   * Emitter of a status changes.
   * Used for inner purposes mostly.
   *
   * @protected
   * @memberof StatusedClassHelper
   */
  protected __emitterInnerStatusChanged = new EventEmitter<IStatusedClassHelperStatusEmitterEvents<Status>>();
  protected __emitterExternal?: TStatusClassHelperStatusChangesEmitter<StatusChangedEventName, Status>;
  protected __emitterEventStatusChanged?: StatusChangedEventName;

  constructor(options: IStatusedClassHelperOptions<StatusChangedEventName, Status>) {
    this.__validateOptionsStatusClassHelper(options);
    this.__setOptionsStatusClassHelper(options);
    this.__setListenerForStatusChanges();
    this.__setIsReady();
  }
  setStatus(status: Status): void {
    this.__checkIsStatusedClassHelperReady();
    this.__setNewStatus(status);
    this.__emitExternalEmitterNewStatus(status);
  }

  waitTillStatus = async <S extends Status | undefined>(
    currentStatus: S,
    timeoutMs: number = STATUSED_CLASS_HELPER_STATUS_WAITING_TIMEOUT_MS_DEFAULT
  ): Promise<Status | undefined> => {
    this.__checkIsStatusedClassHelperReady();
    if (this.__currentStatus !== currentStatus) {
      return this.__currentStatus;
    }
    return this.__resolveOnCondition((newStatus: Status) => newStatus !== currentStatus, timeoutMs);
  };
  waitForStatus = async <S extends Status | undefined>(
    trgetStatus: S,
    timeoutMs: number = STATUSED_CLASS_HELPER_STATUS_WAITING_TIMEOUT_MS_DEFAULT
  ): Promise<Status | undefined> => {
    this.__checkIsStatusedClassHelperReady();
    if (this.__currentStatus === trgetStatus) {
      return this.__currentStatus;
    }
    return this.__resolveOnCondition((newStatus: Status) => newStatus === trgetStatus, timeoutMs);
  };

  listenForStatusChanged(timeoutMs: number = STATUSED_CLASS_HELPER_STATUS_WAITING_TIMEOUT_MS_DEFAULT) {
    this.__checkIsStatusedClassHelperReady();
    return this.__resolveOnCondition(() => true, timeoutMs);
  }

  clearStatus() {
    this.__clearStatus();
  }

  stopStatusEmitter() {
    this.__clearStatus();
    this.__unsetIsReady();
    this.__clearEventEmitters();
    this.__clearOptions();
  }

  protected __setIsReady(): void {
    this.__isReadyStatusedClassHelper = true;
  }

  protected __unsetIsReady(): void {
    this.__isReadyStatusedClassHelper = false;
  }

  protected __emitStatusChaned(statusName: string): void {
    this.__emitterInnerStatusChanged.emit(STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME, statusName);
  }

  protected __handleEmitterStatusChanged = (statusName: Status): void => {
    this.__setNewStatus(statusName);
    this.__emitStatusChaned(statusName);
  };

  protected __getEmitterEventStatusChanged = (): StatusChangedEventName => {
    const emitterEventStatusChanged = this.__emitterEventStatusChanged;

    if (!emitterEventStatusChanged) {
      throw new Error('emitterEventStatusChanged must not be empty');
    }
    return emitterEventStatusChanged;
  };

  protected __setListenerForStatusChanges(): void {
    this.__emitterExternal?.addListener(this.__getEmitterEventStatusChanged(), this.__handleEmitterStatusChanged);
  }

  protected __validateOptionsStatusClassHelper(options: IStatusedClassHelperOptions<StatusChangedEventName, Status>): void {
    assert(!!options, 'Options must be provided');
    assert(typeof options === 'object', 'Options must be an object');

    const { statusChangedEventName, statusChangesEmitter: statusChanesEmitter } = options;

    assert(!!statusChangedEventName, 'Status changed event name must be provided and not empty');
    assert(typeof statusChangedEventName === 'string', 'Status changed event name must be a string');
    assert(!!statusChanesEmitter, 'An event emitter must be provided for listening an event leads to a status chage');
    assert(typeof statusChanesEmitter === 'object', 'An event emitter instance must be an object');
    assert(typeof statusChanesEmitter.addListener === 'function', 'An event emitter instance must have "addListener" method');
    assert(
      statusChanesEmitter.addListener.length > 0,
      'An event emitter instance must have "addListener" method which accepts an event name'
    );
    assert(typeof statusChanesEmitter.emit === 'function', 'An event emitter instance must have "emit" method');
    assert(
      statusChanesEmitter.emit.length > 1,
      'An event emitter instance must have "emit" method which accepts an event name with a new status'
    );
  }

  protected __setOptionsStatusClassHelper(options: IStatusedClassHelperOptions<StatusChangedEventName, Status>): void {
    this.__emitterEventStatusChanged = options.statusChangedEventName;
    this.__emitterExternal = options.statusChangesEmitter;
  }

  /**
   *  Returns a Promise wich will be resolved
   *  when the resolver callback return true.
   *
   * @param {(status: Status) => boolean} resolver
   * @param {number} [timeoutMs] - if specified than will be rejected after this milliseconds count
   * @returns {Promise<Status>} - promised will be resolved with a new status which is meets the requirements
   * @throws - on timeout if the timeout value specified
   */
  protected __resolveOnCondition = async (resolver: (status: Status) => boolean, timeoutMs?: number): Promise<Status> => {
    return new Promise((res, rej) => {
      let timer: NodeJS.Timeout | undefined;
      const listenerStatusChanged = (newStatus: Status) => {
        if (this.__isReadyStatusedClassHelper) {
          timer && clearTimeout(timer);
          rej(new Error('The instance was closed'));
        }
        if (resolver(newStatus) === true) {
          timer && clearTimeout(timer);
          res(newStatus);
        }
      };

      this.__emitterInnerStatusChanged.once(STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME, listenerStatusChanged);
      if (timeoutMs) {
        timer = setTimeout(() => {
          timer = undefined;
          this.__emitterInnerStatusChanged.removeListener(STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME, listenerStatusChanged);
          rej(new Error(`Timed out waiting for a status`));
        }, timeoutMs);
      }
    });
  };

  /**
   * Checks whether the instance is ready to be used.
   * If not, then throw an error.
   *
   * @protected
   * @memberof StatusedClassHelper
   */
  protected __checkIsStatusedClassHelperReady(): void {
    if (!this.__isReadyStatusedClassHelper) {
      throw new Error('The instance is not ready to be used');
    }
  }

  protected __setNewStatus(statusName: Status): void {
    this.__currentStatus = statusName;
  }

  protected __emitExternalEmitterNewStatus(statusName: Status | undefined): void {
    this.__emitterExternal?.emit(this.__getEmitterEventStatusChanged(), statusName);
  }

  protected __clearEventEmitters(): void {
    this.__emitterExternal?.removeListener(this.__getEmitterEventStatusChanged(), this.__handleEmitterStatusChanged);
    this.__emitterInnerStatusChanged.removeAllListeners();
    (this.__emitterInnerStatusChanged as any) = undefined;
    this.__emitterExternal = undefined;
  }

  protected __clearOptions(): void {
    this.__emitterEventStatusChanged = undefined;
  }

  protected __clearStatus(): void {
    this.__emitExternalEmitterNewStatus(undefined);
    this.__currentStatus = undefined;
  }
}
