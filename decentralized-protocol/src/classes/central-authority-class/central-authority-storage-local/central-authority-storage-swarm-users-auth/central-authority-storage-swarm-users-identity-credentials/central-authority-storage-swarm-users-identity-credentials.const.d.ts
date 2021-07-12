import { IOpenStorageConfiguration } from './../../../../open-storage/open-storage.types';
export declare const CA_IDENTITY_CREDENTIALS_STORAGE_NAME_OPTIONS_MAX_LENGTH = 30;
export declare const CA_IDENTITY_CREDENTIALS_STORAGE_NAME = "_CICS";
export declare const CA_IDENTITY_CREDENTIALS_STORAGE_VERSION = "01";
export declare const CA_IDENTITY_CREDENTIALS_STORAGE_FULL_NAME: string;
export declare const CA_IDENTITY_CREDENTIALS_STORAGE_STATUS: {
    NEW: string;
    CONNECTING: string;
    CONNECTED: string;
    CONNECTION_FAILED: string;
    ERROR: string;
    PENDING: string;
    DISCONNECTED: string;
};
export declare const CA_IDENTITY_CREDENTIALS_STORAGE_DATABASE_NAME = "CA_IDENTITY_CREDENTIALS_STORAGE";
export declare const CA_IDENTITY_CREDENTIALS_STORAGE_CONFIGURATION: IOpenStorageConfiguration;
export declare const CA_IDENTITY_CREDENTIALS_STORAGE_READ_CACHE_CAPACITY = 300;
export declare const CA_IDENTITY_CREDENTIALS_STORAGE_READ_RAW_CACHE_CAPACITY = 2000;
//# sourceMappingURL=central-authority-storage-swarm-users-identity-credentials.const.d.ts.map