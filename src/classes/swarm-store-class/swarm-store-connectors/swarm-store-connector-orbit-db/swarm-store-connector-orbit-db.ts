import * as orbitDb from 'orbit-db';
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmStoreConnectorOrbitDBEventNames, SWARM_STORE_CONNECTOR_ORBITDB_CONNECTION_TIMEOUT_MS, SWARM_STORE_CONNECTOR_ORBITDB_LOG_PREFIX } from './swarm-store-connector-orbit-db.const';
import { IPFS } from 'types/ipfs.types';
import { ISwarmStoreConnectorOrbitDBOptions, ISwarmStoreConnectorOrbitDBConnectionOptions, TESwarmStoreConnectorOrbitDBEvents } from './swarm-store-connector-orbit-db.types';
import { timeout } from 'utils/common-utils/common-utils-timer';
import { SwarmStoreConnectorOrbitDBDatabase } from './swarm-store-connector-orbit-db-utils/swarm-store-connector-orbit-db-utils-database/swarm-store-connector-orbit-db-utils-database';

export class SwarmStoreConnctotOrbitDB extends EventEmitter<TESwarmStoreConnectorOrbitDBEvents> {
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

        const createDatabases = await this.createDatabases();
    }

    protected connectionOptions?: ISwarmStoreConnectorOrbitDBConnectionOptions;

    protected options?: ISwarmStoreConnectorOrbitDBOptions;

    protected ipfs?: IPFS; // instance of the IPFS connected through

    protected orbitDb?: orbitDb.OrbitDB; // instance of the OrbitDB

    protected databases?: SwarmStoreConnectorOrbitDBDatabase[];

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

    private async setListenersDatabaseEvents(database: SwarmStoreConnectorOrbitDBDatabase, isSet: boolean = true): Promise<Error | void> {

    }

    private async unsetListenersDatabaseEvents(database: SwarmStoreConnectorOrbitDBDatabase): Promise<Error | void> {
        this.setListenersDatabaseEvents(database, false);
    }

    private async closeDatabase(database: SwarmStoreConnectorOrbitDBDatabase): Promise<Error | void> {
        this.unsetListenersDatabaseEvents(database);
    }

    private async closeDatabases(): Promise<Error | void> {
        // set that the orbit db is not ready to use
        this.setNotReady();
    }

    private async openDatabase(dbOptions: ) {
    }
    
    private async openDatabases() {
    }
}