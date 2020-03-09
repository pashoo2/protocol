import { normalizeUrl } from 'utils/common-utils/common-utils-url';
import {
  ICAConnectionsPoolOptions,
  ICAConnectionsPoolConnections,
  IAuthProviderConnectionConfiguration,
  ICAConnectionsPoolCurrentConnections,
  ICAConnectionPool,
} from './central-authority-connections-pool.types';
import {
  normalizeCAConnectionAuthProviderURL,
  validateCAConnectionAuthProviderType,
  validateCAConnectionAuthProviderConnectionConfiguration,
  validateCAConnectionAuthProviderUrl,
} from '../central-authority-connections-utils/central-authority-connections-utils';
import {
  ICAConnection,
  TCAAuthProviderIdentity,
  ICAConnectionSignUpCredentials,
} from '../central-authority-connections.types';
import { getConnectionConstructorAuthProviderType } from '../central-authority-connections-utils/central-authority-connections-utils.common/central-authority-connections-utils.common';
import { ICentralAuthorityUserProfile } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { CA_CONNECTION_STATUS } from '../central-authority-connections-const/central-authority-connections-const';
import { ICAConnectionUserAuthorizedResult } from '../central-authority-connections.types';
import { TCAuthProviderIdentifier } from '../../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { ICAConnectionPoolAuthResult } from './central-authority-connections-pool.types';
import { checkIsValidCryptoCredentials } from '../../central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import CentralAuthorityIdentity from '../../central-authority-class-user-identity/central-authority-class-user-identity';
import { CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME } from '../../central-authority-class-user-identity/central-authority-class-user-identity.const';
import { compareAuthProvidersIdentities } from '../../central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';

/**
 * This is used to establish connections
 * with auth providers to collect a
 * crypto keys of swarm users.
 *
 * @export
 * @class CAConnectionsPool
 */
export class CAConnectionsPool implements ICAConnectionPool {
  public userAuthResult?: ICAConnectionPoolAuthResult;

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
   * connection throught which the user
   * is authorized on auth provider service.
   * Search trought all the connections
   * connection with the auth flag.
   *
   * @readonly
   * @protected
   * @type {(ICAConnection | void)}
   * @memberof CAConnectionsPool
   */
  protected get authConnection(): {
    connection: ICAConnection;
    authProviderId: TCAuthProviderIdentifier;
  } | void {
    const { providersConnectionState } = this;
    const providersConnectionsStates = Object.values(providersConnectionState);
    let idx = 0;
    let authProviderConnection;
    let authProviderUrl;
    const len = providersConnectionsStates.length;

    while (idx < len) {
      ({
        connection: authProviderConnection,
        caProviderUrl: authProviderUrl,
      } = providersConnectionsStates[idx++]);
      if (
        authProviderConnection &&
        authProviderConnection.status === CA_CONNECTION_STATUS.AUTHORIZED
      ) {
        return {
          connection: authProviderConnection,
          authProviderId:
            authProviderUrl ||
            (authProviderConnection.authProviderURL as string),
        };
      }
    }
  }

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
   * at now it is alias for the connect method
   *
   * @param {TCAAuthProviderIdentity} authProvider
   * @returns
   * @memberof CAConnectionsPool
   */
  public getConnection(authProvider: TCAAuthProviderIdentity) {
    return this.connect(authProvider);
  }

