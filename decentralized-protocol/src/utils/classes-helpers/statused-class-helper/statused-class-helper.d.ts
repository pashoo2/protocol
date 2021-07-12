import { IStatusedClassHelperOptions, TStatusClassHelperStatusChangesEmitter, IStatusedClassHelperStatusEmitterEvents, IStatusedClassHelper } from './statused-class-helper.types';
import { EventEmitter } from '../../../classes/basic-classes/event-emitter-class-base/event-emitter-class-base.types';
export declare class StatusedClassHelper<StatusChangedEventName extends string, Status extends string> implements IStatusedClassHelper<StatusChangedEventName, Status> {
    get currentStatus(): Status | undefined;
    protected __currentStatus?: Status;
    protected __isReadyStatusedClassHelper: boolean;
    protected __emitterInnerStatusChanged: EventEmitter<IStatusedClassHelperStatusEmitterEvents<Status>>;
    protected __emitterExternal?: TStatusClassHelperStatusChangesEmitter<StatusChangedEventName, Status>;
    protected __emitterEventStatusChanged?: StatusChangedEventName;
    constructor(options: IStatusedClassHelperOptions<StatusChangedEventName, Status>);
    setStatus(status: Status): void;
    waitTillStatus: <S extends Status>(currentStatus: S, timeoutMs?: number) => Promise<Status | undefined>;
    waitForStatus: <S extends Status>(trgetStatus: S, timeoutMs?: number) => Promise<Status | undefined>;
    listenForStatusChanged(timeoutMs?: number): Promise<Status>;
    clearStatus(): void;
    stopStatusEmitter(): void;
    protected __setIsReady(): void;
    protected __unsetIsReady(): void;
    protected __emitStatusChaned(statusName: string): void;
    protected __handleEmitterStatusChanged: (statusName: Status) => void;
    protected __getEmitterEventStatusChanged: () => StatusChangedEventName;
    protected __setListenerForStatusChanges(): void;
    protected __validateOptionsStatusClassHelper(options: IStatusedClassHelperOptions<StatusChangedEventName, Status>): void;
    protected __setOptionsStatusClassHelper(options: IStatusedClassHelperOptions<StatusChangedEventName, Status>): void;
    protected __resolveOnCondition: (resolver: (status: Status) => boolean, timeoutMs?: number) => Promise<Status>;
    protected __checkIsStatusedClassHelperReady(): void;
    protected __setNewStatus(statusName: Status): void;
    protected __emitExternalEmitterNewStatus(statusName: Status | undefined): void;
    protected __clearEventEmitters(): void;
    protected __clearOptions(): void;
    protected __clearStatus(): void;
}
//# sourceMappingURL=statused-class-helper.d.ts.map