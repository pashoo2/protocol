import { checkIsError } from '../../utils/common-utils/common-utils-check-value';
import { dataCachingUtilsCachingDecoratorGlobalCachePerClass } from '../../utils/data-cache-utils/data-cache-utils-caching-decorator-global-cache-per-class/data-cache-utils-caching-decorator-global-cache-per-class';
import { validateVerboseBySchema } from './../../utils/validation-utils/validation-utils';
import { getErrorScopedClass } from './../basic-classes/error-extended-scoped-class-base/error-extended-scoped-class-base';
import {
  ICentralAuthorityUserProfile,
  TCentralAuthorityUserIdentity,
} from './central-authority-class-types/central-authority-class-types-common';
import { TCentralAuthorityUserCryptoCredentials } from './central-authority-class-types/central-authority-class-types-crypto-credentials';
import {
  TCAUserIdentityRawTypes,
  TCAuthProviderIdentifier,
} from './central-authority-class-user-identity/central-authority-class-user-identity.types';
import {
  CENTRAL_AUTHORITY_CLASS_ERRORS_PREFIX,
  CENTRAL_AUTHORITY_CLASS_OPTIONS_SCHEMA,
  CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_STORAGE_DB_NAME,
  CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_SWARM_USERS_CREDENTIALS_CACHE_CAPACITY,
} from './central-authority-class.const';
import {
  ICentralAuthority,
  ICentralAuthorityAuthProvidersOptions,
  ICentralAuthorityOptions,
  ICentralAuthorityUser,
} from './central-authority-class.types';
import { CAConnectionsPool } from './central-authority-connections/central-authority-connections-pool/central-authority-connections-pool';
import {
  ICAConnectionPool,
  ICAConnectionPoolAuthResult,
  ICAConnectionsPoolOptions,
} from './central-authority-connections/central-authority-connections-pool/central-authority-connections-pool.types';
import {
  ICAConnectionSignUpCredentials,
  TCAAuthProviderIdentity,
} from './central-authority-connections/central-authority-connections.types';
import { CentralAuthorityStorageCurrentUserCredentials } from './central-authority-storage-local/central-authority-storage-current-user-auth/central-authority-storage-current-user-credentials/central-authority-storage-current-user-credentials';
import {
  ICAStorageCurrentUserCredentials,
  ICAStorageCurrentUserCredentialsOptions,
} from './central-authority-storage-local/central-authority-storage-current-user-auth/central-authority-storage-current-user-credentials/central-authority-storage-current-user-credentials.types';
import { CASwarmCredentialsProvider } from './central-authority-swarm-credentials-provider/central-authority-swarm-credentials-provider';
import {
  ICASwarmCredentialsProvider,
  ICASwarmCredentialsProviderOptions,
} from './central-authority-swarm-credentials-provider/central-authority-swarm-credentials-provider.types';
import {
  compareCryptoCredentials,
  exportCryptoCredentialsToString,
} from './central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import {
  getDataEncryptionKeyPairByCryptoCredentials,
  getDataEncryptionPubKeyByCryptoCredentials,
  getDataSignKeyPairByCryptoCredentials,
  getDataSignPubKeyByCryptoCredentials,
  getUserIdentityFromCryptoCredentials,
} from './central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials-crypto-keys';
import { checkIsValidCryptoCredentials } from './central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import { ISecretStoreCredentialsSession, ISecretStoreCredentials } from '../secret-storage-class/secret-storage-class.types';

const CAError = getErrorScopedClass(CENTRAL_AUTHORITY_CLASS_ERRORS_PREFIX);

/**
 * Used to get and approve the
 * user's credentials stored by
 * an authorization provider.
 * It's necessary to allow each user
 * can connect and get info from
 * all authorization providers.
 * This class used to authorize the user
 * in the SWARM. User must register on one of
 * authority providers services with a
 * public credentials which used by another
 * to authorize the user and approve him
 * to access on the data.
 *
 * @export
 * @class CentralAuthority
 */
