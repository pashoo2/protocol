import {
  ICAConnection,
  TCAAuthProviderIdentity,
  TCAConnectionsAuthProviderConnectionOptions,
  ICAConnectionSignUpCredentials,
} from '../central-authority-connections.types';
import { CA_CONNECTION_AUTH_PROVIDERS } from '../central-authority-connections.const';
import { ICentralAuthorityUserProfile } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ICAConnectionUserAuthorizedResult } from '../central-authority-connections.types';
import { TCAuthProviderIdentifier } from '../../central-authority-class-user-identity/central-authority-class-user-identity.types';

/**
 * options to connect with
 * auth provider extended by the provider type
 */
export type TAuthProviderConnectionOptions = TCAConnectionsAuthProviderConnectionOptions;

/**
 * configuration to establish connectoin
 * with an auth provider
 */
export interface IAuthProviderConnectionConfiguration {
  options: TAuthProviderConnectionOptions;
  caProviderUrl: TCAAuthProviderIdentity;
  caProvider: CA_CONNECTION_AUTH_PROVIDERS;
}

/**
 * options for all known auth
 * providers, to establish connection
 * with any provider is necessary to
 * read swarm user's crypro credentials
 *
 * @export
 * @interface ICAConnectionsPoolOptions
 */
export interface ICAConnectionsPoolOptions {
  providers: IAuthProviderConnectionConfiguration[];
}

/**
 * description of a connection which is currently
 * established or not.
 * If connection is defined than it means active.
 *
 * @export
 * @interface ICAConnectionsPoolCurrentConnections
 */
export interface ICAConnectionsPoolCurrentConnections {
  options: TAuthProviderConnectionOptions;
  caProvider: CA_CONNECTION_AUTH_PROVIDERS;
  caProviderUrl: TCAAuthProviderIdentity;
  connection?: ICAConnection;
}

/**
 * States of a connections are in here.
 * If connection is established then
 * it's not necessary to establish a new
 * one.
 *
 * @export
 * @interface ICAConnectionsPoolConnections
 */
export interface ICAConnectionsPoolConnections {
  [key: string]: ICAConnectionsPoolCurrentConnections;
}

export interface ICAConnectionPoolAuthResult extends ICAConnectionUserAuthorizedResult {
  authProviderId: TCAuthProviderIdentifier;
}

export interface ICAConnectionPool {
  // will be defined if the user is authorized
  // on auth provider service, otherwise
  // it will be undefined.
  userAuthResult?: ICAConnectionUserAuthorizedResult;
  // establish a new connection with the auth provider or returns an existing
  getConnection(authProviderUrl: TCAAuthProviderIdentity): Promise<Error | ICAConnection>;
  /**
   *
   *
   * @param {TCAAuthProviderIdentity} authProviderUrl
   * @param {boolean} [isAuthentificateAnonymousely = true] - authentificate without credentials
   * @returns {(Promise<Error | ICAConnection>)}
   * @memberof ICAConnectionPool
   */
  connect(
    authProviderUrl: TCAAuthProviderIdentity,

    isAuthentificateAnonymousely?: boolean
  ): Promise<Error | ICAConnection>;
  // authorize on the auth provider service or return an existing connection authorized on
  authorize(
    authProviderUrl: TCAAuthProviderIdentity,
    signUpCredentials: ICAConnectionSignUpCredentials,
    profile?: Partial<ICentralAuthorityUserProfile>
  ): Promise<Error | ICAConnection>;
  // disconnect from the auth provider service
  disconnect(authProviderUrl: TCAAuthProviderIdentity): Promise<Error | void>;
  // disconnect from all the connected providers
  close(): Promise<Error | void>;
  // sign out from the service currently authorized throught
  signOut(): Promise<Error | void>;
  /**
   * Returns user's profile stored by the CA
   * provider on which the user is authorized on.
   * If the user is not authorized on a CA
   * then undefined will be returned.
   *
   * @returns {(Promise<Partial<ICentralAuthorityUserProfile> | undefined | Error>)}
   * @memberof ICAConnection
   */
  getCAUserProfile(): Promise<Partial<ICentralAuthorityUserProfile> | undefined | Error>;
}
