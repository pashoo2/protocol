import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from './swarm-store-connector-orbit-db-subclass-database.types';
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX = 'SwarmStoreConnectorOrbitDBDatabase';
export var ESwarmStoreConnectorOrbitDbDatabaseType;
(function (ESwarmStoreConnectorOrbitDbDatabaseType) {
    ESwarmStoreConnectorOrbitDbDatabaseType["FEED"] = "feed_store";
    ESwarmStoreConnectorOrbitDbDatabaseType["KEY_VALUE"] = "key_value";
})(ESwarmStoreConnectorOrbitDbDatabaseType || (ESwarmStoreConnectorOrbitDbDatabaseType = {}));
export var ESortFileds;
(function (ESortFileds) {
    ESortFileds["TIME"] = "TIME";
    ESortFileds["KEY"] = "KEY";
    ESortFileds["HASH"] = "HASH";
    ESortFileds["USER_ID"] = "USER_ID";
})(ESortFileds || (ESortFileds = {}));
export var EOrbidDBFeedSoreEvents;
(function (EOrbidDBFeedSoreEvents) {
    EOrbidDBFeedSoreEvents["REPLICATED"] = "replicated";
    EOrbidDBFeedSoreEvents["REPLICATE_PROGRESS"] = "replicate.progress";
    EOrbidDBFeedSoreEvents["LOAD"] = "load";
    EOrbidDBFeedSoreEvents["LOAD_PROGRESS"] = "load.progress";
    EOrbidDBFeedSoreEvents["READY"] = "ready";
    EOrbidDBFeedSoreEvents["CLOSE"] = "closed";
    EOrbidDBFeedSoreEvents["WRITE"] = "write";
})(EOrbidDBFeedSoreEvents || (EOrbidDBFeedSoreEvents = {}));
export var EOrbitDbStoreOperation;
(function (EOrbitDbStoreOperation) {
    EOrbitDbStoreOperation["DELETE"] = "DEL";
    EOrbitDbStoreOperation["ADD"] = "ADD";
    EOrbitDbStoreOperation["PUT"] = "PUT";
})(EOrbitDbStoreOperation || (EOrbitDbStoreOperation = {}));
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_CONFIGURATION = {
    localOnly: false,
    create: true,
    replicate: true,
};
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT_DEFAULT = 100;
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_OPTIONS_DEFAULT = {
    limit: SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ENTITIES_LOAD_COUNT_DEFAULT,
};
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_INT_MS = 300;
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_EMIT_BATCH_SIZE = 20;
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_PRELOAD_COUNT_MIN = 1;
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_FILTER_OPTIONS = [
    ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gt,
    ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gtT,
    ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gte,
    ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lt,
    ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.ltT,
    ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lte,
    ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.neq,
    ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq,
];
export const SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_ITERATOR_VALUES_GETTER = {
    [ESortFileds.HASH]: (logEntry) => logEntry.hash,
    [ESortFileds.KEY]: (logEntry) => logEntry.payload.key,
    [ESortFileds.TIME]: (logEntry) => logEntry.clock.time,
    [ESortFileds.USER_ID]: (logEntry) => logEntry.identity.id,
};
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-database.const.js.map