import * as orbitDbModule from 'orbit-db';
import OrbitDbFeedStore from 'orbit-db-feedstore';
import { ISwarmStoreConnectorOrbitDbDatabseOptions, ISwarmStoreConnectorOrbitDbDatabseEvents } from './swarm-store-connector-orbit-db-subclass-database.types';
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmConnectorOrbitDbDatabseEventNames, SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX, EOrbidDBFeedSoreEvents } from './swarm-store-connector-orbit-db-subclass-database.const';
import undefined from 'firebase/empty-import';

export class SwarmStoreConnectorOrbitDBDatabase<TFeedStoreType> extends EventEmitter<ISwarmStoreConnectorOrbitDbDatabseEvents> {   
    // is loaded fully and ready to use
    public isReady: boolean = false;
    
    // whether is closed
    public isClosed: boolean = false;
    
    public constructor(
        options: ISwarmStoreConnectorOrbitDbDatabseOptions,
        orbitDb: orbitDbModule.OrbitDB) {
        super();
        this.setOptions(options);
        this.setOrbitDbInstance(orbitDb);
    }

    public async connect(): Promise<Error | void> {
        this.unsetReadyState();

        const dbStoreCreationResult = await this.createDbInstance();

        if (dbStoreCreationResult instanceof Error) {
            return dbStoreCreationResult;
        }
    }

    public async close(): Promise<Error | void> {
        const closeCurrentStoreResult = await this.closeCurrentStore();

        this.isClosed = true;
        this.emitEvent(ESwarmConnectorOrbitDbDatabseEventNames.CLOSE);
        if (closeCurrentStoreResult instanceof Error) {
            return closeCurrentStoreResult;
        }
    }

    private setReadyState(isReady: boolean = true) {
        this.isReady = isReady;
    }

    private unsetReadyState() {
        this.setReadyState(false);
    }

    private options?: ISwarmStoreConnectorOrbitDbDatabseOptions;

    protected orbitDb?: orbitDbModule.OrbitDB;

    protected database?: OrbitDbFeedStore<TFeedStoreType>;

    protected emitError(error: Error | string, mehodName?: string, isFatal: boolean = false): Error {
        const err = typeof error === 'string' ? new Error() : error;
        const eventName = isFatal
            ? ESwarmConnectorOrbitDbDatabseEventNames.FATAL
            : ESwarmConnectorOrbitDbDatabseEventNames.ERROR;

        console.error(`${SWARM_STORE_CONNECTOR_ORBITDB_DATABASE_LOG_PREFIX}::error${mehodName ? `::${mehodName}` : ''}`, err);
        this.emit(eventName, err);
        return err;
    }

    protected onFatalError(error: Error | string, methodName: string) {
        this.unsetReadyState();
        this.emitError(error, methodName, true);
        
        const { isClosed } = this;

        if (!isClosed) {
            this.close();
        }
    }

    protected emitEvent(event: ESwarmConnectorOrbitDbDatabseEventNames, ...args: any[]) {
        const { options } = this;
        const { dbName } = options!;

        this.emit(event, dbName, ...args);
    }

    private getFeedStoreOptions(): IStoreOptions | undefined | Error {
        // TODO
        return undefined;
    }

    private handleFeedStoreReady = () => {
        this.setReadyState();
        this.emitEvent(ESwarmConnectorOrbitDbDatabseEventNames.READY);
    }

    private handleFeedStoreLoaded = () => {
        // emit event that the database local copy was fully loaded
        this.emitEvent(ESwarmConnectorOrbitDbDatabseEventNames.LOADING, 100);
    }

    private handleFeedStoreLoadProgress = (address: string, hash: string, entry: unknown, progress: number, total: number) => {
        // emit event database local copy loading progress
        this.emitEvent(ESwarmConnectorOrbitDbDatabseEventNames.LOADING, progress);
    }

    private handleFeedStoreReplicated = () => {
        // emit event that the db updated, cause it
        // was replicated with another peer db copy
        this.emitEvent(ESwarmConnectorOrbitDbDatabseEventNames.UPDATE);
    }

    private handleFeedStoreClosed = () => {
        const { isClosed } = this;

        if (!isClosed) {
            this.unsetReadyState();
            this.emitError('The instance was closed unexpected', 'handleFeedStoreClosed');
            this.restartStore();
        }
    }

