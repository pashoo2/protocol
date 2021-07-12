import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption, } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
export var ESwarmMessageStoreEventNames;
(function (ESwarmMessageStoreEventNames) {
    ESwarmMessageStoreEventNames["NEW_MESSAGE"] = "NEW_MESSAGE";
    ESwarmMessageStoreEventNames["NEW_MESSAGE_ERROR"] = "NEW_MESSAGE_ERROR";
    ESwarmMessageStoreEventNames["DELETE_MESSAGE"] = "DELETE_MESSAGE";
})(ESwarmMessageStoreEventNames || (ESwarmMessageStoreEventNames = {}));
export const SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT_LIMIT = 200;
export const SWARM_MESSAGE_STORE_CONNECTOR_DATABASE_TYPE_DEFAULT = ESwarmStoreConnectorOrbitDbDatabaseType.FEED;
export const SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT = {
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT_LIMIT,
};
//# sourceMappingURL=swarm-message-store.const.js.map