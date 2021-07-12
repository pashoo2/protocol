export var EOrbitDbCRUDOperations;
(function (EOrbitDbCRUDOperations) {
    EOrbitDbCRUDOperations["ADD"] = "ADD";
    EOrbitDbCRUDOperations["GET"] = "GET";
    EOrbitDbCRUDOperations["REMOVE"] = "REMOVE";
    EOrbitDbCRUDOperations["ITERATE"] = "ITERATE";
})(EOrbitDbCRUDOperations || (EOrbitDbCRUDOperations = {}));
export const SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_OPERATIONS_DEFAULT_TIMEOUT_MS = 2000;
export const SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_CRUD_OPERATIONS_TIMEOUTS_MS = {
    [EOrbitDbCRUDOperations.ADD]: 3000,
    [EOrbitDbCRUDOperations.GET]: 1000,
    [EOrbitDbCRUDOperations.REMOVE]: 1000,
    [EOrbitDbCRUDOperations.ITERATE]: 30000,
};
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-database-queued.const.js.map