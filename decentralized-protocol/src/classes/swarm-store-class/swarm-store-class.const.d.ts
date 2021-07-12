import { SwarmStoreConnectorOrbitDB } from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db';
import { ISwarmStoreDatabasesStatuses } from './swarm-store-class.types';
export declare enum ESwarmStoreConnector {
    OrbitDB = "OrbitDB"
}
export declare enum ESwarmStoreEventNames {
    CONNECTING = "CONNECTING",
    STATE_CHANGE = "STATE_CHANGE",
    UPDATE = "UPDATE",
    READY = "READY",
    CLOSE = "CLOSE",
    CLOSE_DATABASE = "CLOSE_DATABASE",
    LOADING = "LOADING",
    DB_LOADING = "DB_LOADING",
    ERROR = "error",
    FATAL = "fatal",
    NEW_ENTRY = "NEW_ENTRY",
    DATABASES_LIST_UPDATED = "DATABASES_LIST_UPDATED",
    DROP_DATABASE = "DROP_DATABASE"
}
export declare enum ESwarmStoreDbStatus {
    UPDATE = "UPDATE",
    READY = "READY",
    CLOSE = "CLOSE_DATABASE",
    LOADING = "LOADING",
    LOADED = "LOADED",
    EMPTY = "EMPTY"
}
export declare const SWARM_STORE_DATABASE_STATUS_ABSENT: any;
export declare const SWARM_STORE_DATABASES_STATUSES_EMPTY: ISwarmStoreDatabasesStatuses;
export declare const SWARM_STORE_CONNECTORS: {
    OrbitDB: typeof SwarmStoreConnectorOrbitDB;
};
//# sourceMappingURL=swarm-store-class.const.d.ts.map