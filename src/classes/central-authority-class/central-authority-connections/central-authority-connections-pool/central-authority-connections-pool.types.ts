import { ICAConnectionConfigurationFirebase } from '../central-authority-connection-firebase/central-authority-connection-firebase.types.configuration';
import {
  ICAConnection,
  TCAAuthProviderURL,
} from '../central-authority-connections.types';
import { CA_CONNECTION_AUTH_PROVIDERS } from '../central-authority-connections.const';

/**
 * options to connect with
 * auth provider extended by the provider type
 */
export type TAuthProviderConnectionOptions = ICAConnectionConfigurationFirebase;

/**
 * configuration to establish connectoin
 * with an auth provider
 */
export interface IAuthProviderConnectionConfiguration {
  options: TAuthProviderConnectionOptions;
  caProviderUrl: TCAAuthProviderURL;
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
  caProviderUrl: TCAAuthProviderURL;
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
