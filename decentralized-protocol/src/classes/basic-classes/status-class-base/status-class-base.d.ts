import { ownValueOf } from 'types/helper.types';
import { TStatusClassBaseOptions } from './status-class-base.types';
export declare const STATUS_EVENT = "status";
export declare const getStatusClass: <TStatus extends object>({ errorStatus, instanceName, initialStatus, }: TStatusClassBaseOptions<TStatus>) => {
    new (): {
        status?: ownValueOf<TStatus>;
        errorOccurred?: Error;
        statusEmitter: import("../event-emitter-class-base").EventEmitter<{
            status: TStatus;
        }>;
        clearError(): void;
        clearStatus(): void;
        clearState(): void;
        setStatus: (status: ownValueOf<TStatus>) => (() => void);
        setErrorStatus: (err: Error | string) => Error;
    };
    error(err: string | Error): Error;
};
//# sourceMappingURL=status-class-base.d.ts.map