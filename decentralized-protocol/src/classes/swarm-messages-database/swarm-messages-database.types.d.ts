import { ISwarmMessageStore, ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreMessageWithMeta, ISwarmMessageStoreMessagingMethods, ISwarmMessageStoreMessagingRequestWithMetaResult, ISwarmMessageStoreOptionsWithConnectorFabric, TSwarmMessagesStoreGrantAccessCallback } from '../swarm-message-store/types/swarm-message-store.types';
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../swarm-store-class/swarm-store-class.const';
import { ISwarmStoreConnector, ISwarmStoreConnectorBasic, ISwarmStoreOptionsConnectorFabric, ISwarmStoreProviderOptions, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseEntityAddress, TSwarmStoreDatabaseEntityKey, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessageInstanceDecrypted, ISwarmMessageInstanceEncrypted, TSwarmMessageInstance, TSwarmMessageSerialized } from '../swarm-message/swarm-message-constructor.types';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store/swarm-message-store.const';
import { TTypedEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ESwarmMessagesDatabaseCacheEventsNames } from './swarm-messages-database.const';
import { TSwarmMessageUserIdentifierSerialized } from '../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ISwarmMessagesDatabaseMessagesCollector } from './swarm-messages-database.messages-collector.types';
import { TSwarmStoreDatabaseEntityUniqueIndex, TSwarmStoreDatabaseIteratorMethodArgument } from '../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreDeleteMessageArg } from '../swarm-message-store/types/swarm-message-store.types';
export declare type TSwarmMessageDatabaseMessagesCached<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted> = Map<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>, ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>>;
export interface ISwarmMessagesDatabaseConnectCurrentUserOptions {
    userId: TSwarmMessageUserIdentifierSerialized;
}
export interface ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>, SMDCC extends ISwarmMessagesDatabaseCacheConstructor<P, T, DbType, DBO, MD, SMSM, DCO, DCCRT> = ISwarmMessagesDatabaseCacheConstructor<P, T, DbType, DBO, MD, SMSM, DCO, DCCRT>> {
    cacheConstructor: SMDCC;
}
export interface ISwarmMessagesDatabaseConnectOptions<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>> {
    user: ISwarmMessagesDatabaseConnectCurrentUserOptions;
    swarmMessageStore: SMS;
    dbOptions: DBO;
    cacheOptions: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<P, T, DbType, DBO, MD, SMSM, DCO, DCCRT>;
    swarmMessagesCollector: SMSM;
}
export interface ISwarmMessageDatabaseCacheEvents<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted> {
    [ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_STARTED]: () => unknown;
    [ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATING_OVER]: (allMessagesInCahce: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined) => unknown;
    [ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED]: (messages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined) => unknown;
}
export interface ISwarmMessageDatabaseEvents<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted> extends ISwarmMessageDatabaseCacheEvents<P, DbType, MD> {
    [ESwarmStoreEventNames.UPDATE]: (dbName: DBO['dbName']) => unknown;
    [ESwarmStoreEventNames.DB_LOADING]: (dbName: DBO['dbName'], percentage: number) => unknown;
    [ESwarmMessageStoreEventNames.NEW_MESSAGE]: (dbName: DBO['dbName'], message: MD, messageAddress: TSwarmStoreDatabaseEntityAddress<P>, key?: TSwarmStoreDatabaseEntityKey<P>) => unknown;
    [ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR]: (dbName: DBO['dbName'], messageSerialized: T, error: Error, messageAddress: TSwarmStoreDatabaseEntityAddress<P>, key?: TSwarmStoreDatabaseEntityKey<P>) => unknown;
    [ESwarmStoreEventNames.READY]: (dbName: DBO['dbName']) => unknown;
    [ESwarmStoreEventNames.CLOSE_DATABASE]: (dbName: DBO['dbName']) => unknown;
    [ESwarmStoreEventNames.DROP_DATABASE]: (dbName: DBO['dbName']) => unknown;
    [ESwarmMessageStoreEventNames.DELETE_MESSAGE]: (dbName: DBO['dbName'], userId: TSwarmMessageUserIdentifierSerialized, messageAddress: TSwarmStoreDatabaseEntityAddress<P>, messageDeletedAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityAddress<P> | undefined : TSwarmStoreDatabaseEntityAddress<P>, key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined) => unknown;
}
export interface ISwarmMessageDatabaseMessagingMethods<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, MI extends TSwarmMessageInstance, SMS extends ISwarmMessageStoreMessagingMethods<P, T, DbType, MI>> {
    addMessage(message: Parameters<SMS['addMessage']>[1], key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : never): ReturnType<SMS['addMessage']>;
    deleteMessage(messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P, DbType>): Promise<void>;
    collect(options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): ReturnType<SMS['collect']>;
    collectWithMeta(options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): ReturnType<SMS['collectWithMeta']>;
}
export interface ISwarmMessagesDatabaseProperties<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted> {
    isReady: boolean;
    dbName: string | undefined;
    dbType?: DbType;
    emitter: TTypedEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>;
    whetherMessagesListUpdateInProgress: boolean;
    isMessagesListContainsAllMessages: boolean;
    cachedMessages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
}
export interface ISwarmMessagesDatabaseBaseImplementation<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MSI extends TSwarmMessageInstance | T> extends ISwarmMessageStoreMessagingMethods<P, T, DbType, Exclude<MSI, T>>, ISwarmMessagesDatabaseProperties<P, T, DbType, DBO, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>> {
}
export interface ISwarmMessagesDatabase<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>, OPT extends ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT>> extends ISwarmMessagesDatabaseBaseImplementation<P, T, DbType, DBO, MD | T> {
    open(options: OPT): Promise<void>;
    close(): Promise<void>;
    drop(): Promise<void>;
}
export interface ISwarmMessagesDatabaseReady<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>> {
    _dbName: string;
    _isReady: true;
    _swarmMessageStore: ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>;
    _currentUserId: TSwarmMessageUserIdentifierSerialized;
    _swarmMessagesCache: ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>;
}
export interface ISwarmMessagesDatabaseCacheOptions<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>> {
    dbType: DbType;
    dbName: string;
    dbInstance: SMSM;
}
export interface ISwarmMessagesDatabaseCache<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>> {
    readonly isReady: boolean;
    readonly cache: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
    readonly isUpdating: boolean;
    readonly emitter: TTypedEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>;
    readonly whetherMessagesListContainsAllMessages: boolean;
    start(): Promise<void>;
    close(): Promise<void>;
    update(): Promise<TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined>;
    addMessage(swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P, MD>): Promise<boolean>;
    deleteMessage(messageUniqAddressOrKey: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityAddress<P> | undefined : TSwarmStoreDatabaseEntityAddress<P>, key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined): Promise<void>;
}
export interface ISwarmMessagesDatabaseCacheConstructor<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM> = ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM> = ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>> {
    new (options: DCO): DCCRT;
}
export interface ISwarmMessagesDatabaseMesssageMeta<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>> {
    messageUniqAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityAddress<P> | undefined : TSwarmStoreDatabaseEntityAddress<P>;
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined;
}
export interface ISwarmMessagesDatabaseConnector<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>, OPT extends ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT>> extends ISwarmMessageDatabaseMessagingMethods<P, T, DbType, MD, SMS>, ISwarmMessagesDatabaseProperties<P, T, DbType, DBO, MD> {
    connect(options: OPT): Promise<void>;
    drop(): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=swarm-messages-database.types.d.ts.map