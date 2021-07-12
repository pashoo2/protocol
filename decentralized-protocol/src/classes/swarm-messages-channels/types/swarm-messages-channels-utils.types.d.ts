import { ISwarmMessageInstanceDecrypted, TSwarmMessageConstructorBodyMessage, TSwarmMessageSerialized } from '../../swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../swarm-store-class';
import { ISwarmMessageChannelDescriptionRaw } from './swarm-messages-channel-instance.types';
import { ISwarmMessagesChannelsListDescription } from './swarm-messages-channels-list-instance.types';
import { TSwarmStoreDatabaseEntityKey } from '../../swarm-store-class/swarm-store-class.types';
import { TSwarmChannelId } from '../../../../.ignored/swarm-channel/swarm-channel.types';
export interface IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription {
    (channelsListDescription: ISwarmMessagesChannelsListDescription): Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ'];
}
export interface IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription {
    (channelsListDescription: ISwarmMessagesChannelsListDescription): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'];
}
export interface IGetDatabaseKeyForChannelDescription<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized> {
    (channelDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>>): TSwarmStoreDatabaseEntityKey<P>;
}
export interface IGetChannelIdByDatabaseKey<P extends ESwarmStoreConnector> {
    (databaseKey: TSwarmStoreDatabaseEntityKey<P>): TSwarmChannelId;
}
export interface IBodyCreatorOfSwarmMessageWithChannelDescriptionArgument<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized> {
    channelDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>>;
    channelsListDescription: ISwarmMessagesChannelsListDescription;
    getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription: IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription;
    getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription: IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription;
}
export interface IBodyCreatorOfSwarmMessageWithChannelDescription<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized> {
    (argument: IBodyCreatorOfSwarmMessageWithChannelDescriptionArgument<P, T>): TSwarmMessageConstructorBodyMessage;
}
export interface ISwarmMessagesListDatabaseNameByDescriptionGenerator {
    (swarmMessagesListDescription: ISwarmMessagesChannelsListDescription): string;
}
export interface IChannelDescriptionBySwarmMessageFabric<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted> {
    (swarmMessage: MD): Promise<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>;
}
//# sourceMappingURL=swarm-messages-channels-utils.types.d.ts.map