  /**
   * establish a new connection with the auth
   * provider or returns an existing connection
   * if it is active(status !== DISCONNECTED)
   *
   * @param {TCAAuthProviderIdentity} authProviderUrl
   * @returns {(Promise<ICAConnection | Error>)}
   * @memberof CAConnectionsPool
   */
  public async connect(
    authProviderUrl: TCAAuthProviderIdentity
  ): Promise<ICAConnection | Error> {
    if (!validateCAConnectionAuthProviderUrl(authProviderUrl)) {
      return new Error(
        'The url provided as the auth provider service url is not valid'
      );
    }

    const currentConnectionWithAuthProvider = this.getActiveConnectionWithAuthProvider(
      authProviderUrl
    );

    if (currentConnectionWithAuthProvider instanceof Error) {
      console.error(currentConnectionWithAuthProvider);
      return new Error(
        `Failed to resolve an active connection with the provider ${authProviderUrl}`
      );
    }
    if (currentConnectionWithAuthProvider) {
      return currentConnectionWithAuthProvider;
    }

    const connectionWithAuthProvider = await this.connectWithAuthProvider(
      authProviderUrl
    );

    if (connectionWithAuthProvider instanceof Error) {
      return connectionWithAuthProvider;
    }

    const setConnectionInAuhProviderConnectionStatesStore = this.setConnectionWithAuthProvider(
      authProviderUrl,
      connectionWithAuthProvider
    );

    if (setConnectionInAuhProviderConnectionStatesStore instanceof Error) {
      console.error(setConnectionInAuhProviderConnectionStatesStore);

      const disconnectResult = await connectionWithAuthProvider.disconnect();

      if (disconnectResult instanceof Error) {
        console.error(disconnectResult);
      }
      return new Error('Failed to set connection with auth provider');
    }
    return connectionWithAuthProvider;
  }

  /**
   * authorize on the service or return an existing
   * connection which is the user authorized through
   *
   * @param {TCAAuthProviderIdentity} authProviderUrl
   * @param {ICAConnectionSignUpCredentials} signUpCredentials
   * @param {Partial<ICentralAuthorityUserProfile>} [profile]
   * @returns {(Promise<Error | ICAConnection>)}
   * @memberof CAConnectionsPool
   */
  public async authorize(
    authProviderUrl: TCAAuthProviderIdentity,
    signUpCredentials: ICAConnectionSignUpCredentials,
    profile?: Partial<ICentralAuthorityUserProfile>
  ): Promise<Error | ICAConnection> {
    if (!validateCAConnectionAuthProviderUrl(authProviderUrl)) {
      return new Error(
        'The url provided as the auth provider service url is not valid'
      );
    }
    if (this.userAuthResult) {
      // if the user is already authorized on auth provider service
      const signOutResult = await this.signOut();

      if (signOutResult instanceof Error) {
        console.error(signOutResult);
        return new Error(
          'The user is already authorized on the auth provider service, and failed to sign out from it'
        );
      }
    }

    const currentConnectionWithProviderAuthOn = this.authConnection;
    const normalizedUrl = normalizeUrl(authProviderUrl);

    if (normalizedUrl instanceof Error) {
      console.error(normalizedUrl);
      return new Error('Failed to normalize the url of the auth provider');
    }
    if (currentConnectionWithProviderAuthOn) {
      const {
        authProviderId: currentAuthProviderUrl,
        connection,
      } = currentConnectionWithProviderAuthOn;
      const normalizedUrlAuthProviderCurrent = normalizeUrl(
        currentAuthProviderUrl
      );

      if (normalizedUrlAuthProviderCurrent !== normalizedUrl) {
        return new Error(
          `Already authorized on the ${normalizedUrlAuthProviderCurrent} service, differ from the requested ${authProviderUrl}`
        );
      }
      return connection;
    }

    const connectionWithAuthProvider = await this.connect(authProviderUrl);

    if (connectionWithAuthProvider instanceof Error) {
      console.error(connectionWithAuthProvider);
      return new Error(
        `Failed to connect with the auth provider ${authProviderUrl}`
      );
    }

    const authResult = await connectionWithAuthProvider.authorize(
      signUpCredentials,
      profile
    );

    if (authResult instanceof Error) {
      const disconnectFromTheConnectionResult = await connectionWithAuthProvider.disconnect();

      if (disconnectFromTheConnectionResult instanceof Error) {
        console.error(disconnectFromTheConnectionResult);
        console.error(
          new Error(
            'Failed to disconnect form the auth provider which failed to authorize on'
          )
        );
      }
      console.error(
        `Failed to authorize with the auth provider ${authProviderUrl}`
      );
      return authResult;
    }
    this.setAuthResult(authProviderUrl, authResult);
    return connectionWithAuthProvider;
  }

