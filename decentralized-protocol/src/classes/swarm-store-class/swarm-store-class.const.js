import { SwarmStoreConnectorOrbitDB } from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db';
export var ESwarmStoreConnector;
(function (ESwarmStoreConnector) {
    ESwarmStoreConnector["OrbitDB"] = "OrbitDB";
})(ESwarmStoreConnector || (ESwarmStoreConnector = {}));
export var ESwarmStoreEventNames;
(function (ESwarmStoreEventNames) {
    ESwarmStoreEventNames["CONNECTING"] = "CONNECTING";
    ESwarmStoreEventNames["STATE_CHANGE"] = "STATE_CHANGE";
    ESwarmStoreEventNames["UPDATE"] = "UPDATE";
    ESwarmStoreEventNames["READY"] = "READY";
    ESwarmStoreEventNames["CLOSE"] = "CLOSE";
    ESwarmStoreEventNames["CLOSE_DATABASE"] = "CLOSE_DATABASE";
    ESwarmStoreEventNames["LOADING"] = "LOADING";
    ESwarmStoreEventNames["DB_LOADING"] = "DB_LOADING";
    ESwarmStoreEventNames["ERROR"] = "error";
    ESwarmStoreEventNames["FATAL"] = "fatal";
    ESwarmStoreEventNames["NEW_ENTRY"] = "NEW_ENTRY";
    ESwarmStoreEventNames["DATABASES_LIST_UPDATED"] = "DATABASES_LIST_UPDATED";
    ESwarmStoreEventNames["DROP_DATABASE"] = "DROP_DATABASE";
})(ESwarmStoreEventNames || (ESwarmStoreEventNames = {}));
export var ESwarmStoreDbStatus;
(function (ESwarmStoreDbStatus) {
    ESwarmStoreDbStatus["UPDATE"] = "UPDATE";
    ESwarmStoreDbStatus["READY"] = "READY";
    ESwarmStoreDbStatus["CLOSE"] = "CLOSE_DATABASE";
    ESwarmStoreDbStatus["LOADING"] = "LOADING";
    ESwarmStoreDbStatus["LOADED"] = "LOADED";
    ESwarmStoreDbStatus["EMPTY"] = "EMPTY";
})(ESwarmStoreDbStatus || (ESwarmStoreDbStatus = {}));
export const SWARM_STORE_DATABASE_STATUS_ABSENT = undefined;
export const SWARM_STORE_DATABASES_STATUSES_EMPTY = {};
export const SWARM_STORE_CONNECTORS = {
    [ESwarmStoreConnector.OrbitDB]: SwarmStoreConnectorOrbitDB,
};
//# sourceMappingURL=swarm-store-class.const.js.map