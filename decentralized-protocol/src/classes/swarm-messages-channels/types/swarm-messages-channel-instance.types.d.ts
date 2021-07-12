import { SWARM_MESSAGES_CHANNEL_VERSION } from './../swarm-messages-channels-classes/const/swarm-messages-channel-classes-params.const';
import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnector, ISwarmStoreConnectorBasic, ISwarmStoreOptionsConnectorFabric, ISwarmStoreProviderOptions, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from 'classes/swarm-store-class/swarm-store-class.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../const/swarm-messages-channels-main.const';
import { TSwarmMessageUserIdentifierSerialized } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { ISwarmMessageStore, ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreOptionsWithConnectorFabric, TSwarmMessagesStoreGrantAccessCallback } from 'classes/swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from 'classes/swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ISwarmMessagesDatabaseCache, ISwarmMessagesDatabaseCacheOptions, ISwarmMessagesDatabaseConnectOptions } from 'classes/swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from 'classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ISwarmMessageStoreDeleteMessageArg, ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../swarm-message-store/types/swarm-message-store.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessagesChannelsDescriptionsList } from './swarm-messages-channels-list-instance.types';
import { TSwarmStoreDatabaseEntityKey, TSwarmStoreDatabaseIteratorMethodArgument } from '../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions } from '../../swarm-messages-database/swarm-messages-database-fabrics/types/swarm-messages-database-instance-fabric-by-database-options.types';
import { ISwarmMessagesChannelNotificationEmitter } from './swarm-messages-channel-events.types';
import { TCentralAuthorityUserIdentity } from '../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { IQueuedEncryptionClassBase } from '../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessageDatabaseEvents, TSwarmMessageDatabaseMessagesCached } from '../../swarm-messages-database/swarm-messages-database.types';
import { TTypedEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base.types';
export declare type TSwarmMessagesChannelId = string;
export declare type TSwarmMessageChannelDatabaseOptions<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> = Pick<DBO, 'isPublic' | 'write' | 'grantAccess'>;
export interface ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>> {
    readonly id: TSwarmMessagesChannelId;
    readonly version: SWARM_MESSAGES_CHANNEL_VERSION;
    readonly name: string;
    readonly description: string;
    readonly tags: string[];
    readonly dbType: DbType;
    readonly messageEncryption: SWARM_MESSAGES_CHANNEL_ENCRYPTION;
    readonly admins: Array<TSwarmMessageUserIdentifierSerialized>;
}
export interface ISwarmMessageChannelDescriptionRaw<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> extends ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<P, DbType> {
    dbOptions: TSwarmMessageChannelDatabaseOptions<P, T, DbType, DBO>;
}
export interface ISwarmMessageChannelDescriptionRaw<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> {
    id: TSwarmMessagesChannelId;
    version: SWARM_MESSAGES_CHANNEL_VERSION;
    name: string;
    description: string;
    tags: string[];
    dbType: DbType;
    dbOptions: TSwarmMessageChannelDatabaseOptions<P, T, DbType, DBO>;
    messageEncryption: SWARM_MESSAGES_CHANNEL_ENCRYPTION;
    admins: Array<TSwarmMessageUserIdentifierSerialized>;
}
export interface ISwarmMessagesChannelDescriptionWithMetadata<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> extends Readonly<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>> {
    readonly channelDescription: Error | ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;
}
export interface ISwarmMessagesChannel<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>, MD extends ISwarmMessageInstanceDecrypted> extends ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<P, DbType> {
    readonly isReady: boolean;
    readonly markedAsRemoved: boolean;
    readonly emitterChannelState: ISwarmMessagesChannelNotificationEmitter<P, T, DbType>;
    readonly emitterChannelMessagesDatabase: TTypedEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>;
    readonly channelInactiveReasonError: Error | undefined;
    readonly cachedMessages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
    close(): Promise<void>;
    addMessage(message: Omit<MD['bdy'], 'iss'>, key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined): Promise<void>;
    deleteMessage(messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P, DbType>): Promise<void>;
    collect(options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): Promise<Array<Error | MD>>;
    collectWithMeta(options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>>;
    updateChannelDescription(channelRawDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>): Promise<void>;
    deleteLocally(): Promise<void>;
    dropDescriptionAndDeleteRemotely(): Promise<void>;
}
export interface ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> {
    (swarmMessagesChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>): string;
}
export interface ISwarmMessagesChannelMessageIssuerByChannelDescription<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> {
    (swarmMessagesChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>): string;
}
export interface ISwarmMessagesChannelConstructorUtils<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>, OPT extends ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT>> {
    swarmMessagesDatabaseConnectorInstanceByDBOFabric: ISwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>;
    getSwarmMessageIssuerByChannelDescription: ISwarmMessagesChannelMessageIssuerByChannelDescription<P, T, DbType, DBO>;
    getDatabaseNameByChannelDescription: ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription<P, T, DbType, DBO>;
}
export interface ISwarmMessagesChannelConstructorOptions<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>, OPT extends ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT>, CHD extends ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> = ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>> {
    currentUserId: TCentralAuthorityUserIdentity;
    swarmMessagesChannelDescription: CHD;
    swarmMessagesChannelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>;
    passwordEncryptedChannelEncryptionQueue: CHD['messageEncryption'] extends SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD ? IQueuedEncryptionClassBase : never;
    utils: ISwarmMessagesChannelConstructorUtils<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>;
}
export interface ISwarmMessagesChannelConstructor<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>, OPT extends ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT>, ADDT extends Array<any> = never> {
    new (options: ISwarmMessagesChannelConstructorOptions<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>, ...additionalParameter: ADDT): ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>;
}
//# sourceMappingURL=swarm-messages-channel-instance.types.d.ts.map