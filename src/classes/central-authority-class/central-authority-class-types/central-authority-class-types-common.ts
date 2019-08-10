import { IUserDescription, TUesrIdentity } from 'types/users.types';
import { IHttpRequestOptions } from 'classes/basic-classes/http-request-class-base/http-request-class-base.types';

export interface ICentralAuthorityConnectionOptions {
  serverUrl: string;
  getUsersDescriptionsRequestOptions: IHttpRequestOptions;
}

export abstract class CentralAuthorityConnection {
  constructor(options: ICentralAuthorityConnectionOptions) {}
  /**
   * request the users descriptions by the user identities
   */
  public abstract getUsersDescription(
    users: TUesrIdentity[]
  ): Promise<(IUserDescription | null)[] | Error>;
}

export interface ICentralAuthorityConnection {
  new (options: ICentralAuthorityConnectionOptions): CentralAuthorityConnection;
}

export type TInstanceOfCentralAuthorityConnection = InstanceType<
  ICentralAuthorityConnection
>;
