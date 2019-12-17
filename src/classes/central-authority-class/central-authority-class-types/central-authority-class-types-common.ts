import { IUserDescription, TUesrIdentity } from 'types/users.types';
import { IHttpRequestOptions } from 'classes/basic-classes/http-request-class-base/http-request-class-base.types';
import {
  CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME,
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
} from '../central-authority-class-const/central-authority-class-const-auth-credentials';

export type TCentralAuthorityUserIdentity = string;

export type TCentralAuthorityUserLogin = string;

export type TCentralAuthorityUserPassword = string;

export interface ICentralAuthorityUserAuthCredentials {
  login: TCentralAuthorityUserLogin;
  password: TCentralAuthorityUserPassword;
}

export type TCentralAuthorityAuthCredentials = {
  [CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME]: string;
  [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: TCentralAuthorityUserIdentity;
};

export interface ICentralAuthorityUserProfile {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  photoURL?: string | null;
}

export interface ICentralAuthorityConnectionOptions {
  serverUrl: string;
  getUsersDescriptionsRequestOptions: IHttpRequestOptions;
}

export abstract class CentralAuthorityConnection {
  constructor() {}
  /**
   * request the users descriptions by the user identities
   */
  public abstract getUsersDescription(
    users: TUesrIdentity[]
  ): Promise<(IUserDescription | null)[] | Error>;
}

export interface ICentralAuthorityConnection {
  new (): CentralAuthorityConnection;
}

export type TInstanceOfCentralAuthorityConnection = InstanceType<
  ICentralAuthorityConnection
>;
