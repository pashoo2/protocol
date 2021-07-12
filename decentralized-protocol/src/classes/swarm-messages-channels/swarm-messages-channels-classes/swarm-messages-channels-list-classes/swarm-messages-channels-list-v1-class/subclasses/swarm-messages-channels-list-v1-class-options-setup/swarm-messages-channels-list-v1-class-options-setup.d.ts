import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessagesChannelsDescriptionsListConnectionOptions, TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../../types/swarm-messages-channels-list-instance.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArguments, ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric } from '../../../../../types/swarm-messages-channels-list-instance.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp, IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp } from '../../types/swarm-messages-channels-list-v1-class-options-setup.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../../types/swarm-messages-channel-instance.types';
import { TSwarmMessageConstructorBodyMessage } from '../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey } from '../../../../../../swarm-store-class/swarm-store-class.types';
export declare class SwarmMessagesChannelsListVersionOneOptionsSetUp<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>, CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>> extends AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P, T, MD, CTX, DBO, CF, CARGS> {
    protected readonly _channelsListDescription: Readonly<CARGS['description']>;
    protected readonly _connectionOptions: Readonly<CARGS['connectionOptions']>;
    protected readonly _utilities: Readonly<CARGS['utilities']>;
    protected readonly _validators: Readonly<CARGS['validators']>;
    protected readonly _connectorType: P;
    constructor(constructorArguments: CARGS);
    protected __resetOptionsSetup(): void;
    protected _validateConstructorArgumentsConnectionOptions(connectionOptions: Readonly<ISwarmMessagesChannelsDescriptionsListConnectionOptions<P, T, MD, CTX, DBO>>): void;
    protected _validateConstructorArgumentsValidators(validators: CARGS['validators']): void;
    protected _validateConstructorArgumentsUtitlities(utilities: CARGS['utilities']): void;
    protected _validateConstructorArguments(constructorArguments: CARGS): void;
    protected _getChannelsListDescription(): Readonly<CARGS['description']>;
    protected _getConnectionOptions(): Readonly<CARGS['connectionOptions']>;
    protected _getUtilities(): Readonly<CARGS['utilities']>;
    protected _getSerializer(): CARGS['utilities']['serializer'];
    protected _getValidators(): Readonly<CARGS['validators']>;
    protected _getJSONSchemaValidator(): CARGS['validators']['jsonSchemaValidator'];
    protected _getSwarmMessagesChannelDescriptionValidator(): CARGS['validators']['swarmMessagesChannelDescriptionFormatValidator'];
    protected _validateChannelDescriptionFormat(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void>;
    protected _serializeChannelDescriptionRaw(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): string;
    protected _deserializeChannelDescriptionRaw(channelDescriptionSerialized: string): ISwarmMessageChannelDescriptionRaw<P, T, any, any>;
    protected _createChannelDescriptionMessageTyp(): Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ'];
    protected _createChannelDescriptionMessageIssuer(): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'];
    protected _getKeyInDatabaseForStoringChannelsListDescription(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): TSwarmStoreDatabaseEntityKey<P>;
    protected _parseSwarmMessagesChannelDescription: (channelDescription: string) => ISwarmMessageChannelDescriptionRaw<P, T, any, any>;
}
export declare function getIConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>, CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>>(): IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P, T, MD, CTX, DBO, CF, CARGS>;
//# sourceMappingURL=swarm-messages-channels-list-v1-class-options-setup.d.ts.map