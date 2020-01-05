import { ICAConnectionConfigurationFirebase } from '../central-authority-connection-firebase/central-authority-connection-firebase.types.configuration';
import {
  ICAConnection,
  TCAAuthProviderIdentity,
  TCAConnectionsAuthProviderConnectionOptions,
  ICAConnectionSignUpCredentials,
} from '../central-authority-connections.types';
import { CA_CONNECTION_AUTH_PROVIDERS } from '../central-authority-connections.const';
import { ICentralAuthorityUserProfile } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

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

export interface ICAConnectionPool {
  // establish a new connection with the auth provider or returns an existing
  getConnection(
    authProviderUrl: TCAAuthProviderIdentity
  ): Promise<Error | ICAConnection>;
  // establish a new connection with the auth provider or returns an existing
  connect(
    authProviderUrl: TCAAuthProviderIdentity
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
}