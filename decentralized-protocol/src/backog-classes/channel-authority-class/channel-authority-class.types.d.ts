import { IChannelMemberDescription, TChannelIdentity } from 'types/channels.types';
export declare type TChannelMembers = IChannelMemberDescription[];
export declare abstract class ChannelAuthorityConnection {
    abstract getChannelMembers(channelId: TChannelIdentity): Promise<TChannelMembers | Error>;
    abstract getChannelMember(): Promise<IChannelMemberDescription | null | Error>;
}
//# sourceMappingURL=channel-authority-class.types.d.ts.map