  /**
   * disconnect from the auth provider.
   * succed even if not connected to.
   *
   * @param {TCAAuthProviderIdentity} authProviderUrl
   * @returns {(Promise<void | Error>)}
   * @memberof CAConnectionsPool
   */
  public async disconnect(
    authProviderUrl: TCAuthProviderIdentifier
  ): Promise<void | Error> {
    const currentConnectionWithAuthProvider = this.getConnectionWithAuthProvider(
      authProviderUrl
    );

    if (currentConnectionWithAuthProvider instanceof Error) {
      return currentConnectionWithAuthProvider;
    }
    if (currentConnectionWithAuthProvider) {
      const disconnectionResult = await currentConnectionWithAuthProvider.disconnect();

      if (disconnectionResult instanceof Error) {
        console.error(disconnectionResult);
        return new Error(
          `Failed to disconnect from the auth provider ${authProviderUrl}`
        );
      }
    }
    return this.unsetConnectionWithAuthProvider(authProviderUrl);
  }

  /**
   * disconnect from all the active connections
   *
   * @returns {(Promise<Error | void>)}
   * @memberof CAConnectionsPool
   */
  public async close(): Promise<Error | void> {
    const { providersConnectionState } = this;
    const providerConnectionStateValues = Object.values(
      providersConnectionState
    );
    const disconnectResults = [];
    const len = providerConnectionStateValues.length;
    let idx = 0;
    let connectionToAuthProviderStateDesc;
    let connectionToAuthProvider;
    let errorMessage = '';

    while (idx < len) {
      connectionToAuthProviderStateDesc = providerConnectionStateValues[idx++];
      ({
        connection: connectionToAuthProvider,
      } = connectionToAuthProviderStateDesc);
      idx += 1;
      if (connectionToAuthProvider) {
        const connectionToAuthProviderUrl =
          connectionToAuthProviderStateDesc.caProviderUrl;

        if (
          connectionToAuthProvider.status !== CA_CONNECTION_STATUS.DISCONNECTED
        ) {
          disconnectResults.push(
            connectionToAuthProvider
              .disconnect()
              .then((result) => {
                if (result instanceof Error) {
                  console.error(result);
                  errorMessage += `/nThe error has occured when disconnect from the auth provider ${connectionToAuthProviderUrl}`;
                } else {
                  this.unsetConnectionWithAuthProvider(
                    connectionToAuthProviderUrl
                  );
                }
              })
              .catch((err) => {
                console.error(err);
                errorMessage += `/nCrashed while disconnect from the auth provider ${connectionToAuthProviderUrl}`;
              })
          );
        }
        this.unsetConnectionWithAuthProvider(connectionToAuthProviderUrl);
      }
    }
    // wait till all connections will be pro
    await Promise.all(disconnectResults);
    if (errorMessage) {
      return new Error(errorMessage);
    }
  }

  /**
   * sign out from the auth provider service
   * which is currently authorized on and close the connection
   *
   * @returns {(Promise<Error | void>)}
   * @memberof CAConnectionsPool
   */
  public async signOut(): Promise<Error | void> {
    const { authConnection } = this;

    this.unsetAuthResult();
    if (authConnection) {
      const { connection, authProviderId: authProviderUrl } = authConnection;

      if (connection) {
        const disconnectResult = await this.disconnect(authProviderUrl);

        if (disconnectResult instanceof Error) {
          console.error(disconnectResult);
          return new Error(
            `Failed to disconnect from the auth procider ${authProviderUrl} on sign out from it`
          );
        }
      }
    }
  }

