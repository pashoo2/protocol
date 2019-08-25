import * as firebase from 'firebase/app';
import 'firebase/auth';
import {
  ICAConnection,
  ICAConnectionSignUpCredentials,
  ICAConnectionSignInCredentials,
  ICAConnectionUserAuthorizedResult,
} from '../central-authority-connections.types';
import {
  ICAConnectionConfigurationFirebase,
  ICAConnectionFirebaseUserProfile,
} from './central-authority-connection-firebase.types.configuration';
import {
  ICentralAuthorityUserAuthCredentials,
  TCentralAuthorityUserCryptoCredentials,
  ICentralAuthorityUserProfile,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { isEmptyObject } from 'utils/common-utils/common-utils-objects';
import { validateUserProfileData } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-user/central-authority-validators-user';

// TODO export class CAConnectionWithFirebase implements ICAConnection {
export class CAConnectionWithFirebase {
  protected app?: firebase.app.App;

  protected isAuthorizedWithCredentials: boolean = false;

  protected get currentUser(): firebase.User | null {
    const { isConnected, app } = this;

    return isConnected ? app!!.auth().currentUser : null;
  }

  protected get isVerifiedAccount(): boolean {
    const { isConnected, currentUser: currentUserData } = this;

    if (!isConnected) {
      return false;
    }
    if (!currentUserData) {
      return false;
    }
    return !!currentUserData.emailVerified;
  }

  public isConnected: boolean = false;

  public get isAuthorized(): boolean {
    const { isConnected, isVerifiedAccount } = this;

    if (!isConnected) {
      return false;
    }
    // according to the https://firebase.google.com/docs/auth/web/manage-users
    return isVerifiedAccount;
  }

  protected setConnectedStatus(isConnected: false | firebase.app.App) {
    this.isConnected = !!isConnected;
    if (isConnected) {
      this.app = isConnected;
    }
  }

  protected setAuthorizedStatus(isAuthorized: boolean) {
    this.isAuthorizedWithCredentials = isAuthorized;
  }

  public async connect(
    configuration: ICAConnectionConfigurationFirebase
  ): Promise<boolean | Error> {
    let app;
    try {
      app = await firebase.initializeApp(configuration);
    } catch (err) {
      console.error(err);
      this.setConnectedStatus(false);
      return new Error(
        'Failed to initialize the application with the given configuration'
      );
    }
    this.setConnectedStatus(app);
    return true;
  }

  // handle an authorization attemp failed
  protected onAuthorizationFailed(error: Error | string): Error {
    const err = error instanceof Error ? error : new Error(String(error));

    this.setAuthorizedStatus(false);
    console.error(err);
    console.error('Authorization failed on remote Firebase server');
    return err;
  }

  protected async singUpWithAuthCredentials(
    authCredentials: ICentralAuthorityUserAuthCredentials
  ): Promise<boolean | Error> {
    let signUpResult;
    const { login, password } = authCredentials;

    try {
      signUpResult = await firebase
        .auth()
        .createUserWithEmailAndPassword(login, password);
      debugger;
    } catch (err) {
      debugger;
      console.error(err);
      return new Error(
        'Failed to sign up to the Firebase with the given credentials'
      );
    }
    return true;
  }

  protected async singInWithAuthCredentials(
    authCredentials: ICentralAuthorityUserAuthCredentials
  ): Promise<boolean | Error> {
    let signInResult;
    const { login, password } = authCredentials;

    try {
      signInResult = await firebase
        .auth()
        .signInWithEmailAndPassword(login, password);
      debugger;
    } catch (err) {
      debugger;
      console.error(err);
      return new Error(
        'Failed to sign up to the Firebase with the given credentials'
      );
    }
    return true;
  }

  protected async getUserProfileData(): Promise<
    Error | ICentralAuthorityUserProfile
  > {
    const { isConnected } = this;

    if (!isConnected) {
      return new Error('Not connected to the remote server');
    }

    const { currentUser: currentUserData } = this;

    if (!currentUserData) {
      // if there is no profile data
      return {};
    }

    const { displayName, photoURL, phoneNumber, email } = currentUserData;
    debugger;
    return {
      name: displayName || null,
      email: email || null,
      phone: phoneNumber || null,
      photoURL: photoURL || null,
    };
  }

  protected async returnOnAuthorizedResult(): Promise<
    ICentralAuthorityUserProfile | Error
  > {
    debugger;
    return this.getUserProfileData();
  }

  protected mapAppProfileToFirebaseProfile(
    profile: Partial<ICentralAuthorityUserProfile>
  ): ICAConnectionFirebaseUserProfile {
    return {
      displayName: (profile && profile.name) || null,
      photoURL: (profile && profile.photoURL) || null,
    };
  }

  protected async setProfileDataWithFirebase(
    profile: Partial<ICentralAuthorityUserProfile>
  ): Promise<Error | boolean> {
    const { isConnected, currentUser } = this;

    if (!isConnected) {
      return new Error('There is no active connection to the remote server');
    }
    if (!currentUser) {
      return new Error('There is no current user profile');
    }

    const profileMappedForFirebase = this.mapAppProfileToFirebaseProfile(
      profile
    );

    try {
      await currentUser.updateProfile(profileMappedForFirebase);
    } catch (err) {
      console.error(err);
      return new Error('Failed to set the Firebase profile data');
    }

    const { email } = profile;

    if (email && typeof email === 'string' && currentUser.email !== email) {
      try {
        await currentUser.updateEmail(email);
      } catch (err) {
        console.error(err);
        return new Error('Failed to update the email address');
      }

      const sendEmailVerificationResult = await this.handleAuthEmailNotVerified();

      if (sendEmailVerificationResult instanceof Error) {
        console.error(sendEmailVerificationResult);
        return new Error('Failed to update the email address');
      }
      return new Error('The email was updated and must be verified');
    }
    // TODO - what to do with a phone number
    return true;
  }

  protected async setProfileData(
    profile: Partial<ICentralAuthorityUserProfile>
  ): Promise<Error | ICentralAuthorityUserProfile> {
    if (isEmptyObject(profile)) {
      return await this.getUserProfileData();
    }
    if (!validateUserProfileData(profile)) {
      return new Error('The profile is not valid');
    }

    const resultUpdateProfile = await this.setProfileDataWithFirebase(profile);

    if (resultUpdateProfile instanceof Error) {
      return resultUpdateProfile;
    }
    return this.getUserProfileData();
  }

  protected async handleAuthEmailNotVerified() {
    const { isConnected, currentUser } = this;

    if (!isConnected || !currentUser) {
      return new Error('There is no an active connection to the remote server');
    }

    try {
      await currentUser.sendEmailVerification();
      debugger;
      return new Error('Please, verify the email');
    } catch (err) {
      console.error(err);
      return new Error('Failed to send the email verification link');
    }
  }

  protected async handleAuthSuccess(): Promise<
    ICentralAuthorityUserProfile | Error
  > {
    const { isVerifiedAccount } = this;

    if (isVerifiedAccount) {
      return this.returnOnAuthorizedResult();
    }
    return this.handleAuthEmailNotVerified();
  }

  public async authorize(
    credentials: ICAConnectionSignInCredentials,
    profile?: Partial<ICentralAuthorityUserProfile>
  ): Promise<ICentralAuthorityUserProfile | Error> {
    const { isConnected, isAuthorized } = this;

    if (isAuthorized) {
      return this.handleAuthSuccess();
    }
    if (!isConnected) {
      return this.onAuthorizationFailed(
        'There is no active connection to the Firebase CA server'
      );
    }

    // try to sign in with the credentials, then try to sign up
    const signInResult = await this.singInWithAuthCredentials(credentials);

    if (signInResult instanceof Error) {
      // if failed to sign in with the
      // credentials, then try to
      // sign up
      const signUpResult = await this.singUpWithAuthCredentials(credentials);

      if (signUpResult instanceof Error) {
        // if sign up failed then return
        // error that the authorization
        // failed
        return this.onAuthorizationFailed(
          'Failed to authorize on Firebase remote server with the credentials'
        );
      }
    }

    const authHandleResult = await this.handleAuthSuccess();

    if (authHandleResult instanceof Error) {
      return authHandleResult;
    }
    if (profile && isEmptyObject(profile)) {
      return this.setProfileData(profile);
    }
    return authHandleResult;
  }

  //   /**
  //    * sign up the user into the
  //    * central authority remote server.
  //    * It must return CryptoCredentials
  //    * stored for the user
  //    * in the database of the remote
  //    * server
  //    * @param credentialsSignUp
  //    */
  //   public async signUp(
  //     credentialsSignUp: ICAConnectionSignUpCredentials
  //   ): Promise<ICAConnectionUserAuthorizedResult | Error> {}

  //   /**
  //    * sign in the user
  //    * on the remote server
  //    * stored credentials of
  //    * all the users authorized
  //    * on it. It must return CryptoCredentials
  //    * stored previousely for the user on
  //    * the remote server.
  //    * @param credentialsSignIn
  //    */
  //   public async signIn(
  //     credentialsSignIn: ICAConnectionSignInCredentials
  //   ): Promise<ICAConnectionUserAuthorizedResult | Error> {}
}

export default CAConnectionWithFirebase;
