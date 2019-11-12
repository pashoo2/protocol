import { ISwarmStoreConnectorOrbitDBOptions } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME = 'database_test';

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_TWO_DATABASE_DB_NAME = 'database_test_2';

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE_DB_NAME = 'database_test_3';

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE: ISwarmStoreConnectorOrbitDBOptions<string> = {
    databases: [{
        dbName: SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
        isPublic: false,
    }],
};

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_ACCESS_CONTROLLER: ISwarmStoreConnectorOrbitDBOptions<string> = {
    databases: [{
        dbName: SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
        isPublic: true,
        grantAcess: async (entity, id) => {
            debugger;
            return true;
        }
    }],
};

const USER_ID_KEY = '____userId';
const TEST_VALUE_KEY = '____test_value';
function promptUserIdAndTestValue() {
    const userIdStored = localStorage.getItem(USER_ID_KEY);

    if (!userIdStored) {
        const userId = String(window.prompt('user id', 'test1'));

        localStorage.setItem(USER_ID_KEY, userId);
    }
    
    const testValueStored = localStorage.getItem(TEST_VALUE_KEY);

    if (!testValueStored) {
        const tstv = String(window.prompt('test value', 'tv'));

        localStorage.setItem(TEST_VALUE_KEY, tstv);
    }
}
promptUserIdAndTestValue();

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE = `${localStorage.getItem(TEST_VALUE_KEY)}${new Date()}`;

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_WITH_IDENTITY = {
    ...SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE,
    id: localStorage.getItem(USER_ID_KEY),
}

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_WITH_IDENTITY_AND_ACCESS_CONTROLLER = {
    ...SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_ACCESS_CONTROLLER,
    id: localStorage.getItem(USER_ID_KEY),

}

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_TWO = {
    dbName: SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_TWO_DATABASE_DB_NAME,
    isPublic: false,
};

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_THREE = {
    dbName: SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE_DB_NAME,
    isPublic: false,
};

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASES: ISwarmStoreConnectorOrbitDBOptions<string> = {
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