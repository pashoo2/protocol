import { IPFS } from 'types/ipfs.types';
import ipfs from 'ipfs';
import { expect, assert } from 'chai';
import { SwarmStoreConnectorOrbitDB } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db';
import { SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE, SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME, SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE } from './swarm-storage-orbit-db.test.const';
import { SWARM_CONNECTION_OPTIONS } from 'test/ipfs-swarm-connection.test/ipfs-swarm-connection.const';
import { SwarmConnection } from 'classes/swarm-connection-class/swarm-connection-class';
import { ESwarmStoreConnectorOrbitDBEventNames } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.const';
import { ISwarmStoreConnectorOrbitDbDatabaseValue } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';

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


        it('create swarm store OrbitDB connector', async () => {
            expect(ipfsConnection).to.be.an.instanceof(ipfs);

            const connection = new SwarmStoreConnectorOrbitDB(SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE);

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
            expect(readyEmitted).to.be.an('array').that.include.all.members(SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE.databases.map(db => db.dbName));
            
            // TODO
            // const addValueHash = await connection.request(
            //     SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
            //     'add',
            //     SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE,
            // )

            // expect(addValueHash).to.be.a('string');
            //     debugger
            const addValueHash = 'zdpuAvEeSx2hntsCMHDvnmcD8cR5yBALqAMryUJ9SwFKt1aUS';
            const getValueByHashResult: ISwarmStoreConnectorOrbitDbDatabaseValue<string> = await connection.request(
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
                'get',
                addValueHash,
            );
    
            debugger
            expect(getValueByHashResult.id).to.be.equal((connection as any).orbitDb.identity.id);
            expect(getValueByHashResult.hash).to.be.equal(addValueHash);
            expect(getValueByHashResult.value).to.be.equal(SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE);
            debugger
            // await expect(connection.request(
            //     SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
            //     'remove',
            //     addValueHash,
            // )).eventually.not.rejected.not.be.an('error');

            // const getValueByHashAfterRemoveResult = await connection.request(
            //     SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
            //     'get',
            //     addValueHash,
            // );
            // debugger
            // expect(getValueByHashAfterRemoveResult).not.to.be.a('string');
        }).timeout(60000);
    })
};