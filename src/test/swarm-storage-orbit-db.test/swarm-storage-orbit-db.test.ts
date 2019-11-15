import { IPFS } from 'types/ipfs.types';
import ipfs from 'ipfs';
import { expect, assert } from 'chai';
import { SwarmStoreConnectorOrbitDB } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db';
import { 
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE, 
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASES,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_TWO_DATABASE_DB_NAME,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE_DB_NAME,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_TWO,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_THREE,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_WITH_IDENTITY,
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_WITH_IDENTITY_AND_ACCESS_CONTROLLER,
    SWARM_STORE_CONNECTOR_TEST_SUBCLASS_SECRET_STORAGE_CONNECTOR_CREDENTIALS,
    SWARM_STORE_CONNECTOR_TEST_SUBCLASS_SECRET_STORAGE_CONNECTOR_OPTIONS,
 } from './swarm-storage-orbit-db.test.const';
import { SWARM_CONNECTION_OPTIONS } from 'test/ipfs-swarm-connection.test/ipfs-swarm-connection.const';
import { SwarmConnection } from 'classes/swarm-connection-class/swarm-connection-class';
import { ESwarmStoreConnectorOrbitDBEventNames } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.const';
import { ISwarmStoreConnectorOrbitDbDatabaseValue } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON } from 'const/common-values/common-values';
import { SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter';

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
    describe('swarm store: orbit db', () => {
        // TODO
        return
        
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
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASES);

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
                    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASES.databases.map(db => db.dbName)
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

        it('create swarm store OrbitDB connector - 1 database, check database close', async () => {
            expect(ipfsConnection).to.be.an.instanceof(ipfs);

            const connection = new SwarmStoreConnectorOrbitDB<string>(
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE);

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

            //
            await expect(connection.openDatabase(SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_TWO))
                .to.eventually.be.undefined;
            await expect(connection.openDatabase(SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_TWO))
                .to.eventually.be.an('error');

            //
            const result = await Promise.all([
                connection.openDatabase(SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_THREE),
                connection.openDatabase(SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_THREE),
            ]);

            expect(result)
                .to.be.an('array').that.has.property('length', 2);
            assert(result[0] == null, 'The first instance must be started');
            expect(result[1]).to.be.an.instanceof(Error);

            let isEmitDbClose: boolean = false;

            connection.on(ESwarmStoreConnectorOrbitDBEventNames.CLOSE_DATABASE, (dbName: string) => {
                if (dbName === SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME) {
                    isEmitDbClose = true;
                }
            })
            await expect(connection.closeDb(SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME)).to.eventually.eq(undefined);
            expect(isEmitDbClose).to.be.equal(true);
            await expect(connection.request(
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
                'get',
                '111'
            )).to.eventually.be.an('Error');
            
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

        it('create swarm store OrbitDB connector - 1 database with custom identity', async () => {
            expect(ipfsConnection).to.be.an.instanceof(ipfs);

            const connection = new SwarmStoreConnectorOrbitDB<string>(
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_WITH_IDENTITY as any,
            );

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
            assert(
                (fullProgressEmitted as boolean) === true,
                'The event 100% loading progress does not emitted',
            )
            expect(readyEmitted)
                .to.be.an('array')
                .that.include.all.members(
                    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE.databases.map(db => db.dbName)
                );

            await testDatabase(
                connection,
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
            );
        }).timeout(70000);

        it('create swarm store OrbitDB connector - 1 database with custom acccess provider', async () => {
            expect(ipfsConnection).to.be.an.instanceof(ipfs);

            const connection = new SwarmStoreConnectorOrbitDB<string>(
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_WITH_IDENTITY_AND_ACCESS_CONTROLLER as any,
            );

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
            assert(
                (fullProgressEmitted as boolean) === true,
                'The event 100% loading progress does not emitted',
            )
            expect(readyEmitted)
                .to.be.an('array')
                .that.include.all.members(
                    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE.databases.map(db => db.dbName)
                );

            await testDatabase(
                connection,
                SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
            );
        }).timeout(70000);
    })

    describe('swarm store:: orbit db:: subclasses', () => {
        it('subclass swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter', async () => {
            let secretStorageAdapter: undefined | SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter;
            const testKey = '___test_key';
            const testValue = '___test_value';

            expect(() => {
                secretStorageAdapter = new SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter(
                    SWARM_STORE_CONNECTOR_TEST_SUBCLASS_SECRET_STORAGE_CONNECTOR_CREDENTIALS,
                    SWARM_STORE_CONNECTOR_TEST_SUBCLASS_SECRET_STORAGE_CONNECTOR_OPTIONS,
                );
            }).to.not.throw();
            expect(secretStorageAdapter)
                .to.be.an
                .instanceof(SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter);
            
            await expect(secretStorageAdapter!.open()).to.eventually.be.fulfilled;
            await expect(secretStorageAdapter!.get(
                testKey,
            )).to.be.eventually.oneOf([testValue, undefined]);
            await expect(secretStorageAdapter!.put(
                testKey,
                testValue,
            )).to.eventually.be.fulfilled;
            // TODO - must provide storing values as buffer fo the SecretStorage
            await expect(secretStorageAdapter!.get(
                testKey,
            )).to.be.eventually.equal(testValue);

            const testKeyRandom = `${Date.now()}!@#$%^&**()_)_)*(&*&TY&*%*$^#$*:":/*/-*)//..,<><.~~~~';`;
            const testValueRandom = `${new Date()}!@#$%^&**()_)_)*(&*&TY&*%*$^#$*:":/*/-*)//..,<><.~~~~';`;

            await expect(secretStorageAdapter!.put(
                testKeyRandom,
                testValueRandom,
            )).to.eventually.be.fulfilled;
            // TODO - must provide storing values as buffer fo the SecretStorage
            await expect(secretStorageAdapter!.get(
                testKeyRandom,
            )).to.be.eventually.equal(testValueRandom);
            await expect(secretStorageAdapter!.close()).to.eventually.be.fulfilled;
        }).timeout(10000);
    });
};