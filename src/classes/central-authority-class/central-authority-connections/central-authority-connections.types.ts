import { TCentralAuthorityUserCryptoCredentials, ICentralAuthorityUserProfile, ICentralAuthorityUserAuthCredentials } from '../central-authority-class-types/central-authority-class-types';
import { ICAConnectionConfigurationFirebase } from './central-authority-connection-firebase/central-authority-connection-firebase.types.configuration';

export interface ICAConnectionUserSignedInResult {
    cryptoCredentials: TCentralAuthorityUserCryptoCredentials,
    profile: ICentralAuthorityUserProfile,
}

/**
 * credentials used to sign up
 * in central authority
 * @export
 * @interface ICAConnectionSignUpCredentials
 */
export interface ICAConnectionSignUpCredentials extends ICentralAuthorityUserAuthCredentials {
    cryptoCredentials: TCentralAuthorityUserCryptoCredentials,
}

/**
 * credentials used to sign in
 * in central authority
 * @export
 * @interface ICAConnectionSignUpCredentials
 */
export interface ICAConnectionSignInCredentials {
    login: string,
    password: string,
}

export interface ICAConnection {
    // connect to firebase
    connect(configuration: ICAConnectionConfigurationFirebase): Promise<boolean | Error>,
    /**
     * sign up the user into the
     * central authority remote server.
     * It must return CryptoCredentials
     * stored for the user
     * in the database of the remote
     * server
     * @param credentialsSignUp 
     */
    signUp(credentialsSignUp: ICAConnectionSignUpCredentials): Promise<ICAConnectionUserSignedInResult | Error>,
    /**
     * sign in the user
     * on the remote server
     * stored credentials of 
     * all the users authorized
     * on it. It must return CryptoCredentials
     * stored previousely for the user on 
     * the remote server.
     * @param credentialsSignIn 
     */
    signIn(credentialsSignIn: ICAConnectionSignInCredentials): Promise<TCentralAuthorityUserCryptoCredentials | Error>,
    // is connection is active
    isConnected: boolean,
    // is user authorized (signed in)
    isAuthorized: boolean,
}