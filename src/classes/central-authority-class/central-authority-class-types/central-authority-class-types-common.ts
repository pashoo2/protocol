import { IUserDescription, TUesrIdentity } from 'types/users.types';
import { IHttpRequestOptions } from 'classes/basic-classes/http-request-class-base/http-request-class-base.types';
import {
  CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME,
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
} from '../central-authority-class-const/central-authority-class-const-auth-credentials';
import { TCACryptoKeyPairs } from './central-authority-class-types-crypto-keys';
import {
  TCentralAuthorityUserCryptoCredentials,
  TCentralAuthorityCredentialsStorageAuthCredentials,
} from './central-authority-class-types-crypto-credentials';

export type TCentralAuthorityUserIdentity = string;

export interface ICentralAuthorityUserAuthCredentials {
  login: string;
  password: string;
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

export interface ICentralAuthorityStorageCryptoCredentials {
  connect(
    credentials?: TCentralAuthorityCredentialsStorageAuthCredentials
  ): Promise<boolean | Error>;
  setCredentials(cryptoKeyPairs: TCACryptoKeyPairs): Promise<Error | boolean>;
  getCredentials(): Promise<
    TCentralAuthorityUserCryptoCredentials | Error | null
  >;
  disconnect(): Promise<boolean | Error>;
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
