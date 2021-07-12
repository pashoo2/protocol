import { SwarmStoreConnectorOrbitDBDatabase } from '../../swarm-store-connector-orbit-db-subclass-database';
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class.const';
import { ISwarmStoreConnectorBasic } from '../../../../../../swarm-store-class.types';
declare const SwarmStoreConnectorOrbitDBDatabaseQueued_base: typeof SwarmStoreConnectorOrbitDBDatabase & import("@pashoo2/utils").ConstructorType<import("@pashoo2/async-queue/es/async-queue-concurrent/async-queue-concurrent.types").IAsyncQueueConcurrentMixinDefault, any[]>;
export declare class SwarmStoreConnectorOrbitDBDatabaseQueued<ItemType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>, DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>, DBO extends TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType>> extends SwarmStoreConnectorOrbitDBDatabaseQueued_base<ItemType, DbType, DBO> implements ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, ItemType, DbType, DBO> {
    private _asyncOperationsQueue;
    connect: () => ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['close']>;
    close: (opt?: any) => ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['close']>;
    drop: () => ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['drop']>;
    load: (count: number) => ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['load']>;
    add: (addArg: import("../../swarm-store-connector-orbit-db-subclass-database.types").TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<ItemType>) => ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['add']>;
    get: (keyOrHash: string) => ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['get']>;
    remove: (keyOrEntryAddress: string) => ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['remove']>;
    iterator: (options?: import("../../swarm-store-connector-orbit-db-subclass-database.types").ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>) => ReturnType<SwarmStoreConnectorOrbitDBDatabase<ItemType, DbType, DBO>['iterator']>;
    protected _rejectAllPendingOperationsOnDbClose(): Promise<void>;
    protected _rejectAllPendingOperationsOnDbOpen(): Promise<void>;
    protected _rejectAllPendingOperationsOnDbDrop(): Promise<void>;
}
export {};
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-database-queued.d.ts.map