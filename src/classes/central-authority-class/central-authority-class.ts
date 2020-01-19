import { CentralAuthorityStorageCurrentUserCredentials } from './central-authority-storage-local/central-authority-storage-current-user-auth/central-authority-storage-current-user-credentials/central-authority-storage-current-user-credentials';
import { validateVerboseBySchema } from './../../utils/validation-utils/validation-utils';
import { getErrorScopedClass } from './../basic-classes/error-extended-scoped-class-base/error-extended-scoped-class-base';
import { ErrorExtendedBaseClass } from './../basic-classes/error-extended-class-base/error-extended-class-base';
import {
  ICAStorageCurrentUserCredentials,
  ICAStorageCurrentUserCredentialsOptions,
} from './central-authority-storage-local/central-authority-storage-current-user-auth/central-authority-storage-current-user-credentials/central-authority-storage-current-user-credentials.types';
import { ICASwarmCredentialsProvider } from './central-authority-swarm-credentials-provider/central-authority-swarm-credentials-provider.types';
import {
  ICAConnectionPool,
  ICAConnectionsPoolOptions,
} from './central-authority-connections/central-authority-connections-pool/central-authority-connections-pool.types';
import { TCentralAuthorityUserCryptoCredentials } from './central-authority-class-types/central-authority-class-types-crypto-credentials';
import { CAConnectionsPool } from './central-authority-connections/central-authority-connections-pool/central-authority-connections-pool';
import { ICentralAuthorityUserProfile } from './central-authority-class-types/central-authority-class-types-common';
import { ICAConnectionUserAuthorizedResult } from './central-authority-connections/central-authority-connections.types';
import { TCAuthProviderIdentifier } from './central-authority-class-user-identity/central-authority-class-user-identity.types';
import { ICAConnectionPoolAuthResult } from './central-authority-connections/central-authority-connections-pool/central-authority-connections-pool.types';
import { compareCryptoCredentials } from './central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import {
  TCAAuthProviderIdentity,
  ICAConnectionSignUpCredentials,
} from './central-authority-connections/central-authority-connections.types';
import {
  ICentralAuthority,
  ICentralAuthorityOptions,
  ICentralAuthorityAuthProvidersOptions,
  ICentralAuthorityUser,
} from './central-authority-class.types';
import {
  CENTRAL_AUTHORITY_CLASS_ERRORS_PREFIX,
  CENTRAL_AUTHORITY_CLASS_OPTIONS_SCHEMA,
} from './central-authority-class.const';

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
  protected isRunning?: boolean;
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
  protected userCryptoCredntials?: TCentralAuthorityUserCryptoCredentials;
  protected userProfileOnAuthService?: ICentralAuthorityUserProfile;
  protected authProvidersPoolConfiguration?: ICentralAuthorityAuthProvidersOptions;
  protected swarmPoolConnection?: ICAConnectionPool;
  protected swarmCredentialsProvider?: ICASwarmCredentialsProvider;
  protected storageCurrentUserCrdentials?: ICAStorageCurrentUserCredentials;

  public async connect(
    options: ICentralAuthorityOptions
  ): Promise<Error | void> {
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
    const [
      resultUserCredentialsStorage,
      resultCAAuthProvidersConnectionsPool,
    ] = await Promise.all([
      this.connectToUserCredentialsStorage(options.user),
      this.connectToAuthProvidersPool(options.authProvidersPool, options.user),
    ]);

    if (resultCAAuthProvidersConnectionsPool instanceof Error) {
      //
      await this.closeAllExistingConnections();
      return resultCAAuthProvidersConnectionsPool;
    }
    if (resultUserCredentialsStorage instanceof Error) {
      //
      await this.closeAllExistingConnections();
      return resultUserCredentialsStorage;
    }
    await this.checkUserCredentialsInStorage();
    await this.storeCryptoCredentialsFromAuthProvider();

    this.connectToSwarmCredentialsStorage();
    this.setIsRunning();
  }

  protected validateOptions(options: ICentralAuthorityOptions): Error | void {
    if (!options) {
      return new CAError('Options must be provided');
    }
    const validationResult = validateVerboseBySchema(
      CENTRAL_AUTHORITY_CLASS_OPTIONS_SCHEMA,
      options
    );

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
      this.userCryptoCredntials = options.user.credentials.cryptoCredentials;
    }
  }

  protected unsetOptions() {
    this.authProvidersPoolConfiguration = undefined;
    this.userCryptoCredntials = undefined;
  }

  protected setIsRunning() {
    this.isRunning = true;
  }

  protected unsetIsRunning() {
    this.isRunning = true;
  }

  protected getOptionsForAuthProvidersConnectionsPool(
    options: ICentralAuthorityAuthProvidersOptions
  ): ICAConnectionsPoolOptions {
    return {
      providers: options.providersConfigurations,
    };
  }

  protected getOptionsToAuthorizeUserOnAuthConnection(
    optionsUserCredentials: ICentralAuthorityUser
  ): [TCAAuthProviderIdentity, ICAConnectionSignUpCredentials] {
    return [
      optionsUserCredentials.authProviderUrl,
      optionsUserCredentials.credentials,
    ];
  }

  /**
   * set the user profile and crypto keys after he was authorized
   * on the auth provider service.
   *
   * @protected
   * @param {ICAConnectionUserAuthorizedResult} caSwarmConnectionsPoolAuthResult
   * @memberof CentralAuthority
   */
  protected setUserOnAuthResult(
    caSwarmConnectionsPoolAuthResult: ICAConnectionPoolAuthResult
  ) {
    this.userCryptoCredntials =
      caSwarmConnectionsPoolAuthResult.cryptoCredentials;
    this.userProfileOnAuthService = caSwarmConnectionsPoolAuthResult.profile;
    this.authProviderId = caSwarmConnectionsPoolAuthResult.authProviderId;
  }

  protected unsetUserOnAuthResult() {
    this.userCryptoCredntials = undefined;
    this.userProfileOnAuthService = undefined;
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
    const optionsAuthProvidersPool = this.getOptionsForAuthProvidersConnectionsPool(
      optionsConnectionPool
    );
    let connectionToAuthProvidersPool: CAConnectionsPool;
    try {
      connectionToAuthProvidersPool = new CAConnectionsPool(
        optionsAuthProvidersPool
      );
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
      return new CAError(
        'There is no user credntials and profile provided after authorization on auth service'
      );
    }
    if (
      userAuthResult.authProviderId !== optionsUserCredentials.authProviderUrl
    ) {
      return new Error(
        `The auth provider id ${userAuthResult.authProviderId} returned in the crypto credentials is not equals to the auth provider url user want to authorized on ${optionsUserCredentials.authProviderUrl}`
      );
    }
    this.setUserOnAuthResult(userAuthResult);
  }

  protected getOptionsForCAStorageCurrentUserCredentials(
    optionsUser: ICentralAuthorityUser
  ): ICAStorageCurrentUserCredentialsOptions {
    const { credentials } = optionsUser;

    return {
      credentials: {
        login: credentials.login,
        password: credentials.password,
      },
    };
  }

  protected setConnectionToCurrentUserCredentialsStorage(
    connection: CentralAuthorityStorageCurrentUserCredentials
  ) {
    this.storageCurrentUserCrdentials = connection;
  }

  protected async connectToUserCredentialsStorage(
    optionsUser: ICentralAuthorityUser
  ): Promise<Error | void> {
    const caStorageCurrentUserCredentials = new CentralAuthorityStorageCurrentUserCredentials();
    const optionsCAStorageCurrentUserCredentials = this.getOptionsForCAStorageCurrentUserCredentials(
      optionsUser
    );
    const caStorageCurrentUserCredentialsConnectionResult = await caStorageCurrentUserCredentials.connect(
      optionsCAStorageCurrentUserCredentials
    );

    if (caStorageCurrentUserCredentialsConnectionResult instanceof Error) {
      console.error(caStorageCurrentUserCredentialsConnectionResult);
      return new CAError(
        'Failed to connect to the storage of the user credentials'
      );
    }
    this.setConnectionToCurrentUserCredentialsStorage(
      caStorageCurrentUserCredentials
    );
  }

  /**
   * compare the user's credentials got from the user
   * credentials storage and the swarm provider
   * user is authorized on.
   *
   * @protected
   * @memberof CentralAuthority
   */
  protected async checkUserCredentialsInStorage(): Promise<Error | void> {
    if (!this.storageCurrentUserCrdentials) {
      return new CAError(
        'There is no connection to the storage of the user credntials'
      );
    }
    if (!this.authProviderId) {
      return new CAError(
        "The auth provider's identifier user was authorized on is not defined to check the user's crypto credntials for it"
      );
    }
    if (!this.userCryptoCredntials) {
      return new CAError(
        'The user crypto credentials returned by the auth provider are not defined'
      );
    }

    let cryptoCredentials = await this.storageCurrentUserCrdentials.getByAuthProvider(
      this.userCryptoCredntials.userIdentity
    );

    if (cryptoCredentials instanceof Error) {
      console.error(cryptoCredentials);
      console.error(
        new CAError(
          `Failed to read credentials for the user identity ${this.userCryptoCredntials.userIdentity}. Try to read it for the auth provider identity ${this.authProviderId}`
        )
      );
      cryptoCredentials = undefined;
    }
    if (!cryptoCredentials) {
      cryptoCredentials = await this.storageCurrentUserCrdentials.getByAuthProvider(
        this.authProviderId
      );
      if (cryptoCredentials instanceof Error) {
        console.error(cryptoCredentials);
        return new CAError(
          `Failed to read crypto credentials for the auth provider ${this.authProviderId}`
        );
      }
    }
    if (!cryptoCredentials) {
      console.warn(
        'There is no crypto credentials stored for the user identity and the current auth provider id. Nothing to check.'
      );
      return;
    }

    const comparationResult = await compareCryptoCredentials(
      cryptoCredentials,
      this.userCryptoCredntials
    );

    if (comparationResult instanceof Error) {
      console.error(comparationResult);
    }
    if (comparationResult !== true) {
      return new CAError(
        'The crypto credentials stored in the credentials storage does not equals to the credentials provided be the auth provider'
      );
    }
  }
}
