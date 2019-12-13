import {
  TCentralAuthorityUserCryptoCredentials,
  ICentralAuthorityUserProfile,
  ICentralAuthorityUserAuthCredentials,
} from '../central-authority-class-types/central-authority-class-types';
import { ICAConnectionConfigurationFirebase } from './central-authority-connection-firebase/central-authority-connection-firebase.types.configuration';
import { TUserIdentityVersion } from '../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { CA_CONNECTION_STATUS } from './central-authority-connections-const/central-authority-connections-const';

/**
 * the base url of auth provider
 */
export type TCAAuthProviderURL = string;

export interface ICAConnectionUserAuthorizedResult {
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials;
  profile: ICentralAuthorityUserProfile;
}

/**
 * credentials used to sign up
 * in central authority
 * @export
 * @interface ICAConnectionSignUpCredentials
 */
export interface ICAConnectionSignUpCredentials
  extends ICentralAuthorityUserAuthCredentials {
  cryptoCredentials?: TCentralAuthorityUserCryptoCredentials;
}

/**
 * credentials used to sign in
 * in central authority
 * @export
 * @interface ICAConnectionSignUpCredentials
 */
export interface ICAConnectionSignInCredentials {
  login: string;
  password: string;
}

export interface ICAConnection {
  // crypto credentials for the user
  // authorized in the Firebase
  cryptoCredentials?: TCentralAuthorityUserCryptoCredentials;
  // the current status of the connection
  status: CA_CONNECTION_STATUS;
  // the url string with the auth providet url
  // to which the connection is established
  authProviderURL: string | undefined;
  /**
   * checks whether the identity version
   * is supported by the connection
   *
   * @param {TUserIdentityVersion} v - identity version
   */
  isVersionSupported(v: TUserIdentityVersion): boolean;
  // connect to Firebase database in the anonymous mode
  connect(
    configuration: ICAConnectionConfigurationFirebase
  ): Promise<boolean | Error>;
  /**
   * authorize with the credentials on
   * the remote central authority.
   * If the user was not signed up before
   * it will try to sign up the user
   * with the credentials provided and
   * the profile value presented.
   * If the profile value is present then
   * it will set a values from it
   * on the remote authority.
   * @param {ICAConnectionSignUpCredentials} signUpCredentials
   * @param signUpCredentials.login - login used to authorize with the auth provider
   * @param signUpCredentials.password - password used for encrypt a sensitive data and authorize
   * on the auth provider
   * @param signUpCredentials.cryptoCredentials [undefined] - if provided, then the value
   * will be set if there is no credentials value stored for the user
   * it will be save in the credentials storage.
   * @param {Partial<ICentralAuthorityUserProfile>} [profile]
   * @returns {(Promise<Error | ICAConnectionUserAuthorizedResult>)}
   * @memberof ICAConnection
   */
  authorize(
    signUpCredentials: ICAConnectionSignUpCredentials,
    profile?: Partial<ICentralAuthorityUserProfile>
  ): Promise<Error | ICAConnectionUserAuthorizedResult>;
  signOut(): Promise<Error | boolean>;
  // delete the user data from the central authority
  delete(
    signUpCredentials?: ICAConnectionSignUpCredentials
  ): Promise<Error | boolean>;
  /**
   * return a credentials for the user
   * with the id = userId.
   * For the v1 the user id must be a uuidV4.
   * For the v2 the user id must be a login/email/uuid.
   * under which the user was registered the
   * Firebase account.
   */
  getUserCredentials(
    userId: string
  ): Promise<Error | null | TCentralAuthorityUserCryptoCredentials>;
}