export class CentralAuthority implements ICentralAuthority {
  public get isRunning(): boolean {
    return this.isRunningInstance;
  }

  protected isRunningInstance: boolean = false;
  /**
   * an identity of auth provider the user is authorized on
   *
   * @protected
   * @type {TCAuthProviderIdentifier}
   * @memberof CentralAuthority
   */
  protected authProviderId?: TCAuthProviderIdentifier;
  /**
   * crypto credentials of the user, for the auth provider
   * the user is authorized on
   *
   * @protected
   * @type {TCentralAuthorityUserCryptoCredentials}
   * @memberof CentralAuthority
   */
  protected remoteProvidedUserCryptoCredntials?: TCentralAuthorityUserCryptoCredentials;
  protected locallyStoredUserCryptoCredntials?: TCentralAuthorityUserCryptoCredentials;
  protected userProfileOnAuthService?: ICentralAuthorityUserProfile;
  protected authProvidersPoolConfiguration?: ICentralAuthorityAuthProvidersOptions;
  protected connectionAuthProvidersPool?: ICAConnectionPool;
  protected connectionStorageCurrentUserCrdentials?: ICAStorageCurrentUserCredentials;
  protected connectionSwarmCredentialsProvider?: ICASwarmCredentialsProvider;

  protected get errorNotRunning() {
    return new CAError('The instance is not running');
  }

  public async connect(options: ICentralAuthorityOptions): Promise<Error | void> {
    if (this.isRunning) {
      console.warn('This instance is already running');
    }
    const setOptionsResult = this.setOptions(options);

    if (setOptionsResult instanceof Error) {
      return setOptionsResult;
    }
    // TODO - it's necessary to user credentials by getByAuthProvider
    // and compare it with credentials provided in options
    // and compare it by credentials provided from connection to
    // auth provider
    const [resultUserCredentialsStorage, resultCAAuthProvidersConnectionsPool] = await Promise.all([
      this.connectToUserCredentialsStorage(options.user),
      this.connectToAuthProvidersPool(options.authProvidersPool, options.user),
    ]);
    let isError = false;

    if (resultUserCredentialsStorage instanceof Error) {
      console.error(resultUserCredentialsStorage);
      isError = true;
    }
    if (resultCAAuthProvidersConnectionsPool instanceof Error) {
      // TODO - this is important to preserve this error, to
      // notify the users with the error same as returned by the
      // central authority. Cause the user may need to verify
      // his email address or make another action.
      return this.handleFailAndClose(resultCAAuthProvidersConnectionsPool);
    }
    if (isError) {
      return this.handleFailAndClose('There is an error occurred while connecting to the providers');
    }

    const setLocallyStoredCredentialsResult = await this.readAndSetLocallyStoredUserCredentials();

    if (setLocallyStoredCredentialsResult instanceof Error) {
      console.error(setLocallyStoredCredentialsResult);
      return this.handleFailAndClose('Failed to read the locally stored credentials for the current user');
    }

    const checkUserCredentialsResult = await this.compareLocalAndRemoteCredentials();

    if (checkUserCredentialsResult instanceof Error) {
      console.error(checkUserCredentialsResult);
      return this.handleFailAndClose('The user credentials stored locally and provided by the auth provided are not same');
    }

    const storeCredentialsLocallyResult = await this.storeCryptoCredentialsFromAuthProvider();

    if (storeCredentialsLocallyResult instanceof Error) {
      console.error(storeCredentialsLocallyResult);
      return this.handleFailAndClose('Failed to store the credentials for the user locally');
    }

    const createConnectionToSwarmCredentialsStorageResult = await this.connectToSwarmCredentialsStorage();

    if (createConnectionToSwarmCredentialsStorageResult instanceof Error) {
      console.error(createConnectionToSwarmCredentialsStorageResult);
      return this.handleFailAndClose('Failed to connect to the swarm credentials storage provider');
    }
    this.setIsRunning();
  }

