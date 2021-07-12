import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess, ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric } from '../../../../types/swarm-messages-channels-list-instance.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArguments } from '../../../../types/swarm-messages-channels-list-instance.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../types/swarm-messages-channel-instance.types';
import { TSwarmMessageConstructorBodyMessage } from '../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey } from '../../../../../swarm-store-class/swarm-store-class.types';
export declare abstract class AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>, CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>> {
    protected abstract readonly _connectorType: P;
    protected abstract readonly _channelsListDescription: Readonly<CARGS['description']>;
    protected abstract readonly _connectionOptions: Readonly<CARGS['connectionOptions']>;
    protected abstract readonly _utilities: Readonly<CARGS['utilities']>;
    protected abstract readonly _validators: Readonly<CARGS['validators']>;
    protected abstract _getSerializer(): CARGS['utilities']['serializer'];
    protected abstract _getChannelsListDescription(): Readonly<CARGS['description']>;
    protected abstract _getConnectionOptions(): Readonly<CARGS['connectionOptions']>;
    protected abstract _getUtilities(): Readonly<CARGS['utilities']>;
    protected abstract _getValidators(): Readonly<CARGS['validators']>;
    protected abstract __resetOptionsSetup(): void;
    protected abstract _validateChannelDescriptionFormat(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void>;
    protected abstract _serializeChannelDescriptionRaw(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): string;
    protected abstract _deserializeChannelDescriptionRaw(channelDescriptionSerialized: string): ISwarmMessageChannelDescriptionRaw<P, T, any, any>;
    protected abstract _createChannelDescriptionMessageTyp(): Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ'];
    protected abstract _createChannelDescriptionMessageIssuer(): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'];
    protected abstract _getKeyInDatabaseForStoringChannelsListDescription(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): TSwarmStoreDatabaseEntityKey<P>;
}
export interface IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>, CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>> {
    new (args: CARGS): AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P, T, MD, CTX, DBO, CF, CARGS>;
}
//# sourceMappingURL=swarm-messages-channels-list-v1-class-options-setup.types.d.ts.map