  /**
   * set the auth result and check the auth provider
   * in the result is equals to the auth provider id.
   *
   * @protected
   * @param {TCAAuthProviderIdentity} authProviderId
   * @param {ICAConnectionUserAuthorizedResult} authResult
   * @returns {(Error | void)}
   * @memberof CAConnectionsPool
   */
  protected setAuthResult(
    authProviderId: TCAAuthProviderIdentity,
    authResult: ICAConnectionUserAuthorizedResult
  ): Error | void {
    const { cryptoCredentials } = authResult;
    const validationResult = checkIsValidCryptoCredentials(cryptoCredentials);

    if (!validationResult) {
      return new Error('The crypto credentials are not valid');
    }

    const userIdentity = new CentralAuthorityIdentity(
      cryptoCredentials.userIdentity
    );

    if (userIdentity.identityDescription instanceof Error) {
      return new Error('The user identity is not valid');
    }
    if (
      !compareAuthProvidersIdentities(
        userIdentity.identityDescription[
          CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME
        ],
        authProviderId
      )
    ) {
      return new Error(`
        The auth provider url from the auth crdentials ${userIdentity.identityDescription[CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]} is not equals to the provider the user authorized on ${authProviderId}
      `);
    }

    this.userAuthResult = {
      ...authResult,
      authProviderId,
    };
  }

  protected unsetAuthResult() {
    this.userAuthResult = undefined;
  }

  /**
   * returns the current state of a connection
   * to the auth provider.
   *
   * @protected
   * @param {TCAAuthProviderIdentity} authProviderUrl
   * @returns {(ICAConnectionsPoolCurrentConnections | undefined | Error)}
   * @memberof CAConnectionsPool
   */
  protected getAuthProviderStateDesc(
    authProviderUrl: TCAAuthProviderIdentity
  ): ICAConnectionsPoolCurrentConnections | undefined | Error {
    const normalizedUrl = normalizeUrl(authProviderUrl);

    if (normalizedUrl instanceof Error) {
      console.error(normalizedUrl);
      return new Error('The url is not valid');
    }

    const { providersConnectionState } = this;

    return providersConnectionState[normalizedUrl];
  }

  /**
   * returns connection which is active
   * and the status !== DISCONNECTED
   *
   * @protected
   * @param {TCAAuthProviderIdentity} authProviderUrl
   * @returns {(ICAConnection | void | Error)}
   * @memberof CAConnectionsPool
   */
  protected getActiveConnectionWithAuthProvider(
    authProviderUrl: TCAAuthProviderIdentity
  ): ICAConnection | void | Error {
    const authProviderState = this.getAuthProviderStateDesc(authProviderUrl);

    if (authProviderState instanceof Error) {
      return authProviderState;
    }
    if (authProviderState) {
      const { connection } = authProviderState;

      if (
        connection &&
        connection.status !== CA_CONNECTION_STATUS.DISCONNECTED
      ) {
        return connection;
      }
    }
  }

  /**
   * returns any connection
   *
   * @protected
   * @param {TCAAuthProviderIdentity} authProviderUrl
   * @returns {(ICAConnection | void | Error)}
   * @memberof CAConnectionsPool
   */
  protected getConnectionWithAuthProvider(
    authProviderUrl: TCAAuthProviderIdentity
  ): ICAConnection | void | Error {
    const authProviderState = this.getAuthProviderStateDesc(authProviderUrl);

    if (authProviderState instanceof Error) {
      return authProviderState;
    }
    if (authProviderState) {
      return authProviderState.connection;
    }
  }

