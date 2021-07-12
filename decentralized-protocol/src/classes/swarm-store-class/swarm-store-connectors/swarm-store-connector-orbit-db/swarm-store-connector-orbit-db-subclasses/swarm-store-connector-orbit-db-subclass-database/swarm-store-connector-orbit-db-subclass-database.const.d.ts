import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from './swarm-store-connector-orbit-db-subclass-database.types';
export declare const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX = "SwarmStoreConnectorOrbitDBDatabase";
export declare enum ESwarmStoreConnectorOrbitDbDatabaseType {
    FEED = "feed_store",
    KEY_VALUE = "key_value"
}
export declare enum ESortFileds {
    TIME = "TIME",
    KEY = "KEY",
    HASH = "HASH",
    USER_ID = "USER_ID"
}
export declare enum EOrbidDBFeedSoreEvents {
    REPLICATED = "replicated",
    REPLICATE_PROGRESS = "replicate.progress",
    LOAD = "load",
    LOAD_PROGRESS = "load.progress",
    READY = "ready",
    CLOSE = "closed",
    WRITE = "write"
}
export declare enum EOrbitDbStoreOperation {
    DELETE = "DEL",
    ADD = "ADD",
    PUT = "PUT"
}
export declare const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION: IStoreOptions;
export declare const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT_DEFAULT = 100;
export declare const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT: {
    limit: number;
};
export declare const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_INT_MS = 300;
export declare const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_SIZE = 20;
export declare const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_PRELOAD_COUNT_MIN = 1;
export declare const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_FILTER_OPTIONS: ESwarmStoreConnectorOrbitDbDatabaseIteratorOption[];
export declare const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_VALUES_GETTER: {
    HASH: (logEntry: LogEntry<any>) => string;
    KEY: (logEntry: LogEntry<any>) => string;
    TIME: (logEntry: LogEntry<any>) => number;
    USER_ID: (logEntry: LogEntry<any>) => string;
};
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-database.const.d.ts.map