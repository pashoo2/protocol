import { ESwarmStoreConnector } from '../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType } from '../classes/swarm-store-class/swarm-store-class.types';
import { ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions, ISwarmStoreConnectorOrbitDbDatabaseValue, TSwarmStoreConnectorOrbitDbDatabaseEntityIndex, TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument } from '../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
export interface ISwarmStoreConnectorBasicMethods<TSwarmStoreConnectorType extends ESwarmStoreConnector, TStoreValue extends TSwarmStoreValueTypes<TSwarmStoreConnectorType>, DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorType>> {
    connect(): Promise<Error | void>;
    close(opt?: any): Promise<Error | void>;
    add(addArg: TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<TStoreValue>): Promise<string | Error>;
    get(keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex): Promise<Error | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue> | undefined>;
    remove(keyOrEntryAddress: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex): Promise<Error | void>;
    iterator(options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>): Promise<Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue> | Error | undefined>>;
    drop(): Promise<Error | void>;
}
//# sourceMappingURL=swarm-store-connector.types.d.ts.map