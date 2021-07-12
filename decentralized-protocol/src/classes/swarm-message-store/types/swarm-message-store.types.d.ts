import { ISwarmStore, ISwarmStoreConnector, ISwarmStoreConnectorBasic, ISwarmStoreEvents, ISwarmStoreOptions, ISwarmStoreOptionsConnectorFabric, ISwarmStoreOptionsWithConnectorFabric, ISwarmStoreProviderOptions, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseEntityAddress, TSwarmStoreDatabaseEntityKey, TSwarmStoreDatabaseEntryOperation, TSwarmStoreDatabaseIteratorMethodArgument, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType, TSwarmStoreValueTypes } from '../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageConstructor, ISwarmMessageDecrypted, ISwarmMessageInstanceDecrypted, ISwarmMessageInstanceEncrypted, TSwarmMessageConstructorBodyMessage, TSwarmMessageInstance, TSwarmMessageSerialized } from '../../swarm-message/swarm-message-constructor.types';
import { EventEmitter } from '../../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ESwarmMessageStoreEventNames } from '../swarm-message-store.const';
import { TSwarmMessageUserIdentifierSerialized } from '../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { TCentralAuthorityUserIdentity } from '../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { StorageProvider } from '../../storage-providers/storage-providers.types';
import { ISwarmStoreConnectorOrbitDbDatabaseValue } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { PromiseResolveType } from '../../../types/promise.types';
import { ISwarmStoreConnectorBasicWithEntriesCount, ISwarmStoreConnectorWithEntriesCount, ISwarmStoreWithEntriesCount } from '../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import { ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound, ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
export interface ISwarmMessageStoreSwarmMessageMetadata<P extends ESwarmStoreConnector> {
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>;
    key: TSwarmStoreDatabaseEntityKey<P> | undefined;
}
export declare type TSwarmMessagesStoreGrantAccessCallback<P extends ESwarmStoreConnector, TI extends TSwarmMessageSerialized | ISwarmMessageInstanceDecrypted, CTX extends Record<string, unknown> = Record<string, unknown>> = ISwarmMessageStoreAccessControlGrantAccessCallback<P, TI, CTX> & {
    toString(): string;
};
export interface ISwarmMessageStoreEvents<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> extends ISwarmStoreEvents<P, T, DbType, DBO> {
    [ESwarmMessageStoreEventNames.NEW_MESSAGE]: [string, TSwarmMessageInstance, string];
    [ESwarmMessageStoreEventNames.NEW_MESSAGE_ERROR]: [string, string, Error, string];
}
export interface ISwarmMessageStoreAccessControlGrantAccessCallback<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized | TSwarmMessageInstance, CTX extends Record<string, unknown> = Record<string, unknown>> {
    (this: CTX, message: T | string | undefined, userId: TCentralAuthorityUserIdentity, databaseName: string, key: TSwarmStoreDatabaseEntityKey<P> | undefined, op: TSwarmStoreDatabaseEntryOperation<P> | undefined, entryAddedTime: number): Promise<boolean>;
    toString(): string;
}
export interface ISwarmMessageStoreAccessControlOptions<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, TI extends ISwarmMessageInstanceDecrypted | T, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, TI>> {
    grantAccess: GAC;
    allowAccessFor?: TSwarmMessageUserIdentifierSerialized[];
}
export interface ISwarmMessageDatabaseConstructorsForDatabases<SMC extends ISwarmMessageConstructor> {
    [dbName: string]: SMC;
}
export interface ISwarmMessageDatabaseConstructors<SMC extends ISwarmMessageConstructor> extends Partial<ISwarmMessageDatabaseConstructorsForDatabases<SMC>> {
    default: SMC;
}
export interface ISwarmMessageStoreOptions<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, MSI extends TSwarmMessageInstance | T, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined> extends ISwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, PO> {
    accessControl: ACO;
    messageConstructors: ISwarmMessageDatabaseConstructors<PromiseResolveType<ReturnType<NonNullable<MCF>>>>;
    swarmMessageConstructorFabric: MCF;
    cache?: StorageProvider<ISwarmMessageDecrypted>;
}
export interface ISwarmMessageStoreOptionsWithConnectorFabric<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> | undefined, MSI extends TSwarmMessageInstance | T, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined> extends ISwarmMessageStoreOptions<P, T, DbType, DBO, ConnectorBasic, PO, MSI, GAC, MCF, ACO>, ISwarmStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO> {
}
export declare type TSwarmMessageStoreConnectReturnType<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, MSI extends TSwarmMessageInstance | T, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO>> = ReturnType<ISwarmStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O>['connect']>;
export declare type TSwarmMessageStoreEntryRaw<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>> = P extends ESwarmStoreConnector ? ISwarmStoreConnectorOrbitDbDatabaseValue<T> : never;
export declare type ISwarmMessageStoreDeleteMessageArg<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>> = DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.FEED ? TSwarmStoreDatabaseEntityAddress<P> : TSwarmStoreDatabaseEntityKey<P>;
export declare type ISwarmMessageStoreDatabaseType<P extends ESwarmStoreConnector> = P extends ESwarmStoreConnector.OrbitDB ? ESwarmStoreConnectorOrbitDbDatabaseType : undefined;
export interface ISwarmMessageStoreMessageMeta<P extends ESwarmStoreConnector> {
    dbName: string;
    messageAddress: Error | undefined | TSwarmStoreDatabaseEntityAddress<P>;
    key?: Error | TSwarmStoreDatabaseEntityKey<P> | undefined;
}
export interface ISwarmMessageStoreMessagingRequestWithMetaResult<P extends ESwarmStoreConnector, MD extends ISwarmMessageInstanceDecrypted> extends ISwarmMessageStoreMessageMeta<P> {
    message: Error | MD;
}
export interface ISwarmMessageStoreMessageWithMeta<P extends ESwarmStoreConnector, MD extends ISwarmMessageInstanceDecrypted> {
    dbName: string;
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>;
    key: TSwarmStoreDatabaseEntityKey<P> | undefined;
    message: MD;
}
export interface ISwarmMessageStoreMessagingMethods<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, MI extends TSwarmMessageInstance> {
    addMessage(dbName: string, message: MI, key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined): Promise<TSwarmStoreDatabaseEntityAddress<P>>;
    addMessage(dbName: string, message: T, key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined): Promise<TSwarmStoreDatabaseEntityAddress<P>>;
    addMessage(dbName: string, message: TSwarmMessageConstructorBodyMessage, key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined): Promise<TSwarmStoreDatabaseEntityAddress<P>>;
    deleteMessage(dbName: string, messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P, DbType>): Promise<void>;
    collect(dbName: string, options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): Promise<(TSwarmMessageInstance | Error)[]>;
    collectWithMeta(dbName: string, options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, Exclude<MI, ISwarmMessageInstanceEncrypted>> | undefined>>;
}
export interface ISwarmMessageStore<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>, MSI extends TSwarmMessageInstance | T, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MSI, GAC, MCF, ACO>> extends ISwarmStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, O>, EventEmitter<ISwarmMessageStoreEvents<P, T, DbType, DBO>>, ISwarmMessageStoreMessagingMethods<P, T, DbType, Exclude<MSI, T>> {
    connect(options: O): TSwarmMessageStoreConnectReturnType<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>;
}
export interface ISwarmMessageStoreConstructor<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>, MSI extends TSwarmMessageInstance | T, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MSI, GAC, MCF, ACO>> {
    new (): ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>;
}
export interface ISwarmMessageStoreWithEntriesCount<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, MSI extends TSwarmMessageInstance | T, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO>> extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>, ISwarmStoreWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O> {
}
export interface ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext> extends ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, T, CTX> {
    (this: CTX, payload: MD | T): Promise<boolean>;
}
//# sourceMappingURL=swarm-message-store.types.d.ts.map