  /**
   * updates the current state of connection
   * with the auth provider.
   *
   * @protected
   * @param {ICAConnectionsPoolCurrentConnections} authProviderConnectionState
   * @memberof CAConnectionsPool
   */
  protected updateStateAuthProvider(
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
   * set an active connection with an
   * auth provider in the auth
   * providers state.
   *
   * @protected
   * @param {TCAAuthProviderIdentity} authProviderUrl
   * @param {ICAConnection} connection
   * @returns
   * @memberof CAConnectionsPool
   */
  protected setConnectionWithAuthProvider(
    authProviderUrl: TCAAuthProviderIdentity,
    connection: ICAConnection
  ) {
    const authProviderUrlNormalized = normalizeUrl(authProviderUrl);

    if (authProviderUrlNormalized instanceof Error) {
      console.error(authProviderUrlNormalized);
      return new Error('The url is not valid');
    }

    if (!connection) {
      return new Error(
        `Connection with the auth provider ${authProviderUrl} must be specified`
      );
    }
    if (
      typeof connection.authorize !== 'function' ||
      typeof connection.connect !== 'function'
    ) {
      return new Error('The instance of the CAConnection is not valid');
    }
    if (connection.status === CA_CONNECTION_STATUS.DISCONNECTED) {
      return new Error('The connection must be in active state');
    }

    const existingConnection = this.getActiveConnectionWithAuthProvider(
      authProviderUrl
    );

    if (existingConnection instanceof Error) {
      return existingConnection;
    }
    if (existingConnection) {
      return new Error(
        `Connection with the ${authProviderUrl} is already exists`
      );
    }
    return this.updateStateAuthProvider({
      connection,
      caProviderUrl: authProviderUrl,
    });
  }

  /**
   * unset the current connection in the auth provider
   * connections states store
   *
   * @protected
   * @memberof CAConnectionsPool
   */
  protected unsetConnectionWithAuthProvider(
    authProviderUrl: TCAAuthProviderIdentity
  ): Error | void {
    return this.updateStateAuthProvider({
      caProviderUrl: authProviderUrl,
      connection: undefined,
    });
  }

  /**
   * establish a new connection with the auth
   * provider.
   *
   * @protected
   * @param {TCAAuthProviderIdentity} authProviderUrl
   * @returns {(Promise<Error | ICAConnection>)}
   * @memberof CAConnectionsPool
   */
  protected async connectWithAuthProvider(
    authProviderUrl: TCAAuthProviderIdentity
  ): Promise<Error | ICAConnection> {
    const normalizedAuthProviderUrl = normalizeUrl(authProviderUrl);

    if (normalizedAuthProviderUrl instanceof Error) {
      console.error(normalizedAuthProviderUrl);
      return new Error('The url provided for the auth provider is not valid');
    }

    const stateOfAuthProvider = this.getAuthProviderStateDesc(authProviderUrl);

    if (stateOfAuthProvider instanceof Error) {
      console.error(stateOfAuthProvider);
      return new Error(
        `The configuration for the ${authProviderUrl} is not valid`
      );
    }
    if (!stateOfAuthProvider) {
      return new Error(`The url provided ${authProviderUrl} is not known`);
    }

    const { options, caProvider } = stateOfAuthProvider;

    if (!options) {
      return new Error(
        `Connection options is not specified for the auth provider ${authProviderUrl}`
      );
    }
    if (caProvider == null) {
      return new Error(
        'Auth provider type is not specified in the current state'
      );
    }

    const ConnectionConstructor = getConnectionConstructorAuthProviderType(
      caProvider
    );

    if (!ConnectionConstructor) {
      return new Error(
        `There is no constructor class for the auth provider ${authProviderUrl}`
      );
    }
    if (ConnectionConstructor instanceof Error) {
      console.error(ConnectionConstructor);
      return new Error(
        `An error has occurred on define constructor class for the auth provider ${authProviderUrl}`
      );
    }

    let connectionWithAuthProvider;
    try {
      connectionWithAuthProvider = new ConnectionConstructor();
    } catch (err) {
      console.error(err);
      return new Error('The error has occurred when construct the connection');
    }

    const connectionResult = await connectionWithAuthProvider.connect(options);

    if (connectionResult instanceof Error) {
      console.error(connectionResult);
      return new Error(
        `Failed to connect with the auth provider ${authProviderUrl}`
      );
    }
    return connectionWithAuthProvider;
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

    const setAuthProviderConnectionStateResult = this.updateStateAuthProvider({
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
