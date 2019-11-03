import * as orbitDb from 'orbit-db';
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmStoreConnectorOrbitDBEventNames, SWARM_STORE_CONNECTOR_ORBITDB_CONNECTION_TIMEOUT_MS, SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX } from './swarm-store-connector-orbit-db.const';
import { IPFS } from 'types/ipfs.types';
import { ISwarmStoreConnectorOrbitDBOptions, ISwarmStoreConnectorOrbitDBConnectionOptions, TESwarmStoreConnectorOrbitDBEvents } from './swarm-store-connector-orbit-db.types';
import { timeout } from 'utils/common-utils/common-utils-timer';
import { SwarmStoreConnectorOrbitDBDatabase } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database';
import { ISwarmStoreConnectorOrbitDbDatabseOptions } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ESwarmConnectorOrbitDbDatabseEventNames } from './swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';

export class SwarmStoreConnctotOrbitDB<ISwarmDatabseValueTypes> extends EventEmitter<TESwarmStoreConnectorOrbitDBEvents> {
    public isReady: boolean = false;

    public isClosed: boolean = false;

    public constructor(options: ISwarmStoreConnectorOrbitDBOptions) {
        super();
        this.setOptions(options);
    }

    /**
     * waiting for the connection to the swarm, load the database locally
     * and ready to use it
     */
    public async connect(connectionOptions: ISwarmStoreConnectorOrbitDBConnectionOptions): Promise<void | Error> {
        const setConnectionOptionsResult = this.setConnectionOptions(connectionOptions);

        if (setConnectionOptionsResult instanceof Error) {
            return setConnectionOptionsResult;
        }
        
        const disconnectFromSwarmResult = await this.disconnectFromSwarm();

        if (disconnectFromSwarmResult instanceof Error) {
            return disconnectFromSwarmResult;
        }
        
        const connectToSwarmResult = await this.connectToSwarm();

        if (connectToSwarmResult instanceof Error) {
            return connectToSwarmResult;
        }

        const stopOrbitDBResult = await this.stopOrbitDBInsance();

        if (stopOrbitDBResult instanceof Error) {
            return stopOrbitDBResult;
        }

        const createOrbitDbResult = await this.createOrbitDBInstance();

        if (createOrbitDbResult instanceof Error) {
            return createOrbitDbResult;
        }

        const createDatabases = await this.openDatabases();

        if (createDatabases instanceof Error) {
            return createDatabases;
        }

        const databasesReadyResult = await this.waitAllDatabasesOpen();

        if (databasesReadyResult instanceof Error) {
            return databasesReadyResult;
        }
        // set the database is ready to query
        this.setIsReady(true);
    }

    protected connectionOptions?: ISwarmStoreConnectorOrbitDBConnectionOptions;

    protected options?: ISwarmStoreConnectorOrbitDBOptions;

    protected ipfs?: IPFS; // instance of the IPFS connected through

    protected orbitDb?: orbitDb.OrbitDB; // instance of the OrbitDB

    protected databases?: SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabseValueTypes>[];

    protected databasesLoadingStatus: number[] = [];

    protected emitError(error: Error | string, mehodName?: string): Error {
        const err = typeof error === 'string' ? new Error() : error;

        console.error(`${SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX}::error${mehodName ? `::${mehodName}` : ''}`, err);
        this.emit(ESwarmStoreConnectorOrbitDBEventNames.ERROR, err);
        return err;
    }

    private setIsReady(isReady: boolean = false) {
        this.isReady = isReady;
        this.emit(ESwarmStoreConnectorOrbitDBEventNames.STATE_CHANGE, isReady);
    }

    protected setReady() {
        this.setIsReady(true);
    }

    protected setNotReady() {
        this.setIsReady(false);
    }

    private setOptions(options: ISwarmStoreConnectorOrbitDBOptions) {
        this.options = options;
    }

    private setConnectionOptions(connectionOptions: ISwarmStoreConnectorOrbitDBConnectionOptions): void | Error {
        if (!connectionOptions) {
            return this.emitError('Connection options must be specified');
        }

        const { ipfs } = connectionOptions;

        if (!ipfs) {
            return this.emitError('An instance of ipfs must be specified in the connection options');
        }
        this.ipfs = ipfs;
    }

    private unsetSwarmConnectionOptions() {
        this.ipfs = undefined;
        this.connectionOptions = undefined;
    }

    private async disconnectFromSwarm(): Promise<Error | void> {
        console.warn(`${SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX}::disconnectFromTheSwarm`);
        this.unsetSwarmConnectionOptions();
        this.setNotReady();
    }

    private async connectToSwarm(): Promise<Error | void> {
        const { ipfs } = this;

        if (!ipfs) {
            return this.emitError('An instence of the IPFS must be specified')
        }
        try {
            // wait when the ipfs will be ready to use
            await Promise.race([
                ipfs.ready,
                timeout(SWARM_STORE_CONNECTOR_ORBITDB_CONNECTION_TIMEOUT_MS),
            ]);
        } catch(err) {
            this.emitError(err);
        }
    }

