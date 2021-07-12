import { ISwarmStoreDatabaseBaseOptionsWithWriteAccess, ISwarmStoreDatabaseBaseOptions, TSwarmStoreDatabaseEntityUniqueIndex, TSwarmStoreDatabaseType, TSwarmStoreValueTypes } from '../../../../swarm-store-class.types';
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../../../../swarm-store-class.const';
import { ESwarmStoreConnectorOrbitDbDatabaseType, ESortFileds } from './swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback } from '../swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller.types';
import OrbitDbFeedStore from 'orbit-db-feedstore';
import OrbitDbKeyValueStore from 'orbit-db-kvstore';
import { ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclasses-cache.types';
import { ESwarmStoreConnectorOrbitDbDatabaseMethodNames } from '../../swarm-store-connector-orbit-db.types';
import { ISortingOptions } from '../../../../../basic-classes/sorter-class/sorter-class.types';
export declare type TSwarmStoreConnectorOrbitDbDatabaseStoreHash = string;
export declare type TSwarmStoreConnectorOrbitDbDatabaseStoreKey = string;
export declare type TSwarmStoreConnectorOrbitDbDatabaseEntityIndex = TSwarmStoreConnectorOrbitDbDatabaseStoreHash | TSwarmStoreConnectorOrbitDbDatabaseStoreKey;
export declare type TSwarmStoreConnectorOrbitDbDatabase<V> = OrbitDbFeedStore<V> | OrbitDbKeyValueStore<V>;
export interface ISwarmStoreConnectorOrbitDbDatabaseOptions<TStoreValueType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>, DbType extends ESwarmStoreConnectorOrbitDbDatabaseType> extends ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback<TStoreValueType>, ISwarmStoreDatabaseBaseOptionsWithWriteAccess, ISwarmStoreDatabaseBaseOptions {
    dbType: DbType;
    cache?: ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore;
}
export interface ISwarmStoreConnectorOrbitDbDatabaseEvents<TSwarmStoreConnectorOrbitDBDatabase, TFeedStoreType> {
    [ESwarmStoreEventNames.FATAL]: [string, Error, TSwarmStoreConnectorOrbitDBDatabase];
    [ESwarmStoreEventNames.ERROR]: [string, Error, TSwarmStoreConnectorOrbitDBDatabase];
    [ESwarmStoreEventNames.LOADING]: [string, number, TSwarmStoreConnectorOrbitDBDatabase];
    [ESwarmStoreEventNames.UPDATE]: [string, TSwarmStoreConnectorOrbitDBDatabase];
    [ESwarmStoreEventNames.CLOSE]: [string, TSwarmStoreConnectorOrbitDBDatabase];
    [ESwarmStoreEventNames.READY]: [string, TSwarmStoreConnectorOrbitDBDatabase];
    [ESwarmStoreEventNames.NEW_ENTRY]: [
        string,
        any,
        string,
        any,
        ESwarmStoreConnectorOrbitDbDatabaseType,
        TSwarmStoreConnectorOrbitDBDatabase
    ];
}
export declare type ISwarmStoreConnectorOrbitDbDatabaseKey = string;
export interface ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValueType> extends LogEntry<TStoreValueType> {
}
export declare enum ESwarmStoreConnectorOrbitDbDatabaseIteratorOption {
    neq = "neq",
    eq = "eq",
    gt = "gt",
    gte = "gte",
    lt = "lt",
    lte = "lte",
    limit = "limit",
    reverse = "reverse",
    fromCache = "fromCache",
    gtT = "gtT",
    ltT = "ltT",
    sortBy = "sortBy"
}
export interface ISwarmStoreConnectorOrbitDbDatabaseIteratorOptionsRequired<DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>> {
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType> | TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType>[];
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.neq]: TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType> | TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType>[];
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gt]: TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType>;
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gte]: TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType>;
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lt]: TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType>;
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.lte]: TSwarmStoreDatabaseEntityUniqueIndex<ESwarmStoreConnector.OrbitDB, DbType>;
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: number;
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.reverse]: boolean;
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.fromCache]: boolean;
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.gtT]: number;
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.ltT]: number;
    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.sortBy]: Partial<ISortingOptions<LogEntry<any>, ESortFileds>>;
}
export interface ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>> extends Partial<ISwarmStoreConnectorOrbitDbDatabaseIteratorOptionsRequired<DbType>> {
}
export interface ISwarmStoreConnectorOrbitDbDatabaseIteratorAnswer<T> {
    collect(): T[];
}
export declare type TSwarmStoreConnectorOrbitDbDatabaseMethodNames = ESwarmStoreConnectorOrbitDbDatabaseMethodNames;
export declare type TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<TStoreValue> = {
    value: TStoreValue;
    key?: TSwarmStoreConnectorOrbitDbDatabaseStoreKey;
};
export declare type TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbClose = void;
export declare type TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad = number;
export declare type TSwarmStoreConnectorOrbitDbDatabaseMethodArgument<TStoreValue, DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>> = TSwarmStoreConnectorOrbitDbDatabaseStoreHash | TStoreValue | TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<TStoreValue> | ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType> | TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbClose | TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad;
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-database.types.d.ts.map