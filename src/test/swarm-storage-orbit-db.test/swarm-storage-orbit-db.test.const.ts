import { ISwarmStoreConnectorOrbitDBOptions } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';

export const SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE: ISwarmStoreConnectorOrbitDBOptions = {
    databases: [{
        dbName: 'daabase_test',
        isPublic: false,
    }],
};