import { SWARM_CHANNELS_LIST_VERSION } from './../swarm-messages-channels-classes/const/swarm-messages-channels-list-classes-params.const';
import { ESwarmStoreConnector, ESwarmStoreConnectorOrbitDbDatabaseType, TSwarmStoreDatabaseOptions } from '../../swarm-store-class';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../swarm-message';
import { ISwarmMessageChannelDescriptionRaw, TSwarmMessagesChannelId, ISwarmMessagesChannelDescriptionWithMetadata } from './swarm-messages-channel-instance.types';
import { ISwarmMessagesDatabaseConnector } from '../../swarm-messages-database';
import { ISerializer } from '../../../types/serialization.types';
import { ISwarmMessagesListDatabaseNameByDescriptionGenerator, IGetChannelIdByDatabaseKey } from './swarm-messages-channels-utils.types';
import { ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound, TSwarmMessagesStoreGrantAccessCallback, ISwarmMessageStoreAccessControlOptions } from '../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import { JSONSchema7 } from 'json-schema';
import { ISwarmMessagesChannelsListNotificationEmitter } from './swarm-messages-channels-list-events.types';
import { ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams, ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache } from './swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.types';
import { ISwarmMessagesDatabaseCacheOptions, ISwarmMessagesDatabaseCache, ISwarmMessagesDatabaseConnectOptions } from '../../swarm-messages-database/swarm-messages-database.types';
import { ISwarmStoreProviderOptions, ISwarmStoreConnector, ISwarmStoreOptionsConnectorFabric } from '../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreOptionsWithConnectorFabric, ISwarmMessageStore } from '../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmStoreConnectorBasic, TSwarmStoreConnectorConnectionOptions } from '../../swarm-store-class/swarm-store-class.types';
import { IValidatorOfSwarmMessagesChannelsListDescription, ISwamChannelsListDatabaseOptionsValidator } from './swarm-messages-channels-validation.types';
import { ISwarmMessagesChannelDescriptionFormatValidator, IValidatorOfSwarmMessageWithChannelDescription } from './swarm-messages-channels-validation.types';
import { IGetDatabaseKeyForChannelDescription, IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription, IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription } from './swarm-messages-channels-utils.types';
export declare type TSwarmMessagesChannelsListDbType = ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
export declare type TSwrmMessagesChannelsListDBOWithGrantAccess<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, T, TSwarmMessagesChannelsListDbType> = TSwarmStoreDatabaseOptions<P, T, TSwarmMessagesChannelsListDbType>> = Omit<DBO, 'dbName' | 'dbType' | 'grantAccess' | 'preloadCount'> & {
    grantAccess: ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, T, MD, CTX>;
};
export declare type DBOFULL<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>> = TSwarmStoreDatabaseOptions<P, T, TSwarmMessagesChannelsListDbType> & DBO & {
    dbName: string;
    dbType: TSwarmMessagesChannelsListDbType;
    grantAccess: ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, T, MD, CTX>;
};
export interface ISwarmMessagesChannelsListDescription {
    version: SWARM_CHANNELS_LIST_VERSION;
    id: string;
    name: string;
}
export interface ISwarmMessagesChannelsDescriptionsListConnectionOptions<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>> {
    connectorType: P;
    dbOptions: DBO;
}
export interface ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheFabric<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBOL extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, DBO extends DBOFULL<P, T, MD, CTX, DBOL> = DBOFULL<P, T, MD, CTX, DBOL>> {
    (params: ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, DBO, MD>): ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, DBO, MD>;
}
export interface ISwarmMessagesChannelsDescriptionsList<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted> {
    readonly description: Readonly<ISwarmMessagesChannelsListDescription>;
    readonly emitter: ISwarmMessagesChannelsListNotificationEmitter<P, T, any>;
    readonly isReady: boolean;
    readonly swarmChannelsDescriptionsCachedMap: Readonly<Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>>;
    upsertChannel(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void>;
    removeChannelById(channelId: TSwarmMessagesChannelId): Promise<void>;
    getChannelDescriptionById(channelId: TSwarmMessagesChannelId): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined>;
    getAllChannelsDescriptions(): Promise<ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, any, any>[]>;
    close(): Promise<void>;
    drop(): Promise<void>;
}
export interface ISwarmMessagesChannelsDescriptionsListConstructorArgumentsValidators<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>> {
    jsonSchemaValidator(jsonSchema: JSONSchema7, valueToValidate: any): Promise<void>;
    swarmMessagesChannelDescriptionFormatValidator: ISwarmMessagesChannelDescriptionFormatValidator<P, T, any, any>;
    channelDescriptionSwarmMessageValidator: IValidatorOfSwarmMessageWithChannelDescription<P, T, MD, CTX, DBO>;
    channelsListDescriptionValidator: IValidatorOfSwarmMessagesChannelsListDescription;
    swamChannelsListDatabaseOptionsValidator: ISwamChannelsListDatabaseOptionsValidator;
}
export interface ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>> {
    serializer: ISerializer;
    databaseConnectionFabric: CF;
    databaseNameGenerator: ISwarmMessagesListDatabaseNameByDescriptionGenerator;
    getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription: IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription;
    getTypeForSwarmMessageWithChannelDescriptionByChannelDescription: IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription;
    getDatabaseKeyForChannelDescription: IGetDatabaseKeyForChannelDescription<P, T>;
    getChannelIdByDatabaseKey: IGetChannelIdByDatabaseKey<P>;
    getSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache: ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheFabric<P, T, MD, CTX, DBO>;
}
export interface ISwarmMessagesChannelsDescriptionsListConstructorArguments<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>> {
    description: ISwarmMessagesChannelsListDescription;
    connectionOptions: Readonly<ISwarmMessagesChannelsDescriptionsListConnectionOptions<P, T, MD, CTX, DBO>>;
    utilities: ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<P, T, MD, CTX, DBO, CF>;
    validators: ISwarmMessagesChannelsDescriptionsListConstructorArgumentsValidators<P, T, MD, CTX, DBO>;
}
export interface ISwarmMessagesChannelsDescriptionsListConstructor<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>> {
    new (constructorArguments: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>): ISwarmMessagesChannelsDescriptionsList<P, T, MD>;
}
export interface ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, DBOF extends DBOFULL<P, T, MD, CTX, DBO> = DBOFULL<P, T, MD, CTX, DBO>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined = undefined, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T> = TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined = undefined, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, TSwarmMessagesChannelsListDbType, DBOF> = ISwarmStoreConnectorBasic<P, T, TSwarmMessagesChannelsListDbType, DBOF>, CO extends TSwarmStoreConnectorConnectionOptions<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic> = TSwarmStoreConnectorConnectionOptions<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic>, PO extends ISwarmStoreProviderOptions<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO> = ISwarmStoreProviderOptions<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO>, ConnectorMain extends ISwarmStoreConnector<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO> = ISwarmStoreConnector<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain> = ISwarmStoreOptionsConnectorFabric<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain>, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO> = ISwarmMessageStoreOptionsWithConnectorFabric<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, SMS extends ISwarmMessageStore<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O> = ISwarmMessageStore<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, TSwarmMessagesChannelsListDbType, MD> = ISwarmMessagesDatabaseMessagesCollector<P, TSwarmMessagesChannelsListDbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, TSwarmMessagesChannelsListDbType, MD, SMSM> = ISwarmMessagesDatabaseCacheOptions<P, TSwarmMessagesChannelsListDbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, TSwarmMessagesChannelsListDbType, DBOF, MD, SMSM> = ISwarmMessagesDatabaseCache<P, T, TSwarmMessagesChannelsListDbType, DBOF, MD, SMSM>, OPT extends ISwarmMessagesDatabaseConnectOptions<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT> = ISwarmMessagesDatabaseConnectOptions<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT>> {
    (dbo: DBOF): Promise<ISwarmMessagesDatabaseConnector<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>>;
}
//# sourceMappingURL=swarm-messages-channels-list-instance.types.d.ts.map