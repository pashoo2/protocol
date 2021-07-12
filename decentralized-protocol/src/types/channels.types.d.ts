import { IUserDescription, TUserIdentity } from './users.types';
export declare type TChannelMemberRole = 'member' | 'administrator';
export declare type TChannelIdentity = string;
export interface IChannelMemberDescription {
    id: TUserIdentity;
    role: TChannelMemberRole;
}
export interface IMemberFullDescription extends IChannelMemberDescription, IUserDescription {
}
//# sourceMappingURL=channels.types.d.ts.map