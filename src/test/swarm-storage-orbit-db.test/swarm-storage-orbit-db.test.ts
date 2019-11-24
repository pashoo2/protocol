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
  SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASES_WITH_IDENTITY_AND_ACCESS_CONTROLLER_SECRET_KEYSTORE,
  SWARM_STORE_CONNECTOR_TEST_SUBCLASS_CACHE_OPTIONS,
} from './swarm-storage-orbit-db.test.const';
import { SWARM_CONNECTION_OPTIONS } from 'test/ipfs-swarm-connection.test/ipfs-swarm-connection.const';
import { SwarmConnection } from 'classes/swarm-connection-class/swarm-connection-class';
import { ESwarmStoreConnectorOrbitDBEventNames } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.const';
import { ISwarmStoreConnectorOrbitDbDatabaseValue } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON } from 'const/common-values/common-values';
import { SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter.const';
import { SecretStorage } from 'classes/secret-storage-class/secret-storage-class';
import { SwarmStoreConnectorOrbitDBSubclassStorageFabric } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-storage-fabric/swarm-store-connector-orbit-db-subclass-storage-fabric';

export const testDatabase = async (
  connection: SwarmStoreConnectorOrbitDB<string>,
  dbName: string
) => {
  const testValue = `${new Date()}--te`;
  const addValueHash = await connection.request(
    dbName,
    'add',
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE
  );

  expect(addValueHash).to.be.a('string');

  const getValueByHashResult: ISwarmStoreConnectorOrbitDbDatabaseValue<string> = await connection.request(
    dbName,
    'get',
    addValueHash
  );

  expect(getValueByHashResult.id).to.be.equal(
    (connection as any).orbitDb.identity.id
  );
  expect(getValueByHashResult.hash).to.be.equal(addValueHash);
  expect(getValueByHashResult.value).to.be.equal(
    SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE
  );

  await expect(
    connection.request(dbName, 'remove', addValueHash)
  ).eventually.not.rejected.not.be.an('error');

  const getValueByHashAfterRemoveResult = await connection.request(
    dbName,
    'get',
    addValueHash
  );

  assert(
    getValueByHashAfterRemoveResult == null,
    'The value removed before must be empty'
  );
};

export const testDatabaseWithRandomValue = async (
  connection: SwarmStoreConnectorOrbitDB<string>,
  dbName: string
) => {
  let i = 0;

  while ((i += 1) <= 5) {
    const testValue = `${new Date()}--test-value`;
    const addValueHash = await connection.request(dbName, 'add', testValue);

    expect(addValueHash).to.be.a('string');

    const getValueByHashResult: ISwarmStoreConnectorOrbitDbDatabaseValue<string> = await connection.request(
      dbName,
      'get',
      addValueHash
    );

    expect(getValueByHashResult.id).to.be.equal(
      (connection as any).orbitDb.identity.id
    );
    expect(getValueByHashResult.hash).to.be.equal(addValueHash);
    expect(getValueByHashResult.value).to.be.equal(testValue);

    await expect(
      connection.request(dbName, 'remove', addValueHash)
    ).eventually.not.rejected.not.be.an('error');

    const getValueByHashAfterRemoveResult = await connection.request(
      dbName,
      'get',
      addValueHash
    );

    assert(
      getValueByHashAfterRemoveResult == null,
      'The value removed before must be empty'
    );
  }
};

export const runTestSwarmStoreOrbitDBConnection = async (name?: string) => {
  describe('swarm store: orbit db', () => {
    let ipfsConnection: IPFS | undefined;

    beforeEach(async function() {
      this.timeout(60000);
      const swarmConnection = new SwarmConnection();

      expect(swarmConnection).to.be.an.instanceof(SwarmConnection);
      await assert.becomes(
        swarmConnection.connect(SWARM_CONNECTION_OPTIONS),
        true,
        ''
      );
      expect(swarmConnection.isConnected).to.equal(true);

      ipfsConnection = swarmConnection.getNativeConnection();

      expect(ipfsConnection).to.be.an.instanceof(ipfs);
    });

    if (
      !name ||
      name === 'create swarm store OrbitDB connector - 3 databases'
    ) {
      it('create swarm store OrbitDB connector - 3 databases', async () => {
        expect(ipfsConnection).to.be.an.instanceof(ipfs);

        const connection = new SwarmStoreConnectorOrbitDB<string>(
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASES
        );

        expect(connection).to.be.an.instanceof(SwarmStoreConnectorOrbitDB);
        expect(connection.connect).to.be.a('function');

        let fullProgressEmitted: boolean = false;
        let readyEmitted: string[] = [];

        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.LOADING,
          (loadingProgress: number) => {
            if (loadingProgress === 100) {
              fullProgressEmitted = true;
            }
          }
        );
        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.READY,
          (dbName: string) => {
            if (dbName) {
              readyEmitted.push(dbName);
            }
          }
        );

        await expect(
          connection.connect({
            ipfs: ipfsConnection!,
          })
        ).to.be.not.eventually.an.instanceof(Error);

        expect(connection.isClosed).to.be.equal(false);
        expect(connection.isReady).to.be.equal(true);
        assert(
          (fullProgressEmitted as boolean) === true,
          'The event 100% loading progress does not emitted'
        );
        expect(readyEmitted)
          .to.be.an('array')
          .that.include.all.members(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASES.databases.map(
              (db) => db.dbName
            )
          );

        await testDatabase(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME
        );
        await testDatabase(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_TWO_DATABASE_DB_NAME
        );
        await testDatabase(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE_DB_NAME
        );

        let isCloseEmitted: boolean = false;

        connection[COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON](
          ESwarmStoreConnectorOrbitDBEventNames.CLOSE,
          () => {
            isCloseEmitted = true;
          }
        );

        await expect(connection.close()).to.eventually.be.undefined;

        assert(
          (isCloseEmitted as boolean) === true,
          'The close event must be emitted on SwarmStoreConnector close'
        );

        const addValueHashAfterClose = await connection.request(
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
          'add',
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE
        );

        expect(addValueHashAfterClose).to.be.an('error');
      }).timeout(70000);
    }

    if (
      !name ||
      name ===
        'create swarm store OrbitDB connector - 1 database, check database close'
    ) {
      it('create swarm store OrbitDB connector - 1 database, check database close', async () => {
        expect(ipfsConnection).to.be.an.instanceof(ipfs);

        const connection = new SwarmStoreConnectorOrbitDB<string>(
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE
        );

        expect(connection).to.be.an.instanceof(SwarmStoreConnectorOrbitDB);
        expect(connection.connect).to.be.a('function');

        let fullProgressEmitted: boolean = false;
        let readyEmitted: string[] = [];

        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.LOADING,
          (loadingProgress: number) => {
            if (loadingProgress === 100) {
              fullProgressEmitted = true;
            }
          }
        );
        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.READY,
          (dbName: string) => {
            if (dbName) {
              readyEmitted.push(dbName);
            }
          }
        );

        await expect(
          connection.connect({
            ipfs: ipfsConnection!,
          })
        ).to.be.not.eventually.an.instanceof(Error);

        expect(connection.isClosed).to.be.equal(false);
        expect(connection.isReady).to.be.equal(true);
        assert(
          (fullProgressEmitted as boolean) === true,
          'The event 100% loading progress does not emitted'
        );
        expect(readyEmitted)
          .to.be.an('array')
          .that.include.all.members(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE.databases.map(
              (db) => db.dbName
            )
          );

        await testDatabase(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME
        );

        //
        await expect(
          connection.openDatabase(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_TWO
          )
        ).to.eventually.be.undefined;
        await expect(
          connection.openDatabase(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_TWO
          )
        ).to.eventually.be.an('error');

        //
        const result = await Promise.all([
          connection.openDatabase(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_THREE
          ),
          connection.openDatabase(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_DATABASE_THREE
          ),
        ]);

        expect(result)
          .to.be.an('array')
          .that.has.property('length', 2);
        assert(result[0] == null, 'The first instance must be started');
        expect(result[1]).to.be.an.instanceof(Error);

        let isEmitDbClose: boolean = false;

        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.CLOSE_DATABASE,
          (dbName: string) => {
            if (
              dbName ===
              SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME
            ) {
              isEmitDbClose = true;
            }
          }
        );
        await expect(
          connection.closeDb(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME
          )
        ).to.eventually.eq(undefined);
        expect(isEmitDbClose).to.be.equal(true);
        await expect(
          connection.request(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
            'get',
            '111'
          )
        ).to.eventually.be.an('Error');

        let isCloseEmitted: boolean = false;

        connection[COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON](
          ESwarmStoreConnectorOrbitDBEventNames.CLOSE,
          () => {
            isCloseEmitted = true;
          }
        );

        await expect(connection.close()).to.eventually.be.undefined;

        assert(
          (isCloseEmitted as boolean) === true,
          'The close event must be emitted on SwarmStoreConnector close'
        );

        const addValueHashAfterClose = await connection.request(
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
          'add',
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE
        );

        expect(addValueHashAfterClose).to.be.an('error');
      }).timeout(70000);
    }

    if (
      !name ||
      name ===
        'create swarm store OrbitDB connector - 1 database with custom identity'
    ) {
      it('create swarm store OrbitDB connector - 1 database with custom identity', async () => {
        expect(ipfsConnection).to.be.an.instanceof(ipfs);

        const connection = new SwarmStoreConnectorOrbitDB<string>(
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_WITH_IDENTITY as any
        );

        expect(connection).to.be.an.instanceof(SwarmStoreConnectorOrbitDB);
        expect(connection.connect).to.be.a('function');

        let fullProgressEmitted: boolean = false;
        let readyEmitted: string[] = [];

        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.LOADING,
          (loadingProgress: number) => {
            if (loadingProgress === 100) {
              fullProgressEmitted = true;
            }
          }
        );
        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.READY,
          (dbName: string) => {
            if (dbName) {
              readyEmitted.push(dbName);
            }
          }
        );

        await expect(
          connection.connect({
            ipfs: ipfsConnection!,
          })
        ).to.be.not.eventually.an.instanceof(Error);

        expect(connection.isClosed).to.be.equal(false);
        expect(connection.isReady).to.be.equal(true);
        assert(
          (fullProgressEmitted as boolean) === true,
          'The event 100% loading progress does not emitted'
        );
        expect(readyEmitted)
          .to.be.an('array')
          .that.include.all.members(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE.databases.map(
              (db) => db.dbName
            )
          );

        await testDatabase(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME
        );
      }).timeout(70000);
    }

    if (
      !name ||
      name ===
        'create swarm store OrbitDB connector - 1 database with custom acccess provider'
    ) {
      it('create swarm store OrbitDB connector - 1 database with custom acccess provider', async () => {
        expect(ipfsConnection).to.be.an.instanceof(ipfs);

        const connection = new SwarmStoreConnectorOrbitDB<string>(
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_WITH_IDENTITY_AND_ACCESS_CONTROLLER as any
        );

        expect(connection).to.be.an.instanceof(SwarmStoreConnectorOrbitDB);
        expect(connection.connect).to.be.a('function');

        let fullProgressEmitted: boolean = false;
        let readyEmitted: string[] = [];

        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.LOADING,
          (loadingProgress: number) => {
            if (loadingProgress === 100) {
              fullProgressEmitted = true;
            }
          }
        );
        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.READY,
          (dbName: string) => {
            if (dbName) {
              readyEmitted.push(dbName);
            }
          }
        );

        await expect(
          connection.connect({
            ipfs: ipfsConnection!,
          })
        ).to.be.not.eventually.an.instanceof(Error);

        expect(connection.isClosed).to.be.equal(false);
        expect(connection.isReady).to.be.equal(true);
        assert(
          (fullProgressEmitted as boolean) === true,
          'The event 100% loading progress does not emitted'
        );
        expect(readyEmitted)
          .to.be.an('array')
          .that.include.all.members(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE.databases.map(
              (db) => db.dbName
            )
          );

        await testDatabase(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME
        );
      }).timeout(70000);
    }

    if (
      !name ||
      name ===
        'create swarm store OrbitDB connector - 3 databases with custom acccess provider and secret keystore'
    ) {
      it('create swarm store OrbitDB connector - 3 databases with custom acccess provider and secret keystore', async () => {
        expect(ipfsConnection).to.be.an.instanceof(ipfs);

        const connection = new SwarmStoreConnectorOrbitDB<string>(
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASES_WITH_IDENTITY_AND_ACCESS_CONTROLLER_SECRET_KEYSTORE as any
        );

        expect(connection).to.be.an.instanceof(SwarmStoreConnectorOrbitDB);
        expect(connection.connect).to.be.a('function');

        let fullProgressEmitted: boolean = false;
        let readyEmitted: string[] = [];

        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.LOADING,
          (loadingProgress: number) => {
            if (loadingProgress === 100) {
              fullProgressEmitted = true;
            }
          }
        );
        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.READY,
          (dbName: string) => {
            if (dbName) {
              readyEmitted.push(dbName);
            }
          }
        );

        await expect(
          connection.connect({
            ipfs: ipfsConnection!,
          })
        ).to.be.not.eventually.an.instanceof(Error);

        expect(connection.isClosed).to.be.equal(false);
        expect(connection.isReady).to.be.equal(true);
        assert(
          (fullProgressEmitted as boolean) === true,
          'The event 100% loading progress does not emitted'
        );
        expect(readyEmitted)
          .to.be.an('array')
          .that.include.all.members(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE.databases.map(
              (db) => db.dbName
            )
          );

        await testDatabase(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME
        );
        await testDatabase(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_TWO_DATABASE_DB_NAME
        );
        await testDatabase(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE_DB_NAME
        );

        let isCloseEmitted: boolean = false;

        connection[COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON](
          ESwarmStoreConnectorOrbitDBEventNames.CLOSE,
          () => {
            isCloseEmitted = true;
          }
        );

        await expect(connection.close()).to.eventually.be.undefined;

        assert(
          (isCloseEmitted as boolean) === true,
          'The close event must be emitted on SwarmStoreConnector close'
        );

        const addValueHashAfterClose = await connection.request(
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
          'add',
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE
        );

        expect(addValueHashAfterClose).to.be.an('error');
      }).timeout(70000);
    }

    if (
      !name ||
      name ===
        'create swarm store OrbitDB connector - 3 databases with custom acccess provider and secret keystore -- with random loop'
    ) {
      it('create swarm store OrbitDB connector - 3 databases with custom acccess provider and secret keystore', async () => {
        expect(ipfsConnection).to.be.an.instanceof(ipfs);

        const connection = new SwarmStoreConnectorOrbitDB<string>(
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASES_WITH_IDENTITY_AND_ACCESS_CONTROLLER_SECRET_KEYSTORE as any
        );

        expect(connection).to.be.an.instanceof(SwarmStoreConnectorOrbitDB);
        expect(connection.connect).to.be.a('function');

        let fullProgressEmitted: boolean = false;
        let readyEmitted: string[] = [];

        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.LOADING,
          (loadingProgress: number) => {
            if (loadingProgress === 100) {
              fullProgressEmitted = true;
            }
          }
        );
        connection.on(
          ESwarmStoreConnectorOrbitDBEventNames.READY,
          (dbName: string) => {
            if (dbName) {
              readyEmitted.push(dbName);
            }
          }
        );

        await expect(
          connection.connect({
            ipfs: ipfsConnection!,
          })
        ).to.be.not.eventually.an.instanceof(Error);

        expect(connection.isClosed).to.be.equal(false);
        expect(connection.isReady).to.be.equal(true);
        assert(
          (fullProgressEmitted as boolean) === true,
          'The event 100% loading progress does not emitted'
        );
        expect(readyEmitted)
          .to.be.an('array')
          .that.include.all.members(
            SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE.databases.map(
              (db) => db.dbName
            )
          );

        await testDatabaseWithRandomValue(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME
        );
        await testDatabaseWithRandomValue(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_TWO_DATABASE_DB_NAME
        );
        await testDatabaseWithRandomValue(
          connection,
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_THREE_DATABASE_DB_NAME
        );

        let isCloseEmitted: boolean = false;

        connection[COMMON_VALUE_EVENT_EMITTER_METHOD_NAME_ON](
          ESwarmStoreConnectorOrbitDBEventNames.CLOSE,
          () => {
            isCloseEmitted = true;
          }
        );

        await expect(connection.close()).to.eventually.be.undefined;

        assert(
          (isCloseEmitted as boolean) === true,
          'The close event must be emitted on SwarmStoreConnector close'
        );

        const addValueHashAfterClose = await connection.request(
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_DB_NAME,
          'add',
          SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE_TEST_VALUE
        );

        expect(addValueHashAfterClose).to.be.an('error');
      }).timeout(70000);
    }
  });

  async function testCache(
    cache: SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter
  ) {
    const testKey = '___test_key__cache';
    const testValue = '___test_value_cache';

    expect(cache).to.be.an.instanceof(
      SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter
    );
    expect(cache.db).to.deep.equal({
      status:
        SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.OPEN,
    });
    expect(cache!.status).to.be.equal(
      SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.OPEN
    );
    await expect(cache!.get(testKey)).to.be.eventually.oneOf([
      testValue,
      undefined,
    ]);
    expect(cache!.status).to.be.equal(
      SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.OPEN
    );
    await expect(cache!.put(testKey, testValue)).to.eventually.be.fulfilled;
    await expect(cache!.open()).to.eventually.be.fulfilled;
    expect(cache!.status).to.be.equal(
      SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.OPEN
    );
    // TODO - must provide storing values as buffer fo the SecretStorage
    await expect(cache!.get(testKey)).to.be.eventually.equal(testValue);

    const testKeyRandom = `${Date.now()}!@#$%^&**()_)_)*(&*&TY&*%*$^#$*:":/*/-*)//..,<><.~~~~';`;
    const testValueRandom = `${new Date()}!@#$%^&**()_)_)*(&*&TY&*%*$^#$*:":/*/-*)//..,<><.~~~~';`;

    await expect(cache!.put(testKeyRandom, testValueRandom)).to.eventually.be
      .fulfilled;
    // TODO - must provide storing values as buffer fo the SecretStorage

    let cbCalledTimes = 0;
    const cb = (err: Error | undefined, value: string | undefined) => {
      if (!err) {
        cbCalledTimes += Number(!!value);
      }
    };

    await expect(cache!.get(testKeyRandom, cb)).to.be.eventually.equal(
      testValueRandom
    );
    expect(cbCalledTimes).to.equal(1);

    const cbErr = (err: Error | undefined) => {
      if (!err) {
        cbCalledTimes += 1;
      }
    };

    await expect(cache!.del(testKeyRandom, cbErr)).to.be.eventually.equal(
      undefined
    );
    expect(cbCalledTimes).to.equal(2);
    await expect(cache!.close(cbErr)).to.eventually.be.fulfilled;
    expect(cbCalledTimes).to.equal(3);
    expect(cache!.status).to.be.equal(
      SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.CLOSE
    );
  }

  describe('swarm store:: orbit db:: subclasses', () => {
    if (
      !name ||
      name ===
        'subclass swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter'
    ) {
      it('subclass swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter', async () => {
        let secretStorageAdapter:
          | undefined
          | SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter;
        const testKey = '___test_key';
        const testValue = '___test_value';

        expect(() => {
          secretStorageAdapter = new SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter(
            SWARM_STORE_CONNECTOR_TEST_SUBCLASS_SECRET_STORAGE_CONNECTOR_CREDENTIALS,
            SWARM_STORE_CONNECTOR_TEST_SUBCLASS_SECRET_STORAGE_CONNECTOR_OPTIONS
          );
        }).to.not.throw();
        expect(secretStorageAdapter).to.be.an.instanceof(
          SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter
        );
        expect(secretStorageAdapter!.status).to.be.equal(
          SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.OPEN
        );
        await expect(
          secretStorageAdapter!.get(testKey)
        ).to.be.eventually.oneOf([testValue, undefined]);
        expect(secretStorageAdapter!.status).to.be.equal(
          SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.OPEN
        );
        await expect(secretStorageAdapter!.put(testKey, testValue)).to
          .eventually.be.fulfilled;
        await expect(secretStorageAdapter!.open()).to.eventually.be.fulfilled;
        expect(secretStorageAdapter!.status).to.be.equal(
          SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.OPEN
        );
        // TODO - must provide storing values as buffer fo the SecretStorage
        await expect(secretStorageAdapter!.get(testKey)).to.be.eventually.equal(
          testValue
        );

        const testKeyRandom = `${Date.now()}!@#$%^&**()_)_)*(&*&TY&*%*$^#$*:":/*/-*)//..,<><.~~~~';`;
        const testValueRandom = `${new Date()}!@#$%^&**()_)_)*(&*&TY&*%*$^#$*:":/*/-*)//..,<><.~~~~';`;

        await expect(secretStorageAdapter!.put(testKeyRandom, testValueRandom))
          .to.eventually.be.fulfilled;
        // TODO - must provide storing values as buffer fo the SecretStorage
        await expect(
          secretStorageAdapter!.get(testKeyRandom)
        ).to.be.eventually.equal(testValueRandom);
        await expect(secretStorageAdapter!.close()).to.eventually.be.fulfilled;
        expect(secretStorageAdapter!.status).to.be.equal(
          SWARM_STORE_CONNECTOR_ORBITDB_SUBCASS_STORE_TO_SECRET_STORAGE_ADAPTER_STATUS.CLOSE
        );
      }).timeout(10000);
    }
    if (
      !name ||
      name === 'subclass swarm-store-connector-orbit-db-subclass-storage-cache'
    ) {
      it('subclass swarm-store-connector-orbit-db-subclass-storage-cache', async () => {
        const password = '123456';
        let key: CryptoKey;
        let cache:
          | undefined
          | SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter;

        await expect(
          (async () => {
            key = (await SecretStorage.generatePasswordKeyByPasswordString(
              password
            )) as CryptoKey;
            return key;
          })()
        ).to.eventually.be.fulfilled;

        expect(key!).to.be.an.instanceOf(CryptoKey);
        expect(() => {
          cache = new SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter(
            { key },
            SWARM_STORE_CONNECTOR_TEST_SUBCLASS_CACHE_OPTIONS
          );
        }).to.not.throw();
        await testCache(cache!);
      }).timeout(10000);
    }
    if (
      !name ||
      name === 'subclass swarm-store-connector-orbit-db-subclass-storage-fabric'
    ) {
      it('subclass swarm-store-connector-orbit-db-subclass-storage-fabric', async () => {
        const password = '123456';
        const cachePath = '___cachePath_test';
        const passwordFailed = '12345';

        expect(() => {
          new SwarmStoreConnectorOrbitDBSubclassStorageFabric({
            password: passwordFailed,
          });
        }).to.throw();

        let fabric: undefined | SwarmStoreConnectorOrbitDBSubclassStorageFabric;
        let cache:
          | undefined
          | SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter;

        expect(() => {
          fabric = new SwarmStoreConnectorOrbitDBSubclassStorageFabric({
            password,
          });
        }).not.to.throw();
        expect(fabric).to.be.instanceOf(
          SwarmStoreConnectorOrbitDBSubclassStorageFabric
        );
        await expect(
          (async () => {
            cache = (await fabric!.createStore(
              cachePath
            )) as SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter;
          })()
        ).to.eventually.be.fulfilled;
        await testCache(cache!);
      }).timeout(10000);
    }
  });
};
