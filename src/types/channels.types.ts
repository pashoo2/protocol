import { IUserDescription, TUserIdentity } from './users.types';

export type TChannelMemberRole = 'member' | 'administrator';

/**
 * identity of a channel
 */
export type TChannelIdentity = string;

/**
 * only the short descirption of the member
 */
export interface IChannelMemberDescription {
  id: TUserIdentity;
  role: TChannelMemberRole;
}

/**
 * the full description of the member
 * including signing and public keys
 */
export interface IMemberFullDescription extends IChannelMemberDescription, IUserDescription {}
