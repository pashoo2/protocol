import { SwarmStore } from '../swarm-store-class/swarm-store-class';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageInstance, ISwarmMessageInstanceEncrypted, ISwarmMessageInstanceDecrypted } from '../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseMethodAnswer, TSwarmStoreDatabaseEntityAddress } from '../swarm-store-class/swarm-store-class.types';
import { TSwarmStoreDatabaseMethodArgument, TSwarmStoreDatabaseIteratorMethodArgument } from '../swarm-store-class/swarm-store-class.types';
import { TSwarmStoreDatabaseMethod, ISwarmStoreDatabaseBaseOptions } from '../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageStoreConnectReturnType } from './types/swarm-message-store.types';
import { ISwarmMessageStoreEvents, ISwarmMessageStore } from './types/swarm-message-store.types';
import { ISwarmMessageStoreDeleteMessageArg } from './types/swarm-message-store.types';
import { TSwarmMessageSerialized, TSwarmMessageConstructorBodyMessage } from '../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreAccessControlOptions, ISwarmMessageDatabaseConstructors } from './types/swarm-message-store.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult, ISwarmMessageStoreSwarmMessageMetadata, TSwarmMessageStoreEntryRaw } from './types/swarm-message-store.types';
import { TSwarmStoreDatabaseRequestMethodReturnType, TSwarmStoreDatabaseEntityKey } from '../swarm-store-class/swarm-store-class.types';
import { StorageProvider } from '../storage-providers/storage-providers.types';
import { ISwarmMessageStoreUtilsMessagesCache, ISwarmMessageStoreUtilsMessagesCacheOptions } from './swarm-message-store-utils/swarm-message-store-utils-messages-cache/swarm-message-store-utils-messages-cache.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreDatabaseRequestMethodEntitiesReturnType, TSwarmStoreDatabaseLoadMethodAnswer, TSwarmStoreDatabaseCloseMethodAnswer } from '../swarm-store-class/swarm-store-class.types';
import { ISwarmStoreConnectorBasic, ISwarmStoreConnector } from '../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreOptionsWithConnectorFabric, TSwarmMessagesStoreGrantAccessCallback } from './types/swarm-message-store.types';
import { TSwarmMessageUserIdentifierSerialized } from '../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { PromiseResolveType } from '../../types/promise.types';
import { ISwarmMessageStoreDatabaseOptionsExtender } from './types/swarm-message-store-utils.types';
import { TSwarmStoreConnectorConnectionOptions, ISwarmStoreProviderOptions, ISwarmStoreOptionsConnectorFabric } from '../swarm-store-class/swarm-store-class.types';
export declare class SwarmMessageStore<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> & {
    grantAccess: GAC;
}, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>, MSI extends TSwarmMessageInstance | T, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, E extends ISwarmMessageStoreEvents<P, T, DbType, DBO>, MD extends ISwarmMessageInstanceDecrypted = Exclude<Exclude<MSI, ISwarmMessageInstanceEncrypted>, T>> extends SwarmStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, O, E> implements ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O> {
    protected connectorType: P | undefined;
    protected accessControl?: ACO;
    protected messageConstructors?: ISwarmMessageDatabaseConstructors<PromiseResolveType<ReturnType<NonNullable<MCF>>>>;
    protected swarmMessageConstructorFabric?: MCF;
    protected extendDBOWithAccessControl?: ISwarmMessageStoreDatabaseOptionsExtender<P, T, DbType, DBO, DBO & ISwarmStoreDatabaseBaseOptions & {
        provider: P;
    }, PromiseResolveType<ReturnType<NonNullable<MCF>>>>;
    protected _dbTypes: Record<string, DbType>;
    protected _cache?: StorageProvider<MD>;
    protected _databasesMessagesCaches: Record<string, ISwarmMessageStoreUtilsMessagesCache<P, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>>;
    protected get dbMethodAddMessage(): TSwarmStoreDatabaseMethod<P>;
    protected get dbMethodRemoveMessage(): TSwarmStoreDatabaseMethod<P>;
    protected get dbMethodIterator(): TSwarmStoreDatabaseMethod<P>;
    connect(options: O): TSwarmMessageStoreConnectReturnType<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>;
    openDatabase(dbOptions: DBO): Promise<void | Error>;
    dropDatabase(dbName: DBO['dbName']): Promise<void | Error>;
    addMessage<ValueType extends MSI | TSwarmMessageConstructorBodyMessage, DT extends DbType>(dbName: DBO['dbName'], msg: ValueType, key?: TSwarmStoreDatabaseEntityKey<P>): Promise<TSwarmStoreDatabaseEntityAddress<P>>;
    deleteMessage<DBT extends DbType>(dbName: DBO['dbName'], messageAddressOrDbKey: ISwarmMessageStoreDeleteMessageArg<P, DBT>): Promise<void>;
    collect<ValueType extends T, DT extends DbType, MD extends Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>(dbName: DBO['dbName'], options: TSwarmStoreDatabaseIteratorMethodArgument<P, DT>): Promise<Array<MD | Error>>;
    collectWithMeta<MDT extends MD>(dbName: DBO['dbName'], options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MDT> | undefined>>;
    protected validateOpts(options: O): void;
    protected _setOptions(options: O): void;
    protected getOrbitDBDatabaseTypeByOptions(dbOptions: DBO): ESwarmStoreConnectorOrbitDbDatabaseType;
    protected getDatabaseTypeByOptions(dbOptions: DBO): DbType | undefined;
    protected getMessageConstructor(dbName: DBO['dbName']): Promise<PromiseResolveType<ReturnType<NonNullable<MCF>>> | undefined>;
    protected _getDefaultSwarmMessageConstructor(): PromiseResolveType<ReturnType<NonNullable<MCF>>>;
    protected _getSwarmMessageConstructorForDb(dbName: DBO['dbName']): Promise<PromiseResolveType<ReturnType<NonNullable<MCF>>>>;
    protected getMessagesWithMeta<MDT extends MD>(messages: Array<Error | MDT>, rawEntriesIterator: TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P, T>, dbName: DBO['dbName'], dbType: DbType): Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MDT> | undefined>;
    protected joinMessagesWithRawOrbitDBEntries<M extends MD>(messages: Array<Error | M>, rawEntriesIterator: TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P, T>, dbName: DBO['dbName'], dbType: DbType): Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, M> | undefined>;
    protected emitMessageConstructionFails: (dbName: DBO['dbName'], message: T, messageAddr: TSwarmStoreDatabaseEntityAddress<P>, key: TSwarmStoreDatabaseEntityKey<P> | undefined, error: Error) => void;
    protected emitMessageNew: (dbName: DBO['dbName'], message: Exclude<MSI, T>, messageAddr: TSwarmStoreDatabaseEntityAddress<P>, messageKey: TSwarmStoreDatabaseEntityKey<P> | undefined) => void;
    protected emitMessageDelete: (dbName: DBO['dbName'], userId: TSwarmMessageUserIdentifierSerialized, messageHash: TSwarmStoreDatabaseEntityAddress<P>, messageDeletedHash: TSwarmStoreDatabaseEntityAddress<P> | undefined, messageKey: TSwarmStoreDatabaseEntityKey<P> | undefined) => void;
    protected isValidDataMessageFormat(message: TSwarmMessageStoreEntryRaw<P, T>, dbType: DbType): message is TSwarmMessageStoreEntryRaw<P, T>;
    protected getSwarmMessageMetadataOrbitDb(message: TSwarmMessageStoreEntryRaw<ESwarmStoreConnector.OrbitDB, T> | undefined, dbType: DbType): ISwarmMessageStoreSwarmMessageMetadata<P> | undefined;
    protected getSwarmMessageMetadata(message: TSwarmMessageStoreEntryRaw<P, T> | undefined, dbType: DbType): ISwarmMessageStoreSwarmMessageMetadata<P> | undefined;
    protected constructNewSwarmMessageFromRawEntry: (dbName: DBO['dbName'], dbType: DbType, message: TSwarmMessageStoreEntryRaw<P, T>) => Promise<Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>;
    protected handleNewDataMessage: (dbName: DBO['dbName'], dbType: DbType, message: TSwarmMessageStoreEntryRaw<P, T>) => Promise<void>;
    protected handleNewMessage: ([dbName, message, messageAddress, heads, dbType]: [
        DBO['dbName'],
        TSwarmMessageStoreEntryRaw<P, T>,
        TSwarmStoreDatabaseEntityAddress<P>,
        unknown,
        DbType
    ]) => Promise<void>;
    protected setListeners(): void;
    protected validateMessageFormat(message: MSI | TSwarmMessageConstructorBodyMessage): message is MSI | TSwarmMessageConstructorBodyMessage;
    protected serializeMessage(message: MSI): T;
    protected getArgRemoveMessage<DBT extends DbType>(messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P, DBT>): TSwarmStoreDatabaseMethodArgument<P, T, DBT>;
    protected getArgIterateDb<V extends T, DBT extends DbType>(dbName: DBO['dbName'], options: TSwarmStoreDatabaseIteratorMethodArgument<P, DBT>): TSwarmStoreDatabaseMethodArgument<P, V, DBT>;
    protected collectMessagesFromOrbitDBIterator<MD extends Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>(dbName: DBO['dbName'], rawEnties: TSwarmStoreDatabaseRequestMethodEntitiesReturnType<ESwarmStoreConnector.OrbitDB, T>, dbType: DbType): Promise<Array<MD | Error>>;
    protected isSwarmStoreDatabaseLoadMethodAnswer(rawEntries: TSwarmStoreDatabaseRequestMethodReturnType<P, T>): rawEntries is TSwarmStoreDatabaseLoadMethodAnswer<P>;
    protected isSwarmStoreDatabaseCloseMethodAnswer(rawEntries: TSwarmStoreDatabaseRequestMethodReturnType<P, T>): rawEntries is TSwarmStoreDatabaseCloseMethodAnswer<P>;
    protected checkIsRequestMethodReturnEntries(rawEntries: TSwarmStoreDatabaseRequestMethodReturnType<P, T>): rawEntries is TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P, T>;
    protected collectMessages<MD extends Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>(dbName: DBO['dbName'], rawEntries: TSwarmStoreDatabaseRequestMethodEntitiesReturnType<P, T>, dbType: DbType): Promise<Array<MD | Error>>;
    protected deserializeAddMessageResponse(addMessageResponse: TSwarmStoreDatabaseMethodAnswer<P, T>): TSwarmStoreDatabaseEntityAddress<P> | undefined;
    protected createMessageConstructorForDb(dbName: DBO['dbName']): Promise<PromiseResolveType<ReturnType<NonNullable<MCF>>> | undefined>;
    protected constructMessage<MD extends Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>(dbName: DBO['dbName'], message: MSI | TSwarmMessageConstructorBodyMessage, metadata?: ISwarmMessageStoreSwarmMessageMetadata<P>): Promise<MD>;
    protected getOptionsForDatabaseMessagesCache(dbName: DBO['dbName']): ISwarmMessageStoreUtilsMessagesCacheOptions<P, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>;
    protected openDatabaseMessagesCache: (dbName: DBO['dbName']) => Promise<void>;
    protected unsetDatabaseMessagesCache: (dbName: DBO['dbName']) => Promise<void>;
    protected getMessagesCacheForDb(dbName: DBO['dbName']): ISwarmMessageStoreUtilsMessagesCache<P, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>;
    protected addMessageToCacheByMetadata(dbName: DBO['dbName'], messageMetadata: ISwarmMessageStoreSwarmMessageMetadata<P>, messageInstance: Exclude<MSI, T | ISwarmMessageInstanceEncrypted>): Promise<void>;
    protected removeSwarmMessageFromCacheByKey(dbName: DBO['dbName'], key: TSwarmStoreDatabaseEntityKey<P>): Promise<void>;
    protected removeSwarmMessageFromCacheByAddress(dbName: DBO['dbName'], messageAddress: TSwarmStoreDatabaseEntityAddress<P>): Promise<void>;
    protected removeSwarmMessageFromCacheByAddressOrKey(dbName: DBO['dbName'], deleteMessageArg: ISwarmMessageStoreDeleteMessageArg<P, DbType>): Promise<void>;
    protected getSwarmMessageInstanceFromCacheByAddress(dbName: DBO['dbName'], messageAddress: TSwarmStoreDatabaseEntityAddress<P>): Promise<Exclude<MSI, T | ISwarmMessageInstanceEncrypted> | undefined>;
    protected getSwarmMessageFromCacheByRawEntry(dbName: DBO['dbName'], dbType: DbType, message: TSwarmMessageStoreEntryRaw<P, T> | undefined): Promise<Exclude<MSI, T | ISwarmMessageInstanceEncrypted> | undefined>;
    protected _setDatabaseType(dbName: DBO['dbName'], dbType: DbType): void;
    protected _unsetDatabaseType(dbName: DBO['dbName']): void;
    protected _getDatabaseType: (dbName: DBO['dbName']) => DbType | undefined;
    protected _startCacheStore: () => Promise<void>;
    protected _createDatabaseOptionsExtender(options: O): ISwarmMessageStoreDatabaseOptionsExtender<P, T, DbType, DBO & {
        grantAccess: GAC;
    }, DBO & ISwarmStoreDatabaseBaseOptions & {
        provider: P;
    }, PromiseResolveType<ReturnType<NonNullable<MCF>>>>;
    protected _setCurrentDatabaseOptionsExtenderWithAccessControl(extenderDbOptionsWithAccessControl: ISwarmMessageStoreDatabaseOptionsExtender<P, T, DbType, DBO & {
        grantAccess: GAC;
    }, DBO & ISwarmStoreDatabaseBaseOptions & {
        provider: P;
    }, PromiseResolveType<ReturnType<NonNullable<MCF>>>>): void;
    protected _extendSwarmMessgeStoreOptions(options: O): Promise<O>;
}
//# sourceMappingURL=swarm-message-store.d.ts.map