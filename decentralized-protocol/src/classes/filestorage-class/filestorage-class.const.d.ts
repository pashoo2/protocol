export declare enum FILE_STORAGE_SERVICE_STATUS {
    READY = "READY",
    CONNECTING = "CONNECTING",
    NOT_READY = "NOT_READY",
    ERROR = "ERROR"
}
export declare enum FILE_STORAGE_SERVICE_TYPE {
    IPFS = "IPFS",
    HTTP = "HTTP"
}
export declare const FILE_STORAGE_SERVICES_IMPLEMENTATIONS: Record<FILE_STORAGE_SERVICE_TYPE, () => Promise<any>>;
export declare const FILE_STORAGE_SERVICE_PREFIX = "/file";
export declare const FILE_STORAGE_SERVICE_PREFIX_LENGTH: number;
//# sourceMappingURL=filestorage-class.const.d.ts.map