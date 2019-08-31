import {
  TCentralAuthorityUserCryptoCredentials,
  ICentralAuthorityUserProfile,
  ICentralAuthorityUserAuthCredentials,
} from '../central-authority-class-types/central-authority-class-types';
import { ICAConnectionConfigurationFirebase } from './central-authority-connection-firebase/central-authority-connection-firebase.types.configuration';

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
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials;
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
  // is connection active
  isConnected: boolean;
  // is the user was authorized
  // (signed in)
  isAuthorized: boolean;
  // connect to firebase
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
   * @param {ICAConnectionSignUpCredentials} credentials
   * @param {Partial<ICentralAuthorityUserProfile>} [profile]
   * @returns {(Promise<Error | ICAConnectionUserAuthorizedResult>)}
   * @memberof ICAConnection
   */
  authorize(
    credentials: ICAConnectionSignUpCredentials,
    profile?: Partial<ICentralAuthorityUserProfile>
  ): Promise<Error | ICAConnectionUserAuthorizedResult>;
  signOut(): Promise<Error | boolean>;
}
