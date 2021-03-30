import { ownValueOf } from 'types/helper.types';
import { TStatusClassBaseOptions } from './status-class-base.types';
import { STATUS_CLASS_STATUS_CHANGE_EVENT } from './status-class-base.const';
import { getEventEmitterInstance } from '../event-emitter-class-base/event-emitter-class-base';

export const STATUS_EVENT = STATUS_CLASS_STATUS_CHANGE_EVENT;

export const getStatusClass = <TStatus extends object>({
  errorStatus,
  instanceName,
  initialStatus,
}: TStatusClassBaseOptions<TStatus>) =>
  class StatusClassBase {
    public static error(err: string | Error): Error {
      let errorInstance: Error;

      if (err instanceof Error) {
        errorInstance = err;
      } else {
        errorInstance = new Error(String(err));
      }
      console.error(instanceName, errorInstance);
      return errorInstance;
    }
    public status?: ownValueOf<TStatus> = initialStatus ? initialStatus : undefined;

    public errorOccurred?: Error;

    /**
     * emit an events described in
     * TSafeStorageEvents
     * @public
     * @memberof StatusClassBase
     */
    public statusEmitter = getEventEmitterInstance<{
      ['status']: TStatus;
    }>();

    public clearError() {
      this.errorOccurred = undefined;
    }

    public clearStatus() {
      this.status = undefined;
    }

    public clearState() {
      this.clearStatus();
      this.clearError();
    }

    /**
     *
     * @param status
     * @returns {Function} - function to set the previous status value
     */
    public setStatus = (status: ownValueOf<TStatus>): (() => void) => {
      const { statusEmitter, status: prevStatus } = this;

      this.status = status;
      statusEmitter.emit('status', status);
      return () => {
        this.status = prevStatus;
      };
    };

    public setErrorStatus = (err: Error | string): Error => {
      if (err) {
        const errorOccurred = StatusClassBase.error(err);

        this.errorOccurred = errorOccurred;
        return errorOccurred;
      }
      this.setStatus(errorStatus);
      return new Error('Unknown error');
    };
  };
