import {
  IChannelMemberDescription,
  TChannelIdentity,
} from 'types/channels.types';

export type TChannelMembers = IChannelMemberDescription[];

export abstract class ChannelAuthorityConnection {
  /**
   * request of the channel members full list
   */
  public abstract getChannelMembers(
    channelId: TChannelIdentity
  ): Promise<TChannelMembers | Error>;

  /**
   * reuquest for just a one channel member description
   * null - if the member requested is not a member of the channel
   */
  public abstract getChannelMemberDescription(): Promise<
    IChannelMemberDescription | null | Error
  >;
}
