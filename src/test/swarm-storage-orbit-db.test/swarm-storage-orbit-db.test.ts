import { IPFS } from 'types/ipfs.types';
import ipfs from 'ipfs';
import { expect, assert } from 'chai';
import { SwarmStoreConnectorOrbitDB } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db';
import { 
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE, 
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_TWO_DATABASE_DB_NAME,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE_DB_NAME,
 } from './swarm-storage-orbit-db.test.const';
import { SWARM_CONNECTION_OPTIONS } from 'test/ipfs-swarm-connection.test/ipfs-swarm-connection.const';
import { SwarmConnection } from 'classes/swarm-connection-class/swarm-connection-class';
import { ESwarmStoreConnectorOrbitDBEventNames } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.const';
import { ISwarmStoreConnectorOrbitDbDatabaseValue } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON } from 'const/common-values/common-values';

export const testDatabase = async (
    connection: SwarmStoreConnectorOrbitDB<string>,
    dbName: string,
) => {
    const addValueHash = await connection.request(
        dbName,
        'add',
        SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE,
    )

    expect(addValueHash).to.be.a('string');
   
    const getValueByHashResult: ISwarmStoreConnectorOrbitDbDatabaseValue<string> = await connection.request(
        dbName,
        'get',
        addValueHash,
    );
   
    expect(getValueByHashResult.id).to.be.equal((connection as any).orbitDb.identity.id);
    expect(getValueByHashResult.hash).to.be.equal(addValueHash);
    expect(getValueByHashResult.value).to.be.equal(SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE);
   
    await expect(connection.request(
        dbName,
        'remove',
        addValueHash,
    )).eventually.not.rejected.not.be.an('error');

    const getValueByHashAfterRemoveResult = await connection.request(
        dbName,
        'get',
        addValueHash,
    );
    
    assert(getValueByHashAfterRemoveResult == null, 'The value removed before must be empty');
}

export const runTestSwarmStoreOrbitDBConnection = async () => {
    describe('swarm connection:: ipfs', () => {
        let ipfsConnection: IPFS | undefined;

        beforeEach(async function () {
            this.timeout(60000);
            const swarmConnection = new SwarmConnection();

            expect(swarmConnection).to.be.an.instanceof(SwarmConnection);
            await assert.becomes(swarmConnection.connect(SWARM_CONNECTION_OPTIONS), true, '');
            expect(swarmConnection.isConnected).to.equal(true);

            ipfsConnection = swarmConnection.getNativeConnection();

            expect(ipfsConnection).to.be.an.instanceof(ipfs);
        });

        it('create swarm store OrbitDB connector - 3 databases', async () => {
            expect(ipfsConnection).to.be.an.instanceof(ipfs);

            const connection = new SwarmStoreConnectorOrbitDB<string>(
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE);

            expect(connection).to.be.an.instanceof(SwarmStoreConnectorOrbitDB);
            expect(connection.connect).to.be.a('function');
            
            let fullProgressEmitted: boolean = false;
            let readyEmitted: string[] = [];

            connection.on(ESwarmStoreConnectorOrbitDBEventNames.LOADING, (loadingProgress: number) => {
                if (loadingProgress === 100) {
                    fullProgressEmitted = true;
                }
            });
            connection.on(ESwarmStoreConnectorOrbitDBEventNames.READY, (dbName: string) => {
                if (dbName) {
                    readyEmitted.push(dbName);
                }
            });

            await expect(connection.connect({
                ipfs: ipfsConnection!,
            })).to.be.not.eventually.an.instanceof(Error);

            expect(connection.isClosed).to.be.equal(false);
            expect(connection.isReady).to.be.equal(true);
            assert((fullProgressEmitted as boolean) === true, 'The event 100% loading progress does not emitted')
            expect(readyEmitted)
                .to.be.an('array')
                .that.include.all.members(
                    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE.databases.map(db => db.dbName)
                );
            
            await testDatabase(
                connection,
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
            );
            await testDatabase(
                connection,
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_TWO_DATABASE_DB_NAME,
            );
            await testDatabase(
                connection,
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE_DB_NAME,
            );

            let isCloseEmitted: boolean = false;

            connection[COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON](ESwarmStoreConnectorOrbitDBEventNames.CLOSE, () => {
                isCloseEmitted = true;
            });

            await expect(connection.close()).to.eventually.be.undefined;

            assert((isCloseEmitted as boolean) === true, 'The close event must be emitted on SwarmStoreConnector close');

            const addValueHashAfterClose = await connection.request(
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
                'add',
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE,
            )
        
            expect(addValueHashAfterClose).to.be.an('error');
        }).timeout(70000);
    })
};