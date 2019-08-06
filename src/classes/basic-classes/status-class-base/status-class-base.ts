import { ownValueOf } from 'types/helper.types';
import { TStatusClassBaseOptions } from './status-class-base.types';
import { EventEmitter } from '../event-emitter-class-base/event-emitter-class-base';
import { STATUS_CLASS_STATUS_CHANGE_EVENT } from './status-class-base.const';

export const STATUS_EVENT = STATUS_CLASS_STATUS_CHANGE_EVENT;

export const getStatusClass = <TStatus extends object>({
  errorStatus,
  instanceName,
  initialStatus,
}: TStatusClassBaseOptions<TStatus>) =>
  class StatusClassBase {
    protected static error(err: string | Error): Error {
      let errorInstance: Error;

      if (err instanceof Error) {
        errorInstance = err;
      } else {
        errorInstance = new Error(String(err));
      }
      console.error(instanceName, errorInstance);
      return errorInstance;
    }
    public status?: ownValueOf<TStatus> = initialStatus
      ? initialStatus
      : undefined;

    public errorOccurred?: Error;

    /**
     * emit an events described in
     * TSafeStorageEvents
     * @public
     * @memberof StatusClassBase
     */
    public statusEmitter = new EventEmitter<{
      [STATUS_CLASS_STATUS_CHANGE_EVENT]: TStatus;
    }>();

    protected clearError() {
      this.errorOccurred = undefined;
    }

    protected clearStatus() {
      this.status = undefined;
    }

    protected clearState() {
      this.clearStatus();
      this.clearError();
    }

    /**
     *
     * @param status
     * @returns {Function} - function to set the previous status value
     */
    protected setStatus(status: ownValueOf<TStatus>): () => void {
      const { statusEmitter, status: prevStatus } = this;

      this.status = status;
      statusEmitter.emit(STATUS_CLASS_STATUS_CHANGE_EVENT, status);
      return () => {
        this.status = prevStatus;
      };
    }

    protected setErrorStatus(err: Error | string): Error {
      if (err) {
        const errorOccurred = StatusClassBase.error(err);

        this.errorOccurred = errorOccurred;
        return errorOccurred;
      }
      this.setStatus(errorStatus);
      return new Error('Unknown error');
    }
  };
