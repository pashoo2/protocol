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
import { dataValidatorUtilEmail } from 'utils/data-validators-utils/data-validators-utils';
import { checkIsValidCryptoCredentials } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';

// TODO export class CAConnectionWithFirebase implements ICAConnection {
export class CAConnectionWithFirebase implements ICAConnection {
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

  public getApp(): void | firebase.app.App {
    return this.app;
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

  protected checkIfConnected(): boolean | Error {
    const { isConnected } = this;

    return !isConnected
      ? new Error('There is no active connection with the Firebase')
      : true;
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

  protected async setUserCryptoCredentials() {}

  protected getUserCryptoCredentials() {}

  protected async singUpWithAuthCredentials(
    authCredentials: ICentralAuthorityUserAuthCredentials
  ): Promise<boolean | Error> {
    const { login, password } = authCredentials;

    try {
      await firebase.auth().createUserWithEmailAndPassword(login, password);
    } catch (err) {
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
    } catch (err) {
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
    const isConnected = this.checkIfConnected();

    if (isConnected instanceof Error) {
      return isConnected;
    }

    const { currentUser: currentUserData } = this;

    if (!currentUserData) {
      // if there is no profile data
      return {};
    }

    const { displayName, photoURL, phoneNumber, email } = currentUserData;

    return {
      name: displayName || null,
      email: email || null,
      phone: phoneNumber || null,
      photoURL: photoURL || null,
    };
  }

  protected async returnOnAuthorizedResult(
    cryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<ICAConnectionUserAuthorizedResult | Error> {
    const userProfile = await this.getUserProfileData();

    if (userProfile instanceof Error) {
      console.error(userProfile);
      return new Error('Failed to get profile data');
    }
    return {
      cryptoCredentials,
      profile: userProfile,
    };
  }

  protected mapAppProfileToFirebaseProfileWithoutEmail(
    profile: Partial<ICentralAuthorityUserProfile>
  ): ICAConnectionFirebaseUserProfile {
    return {
      displayName: (profile && profile.name) || null,
      photoURL: (profile && profile.photoURL) || null,
    };
  }

  protected async setProfileDataEmail(email: string): Promise<Error | boolean> {
    const checkIsConnectedResult = this.checkIfConnected();

    if (checkIsConnectedResult instanceof Error) {
      return checkIsConnectedResult;
    }
    if (!dataValidatorUtilEmail(email)) {
      return new Error('The email is not valid');
    }

    const { currentUser } = this;

    if (!currentUser) {
      return new Error('Failed to get the user profile data');
    }
    if (currentUser.email !== email) {
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
      // TODO - if the user was authentificated by OAuth
      // it is necessary to invoke the reauthentificate method
      // of the Firebase
      const logOutResult = await this.signOut();

      if (logOutResult instanceof Error) {
        console.error(logOutResult);
        return new Error('Failed to log out');
      }
      return true;
    }
    return true;
  }

  /**
   * At no a phone number can't be updated
   * @param profileDataPartialWithoutPhoneNumber
   */
  protected async setProfileDataWithFirebase(
    profileDataPartialWithoutPhoneNumber: Partial<ICentralAuthorityUserProfile>
  ): Promise<Error | boolean> {
    const isConnected = this.checkIfConnected();

    if (isConnected instanceof Error) {
      return isConnected;
    }

    const { currentUser } = this;

    if (!currentUser) {
      return new Error('There is no current user profile');
    }

    const profileMappedForFirebaseWithoutEmail = this.mapAppProfileToFirebaseProfileWithoutEmail(
      profileDataPartialWithoutPhoneNumber
    );

    try {
      await currentUser.updateProfile(profileMappedForFirebaseWithoutEmail);
    } catch (err) {
      console.error(err);
      return new Error('Failed to set the Firebase profile data');
    }
    // TODO - what to do with a phone number
    return true;
  }

  // TODO - test it and change to private method
  public async setProfileData(
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

    const updatedProfile = await this.getUserProfileData();

    if (updatedProfile instanceof Error) {
      console.error(updatedProfile);
      return new Error('Failed to read the updated profile data');
    }

    const { email } = profile;

    if (email) {
      // if it is necessary to update email value
      // it will cause that user must authentificate
      // once again
      const updateEmailResult = await this.setProfileDataEmail(email);

      if (updateEmailResult instanceof Error) {
        return updateEmailResult;
      }
    }
    return {
      ...updatedProfile,
      email: email || null,
    };
  }

  protected async handleAuthEmailNotVerified(): Promise<boolean | Error> {
    const isConnected = this.checkIfConnected();

    if (isConnected instanceof Error) {
      return isConnected;
    }

    const { currentUser } = this;

    if (!currentUser) {
      return new Error('There is no an active connection to the remote server');
    }

    try {
      await currentUser.sendEmailVerification();
    } catch (err) {
      console.error(err);
      return new Error('Failed to send the email verification link');
    }
    return true;
  }

  protected async handleAuthSuccess(
    cryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<ICAConnectionUserAuthorizedResult | Error> {
    const { isVerifiedAccount } = this;

    if (isVerifiedAccount) {
      return this.returnOnAuthorizedResult(cryptoCredentials);
    }

    const sendVerificationEmailResult = await this.handleAuthEmailNotVerified();

    if (sendVerificationEmailResult instanceof Error) {
      console.error(sendVerificationEmailResult);
      return new Error('Failed to send the email verification');
    }
    return new Error('Please verify the email address');
  }

  public async authorize(
    signUpCredentials: ICAConnectionSignUpCredentials,
    profile?: Partial<ICentralAuthorityUserProfile>
  ): Promise<ICAConnectionUserAuthorizedResult | Error> {
    const isConnected = this.checkIfConnected();

    if (isConnected instanceof Error) {
      return isConnected;
    }

    const { cryptoCredentials } = signUpCredentials;

    if (!checkIsValidCryptoCredentials(cryptoCredentials)) {
      return new Error('The crypto credentials value is not valid');
    }

    const { isAuthorized } = this;

    if (isAuthorized) {
      // TODO - verify the crypto credentials
      return this.handleAuthSuccess(cryptoCredentials);
    }

    // try to sign in with the credentials, then try to sign up
    const signInResult = await this.singInWithAuthCredentials(
      signUpCredentials
    );

    if (signInResult instanceof Error) {
      // if failed to sign in with the
      // credentials, then try to
      // sign up
      const signUpResult = await this.singUpWithAuthCredentials(
        signUpCredentials
      );

      if (signUpResult instanceof Error) {
        // if sign up failed then return
        // error that the authorization
        // failed
        return this.onAuthorizationFailed(
          'Failed to authorize on Firebase remote server with the credentials'
        );
      }
    }

    const authHandleResult = await this.handleAuthSuccess(cryptoCredentials);

    if (authHandleResult instanceof Error) {
      return authHandleResult;
    }
    if (profile && isEmptyObject(profile)) {
      const setProfileResult = await this.setProfileData(profile);

      if (setProfileResult instanceof Error) {
        console.error(setProfileResult);
        return new Error('Failed to set the profile data');
      }
      return {
        profile: setProfileResult,
        // TODO it is necessry to set this credentials in the database
        cryptoCredentials: signUpCredentials.cryptoCredentials,
      };
    }
    return authHandleResult;
  }

  public async signOut(): Promise<boolean | Error> {
    const isConnected = this.checkIfConnected();

    if (isConnected instanceof Error) {
      return isConnected;
    }

    const { app } = this;

    try {
      await app!!.auth().signOut();
    } catch (err) {
      console.error(err);
      return new Error('Failed to sign out');
    }

    this.setAuthorizedStatus(false);
    return true;
  }

  public async delete(): Promise<Error | boolean> {
    const isConnected = this.checkIfConnected();

    if (isConnected instanceof Error) {
      return isConnected;
    }

    const { currentUser } = this;

    if (currentUser instanceof Error) {
      console.error(currentUser);
      return new Error('Failed to read the current user');
    }
    if (currentUser == null) {
      return new Error('There is no current user');
    }
    try {
      await currentUser.delete();
    } catch (err) {
      console.error(err);
      return new Error('Failed to delete the user from the authority');
    }
    return true;
  }
}

export default CAConnectionWithFirebase;
