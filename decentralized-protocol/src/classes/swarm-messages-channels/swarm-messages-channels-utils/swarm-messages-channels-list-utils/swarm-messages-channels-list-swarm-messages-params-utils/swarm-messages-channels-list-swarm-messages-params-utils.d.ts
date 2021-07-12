import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, TSwarmMessageConstructorBodyMessage } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageChannelDescriptionRaw, TSwarmMessagesChannelId } from '../../../types/swarm-messages-channel-instance.types';
import { ISwarmMessagesChannelsListDescription } from '../../../types/swarm-messages-channels-list-instance.types';
import { TSwarmStoreDatabaseEntityKey } from '../../../../swarm-store-class/swarm-store-class.types';
export declare function getChannelsListDatabaseKeyForChannelDescription<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized>(channelDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>>): TSwarmStoreDatabaseEntityKey<P>;
export declare function getSwarmMessagesChannelIdByChannelsListDatabaseKey<P extends ESwarmStoreConnector>(keyForChannelDescriptionInDatabase: TSwarmStoreDatabaseEntityKey<P>): TSwarmMessagesChannelId;
export declare function getSwarmMessageWithChannelDescriptionTypeByChannelListDescription(channelsListDescription: ISwarmMessagesChannelsListDescription): Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ'];
export declare function getSwarmMessageWithChannelDescriptionIssuerByChannelListDescription(channelsListDescription: Readonly<ISwarmMessagesChannelsListDescription>): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'];
export declare function getSwarmMessagesListDatbaseNameByChannelDescription(swarmMessagesListDescription: ISwarmMessagesChannelsListDescription): string;
//# sourceMappingURL=swarm-messages-channels-list-swarm-messages-params-utils.d.ts.map