    private async closeInstanceOfStore(storeInstance: OrbitDbFeedStore<TFeedStoreType>): Promise<Error | void> {
        if (!storeInstance) {
            return new Error('An instance of the store must be specified');
        }
        this.unsetFeedStoreEventListeners(storeInstance);
        try {
            await storeInstance.close();
        } catch(err) {
            console.error(err);
            return new Error('Fatal error has occurred on close the instance of the Feed store');
        }
    }

    private async closeCurrentStore(): Promise<Error | void> {
        const { database } = this;

        if (database) {
            const closeStoreResult = await this.closeInstanceOfStore(database);

            if (closeStoreResult instanceof Error) {
                console.error(closeStoreResult);
                return new Error('Failed to close the current instance of the Database store');
            }
            this.database = undefined;
        }
    }

    // restart the store
    private async restartStore(): Promise<Error | void> {
        const { isClosed } = this;

        if (isClosed) {
            return new Error('The store was closed previousely');
        }

        const currentStoreStopResult = await this.closeCurrentStore();

        if (currentStoreStopResult instanceof Error) {
            console.error(currentStoreStopResult);
            return this.onFatalError('Failed to restart the Database cause failed to close the store instance', 'restartStore');
        }
        return this.connect();
    }

    private setFeedStoreEventListeners(feedStore: OrbitDbFeedStore<TFeedStoreType>, isSet = true): Error | void {
        if (!feedStore) {
            return new Error('An instance of the FeedStore must be specified');
        }
        if (!feedStore.events) {
            return new Error('An unknown API of the FeedStore');
        }
        if (typeof feedStore.events.addListener !== 'function' || typeof feedStore.events.removeListener !== 'function') {
            return new Error('An unknown API of the FeedStore events');
        }

        const methodName = isSet
            ? 'addListener'
            : 'removeListener';
            
        feedStore.events[methodName](EOrbidDBFeedSoreEvents.READY, this.handleFeedStoreReady);
        feedStore.events[methodName](EOrbidDBFeedSoreEvents.LOAD, this.handleFeedStoreLoaded);
        feedStore.events[methodName](EOrbidDBFeedSoreEvents.LOAD_PROGRESS, this.handleFeedStoreLoadProgress);
        feedStore.events[methodName](EOrbidDBFeedSoreEvents.REPLICATED, this.handleFeedStoreReplicated);
        feedStore.events[methodName](EOrbidDBFeedSoreEvents.CLOSE, this.handleFeedStoreClosed);
    }

    private unsetFeedStoreEventListeners(feedStore: OrbitDbFeedStore<TFeedStoreType>) {
        this.setFeedStoreEventListeners(feedStore, false);
    }

    private async createDbInstance(): Promise<Error | void> {
        try {
            const { orbitDb, options } = this;

            if (!orbitDb) {
                return this.onFatalError('There is no intance of the OrbitDb is specified', 'createDbInstance');
            }
            
            const { dbName } = options!;

            if (!dbName) {
                return this.onFatalError('A name of the database must be specified', 'createDbInstance');
            }

            const dbFeedStoreOptions = this.getFeedStoreOptions();

            if (dbFeedStoreOptions instanceof Error) {
                return this.onFatalError(dbFeedStoreOptions, 'createDbInstance::getFeedStoreOptions')
            }

            const db = await orbitDb.feed<TFeedStoreType>(dbName, dbFeedStoreOptions);

            if (db instanceof Error) {
                return this.onFatalError(db, 'createDbInstance::feed store creation');
            }

            const setStoreListenersResult = this.setFeedStoreEventListeners(db);

            if (setStoreListenersResult instanceof Error) {
                return this.onFatalError(setStoreListenersResult, 'createDbInstance::set feed store listeners')
            }
            this.database = db;
        } catch(err) {
            return this.onFatalError(err, 'createDbInstance')
        }
    }

    private setOptions(options: ISwarmStoreConnectorOrbitDbDatabseOptions): void | Error {
        if (!options) {
            return this.onFatalError('Options must be specified', 'setOptions')
        }

        const { dbName } = options;

        if (typeof dbName !== 'string') {
            return this.onFatalError('A name of the database must be specified', 'setOptions')
        } 
        this.options = options;
    }

    private setOrbitDbInstance(orbitDb: orbitDbModule.OrbitDB): void | Error {
        if (!orbitDb) {
            return this.onFatalError('An instance of orbit db must be specified', 'setOrbitDbInstance')
        }
        this.orbitDb = orbitDb;        
    }
}