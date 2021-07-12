import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
export declare enum ESwarmMessageStoreEventNames {
    NEW_MESSAGE = "NEW_MESSAGE",
    NEW_MESSAGE_ERROR = "NEW_MESSAGE_ERROR",
    DELETE_MESSAGE = "DELETE_MESSAGE"
}
export declare const SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT_LIMIT = 200;
export declare const SWARM_MESSAGE_STORE_CONNECTOR_DATABASE_TYPE_DEFAULT = ESwarmStoreConnectorOrbitDbDatabaseType.FEED;
export declare const SWARM_MESSAGE_STORE_CONNECTOR_ORBIT_DB_ITERATOR_OPTIONS_DEFAULT: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<ESwarmStoreConnectorOrbitDbDatabaseType.FEED>;
//# sourceMappingURL=swarm-message-store.const.d.ts.map