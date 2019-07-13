import { IUserDescription, TUesrIdentity } from 'types/users.types';
export abstract class ChannelAuthorityConnection {
  /**
   * request the users descriptions by the user identities
   */
  public abstract getUsersDescription(
    users: TUesrIdentity[]
  ): Promise<(IUserDescription | null)[] | Error>;
}