    private async stopOrbitDBInsance(): Promise<Error | void> {
        const { orbitDb } = this;

        if (orbitDb)  {
            try {
                await orbitDb.stop();
                this.orbitDb = undefined;
                this.setNotReady();
            }  catch(err) {
                return this.emitError(err, 'stopOrbitDBInsance');
            }
        }
    }

    private async createOrbitDBInstance(): Promise<Error | void> {
        const { ipfs } = this;

        if (!ipfs) {
            return this.emitError('An instance of IPFS must exists', 'createOrbitDBInstance');
        }
        try {
            const instanceOfOrbitDB = await orbitDb.OrbitDB.createInstance(ipfs);

            if (instanceOfOrbitDB instanceof Error) {
                return this.emitError(instanceOfOrbitDB, 'createOrbitDBInstance::error has occurred in the "createInstance" method');
            }
            this.orbitDb = instanceOfOrbitDB;
        } catch(err) {
            return this.emitError(err, 'createOrbitDBInstance::failed to create the instance of OrbitDB');
        }
    }

    protected getDbOptions(dbName: string): ISwarmStoreConnectorOrbitDbDatabseOptions | void | Error {
        const { options } = this;

        if (!options) {
            return this.emitError('An options is not specified for the database', `getDbOptions::${dbName}`);
        }

        const { databses } = options;

        return databses!.find(option => option && option.dbName === dbName);
    }

    protected stop(): Promise<Error | void> {
        this.setNotReady();
        return this.closeDatabases();
    }

    private async restartDbConnection(dbName: string, database: SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabseValueTypes>): Promise<void | Error> {
        //try to restart the database
        const optionsForDb = this.getDbOptions(dbName);

        this.unsetListenersDatabaseEvents(database);
        if (optionsForDb instanceof Error || !optionsForDb) {
            this.emitError('Failed to get options to open a new db store', `restartDbConnection::${dbName}`);
            return this.stop();
        }

        const startDbResult = await this.openDatabase(optionsForDb);

        if (startDbResult instanceof Error) {
            this.emitError('Failed to open a new db store', `restartDbConnection::${dbName}`);
            return this.stop();
        }
    }

    protected removeDbFromList(database: SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabseValueTypes>) {
        if (this.databases instanceof Array) {
            this.databases = this.databases.filter(db => db !== database);
        }
    }

    private handleDatabaseStoreClosed = (dbName: string, database: SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabseValueTypes>) => {
        this.emitError('Database closed unexpected', `handleDatabaseStoreClosed::${dbName}`);
        this.removeDbFromList(database);
        this.restartDbConnection(dbName, database);
    }

    private async setListenersDatabaseEvents(database: SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabseValueTypes>, isSet: boolean = true): Promise<Error | void> {
        database.on(ESwarmConnectorOrbitDbDatabseEventNames.CLOSE, this.handleDatabaseStoreClosed);
        database.on();
        database.on();
        database.on();
    }

    private async unsetListenersDatabaseEvents(database: SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabseValueTypes>): Promise<Error | void> {
        this.setListenersDatabaseEvents(database, false);
    }

    private async closeDatabase(database: SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabseValueTypes>): Promise<Error | void> {
        this.unsetListenersDatabaseEvents(database);
        return database.close();
    }

    private async closeDatabases(): Promise<Error | void> {
        const { databases } = this;

        // set that the orbit db is not ready to use
        this.setNotReady();
        if (!databases || !databases.length) {
            return;
        }

        try {
            let idx = 0;
            const len = databases.length;

            for (; idx < len; idx +=1) {
                const db = databases[idx];
                const dbCloseResult = await this.closeDatabase(db);

                if (dbCloseResult instanceof Error) {
                    console.error(this.emitError(dbCloseResult));
                    this.emitError('An error has occurred on closing the database', 'closeDatabases');   
                }
            }
            this.databases = [];
        } catch(err) {
            return err;
        }
    }

    private openDatabase = async (dbOptions: ISwarmStoreConnectorOrbitDbDatabseOptions): Promise<void | Error> => {
        const { orbitDb } = this;

        if (!orbitDb) {
            return new Error('There is no instance of OrbitDB');
        }

        const database = new SwarmStoreConnectorOrbitDBDatabase<ISwarmDatabseValueTypes>(dbOptions, orbitDb);
        
        this.setListenersDatabaseEvents(database);
        this.databases!.push(database);
    }
    
    private async openDatabases(): Promise<Error | void> {
        const { options } = this;

        if (!options) {
            return this.emitError('The options must be specified to open the databases');
        }

        const closeExistingDatabaseesOpened = await this.closeDatabases();

        if (closeExistingDatabaseesOpened instanceof Error) {
            return this.emitError(closeExistingDatabaseesOpened, 'openDatabases');
        }

        const { databses } = options;

        if (!(databses instanceof Array)) {
            return this.emitError('The options for databases must be specified');
        }

        try {
            let idx =0;
            const len = databses.length;
            
            for(;idx < len; idx +=1) {
                const options = databses[idx];
                const startResultStatus = await this.openDatabase(options);

                if (startResultStatus instanceof Error) {
                    console.error(startResultStatus);
                    await this.closeDatabases();
                    return new Error('Failed to open the database');
                }
            }
        } catch(err) {
            await this.closeDatabases();
            return this.emitError(err);
        }
    }
}