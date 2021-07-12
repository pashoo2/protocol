import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME } from './statused-class-helper.const';
export declare type TStatusClassHelperStatusChangesEmitter<SCE extends string, Status extends string> = EventEmitter<{
    [key in SCE]: (status: Status, ...other: any[]) => void;
}>;
export interface IStatusedClassHelperOptions<SCE extends string, Status extends string> {
    statusChangesEmitter: TStatusClassHelperStatusChangesEmitter<SCE, Status>;
    statusChangedEventName: SCE;
}
export interface IStatusedClassHelperStatusEmitterEvents<Status extends string> {
    [STATUSED_CLASS_HELPER_STATUS_CHANGED_EVENT_NAME]: (status: Status | undefined) => void;
}
export interface IStatusedClassHelper<StatusChangedEventName extends string, Status extends string> {
    readonly currentStatus: Status | undefined;
    setStatus(status: Status): void;
    waitTillStatus(status: Status | undefined, timeoutMs?: number): Promise<Status | undefined>;
    waitForStatus(status: Status | undefined, timeoutMs?: number): Promise<Status | undefined>;
    listenForStatusChanged(timeoutMs?: number): Promise<Status | undefined>;
    stopStatusEmitter(): void;
}
//# sourceMappingURL=statused-class-helper.types.d.ts.map