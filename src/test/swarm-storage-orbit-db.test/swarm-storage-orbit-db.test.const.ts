import { ISwarmStoreConnectorOrbitDBOptions } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME = 'database_test';

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_TWO_DATABASE_DB_NAME = 'database_test_2';

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE_DB_NAME = 'database_test_3';

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE: ISwarmStoreConnectorOrbitDBOptions = {
    databases: [{
        dbName: SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
        isPublic: false,
    }],
};

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_TWO = {
    dbName: SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_TWO_DATABASE_DB_NAME,
    isPublic: false,
};

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_THREE = {
    dbName: SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE_DB_NAME,
    isPublic: false,
};

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASES: ISwarmStoreConnectorOrbitDBOptions = {
    databases: [
        {
            dbName: SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
            isPublic: false,
        },
        {
            ...SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_TWO,
        },
        {
            ...SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_THREE,
        },
    ],
};

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE = 'database_test_value';