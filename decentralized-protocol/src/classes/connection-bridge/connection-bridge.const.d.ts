import { ICentralAuthorityOptions } from '../central-authority-class/central-authority-class.types';
import { ISerializer } from '../../types/serialization.types';
export declare const CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT = "_//_";
export declare const CONNECTION_BRIDGE_DEFAULT_SERIALIZER: ISerializer;
export declare enum CONNECTION_BRIDGE_SESSION_STORAGE_KEYS {
    USER_LOGIN = "CONNECTION_BRIDGE_SESSION_STORAGE_KEYS_USER_LOGIN",
    SESSION_DATA_AVAILABLE = "CONNECTION_BRIDGE_SESSION_STORAGE_KEYS_SESSION_DATA_AVAILABLE"
}
export declare enum CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX {
    MESSAGE_CACHE_STORAGE = "__MESSAGE_CACHE_STORAGE",
    CONNECTION_SESSION_DATA_STORAGE = "__USER_DATA_STORAGE",
    DATABASE_LIST_STORAGE = "__DATABASE_LIST_STORAGE",
    SECRET_STORAGE = "__SECRET_STORAGE"
}
export declare enum CONNECTION_BRIDGE_STORAGE_DATABASE_NAME {
    MESSAGE_CACHE_STORAGE = "_CONNECTION_BRIDGE"
}
export declare const CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_PROTOCOL: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
};
export declare const CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL_FIREBASE_DB_WATCHA: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
};
export declare const CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL: ICentralAuthorityOptions['authProvidersPool'];
export declare const CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE: {
    storagePrefix: CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX;
};
//# sourceMappingURL=connection-bridge.const.d.ts.map