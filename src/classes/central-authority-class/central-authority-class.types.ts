import { TCentralAuthorityUserCryptoCredentials } from './central-authority-class-types/central-authority-class-types-crypto-credentials';
import { TCAUserIdentityRawTypes } from './central-authority-class-user-identity/central-authority-class-user-identity.types';
import {
  ICentralAuthorityUserProfile,
  TCentralAuthorityUserIdentity,
} from './central-authority-class-types/central-authority-class-types-common';
import {
  TCAAuthProviderIdentity,
  ICAConnectionSignUpCredentials,
} from './central-authority-connections/central-authority-connections.types';
import { IAuthProviderConnectionConfiguration } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-pool/central-authority-connections-pool.types';
import { ISecretStoreCredentialsSession } from 'classes/secret-storage-class';

//CentralAuthorityStorageCurrentUserCredentials

/**
 * this configuration determines a list of
 * auth provider known and trusted by the
 * user. It allows to connect to an auth
 * providers form the list to get a
 * crypto credentials of a swarm uses which
 * are registered on it.
 *
 * @export
 * @interface ICentralAuthorityAuthProvidersOptions
 */
export interface ICentralAuthorityAuthProvidersOptions {
  providersConfigurations: IAuthProviderConnectionConfiguration[];
}

export type ICentralAuthorityUserCredentials = ICAConnectionSignUpCredentials & Partial<ISecretStoreCredentialsSession>;

/**
 * This configuration determines the user's credentials
 * to register or authorize(if already register) on
 * the auth provider service specified by the auth provider
 * url.
 * A configuration of the auth provider which the user
 * want to authorize on must be specified in the configuration
 * of the auth providers pool.
 * The user profile may contain a small subset of a data
 * about the user. If another user wan to be provided by
 * the user, another provider must be use to implement it.
 *
 * @export
 * @interface ICentralAuthorityUser
 */
export interface ICentralAuthorityUser {
  authProviderUrl: TCAAuthProviderIdentity;
  credentials: ICentralAuthorityUserCredentials;
  profile?: Partial<ICentralAuthorityUserProfile>;
}

export interface ICentralAuthorityOptions {
  authProvidersPool: ICentralAuthorityAuthProvidersOptions;
  user: ICentralAuthorityUser;
}

/**
 * This class manages connection of the user to the auth proviers
 * and authorization of the user on one of them. It handles
 * user crypto keys, including a private keys to be stored
 * on a secret storage(encrypted and safe).
 * This class provides functionality to get a credentials of
 * another users by requsting it from the local database or if
 * it's not contains requested credentials, the requesting it
 * from the connection to an auth provider, specified in the
 * identity of the user, which credentials are necessary to
 * receive.
 *
 * @export
 * @interface ICentralAuthority
 */
export interface ICentralAuthority {
  /**
   * returns true if the instance is connected
   * to the storages and ready to be used
   *
   * @type {boolean}
   * @memberof ICentralAuthority
   */
  readonly isRunning: boolean;
  /**
   * connect to the auth providers pool and
   * authorize the user on one of them. Also
   * connect to the data storages which
   * are necessary to store or caching some
   * information.
   *
   * @param {ICentralAuthorityOptions} options
   * @returns {(Promise<Error | void>)}
   * @memberof ICentralAuthority
   */
  connect(options: ICentralAuthorityOptions): Promise<Error | void>;
  /**
   * close all connections with auth providers and
   * storages. And log out the user.
   *
   * @returns {(Promise<Error | void>)}
   * @memberof ICentralAuthority
   */
  disconnect(): Promise<Error | void>;
  /**
   * returns a crypto credentials by the user identity.
   * Credentials received form an existing connection
   * to an auth provider, specified by the user identity.
   * Therefore, if there is no configuration specified
   * for the provider, then a credentials can't be
   * given.
   *
   * @param {TCAUserIdentityRawTypes} identity
   * @returns {(Promise<TCentralAuthorityUserCryptoCredentials | Error | null>)}
   * @memberof ICentralAuthority
   */
  getSwarmUserCredentials(identity: TCAUserIdentityRawTypes): Promise<TCentralAuthorityUserCryptoCredentials | Error | null>;

  /**
   * returns a crypto key of the swarm user used
   * for data encryption
   *
   * @param {TCAUserIdentityRawTypes} identity
   * @returns {(Promise<Error | null | CryptoKey>)}
   * @memberof ICentralAuthority
   */
  getSwarmUserEncryptionPubKey(identity: TCAUserIdentityRawTypes): Promise<Error | null | CryptoKey>;
  /**
   * returns a crypto key of the swarm user used
   * for data sign
   *
   * @param {TCAUserIdentityRawTypes} identity
   * @returns {(Promise<Error | null | CryptoKey>)}
   * @memberof ICentralAuthority
   */
  getSwarmUserSignPubKey(identity: TCAUserIdentityRawTypes): Promise<Error | null | CryptoKey>;
  /**
   * return the identity of the current user
   *
   * @returns {Error | TCentralAuthorityUserIdentity}
   * @memberof ICentralAuthority
   */
  getUserIdentity(): Error | TCentralAuthorityUserIdentity;
  /**
   * return encryption key pair,used for
   * a data encryption, which was
   * specified for the current user when
   * he register on an auth provider.
   *
   * @returns {Error | CryptoKeyPair>}
   * @memberof ICentralAuthority
   */
  getUserEncryptionKeyPair(): Error | CryptoKeyPair;
  /**
   * return encryption key pair,used for
   * a data signign, which was
   * specified for the current user when
   * he register on an auth provider.
   *
   * @returns {Error | CryptoKeyPair}
   * @memberof ICentralAuthority
   */
  getUserDataSignKeyPair(): Error | CryptoKeyPair;
  /**
   * Returns user's profile stored by the CA
   * provider on which the user is authorized on.
   * If the user is not authorized on a CA
   * then undefined will be returned.
   *
   * @returns {(Promise<Partial<ICentralAuthorityUserProfile> | undefined | Error>)}
   * @memberof ICAConnection
   */
  getCAUserProfile(): Promise<ICentralAuthorityUserProfile | undefined>;
  /**
   * export a crypto keys, including a private keys.
   * This crypto keys are used to sign or encrypt
   * a messages or another valuable information and
   * identify the user by another swarm users.
   *
   * @returns {string}
   * @memberof ICentralAuthority
   */
  exportCryptoCredentials(): Promise<string | Error>;
  /**
   * import crypto credentials from a string provided
   * and return it.
   *
   * @returns {(Promise<
   *     TCentralAuthorityUserCryptoCredentials | Error
   *   >)}
   * @memberof ICentralAuthority
   */
  importCryptoCredentials?( // TODO - necessary to implement it in the feature
    cryptoCredentials: string
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error>;
}
