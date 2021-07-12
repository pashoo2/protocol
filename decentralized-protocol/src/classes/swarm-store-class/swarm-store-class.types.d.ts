import { TSecretStorageAuthorizazionOptions } from '../secret-storage-class/secret-storage-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseMethodNames, ISwarmStoreConnectorOrbitDbConnecectionBasicFabric, ISwarmStoreConnectorOrbitDBConnectionOptions, ISwarmStoreConnectorOrbitDBEvents, ISwarmStoreConnectorOrbitDBOptions } from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ESwarmStoreConnector, ESwarmStoreDbStatus as ESwarmStoreDatabaseStatus, ESwarmStoreEventNames, SWARM_STORE_DATABASE_STATUS_ABSENT } from './swarm-store-class.const';
import { ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions, ISwarmStoreConnectorOrbitDbDatabaseOptions, ISwarmStoreConnectorOrbitDbDatabaseValue, TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument, TSwarmStoreConnectorOrbitDbDatabaseEntityIndex, TSwarmStoreConnectorOrbitDbDatabaseMethodArgument, TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad, TSwarmStoreConnectorOrbitDbDatabaseMethodNames, TSwarmStoreConnectorOrbitDbDatabaseStoreHash, TSwarmStoreConnectorOrbitDbDatabaseStoreKey } from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { IStorageCommon } from 'types/storage.types';
import { EOrbitDbStoreOperation, ESwarmStoreConnectorOrbitDbDatabaseType } from './swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmMessageSerialized } from '../swarm-message/swarm-message-constructor.types';
import { TSwarmMessageUserIdentifierSerialized } from '../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { ISerializer } from '../../types/serialization.types';
import { IOptionsSerializerValidatorConstructorParams, IOptionsSerializerValidatorValidators } from '../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
import { ISwarmStoreDBOSerializerValidator } from './swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStoreDeleteMessageArg } from '../swarm-message-store/types/swarm-message-store.types';
export declare type TSwarmStoreDatabaseType<P extends ESwarmStoreConnector> = ESwarmStoreConnectorOrbitDbDatabaseType;
export declare type TSwarmStoreOrbitDBDatabaseEntityUniqueIndex<DbType extends TSwarmStoreDatabaseType<ESwarmStoreConnector.OrbitDB>> = DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<ESwarmStoreConnector.OrbitDB> : TSwarmStoreDatabaseEntityAddress<ESwarmStoreConnector.OrbitDB>;
export declare type TSwarmStoreDatabaseEntityUniqueIndex<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>> = P extends ESwarmStoreConnector.OrbitDB ? TSwarmStoreOrbitDBDatabaseEntityUniqueIndex<DbType> : never;
export declare type TSwarmStoreConnectorBasicFabric<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<T, DbType, DBO, ConnectorBasic> : never;
export declare type TSwarmStoreConnectorEventRetransmitter = (...args: any[]) => void;
export interface ISwarmStoreDatabasesStatuses extends Record<string, ESwarmStoreDatabaseStatus | typeof SWARM_STORE_DATABASE_STATUS_ABSENT> {
}
export declare type TSwarmStoreDatabaseMethod<P extends ESwarmStoreConnector> = P extends ESwarmStoreConnector.OrbitDB ? TSwarmStoreConnectorOrbitDbDatabaseMethodNames : never;
export declare type TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>> = Error | TSwarmStoreDatabaseMethodAnswer<P, ItemType> | TSwarmStoreDatabaseIteratorMethodAnswer<P, ItemType>;
export declare type TSwarmStoreDatabaseRequestMethodReturnType<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>> = Error | TSwarmStoreDatabaseLoadMethodAnswer<P> | TSwarmStoreDatabaseCloseMethodAnswer<P> | TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P, ItemType>;
export declare type TSwarmStoreConnectorConstructorOptions<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDBOptions<ItemType, DbType> : never;
export interface ISwarmStoreConnectorRequestLoadAnswer {
    count: number;
    loadedCount: number;
    overallCount: number;
}
export interface ISwarmStoreEvents<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>> {
    [ESwarmStoreEventNames.STATE_CHANGE]: boolean;
    [ESwarmStoreEventNames.ERROR]: Error;
    [ESwarmStoreEventNames.CLOSE]: void;
    [ESwarmStoreEventNames.UPDATE]: string;
    [ESwarmStoreEventNames.LOADING]: number;
    [ESwarmStoreEventNames.DB_LOADING]: [string, number];
    [ESwarmStoreEventNames.READY]: string;
    [ESwarmStoreEventNames.DATABASES_LIST_UPDATED]: ISwarmStoreDatabasesCommonStatusList<P, ItemType, DbType, DBO>;
}
export declare type TSwarmStoreDatabaseMethodArgumentBase<P extends ESwarmStoreConnector, T, DbType extends TSwarmStoreDatabaseType<P>> = P extends ESwarmStoreConnector.OrbitDB ? TSwarmStoreConnectorOrbitDbDatabaseMethodArgument<T, DbType> : never;
export declare type TSwarmStoreDatabaseMethodArgument<P extends ESwarmStoreConnector, M, DbType extends TSwarmStoreDatabaseType<P>> = ISwarmMessageStoreDeleteMessageArg<P, DbType> | TSwarmStoreDatabaseMethodArgumentBase<P, M, DbType>;
export declare type TSwarmStoreDatabaseEntryOperation<P extends ESwarmStoreConnector> = P extends ESwarmStoreConnector.OrbitDB ? EOrbitDbStoreOperation : never;
export declare type TSwarmStoreDatabaseIteratorMethodArgument<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType> : never;
export declare type TSwarmStoreDatabaseLoadMethodAnswer<P extends ESwarmStoreConnector.OrbitDB> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorRequestLoadAnswer : never;
export declare type TSwarmStoreDatabaseCloseMethodAnswer<P extends ESwarmStoreConnector.OrbitDB> = P extends ESwarmStoreConnector.OrbitDB ? void : never;
export declare type TSwarmStoreDatabaseIteratorMethodAnswer<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>> = P extends ESwarmStoreConnector.OrbitDB ? Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<T> | Error | undefined> : never;
export declare type TSwarmStoreValueTypes<P extends ESwarmStoreConnector> = TSwarmMessageSerialized;
export declare type TSwarmStoreDatabaseMethodAnswer<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDbDatabaseValue<T> : never;
export interface ISwarmStoreDatabaseBaseOptionsWithWriteAccess {
    write?: string[];
}
export interface ISwarmStoreDatabaseBaseOptions extends ISwarmStoreDatabaseBaseOptionsWithWriteAccess {
    dbName: string;
    isPublic?: boolean;
    preloadCount?: number;
    useEncryptedStorage?: boolean;
}
export declare type TSwarmStoreDatabaseEntityKey<P extends ESwarmStoreConnector = never> = P extends ESwarmStoreConnector.OrbitDB ? TSwarmStoreConnectorOrbitDbDatabaseStoreKey : never;
export declare type TSwarmStoreDatabaseEntityAddress<P extends ESwarmStoreConnector> = P extends ESwarmStoreConnector.OrbitDB ? TSwarmStoreConnectorOrbitDbDatabaseStoreHash : never;
export declare type TSwarmStoreDatabaseOptions<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDbDatabaseOptions<T, DbType> : ISwarmStoreDatabaseBaseOptions & ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, T>;
export declare type TSwarmStoreDatabaseOptionsSerialized = string;
export interface ISwarmStoreDatabasesOptions<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>> {
    databases: TSwarmStoreDatabaseOptions<P, T, DbType>[];
    directory: string;
}
export interface ISwarmStoreUserOptions {
    userId?: TSwarmMessageUserIdentifierSerialized;
    credentials?: TSecretStorageAuthorizazionOptions;
}
export declare type TSwarmStoreConnectorConnectionOptions<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>> = P extends ESwarmStoreConnector.OrbitDB ? ISwarmStoreConnectorOrbitDBConnectionOptions<T, DbType, DBO, ConnectorBasic> : never;
export interface ISwarmStoreProviderOptions<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>> {
    provider: P;
    providerConnectionOptions: PO;
}
export interface ISwarmStoreMainOptions<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>> extends ISwarmStoreUserOptions, ISwarmStoreDatabasesOptions<P, T, DbType> {
}
export interface ISwarmStoreOptionsConnectorFabric<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>> {
    (options: CO): ConnectorMain;
}
export declare type TSwarmStoreOptionsSerialized = string;
export interface ISwarmStoreOptions<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>> extends Required<ISwarmStoreMainOptions<P, ItemType, DbType>>, Required<ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>> {
}
export interface ISwarmStoreOptionsWithConnectorFabric<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> | undefined> extends ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO> {
    connectorFabric: CFO;
    persistentDatbasesList?: ISwarmStoreConnectorDatabasesPersistentList<P, ItemType, DbType, DBO, Record<DBO['dbName'], Readonly<DBO>>>;
}
export interface ISwarmStoreConnectorBase<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>> {
    isReady: boolean;
    isClosed: boolean;
    connect(options: PO, dataBasePersistantStorage?: IStorageCommon): Promise<Error | void>;
    close(): Promise<Error | void>;
    openDatabase(dbOptions: DBO): Promise<void | Error>;
    closeDatabase(dbName: DBO['dbName']): Promise<void | Error>;
    dropDatabase(dbName: string): Promise<void | Error>;
    request<A extends ItemType, DT extends DbType>(dbName: DBO['dbName'], dbMethod: TSwarmStoreDatabaseMethod<P>, arg: TSwarmStoreDatabaseMethodArgument<P, A, DT>): Promise<TSwarmStoreDatabaseRequestMethodReturnType<P, A>>;
}
export interface ISwarmStoreConnectorBasic<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>> extends EventEmitter<ISwarmStoreConnectorOrbitDBEvents<P, ItemType, DbType, DBO>> {
    dbName: string;
    isClosed: boolean;
    isReady: boolean;
    [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.close](opt?: any): Promise<Error | void>;
    [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.load](count: TSwarmStoreConnectorOrbitDbDatabaseMethodArgumentDbLoad): Promise<ISwarmStoreConnectorRequestLoadAnswer | Error>;
    [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.add](addArg: TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<ItemType>): Promise<string | Error>;
    [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.get](keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex): Promise<Error | ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | undefined>;
    [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.remove](keyOrEntryAddress: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex): Promise<Error | void>;
    [ESwarmStoreConnectorOrbitDbDatabaseMethodNames.iterator](options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>): Promise<Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<ItemType> | Error | undefined>>;
    connect(): Promise<Error | void>;
    drop(): Promise<Error | void>;
}
export interface ISwarmStoreConnector<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>> extends EventEmitter<ISwarmStoreEvents<P, ItemType, DbType, DBO>>, ISwarmStoreConnectorBase<P, ItemType, DbType, DBO, ConnectorBasic, PO> {
}
export declare type TSwarmStoreOptionsOfDatabasesKnownList<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>> = Record<DBO['dbName'], DBO>;
export interface ISwarmStoreDatabasesCommonStatusList<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>> {
    readonly options: TSwarmStoreOptionsOfDatabasesKnownList<P, ItemType, DbType, DBO> | undefined;
    readonly opened: Record<string, boolean>;
}
export interface ISwarmStoreWithConnector<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>, ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>> {
    getConnectorOrError(): ConnectorMain | Error;
}
export interface ISwarmStore<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, SSO extends ISwarmStoreOptionsWithConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>> extends Omit<ISwarmStoreConnectorBase<P, ItemType, DbType, DBO, ConnectorBasic, PO>, 'connect'> {
    dbStatuses: ISwarmStoreDatabasesStatuses;
    databases: ISwarmStoreDatabasesCommonStatusList<P, ItemType, DbType, DBO> | undefined;
    connect(options: SSO): Promise<Error | void>;
}
export interface ISwarmStoreOptionsClassConstructorParams<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, SSO extends ISwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO>> {
    optionsSerializer?: ISerializer;
    optionsValidators?: IOptionsSerializerValidatorValidators<SSO, TSwarmStoreOptionsSerialized>;
    swarmStoreOptions: SSO | TSwarmStoreOptionsSerialized;
}
export interface ISwarmStoreOptionsClass<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>, SSO extends ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO> = ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>> {
    options: Readonly<SSO>;
    toString(): TSwarmStoreOptionsSerialized;
}
export interface ISwarmStoreOptionsClassConstructor<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, SSO extends ISwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO> = ISwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO>> {
    new (params: ISwarmStoreOptionsClassConstructorParams<P, T, DbType, DBO, ConnectorBasic, CO, SSO>): ISwarmStoreOptionsClass<P, T, DbType, DBO, ConnectorBasic, CO, SSO>;
}
export declare type TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, I extends unknown | never = never> = (payload: T | I, userId: TSwarmMessageUserIdentifierSerialized, key: string | undefined, operation: TSwarmStoreDatabaseEntryOperation<P> | undefined, time: number) => Promise<boolean>;
export interface ISwarmStoreConnectorAccessConrotllerGrantAccessCallbackSerializable<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, I extends unknown | never = never> extends TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, I> {
    toString(): string;
}
export interface ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, I extends unknown | never = never> {
    grantAccess?: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, I>;
}
export interface IDatabaseOptionsClass<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> {
    new (params: Pick<IOptionsSerializerValidatorConstructorParams<DBO, DBOS>, 'options'>): ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}
export interface ISwarmStoreConnectorDatabasesPersistentList<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBL extends Record<DBO['dbName'], DBO>> {
    readonly databasesKnownOptionsList: DBL | undefined;
    loadDatabasesListFromPersistentStorage(): Promise<DBL>;
    getDatabaseOptions(dbName: DBO['dbName']): Promise<DBO | undefined>;
    addDatabase(dbName: DBO['dbName'], dbOptions: DBO): Promise<void>;
    removeDatabase(dbName: DBO['dbName']): Promise<void>;
    close(): Promise<void>;
}
export interface ISwarmStoreConnectorDatabasesPersistentListConstructorParams {
    persistentStorage: IStorageCommon;
    keyPrefixForDatabasesLisInPersistentStorage: string;
    serializer: ISerializer;
}
//# sourceMappingURL=swarm-store-class.types.d.ts.map