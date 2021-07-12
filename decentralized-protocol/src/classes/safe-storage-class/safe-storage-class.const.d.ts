export declare const SAFE_STORAGE_STORAGE_NAME_COMMON_PREFIX = "__safe_storage__";
export declare const SAFE_STORAGE_STORAGE_APPEND_LOG_COMMON_POSTFIX = "__append_log";
export declare const SAFE_STORAGE_ATTEMPTS_TO_SAVE_DATA_TO_STORAGE = 4;
export declare const SAFE_STORAGE_DEFAULT_DUMP_INTERVAL_MS = 1000;
export declare const SAFE_STORAGE_DEFAULT_STORAGE_BUSY_TIMEOUT_MS = 10000;
export declare const SAFE_STORAGE_PARSE_DATA_ERROR_TRY_TO_DECODE = "Unexpected token %";
export declare const SAFE_STORAGE_MAX_ITEMS_APPEND_LOG = 200;
export declare const SAFE_STORAGE_DUMP_PROVIDERS: {
    LOCAL_STORAGE: string;
    SESSION_STORAGE: string;
    LEVEL_JS: string;
    LOCAL_FORAGE: string;
};
export declare const SAFE_STORAGE_DUMP_PROVIDER_DEFAULT: string;
export declare enum ESAFE_STORAGE_PROVIDER_STATUS {
    NEW = "NEW",
    CONNECTING_TO_STORAGE = "CONNECTING_TO_STORAGE",
    CONNECTED_TO_STORAGE = "CONNECTED_TO_STORAGE",
    READY = "READY",
    WORKING_WITH_STORAGE = "WORKING_WITH_STORAGE",
    DISCONNECTED = "DISCONNECTED",
    ERROR = "ERROR"
}
export declare enum ESAFE_STORAGE_RETURN_TYPE {
    STRING = "STRING",
    NUMBER = "NUMBER",
    OBJECT = "OBJECT"
}
export declare enum ESAFE_STORAGE_STORAGE_TYPE {
    KEY_VALUE = "KEY_VALUE",
    APPEND_LOG = "APPEND_LOG"
}
export declare const SAFE_STORAGE_APPEND_LOG_INITIAL_VALUE: any[];
export declare const SAFE_STORAGE_KEY_VALUE_INITIAL_VALUE: {};
export declare const SAFE_STORAGE_APPEND_LOG_APPEND_DATA_INITIAL_VALUE: any[];
export declare const SAFE_STORAGE_KEY_VALUE_APPEND_DATA_INITIAL_VALUE: {};
//# sourceMappingURL=safe-storage-class.const.d.ts.map