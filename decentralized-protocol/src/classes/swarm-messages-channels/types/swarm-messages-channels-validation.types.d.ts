import { TSwarmMessageUserIdentifierSerialized } from '../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { ESwarmStoreConnector, TSwarmStoreDatabaseEntryOperation, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../swarm-store-class';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../swarm-message';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageChannelDescriptionRaw } from './swarm-messages-channel-instance.types';
import { JSONSchema7 } from 'json-schema';
import { TSwarmStoreDatabaseEntityKey } from '../../swarm-store-class/swarm-store-class.types';
import { IGetDatabaseKeyForChannelDescription, IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription, IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription } from './swarm-messages-channels-utils.types';
import { ISwarmMessagesChannelsListDescription, TSwrmMessagesChannelsListDBOWithGrantAccess } from './swarm-messages-channels-list-instance.types';
export interface ISwarmMessagesChannelDescriptionFormatValidator<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> {
    (channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>, jsonSchemaValidator: (jsonSchema: JSONSchema7, valueToValidate: any) => Promise<void>): Promise<void>;
}
export interface ISwarmMessagesChannelDescriptionParser<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> {
    (channelDescriptionSerialized: string): Promise<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>> | ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;
}
export interface IValidatorOfSwarmMessageWithChannelDescription<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>> {
    (this: CTX, argument: IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, MD, CTX, DBO>): Promise<void>;
}
export interface IValidatorOfSwarmMessagesChannelsListDescription {
    (swarmMessagesChannelsListDescription: ISwarmMessagesChannelsListDescription): void;
}
export interface ISwamChannelsListDatabaseOptionsValidator {
    (dbOptions: unknown): dbOptions is TSwrmMessagesChannelsListDBOWithGrantAccess<any, any, any, any>;
}
export interface IValidatorOfSwarmMessageWithChannelDescriptionArgument<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>> {
    isDatabaseReady: boolean;
    messageOrHash: T | MD;
    senderUserId: TSwarmMessageUserIdentifierSerialized;
    keyInDb: TSwarmStoreDatabaseEntityKey<P> | undefined;
    operationInDb: TSwarmStoreDatabaseEntryOperation<P>;
    timeEntryAdded: number;
    channelExistingDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>> | undefined;
    channelsListDescription: ISwarmMessagesChannelsListDescription;
    grandAccessCallbackFromDbOptions: NonNullable<DBO['grantAccess']>;
    getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription: IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription;
    getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription: IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription;
    getDatabaseKeyForChannelDescription: IGetDatabaseKeyForChannelDescription<P, T>;
    channelDescriptionFormatValidator: ISwarmMessagesChannelDescriptionFormatValidator<P, T, any, TSwarmStoreDatabaseOptions<P, T, any>>;
    parseChannelDescription: ISwarmMessagesChannelDescriptionParser<P, T, any, any>;
}
//# sourceMappingURL=swarm-messages-channels-validation.types.d.ts.map