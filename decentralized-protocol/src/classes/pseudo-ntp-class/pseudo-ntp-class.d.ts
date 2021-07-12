/// <reference types="node" />
import { IPseudoNTPClassEvents, IPseudoNTPClassOptions, TPseudoNTPClassServersPoolOption, IPseudoNTPClassServerConnection, IPseudoNTPClassCommonOptionsMilliseconds, TPseudoNTPClassServerResponse } from './pseudo-ntp-class.types';
import { PSEUDO_NTP_CLASS_EVENTS } from './pseudo-ntp-class.const';
import { IHttpRequestOptions } from 'classes/basic-classes/http-request-class-base';
declare const PseudoNTPClass_base: import("../basic-classes/event-emitter-class-base").EventEmitterContructor<IPseudoNTPClassEvents>;
export declare class PseudoNTPClass extends PseudoNTPClass_base {
    static Event: typeof PSEUDO_NTP_CLASS_EVENTS;
    isRunning: boolean;
    protected isSyncInProgress: boolean;
    protected serversPool?: TPseudoNTPClassServersPoolOption;
    protected currentServerIndex?: number;
    protected currentServerOptions?: IPseudoNTPClassServerConnection;
    protected currentServerRequestOptions?: IHttpRequestOptions;
    protected currentServerFails: number;
    protected commonOptions: IPseudoNTPClassCommonOptionsMilliseconds;
    protected intervalRunning?: NodeJS.Timeout;
    constructor(options: IPseudoNTPClassOptions);
    start(): void;
    stop(): void;
    protected log: (message: Error | string) => void;
    protected checkServerOptions(options: any): options is IPseudoNTPClassServerConnection;
    protected setOptions(options: IPseudoNTPClassOptions): void;
    protected setCurrentServerFromPoolIndex(): void;
    protected setCurrentServerRequestOptions(): void | Error;
    protected setCurrentServerFromPoolOptions(): void;
    protected resetCurrentServerDescription(): void;
    protected setCurrentServerFromPool(): void;
    protected sync: () => Promise<void>;
    protected startInterval(): void;
    protected stopInterval(): void;
    protected handleSyncFail(err?: Error): void;
    protected parseServerResponse: (response: TPseudoNTPClassServerResponse) => Error | Date;
    protected emitClientServerTimeDifference(timeDifferenceSeconds: number): void;
    protected handleServerDate(serverDate: Date, timestampReq: number, timestampRes: number, dateRes: Date): void;
    protected convertServerResponseRaw(responseRaw: {
        [key: string]: string;
    }): TPseudoNTPClassServerResponse | Error;
    private handleServerResponse;
    private sendRequestToCurrentServer;
}
export default PseudoNTPClass;
//# sourceMappingURL=pseudo-ntp-class.d.ts.map