  /**
   * close all existings connections and unset all
   * options
   *
   * @returns {(Promise<Error | void>)}
   * @memberof CentralAuthority
   */
  public async disconnect(): Promise<Error | void> {
    this.unsetOptions();
    if (!this.isRunning) {
      console.warn('The user is already not connected to the central authority');
      return;
    }

    const result = await this.disconnectAll();

    if (result instanceof Error) {
      console.error(result);
      return new CAError('Failed to close all the connections');
    }
  }

  /**
   * read credentials of the user connected to the swarm
   * from a local cache or, if it's not found, in the local
   * cache, from the swarm auth provider.
   *
   * @param {TCAUserIdentityRawTypes} identity
   * @returns {(Promise<TCentralAuthorityUserCryptoCredentials | Error | null>)}
   * @memberof CentralAuthority
   */
  public async getSwarmUserCredentials(
    identity: TCAUserIdentityRawTypes
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | null> {
    if (!this.isRunning) {
      return this.errorNotRunning;
    }
    return this.readSwarmUserCredentials(identity);
  }

  /**
   * return crypto key of the swarm user if exists
   * in the local cache or in the swarm providers
   * the current user is connected to
   *
   * @param {TCAUserIdentityRawTypes} identity
   * @returns {(Promise<Error | null | CryptoKey>)}
   * @memberof CentralAuthority
   */
  public async getSwarmUserEncryptionPubKey(identity: TCAUserIdentityRawTypes): Promise<Error | null | CryptoKey> {
    if (!this.isRunning) {
      return this.errorNotRunning;
    }

    const swarmUserCredentials = await this.readSwarmUserCredentials(identity);

    if (swarmUserCredentials instanceof Error) {
      console.error(swarmUserCredentials);
      return new CAError('Failed to get a credentials of the swarm user');
    }
    return getDataEncryptionPubKeyByCryptoCredentials(swarmUserCredentials);
  }

  /**
   * return crypto key of the swarm user if exists
   * in the local cache or in the swarm providers
   * the current user is connected to
   *
   * @param {TCAUserIdentityRawTypes} identity
   * @returns {(Promise<Error | null | CryptoKey>)}
   * @memberof CentralAuthority
   */
  public async getSwarmUserSignPubKey(identity: TCAUserIdentityRawTypes): Promise<Error | null | CryptoKey> {
    if (!this.isRunning) {
      return this.errorNotRunning;
    }

    const swarmUserCredentials = await this.readSwarmUserCredentials(identity);

    if (swarmUserCredentials instanceof Error) {
      console.error(swarmUserCredentials);
      return new CAError('Failed to get a credentials of the swarm user');
    }
    return getDataSignPubKeyByCryptoCredentials(swarmUserCredentials);
  }

  /**
   * return the identity of the current user
   *
   * @returns {(Promise<Error | TCentralAuthorityUserIdentity>)}
   * @memberof ICentralAuthority
   */
  public getUserIdentity(): Error | TCentralAuthorityUserIdentity {
    const userCryptoCredentials = this.getCurrentUserCryptoCredentials();

    if (userCryptoCredentials instanceof Error) {
      return userCryptoCredentials;
    }
    return (
      getUserIdentityFromCryptoCredentials(userCryptoCredentials) || new CAError('there is no credentials of the current user')
    );
  }
  /**
   * retutn a crypto key pair of the current user
   * for a data encryption
   *
   * @returns
   * @memberof CentralAuthority
   */
  public getUserEncryptionKeyPair(): Error | CryptoKeyPair {
    const userCryptoCredentials = this.getCurrentUserCryptoCredentials();

    if (userCryptoCredentials instanceof Error) {
      return userCryptoCredentials;
    }
    return (
      getDataEncryptionKeyPairByCryptoCredentials(userCryptoCredentials) ||
      new CAError('there is no credentials of the current user')
    );
  }

  /**
   * retutn a crypto key pair of the current user
   * for a data encryption
   *
   * @returns
   * @memberof CentralAuthority
   */
  public getUserDataSignKeyPair(): Error | CryptoKeyPair {
    const userCryptoCredentials = this.getCurrentUserCryptoCredentials();

    if (userCryptoCredentials instanceof Error) {
      return userCryptoCredentials;
    }
    return (
      getDataSignKeyPairByCryptoCredentials(userCryptoCredentials) || new CAError('there is no credentials of the current user')
    );
  }

  /**
   * Reads the user's profile from the CA service
   * the user is authrorized on and return it if exists.
   * If the user is not authorized on a CA then undefined
   * will be returned.
   *
   * @returns {(Promise<ICentralAuthorityUserProfile | undefined>)}
   * @memberof CentralAuthority
   */
  public async getCAUserProfile(): Promise<ICentralAuthorityUserProfile | undefined> {
    return this.connectionAuthProvidersPool?.getCAUserProfile();
  }

  // TODO - set the user profile in the CA service

  /**
   * export crypto credentials of the current user
   *
   * @returns {(Promise<string | Error>)}
   * @memberof CentralAuthority
   */
  public async exportCryptoCredentials(): Promise<string | Error> {
    const userCryptoCredentials = this.getCurrentUserCryptoCredentials();

    if (userCryptoCredentials instanceof Error) {
      return userCryptoCredentials;
    }
    return exportCryptoCredentialsToString(userCryptoCredentials);
  }

  protected validateOptions(options: ICentralAuthorityOptions): Error | void {
    if (!options) {
      return new CAError('Options must be provided');
    }

    const validationResult = validateVerboseBySchema(CENTRAL_AUTHORITY_CLASS_OPTIONS_SCHEMA, options);

    if (validationResult instanceof Error) {
      return new CAError(validationResult);
    }
  }

  protected setOptions(options: ICentralAuthorityOptions): Error | void {
    const optionsValidationResult = this.validateOptions(options);

    if (optionsValidationResult) {
      return optionsValidationResult;
    }
    this.authProvidersPoolConfiguration = options.authProvidersPool;
    if (options.user.credentials.cryptoCredentials) {
      this.remoteProvidedUserCryptoCredntials = options.user.credentials.cryptoCredentials;
    }
  }

  protected unsetOptions() {
    this.authProvidersPoolConfiguration = undefined;
    this.remoteProvidedUserCryptoCredntials = undefined;
  }

  protected setIsRunning() {
    this.isRunningInstance = true;
  }

  protected unsetIsRunning() {
    this.isRunningInstance = false;
  }

  protected async closeConnectionToAuthProvidersPool(): Promise<Error | void> {
    const { connectionAuthProvidersPool } = this;

    this.unsetConnectionToAuthProvidersPool();
    if (connectionAuthProvidersPool) {
      const res = await connectionAuthProvidersPool.close();

      if (res instanceof Error) {
        console.error(res);
        return new CAError('Failed to disconnect from auth providers pool');
      }
    }
  }

  protected async closeConnectionToCurrentUserCredentialsStorage(): Promise<Error | void> {
    const { connectionStorageCurrentUserCrdentials } = this;

    this.unsetConnectionToCurrentUserCredentialsStorage();
    if (connectionStorageCurrentUserCrdentials) {
      const res = await connectionStorageCurrentUserCrdentials.disconnect();

      if (res instanceof Error) {
        console.error(res);
        return new CAError('Failed to disconnect from current user credentials storage');
      }
    }
  }

  protected async closeConnectionSwarmCredentialsProvider(): Promise<Error | void> {
    const { connectionSwarmCredentialsProvider } = this;

    this.unsetConnectionToSwarmCredentialsStorage();
    if (connectionSwarmCredentialsProvider) {
      const res = await connectionSwarmCredentialsProvider.disconnect();

      if (res instanceof Error) {
        console.error(res);
        return new CAError('Failed to disconnect from swarm credentials provider');
      }
    }
  }

  /**
   * close all the existing connections
   *
   * @protected
   * @returns {(Promise<Error | void>)}
   * @memberof CentralAuthority
   */
  protected async closeAllConnections(): Promise<Error | void> {
    const results = await Promise.all([
      this.closeConnectionToAuthProvidersPool(),
      this.closeConnectionToCurrentUserCredentialsStorage(),
      this.closeConnectionSwarmCredentialsProvider(),
    ]);
    const isErrorExists = results.some(checkIsError);

    if (isErrorExists) {
      return new CAError('Failed to close one of the exising connections');
    }
  }

  protected unsetPropsOnClose() {
    this.unsetIsRunning();
    this.unsetLocallyStoredCredentials();
    this.unsetUserOnAuthResult();
  }

  /**
   * close and unset all connections
   *
   * @protected
   * @returns {(Promise<Error | void>)}
   * @memberof CentralAuthority
   */
  protected async disconnectAll(): Promise<Error | void> {
    this.unsetPropsOnClose();

    const closeConnectionsResult = await this.closeAllConnections();

    if (closeConnectionsResult instanceof Error) {
      console.error(closeConnectionsResult);
      return closeConnectionsResult;
    }
  }

  /**
   * close the instance and emit an error
   *
   * @protected
   * @param {(string | Error)} [error]
   * @returns {Promise<Error>}
   * @memberof CentralAuthority
   */
  protected async handleFailAndClose(error?: string | Error): Promise<Error> {
    const closeConnectionsResult = await this.disconnectAll();

    if (closeConnectionsResult instanceof Error) {
      console.error(closeConnectionsResult);
      console.error(new CAError('handleFailAndClose::failed to close the instance'));
    }
    return new CAError(error || 'handleFailAndClose::an unknown error caused the instance close');
  }

  protected getOptionsForAuthProvidersConnectionsPool(options: ICentralAuthorityAuthProvidersOptions): ICAConnectionsPoolOptions {
    return {
      providers: options.providersConfigurations,
    };
  }

  protected getOptionsToAuthorizeUserOnAuthConnection(
    optionsUserCredentials: ICentralAuthorityUser
  ): [TCAAuthProviderIdentity, ICAConnectionSignUpCredentials, Partial<ICentralAuthorityUserProfile> | undefined] {
    return [optionsUserCredentials.authProviderUrl, optionsUserCredentials.credentials, optionsUserCredentials.profile];
  }

  /**
   * set the user profile and crypto keys after he was authorized
   * on the auth provider service.
   *
   * @protected
   * @param {ICAConnectionUserAuthorizedResult} caSwarmConnectionsPoolAuthResult
   * @memberof CentralAuthority
   */
  protected setUserOnAuthResult(caSwarmConnectionsPoolAuthResult: ICAConnectionPoolAuthResult) {
    this.remoteProvidedUserCryptoCredntials = caSwarmConnectionsPoolAuthResult.cryptoCredentials;
    this.userProfileOnAuthService = caSwarmConnectionsPoolAuthResult.profile;
    this.authProviderId = caSwarmConnectionsPoolAuthResult.authProviderId;
  }

  protected unsetUserOnAuthResult() {
    this.remoteProvidedUserCryptoCredntials = undefined;
    this.userProfileOnAuthService = undefined;
  }

  protected setConnectionToAuthProvidersPool(connectionSwarmPool: ICAConnectionPool) {
    this.connectionAuthProvidersPool = connectionSwarmPool;
  }

  protected unsetConnectionToAuthProvidersPool() {
    this.connectionAuthProvidersPool = undefined;
  }

  /**
   * create connection of the CAConnectionsPool and authorize
   * on auth provider specified by the user.
   *
   * @protected
   * @param {ICentralAuthorityAuthProvidersOptions} optionsConnectionPool
   * @param {ICentralAuthorityUser} optionsUserCredentials
   * @returns {(Promise<Error | void>)}
   * @memberof CentralAuthority
   */
  protected async connectToAuthProvidersPool(
    optionsConnectionPool: ICentralAuthorityAuthProvidersOptions,
    optionsUserCredentials: ICentralAuthorityUser
  ): Promise<Error | void> {
    const optionsAuthProvidersPool = this.getOptionsForAuthProvidersConnectionsPool(optionsConnectionPool);
    let connectionToAuthProvidersPool: CAConnectionsPool;

    try {
      connectionToAuthProvidersPool = new CAConnectionsPool(optionsAuthProvidersPool);
    } catch (err) {
      console.error(err);
      return new CAError('Failed to create an instance of CAConnectionsPool');
    }

    const authorizationResult = await connectionToAuthProvidersPool.authorize(
      ...this.getOptionsToAuthorizeUserOnAuthConnection(optionsUserCredentials)
    );
    if (authorizationResult instanceof Error) {
      console.error(authorizationResult);
      return authorizationResult;
    }

    const { userAuthResult } = connectionToAuthProvidersPool;

    if (!userAuthResult) {
      return new CAError('There is no user credntials and profile provided after authorization on auth service');
    }
    if (userAuthResult.authProviderId !== optionsUserCredentials.authProviderUrl) {
      return new Error(
        `The auth provider id ${userAuthResult.authProviderId} returned in the crypto credentials is not equals to the auth provider url user want to authorized on ${optionsUserCredentials.authProviderUrl}`
      );
    }
    this.setConnectionToAuthProvidersPool(connectionToAuthProvidersPool);
    this.setUserOnAuthResult(userAuthResult);
  }

  protected getOptionsForCAStorageCurrentUserCredentials(
    optionsUser: ICentralAuthorityUser
  ): ICAStorageCurrentUserCredentialsOptions {
    const { credentials } = optionsUser;
    let userCredentials: ISecretStoreCredentialsSession | ISecretStoreCredentials;

    if (!credentials.password) {
      userCredentials = {
        login: credentials.login,
        session: credentials.session,
      } as ISecretStoreCredentialsSession;
    } else {
      userCredentials = {
        login: credentials.login,
        password: credentials.password,
        session: credentials.session,
      } as ISecretStoreCredentials;
    }
    return {
      credentials: userCredentials,
    };
  }

  protected setConnectionToCurrentUserCredentialsStorage(connection: CentralAuthorityStorageCurrentUserCredentials) {
    this.connectionStorageCurrentUserCrdentials = connection;
  }

  protected unsetConnectionToCurrentUserCredentialsStorage() {
    this.connectionStorageCurrentUserCrdentials = undefined;
  }

  protected async connectToUserCredentialsStorage(optionsUser: ICentralAuthorityUser): Promise<Error | void> {
    const caStorageCurrentUserCredentials = new CentralAuthorityStorageCurrentUserCredentials();
    const optionsCAStorageCurrentUserCredentials = this.getOptionsForCAStorageCurrentUserCredentials(optionsUser);
    const caStorageCurrentUserCredentialsConnectionResult = await caStorageCurrentUserCredentials.connect(
      optionsCAStorageCurrentUserCredentials
    );

    if (caStorageCurrentUserCredentialsConnectionResult instanceof Error) {
      console.error(caStorageCurrentUserCredentialsConnectionResult);
      return new CAError('Failed to connect to the storage of the user credentials');
    }
    this.setConnectionToCurrentUserCredentialsStorage(caStorageCurrentUserCredentials);
  }

  /**
   *
   *
   * @param {*} cryptoCredentials
   * @returns {<void | Error>}
   * @memberof CentralAuthority
   */
  protected setLocallyStoredCredentials(cryptoCredentials: TCentralAuthorityUserCryptoCredentials): void | Error {
    const validateResult = checkIsValidCryptoCredentials(cryptoCredentials);

    if (!validateResult) {
      return new CAError('The locally stored crypto credentials is not valid');
    }
    this.locallyStoredUserCryptoCredntials = cryptoCredentials;
  }

  protected unsetLocallyStoredCredentials() {
    this.locallyStoredUserCryptoCredntials = undefined;
  }

  /**
   * Set a locally stored credentials of the user by the credentials
   * got from the swarm auth provider connected to.
   *
   * @protected
   * @memberof CentralAuthority
   * @returns {(Promise<void | Error>)}
   */
  protected async readAndSetLocallyStoredUserCredentials(): Promise<Error | void> {
    if (!this.connectionStorageCurrentUserCrdentials) {
      return new CAError('There is no connection to the storage of the user credntials');
    }
    if (!this.authProviderId) {
      return new CAError(
        "The auth provider's identifier, the user was authorized on, is not defined to check the user's crypto credntials for it"
      );
    }
    if (!this.remoteProvidedUserCryptoCredntials) {
      return new CAError('The user crypto credentials returned by the auth provider are not defined');
    }

    let cryptoCredentials = await this.connectionStorageCurrentUserCrdentials.get(
      this.remoteProvidedUserCryptoCredntials.userIdentity
    );

    if (cryptoCredentials instanceof Error) {
      console.error(cryptoCredentials);
      console.error(
        new CAError(
          `Failed to read credentials for the user identity ${this.remoteProvidedUserCryptoCredntials.userIdentity}. Try to read it for the auth provider identity ${this.authProviderId}`
        )
      );
      cryptoCredentials = undefined;
    }
    if (!cryptoCredentials) {
      cryptoCredentials = await this.connectionStorageCurrentUserCrdentials.getByAuthProvider(this.authProviderId);
      if (cryptoCredentials instanceof Error) {
        console.error(cryptoCredentials);
        return new CAError(`Failed to read crypto credentials for the auth provider ${this.authProviderId}`);
      }
    }
    if (!cryptoCredentials) {
      console.warn('There is no credentials stored locally for the current user');
      return;
    }
    return this.setLocallyStoredCredentials(cryptoCredentials);
  }

  /**
   * compare the user's credentials got from the user
   * credentials storage and the swarm provider
   * user is authorized on.
   *
   * @protected
   * @memberof CentralAuthority
   */
  protected async compareLocalAndRemoteCredentials(): Promise<Error | void> {
    if (!this.remoteProvidedUserCryptoCredntials) {
      return new CAError('There is no credntials for the user provided by the auth provider the user is authentificated on');
    }
    if (!this.locallyStoredUserCryptoCredntials) {
      console.warn(
        'There is no crypto credentials stored for the user identity and the current auth provider id. Nothing to check.'
      );
      return;
    }

    const comparationResult = await compareCryptoCredentials(
      this.locallyStoredUserCryptoCredntials,
      this.remoteProvidedUserCryptoCredntials
    );

    if (comparationResult instanceof Error) {
      console.error(comparationResult);
      return new CAError('Failed to compare crypto credentials stored locally and got by the auth provider');
    }
    if (comparationResult !== true) {
      return new CAError(
        'The crypto credentials stored in the credentials storage does not equals to the credentials provided be the auth provider'
      );
    }
  }

  /**
   * Stores the crypto credentials to the current user credentials storage
   * connection.
   *
   * @protected
   * @returns {(Promise<Error | void>)}
   * @memberof CentralAuthority
   */
  protected async storeCryptoCredentialsFromAuthProvider(): Promise<Error | void> {
    const {
      connectionStorageCurrentUserCrdentials,
      locallyStoredUserCryptoCredntials,
      remoteProvidedUserCryptoCredntials,
    } = this;

    if (locallyStoredUserCryptoCredntials) {
      console.warn('storeCryptoCredentialsFromAuthProvider:: locally stored credentials for the current user is already exists');
      return;
    }
    if (!remoteProvidedUserCryptoCredntials) {
      return new CAError('There was no credentials provided by the auth provider the user is authorized on');
    }
    if (!connectionStorageCurrentUserCrdentials) {
      return new CAError('There is no connection to the storage of the current user credentials');
    }

    const setRemoteCredentialsResult = await connectionStorageCurrentUserCrdentials.set(remoteProvidedUserCryptoCredntials);

    if (setRemoteCredentialsResult instanceof Error) {
      console.error(setRemoteCredentialsResult);
      return new CAError('Failed to store locally the current user credentials provided by the auth provided');
    }
  }

  /**
   * create instance
   *
   * @protected
   * @returns {(Error | ICASwarmCredentialsProvider)}
   * @memberof CentralAuthority
   */
  protected createConnectionToSwarmCredentialsStorage(): Error | ICASwarmCredentialsProvider {
    try {
      return new CASwarmCredentialsProvider();
    } catch (err) {
      console.error(err);
      return new CAError('Failed to create instance of the Swarm credentials storage');
    }
  }

  /**
   * get options to establish a new connection to the
   * swarm credentials storage
   *
   * @protected
   * @returns {(Error
   *     | ICASwarmCredentialsProviderOptions)}
   * @memberof CentralAuthority
   */
  protected getOptionsForSwarmCredentialsStorageConnection(): Error | ICASwarmCredentialsProviderOptions {
    if (!this.connectionAuthProvidersPool) {
      return new CAError('A connection to the swarm pool must be provided for the swarm credentials storage');
    }
    return {
      connections: {
        swarmConnectionPool: this.connectionAuthProvidersPool,
      },
      storageDb: CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_STORAGE_DB_NAME,
    };
  }

  protected setConnectionToSwarmCredentialsStorage(connection: ICASwarmCredentialsProvider) {
    this.connectionSwarmCredentialsProvider = connection;
  }

  protected unsetConnectionToSwarmCredentialsStorage() {
    this.connectionSwarmCredentialsProvider = undefined;
  }

  /**
   * establish connection to the swarm storage credentials provider
   *
   * @protected
   * @returns {(Promise<Error | void>)}
   * @memberof CentralAuthority
   */
  protected async connectToSwarmCredentialsStorage(): Promise<Error | void> {
    const connectionToSwarmCredentialsStorage = this.createConnectionToSwarmCredentialsStorage();

    if (connectionToSwarmCredentialsStorage instanceof Error) {
      console.error(connectionToSwarmCredentialsStorage);
      return connectionToSwarmCredentialsStorage;
    }

    const options = this.getOptionsForSwarmCredentialsStorageConnection();

    if (options instanceof Error) {
      console.error(options);
      return options;
    }

    const connectionResult = await connectionToSwarmCredentialsStorage.connect(options);

    if (connectionResult instanceof Error) {
      console.error(connectionResult);
      return new CAError('Failed to connect to the swarm credentials storage');
    }
    return this.setConnectionToSwarmCredentialsStorage(connectionToSwarmCredentialsStorage);
  }

  /**
   * read credentials of the user connected to the swarm
   * from a local cache or, if not found in the local
   * cache, from the swarm auth provider.
   *
   * @param {TCAUserIdentityRawTypes} identity
   * @returns {(Promise<TCentralAuthorityUserCryptoCredentials | Error | null>)}
   * @memberof CentralAuthority
   */
  @dataCachingUtilsCachingDecoratorGlobalCachePerClass(
    CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_SWARM_USERS_CREDENTIALS_CACHE_CAPACITY
  )
  protected async readSwarmUserCredentials(
    identity: TCAUserIdentityRawTypes
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | null> {
    const { connectionSwarmCredentialsProvider } = this;

    if (!connectionSwarmCredentialsProvider) {
      return new CAError('There is no connection to the swarm credentials provider');
    }
    return await connectionSwarmCredentialsProvider.get(identity);
  }

  protected getCurrentUserCryptoCredentials(): Error | TCentralAuthorityUserCryptoCredentials {
    if (!this.isRunning) {
      return this.errorNotRunning;
    }
    if (!this.remoteProvidedUserCryptoCredntials) {
      return new CAError('There is no user crypyo credentials');
    }
    return this.remoteProvidedUserCryptoCredntials;
  }
}
