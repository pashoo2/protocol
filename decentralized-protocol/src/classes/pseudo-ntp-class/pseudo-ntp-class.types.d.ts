import { PSEUDO_NTP_CLASS_EVENTS } from './pseudo-ntp-class.const';
export declare type TPseudoNTPClassResponseRaw = any;
export declare type TPseudoNTPClassResponseWithTimestamps = {
    timestampReq: number;
    timestampRes: number;
    dateRes: Date;
    responseRaw: TPseudoNTPClassResponseRaw;
};
export interface IPseudoNTPClassEvents {
    [PSEUDO_NTP_CLASS_EVENTS.TIME_SYNC]: number;
}
export declare type TPseudoNTPClassServerResponse = string | {
    [key: string]: any;
};
export interface IPseudoNTPClassServerConnectionField {
    server: string;
    fieldName: string;
}
export interface IPseudoNTPClassServerConnectionCb {
    server: string;
    parseCallback: (response: TPseudoNTPClassServerResponse) => Date | Error;
}
export declare type IPseudoNTPClassServerConnection = IPseudoNTPClassServerConnectionCb | IPseudoNTPClassServerConnectionField;
export declare type TPseudoNTPClassServersPoolOption = IPseudoNTPClassServerConnection[];
export interface IPseudoNTPClassCommonOptions {
    syncIntervalS?: number;
    maxFailedResponses?: number;
    retryRequestDelayS?: number;
    responseTimeoutS?: number;
    maxOffsetErrorS?: number;
}
export interface IPseudoNTPClassCommonOptionsMilliseconds {
    syncIntervalMs: number;
    maxFailedResponses: number;
    retryRequestDelayMs: number;
    responseTimeoutMs: number;
    maxOffsetErrorS: number;
}
export interface IPseudoNTPClassOptions extends IPseudoNTPClassCommonOptions {
    serversPool: TPseudoNTPClassServersPoolOption;
}
//# sourceMappingURL=pseudo-ntp-class.types.d.ts.map