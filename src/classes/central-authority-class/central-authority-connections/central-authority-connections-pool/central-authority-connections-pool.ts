import {
  ICAConnectionsPoolOptions,
  ICAConnectionsPoolConnections,
  IAuthProviderConnectionConfiguration,
  ICAConnectionsPoolCurrentConnections,
} from './central-authority-connections-pool.types';
import {
  normalizeCAConnectionAuthProviderURL,
  validateCAConnectionAuthProviderType,
  validateCAConnectionAuthProviderConnectionConfiguration,
} from '../central-authority-connections-utils/central-authority-connections-utils';

/**
 * This is used to establish connections
 * with auth providers to collect a
 * crypto keys of swarm users.
 *
 * @export
 * @class CAConnectionsPool
 */
export class CAConnectionsPool {
  /**
   * States of connections to auth
   * providers
   *
   * @protected
   * @type {ICAConnectionsPoolConnections}
   * @memberof CAConnectionsPool
   */
  protected providersConnectionState: ICAConnectionsPoolConnections = {};

  /**
   * Creates an instance of CAConnectionsPool.
   * @param {ICAConnectionsPoolOptions} options
   * @memberof CAConnectionsPool
   * @throws
   */
  constructor(options: ICAConnectionsPoolOptions) {
    this.setOptions(options);
  }

  /**
   * set the current state of a connection
   * to the auth provider
   *
   * @protected
   * @param {ICAConnectionsPoolCurrentConnections} authProviderConnectionState
   * @memberof CAConnectionsPool
   */
  protected setStateForAuthProvider(
    authProviderConnectionState: Partial<
      ICAConnectionsPoolCurrentConnections
    > & { caProviderUrl: ICAConnectionsPoolCurrentConnections['caProviderUrl'] }
  ) {
    const { caProviderUrl } = authProviderConnectionState;

    if (!caProviderUrl) {
      return new Error('An url of the auth provider must be specified');
    }

    const authProviderUrlNormalized = normalizeCAConnectionAuthProviderURL(
      caProviderUrl
    );

    if (authProviderUrlNormalized instanceof Error) {
      return authProviderUrlNormalized;
    }

    const { providersConnectionState } = this;
    const existingState = providersConnectionState[authProviderUrlNormalized];

    if (!existingState) {
      providersConnectionState[
        caProviderUrl
      ] = authProviderConnectionState as ICAConnectionsPoolCurrentConnections;
    } else {
      Object.assign(existingState, authProviderConnectionState);
    }
  }

  /**
   * add auth provider in the description
   * of a state of connections
   *
   * @protected
   * @param {IAuthProviderConnectionConfiguration} authProviderConnectionConfiguration
   * @memberof CAConnectionsPool
   * @throws
   */
  protected addAuthProvider = (
    authProviderConnectionConfiguration: IAuthProviderConnectionConfiguration
  ): void => {
    if (!authProviderConnectionConfiguration) {
      throw new Error('Configuration for the auth provider is not defined');
    }
    if (typeof authProviderConnectionConfiguration !== 'object') {
      throw new Error('Configuration must be an object');
    }

    const {
      caProvider,
      caProviderUrl,
      options,
    } = authProviderConnectionConfiguration;

    if (caProvider == null) {
      throw new Error('Provider type must be defined');
    }
    if (!validateCAConnectionAuthProviderType(caProvider)) {
      throw new Error('The auth provider type is wrong');
    }

    const authProviderUrlNormalized = normalizeCAConnectionAuthProviderURL(
      caProviderUrl
    );
    const { providersConnectionState } = this;

    if (authProviderUrlNormalized instanceof Error) {
      throw authProviderUrlNormalized;
    }
    if (providersConnectionState[authProviderUrlNormalized]) {
      throw new Error(
        `Configuration was already set for the auth provider ${authProviderUrlNormalized}`
      );
    }
    if (!options) {
      throw new Error(
        `Configuration for the auth provider ${authProviderUrlNormalized} is not specified`
      );
    }
    if (
      !validateCAConnectionAuthProviderConnectionConfiguration(
        caProvider,
        options
      )
    ) {
      throw new Error(
        `The configuration for the auth provider ${authProviderUrlNormalized} is not valid`
      );
    }

    const setAuthProviderConnectionStateResult = this.setStateForAuthProvider({
      caProvider,
      caProviderUrl,
      options,
    });

    if (setAuthProviderConnectionStateResult instanceof Error) {
      throw setAuthProviderConnectionStateResult;
    }
  };

  /**
   * set options for auth providers connections constructors
   *
   * @protected
   * @param {IAuthProviderConnectionConfiguration[]} providers
   * @memberof CAConnectionsPool
   * @throws
   */
  protected setOptionsOfAuthProviders(
    providers: IAuthProviderConnectionConfiguration[]
  ): void {
    if (!providers) {
      throw new Error('Providers property must be specified');
    }
    if (!(providers instanceof Array)) {
      throw new Error('Providers must be an instance of Array');
    }
    if (!providers.length) {
      throw new Error('Providers property must not be an empty array');
    }
    // add each auth provider configuration
    // to connect on in a feature
    providers.forEach(this.addAuthProvider);
  }

  /**
   * set options for the instance.
   *
   * @protected
   * @param {ICAConnectionsPoolOptions} options
   * @memberof CAConnectionsPool
   * @throws
   */
  protected setOptions(options: ICAConnectionsPoolOptions): void {
    const { providers } = options;

    this.setOptionsOfAuthProviders(providers);
  }
}
