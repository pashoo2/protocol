import { ownValueOf } from 'types/helper.types';
import { TStatusClassBaseOptions } from './status-class-base.types';

export const getStatusClass = <TStatus extends object>({
  errorStatus,
  instanceName,
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
    public status?: ownValueOf<TStatus> = undefined;

    public errorOccurred?: Error;

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

    protected setStatus(status: ownValueOf<TStatus>) {
      this.status = status;
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
