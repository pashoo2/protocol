import { CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { CentralAuthorityIdentity } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  TCentralAuthorityUserIdentity,
  TCentralAuthorityUserCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import {
  TCAuthProviderIdentifier,
  TCAUserIdentityRawTypes,
} from './../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { CentralAuthorityIdentityCredentialsStorage } from 'classes/central-authority-class/central-authority-storage-local/central-authority-storage-swarm-users-auth/central-authority-storage-swarm-users-identity-credentials/central-authority-storage-swarm-users-identity-credentials';
import {
  ICAIdentityCredentialsStorage,
  ICAIdentityCredentialsStorageConntionOptions,
} from './../central-authority-storage-local/central-authority-storage-swarm-users-auth/central-authority-storage-swarm-users-identity-credentials/central-authority-storage-swarm-users-identity-credentials.types';
import { ICAConnectionPool } from './../central-authority-connections/central-authority-connections-pool/central-authority-connections-pool.types';
import {
  ICASwarmCredentialsProvider,
  ICASwarmCredentialsProviderOptions,
  ICASwarmCredentialsProviderOptionsConnections,
} from './central-authority-swarm-credentials-provider.types';

/**
 * This class used to get credentials of the users by
 * connection to the swarm, and store it in the local
 * cache or from the local cache
 */
export class CASwarmCredentialsProvider implements ICASwarmCredentialsProvider {
  protected isRunning: boolean = false;

  protected options?: ICASwarmCredentialsProviderOptions;

  protected connectionSwarmConnectionPool?: ICAConnectionPool;

  protected connectionLocalCredentialsStorage?: ICAIdentityCredentialsStorage;

  /**
   * connect with a storages and a swarm
   *
   * @param {ICASwarmCredentialsProviderOptions} options
   * @returns {(Promise<void | Error>)}
   * @memberof CASwarmCredentialsProvider
   */
  public connect = async (
    options: ICASwarmCredentialsProviderOptions
  ): Promise<void | Error> => {
    if (this.isRunning) {
      console.warn('The instance is already running');
      return;
    }

    const setOptionsResult = this.setOptions(options);

    if (setOptionsResult instanceof Error) {
      return setOptionsResult;
    }

    const { connections } = options;

    await this.runConnections(connections);
    this.setRunningFlag();
    this.options = options;
  };

  /**
   * close connection with the local credentials
   * storage and unset the current connection
   * with the swarm
   *
   * @returns {(Promise<Error | void>)}
   * @memberof CASwarmCredentialsProvider
   */
  public disconnect = async (): Promise<Error | void> => {
    if (!this.isRunning) {
      return;
    }

    const [
      resDisconnectFromCredentialsStorage,
      resultDisconnectFromSwarmConnectionsPool,
    ] = await Promise.all([
      this.disconnectFromCredentialsStorage(),
      this.disconnectFromSwarmConnectionsPool(),
    ]);
    let error: string = '';

    if (resDisconnectFromCredentialsStorage instanceof Error) {
      console.error(resDisconnectFromCredentialsStorage);
      error = 'Failed to disconnect from the credentials storage';
    }
    if (resultDisconnectFromSwarmConnectionsPool instanceof Error) {
      console.error(resultDisconnectFromSwarmConnectionsPool);
      error = `${error}/nFailed to disconnect from the swarm connections pool`;
    }
    this.unsetConnectionsUsed();
    this.unsetRunningFlag();
    if (error) {
      return new Error(error);
    }
  };

  /**
   * read the user's credentials from the local credentials storage
   * if there is no one, then read credentials from the swarm.
   * If credentials were read from the swarm it will set it
   * in the local credentials storage to cahe the value locally.
   *
   * @param {TCAUserIdentityRawTypes} identity - identity of the user of which is necessary to get credentials of
   * @returns {(Promise<TCentralAuthorityUserCryptoCredentials | Error | null>)}
   * @memberof CASwarmCredentialsProvider
   */
  public async get(
    identity: TCAUserIdentityRawTypes
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | null> {
    if (!this.isRunning) {
      return new Error('The instance is not running');
    }

    const identityInstance = this.getUserIdentityInstance(identity);

    if (identityInstance instanceof Error) {
      return identityInstance;
    }

    const credentialsFromLocalCredentialsStorage = await this.readCredentialsFromLocalCredentialsStorage(
      identityInstance
    );

    if (credentialsFromLocalCredentialsStorage instanceof Error) {
      console.error(credentialsFromLocalCredentialsStorage);
      console.error(
        new Error(
          'Failed to read credentials from the local credentials storage'
        )
      );
    }
    if (credentialsFromLocalCredentialsStorage) {
      return credentialsFromLocalCredentialsStorage;
    }

    const crdentialsFromSwarm = await this.readCredentialsFromTheSwarm(
      identityInstance
    );

    if (crdentialsFromSwarm instanceof Error) {
      console.error(crdentialsFromSwarm);
      return new Error(
        'Failed to get credentials from the credentials provider'
      );
    }
    // set the crdentials read from the swarm in the local credentials storage
    if (crdentialsFromSwarm) {
      const result = await this.setCredentialsInCredentialsStorage(
        crdentialsFromSwarm
      );

      if (result instanceof Error) {
        console.error(result);
      }
    }
    return crdentialsFromSwarm;
  }

  protected validateOptions(
    options: ICASwarmCredentialsProviderOptions
  ): Error | void {
    if (!options) {
      return new Error('An options must be provided');
    }
    if (typeof options !== 'object') {
      return new Error('The options provided must be an object');
    }

    const { connections, storageDb } = options;

    if (!connections) {
      return new Error(
        'The connections parameter is absent in the options object'
      );
    }
    if (!connections.swarmConnectionPool) {
      return new Error(
        'Connection to the swarm connections pool is not provided in the options'
      );
    }
    if (storageDb && typeof storageDb !== 'string') {
      return new Error('The storage db name must be a string');
    }
  }

  protected setOptions(
    options: ICASwarmCredentialsProviderOptions
  ): Error | void {
    const validationResult = this.validateOptions(options);

    if (validationResult instanceof Error) {
      return validationResult;
    }
    this.options = options;
  }

  /**
   * set the flag that the instance is running
   *
   * @protected
   * @memberof CASwarmCredentialsProvider
   */
  protected setRunningFlag() {
    this.isRunning = true;
  }

  /**
   * unset the flag that the instance is running
   *
   * @protected
   * @memberof CASwarmCredentialsProvider
   */
  protected unsetRunningFlag() {
    this.isRunning = false;
  }

  /**
   * Gets auth provider url by user identity
   * @param userIdentity
   * @returns auth provider id by user identity
   */
  protected getAuthProviderIdByUserIdentity(
    userIdentity: CentralAuthorityIdentity
  ): TCAuthProviderIdentifier | Error {
    const { identityDescription } = userIdentity;

    if (identityDescription instanceof Error) {
      return new Error('The identity is not valid');
    }
    return identityDescription[
      CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME
    ];
  }

  /**
   * unset connections to the local credentials
   * storage and the swarm
   *
   * @protected
   * @memberof CASwarmCredentialsProvider
   */
  protected unsetConnectionsUsed() {
    this.connectionSwarmConnectionPool = undefined;
    this.connectionLocalCredentialsStorage = undefined;
  }

  protected async connectToTheLocalCredentialsStorage(): Promise<Error | void> {
    const localCredentialsStorageInstance = await this.startConnectionLocalCredentialsStorage();

    if (localCredentialsStorageInstance instanceof Error) {
      console.error(localCredentialsStorageInstance);
      return new Error(
        'Failed to start an instance of the Local credentials storage'
      );
    }
    this.connectionLocalCredentialsStorage = localCredentialsStorageInstance;
  }

  /**
   * start or use connections to the swarm and
   * the local credentials storage(used for caching)
   *
   * @protected
   * @param {ICASwarmCredentialsProviderOptionsConnections} connections
   * @returns {(Promise<Error | void>)}
   * @memberof CASwarmCredentialsProvider
   */
  protected async runConnections(
    connections: ICASwarmCredentialsProviderOptionsConnections
  ): Promise<Error | void> {
    const { swarmConnectionPool, localCredentialsStorage } = connections;

    if (!swarmConnectionPool) {
      return new Error(
        'A connection to the Swarm connections pool must be provided in the options'
      );
    }
    this.connectionSwarmConnectionPool = swarmConnectionPool;
    if (!localCredentialsStorage) {
      return this.connectToTheLocalCredentialsStorage();
    }
  }

  protected getOptionsForLocalCredentialsStorage():
    | ICAIdentityCredentialsStorageConntionOptions
    | undefined {
    if (this.options && this.options.storageDb) {
      return {
        storageName: this.options.storageDb || '',
      };
    }
  }

  protected async startConnectionLocalCredentialsStorage(): Promise<
    Error | ICAIdentityCredentialsStorage
  > {
    try {
      const connectionLocalCredentialsStorage = new CentralAuthorityIdentityCredentialsStorage();
      const connectToCredentialsStorageResult = await connectionLocalCredentialsStorage.connect(
        this.getOptionsForLocalCredentialsStorage()
      );

      if (connectToCredentialsStorageResult instanceof Error) {
        console.error(connectToCredentialsStorageResult);
        return new Error(
          'Failed to connect with the local credentials storage'
        );
      }
      return connectionLocalCredentialsStorage;
    } catch (err) {
      console.error(err);
      return new Error(
        'An unknown error has thrown on starting a new connection to the local credentials storage'
      );
    }
  }

  /**
   * disconnect from the credentials storage
   *
   * @protected
   * @returns {(Promise<Error | void>)}
   * @memberof CASwarmCredentialsProvider
   */
  protected async disconnectFromCredentialsStorage(): Promise<Error | void> {
    const connection = this.connectionLocalCredentialsStorage;

    if (!connection) {
      console.warn('There is no active connection to the credentials storage');
      return;
    }

    const disconnectResult = await connection.disconnect();

    if (disconnectResult instanceof Error) {
      return disconnectResult;
    }
  }

  /**
   * at now this method do nothing cause the connetion
   * to the swarm may be used in another places
   *
   * @protected
   * @returns {(Promise<Error | void>)}
   * @memberof CASwarmCredentialsProvider
   */
  protected async disconnectFromSwarmConnectionsPool(): Promise<Error | void> {
    const connection = this.connectionSwarmConnectionPool;

    if (!connection) {
      console.warn(
        'There is no active connection to the swarm connections pool'
      );
      return;
    }
    // do not disconnect from the connections swarm connection pool cause
    // it may be used outside of the class
  }

  /**
   * validate and return the user identity to use it
   * to read the user credentials from the local
   * storage or from the swarm
   *
   * @protected
   * @param {TCAUserIdentityRawTypes} userIdentity
   * @returns {(Error | CentralAuthorityIdentity)}
   * @memberof CASwarmCredentialsProvider
   */
  protected getUserIdentityInstance(
    userIdentity: TCAUserIdentityRawTypes
  ): Error | CentralAuthorityIdentity {
    const identityInstance = new CentralAuthorityIdentity(userIdentity);

    if (!identityInstance.isValid) {
      return new Error('The identity provided is not valid');
    }
    return identityInstance;
  }

  /**
   * read user credentials form the local credentials storage
   *
   * @protected
   * @param {CentralAuthorityIdentity} userIdentity
   * @returns {(Promise<Error | undefined | TCentralAuthorityUserCryptoCredentials>)}
   * @memberof CASwarmCredentialsProvider
   */
  protected async readCredentialsFromLocalCredentialsStorage(
    userIdentity: CentralAuthorityIdentity
  ): Promise<Error | null | TCentralAuthorityUserCryptoCredentials> {
    if (!this.connectionLocalCredentialsStorage) {
      console.warn(
        'There is no connection to the local credentials storage - start a new one'
      );
      const connectionResult = await this.connectToTheLocalCredentialsStorage();

      if (
        connectionResult instanceof Error ||
        !this.connectionLocalCredentialsStorage
      ) {
        console.error(connectionResult);
        return new Error(
          'Failed to start a new connection to the local credentials storage'
        );
      }
    }
    return this.connectionLocalCredentialsStorage.getCredentials(userIdentity);
  }

  /**
   * get auth provider identity by the user identity
   * connect to it and request the credentials
   * for the identity
   *
   * @protected
   * @param {CentralAuthorityIdentity} userIdentity
   * @returns {(Promise<Error | null | TCentralAuthorityUserCryptoCredentials>)}
   * @memberof CASwarmCredentialsProvider
   */
  protected async readCredentialsFromTheSwarm(
    userIdentity: CentralAuthorityIdentity
  ): Promise<Error | null | TCentralAuthorityUserCryptoCredentials> {
    const connectionSwarm = this.connectionSwarmConnectionPool;

    if (!connectionSwarm) {
      return new Error('There is no connection to the swarm');
    }

    const authProviderId = this.getAuthProviderIdByUserIdentity(userIdentity);

    if (authProviderId instanceof Error) {
      return authProviderId;
    }

    const connection = await connectionSwarm.connect(authProviderId);

    if (connection instanceof Error) {
      console.error(connection);
      return new Error(
        `Failed to connect to the auth provider ${authProviderId}`
      );
    }
    return connection.getUserCredentials(String(userIdentity));
  }

  /**
   * set the credentials in the local credentials
   * storage
   *
   * @protected
   * @param {CentralAuthorityIdentity} userIdentity
   * @param {TCentralAuthorityUserCryptoCredentials} credentials
   * @returns {(Promsie<void | Error>)}
   * @memberof CASwarmCredentialsProvider
   */
  protected async setCredentialsInCredentialsStorage(
    credentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<void | Error> {
    if (!this.connectionLocalCredentialsStorage) {
      console.warn(
        'There is no connection to the local credentials storage - start a new one'
      );
      const connectionResult = await this.connectToTheLocalCredentialsStorage();

      if (
        connectionResult instanceof Error ||
        !this.connectionLocalCredentialsStorage
      ) {
        console.error(connectionResult);
        return new Error(
          'Failed to start a new connection to the local credentials storage'
        );
      }
    }

    const setCredntialsResult = await this.connectionLocalCredentialsStorage.setCredentials(
      credentials
    );

    if (setCredntialsResult instanceof Error) {
      console.error(setCredntialsResult);
      return new Error('Failed to store crdentials got from the swarm');
    }
  }
}
