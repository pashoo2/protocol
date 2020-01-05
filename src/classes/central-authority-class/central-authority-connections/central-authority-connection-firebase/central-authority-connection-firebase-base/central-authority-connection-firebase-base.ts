import * as firebase from 'firebase/app';
import 'firebase/auth';
import {
  ICAConnectionSignUpCredentials,
  ICAConnectionUserAuthorizedResult,
} from '../../central-authority-connections.types';
import {
  ICAConnectionConfigurationFirebase,
  ICAConnectionFirebaseUserProfile,
} from '../central-authority-connection-firebase.types.configuration';
import {
  ICentralAuthorityUserAuthCredentials,
  TCentralAuthorityUserCryptoCredentials,
  ICentralAuthorityUserProfile,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { isEmptyObject } from 'utils/common-utils/common-utils-objects';
import { validateUserProfileData } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-user/central-authority-validators-user';
import {
  dataValidatorUtilEmail,
  dataValidatorUtilURL,
} from 'utils/data-validators-utils/data-validators-utils';
import { checkIsValidCryptoCredentials } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import { generateCryptoCredentialsWithUserIdentityV1 } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { CAConnectionFirestoreUtilsCredentialsStrorage } from '../central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.credentials-storage/central-authority-connection-firebase-utils.credentials-storage';
import { CA_CONNECTION_FIREBASE_CREDENTIALS_GENERATION_MAX_ATTEMPTS } from '../central-authority-connection-firebase.const/central-authority-connection-firebase.const.restrictions';
import { validatePassword } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import ErrorExtendedBaseClass from 'classes/basic-classes/error-extended-class-base/error-extended-class-base';
import {
  CA_CONNECTION_ERROR_ACCOUNT_NOT_VERIFIED_CODE,
  CA_CONNECTION_ERROR_ACCOUNT_CAN_NOT_BE_USED_ANYMORE,
} from '../../central-authority-connections-const/central-authority-connections-const';
import { valiateCAAuthConnectionFirebaseUtilsConnetionConfiguration } from '../central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.validators';

/**
 *
 * This is the class realized the basic functions
 * allows to connect with the Firebase.
 *
 * @export
 * @class CAConnectionWithFirebase
 */
export class CAConnectionWithFirebaseBase {
  public static validateConfiguration = valiateCAAuthConnectionFirebaseUtilsConnetionConfiguration;

  // if the application is connected with the remote Firebase
  public isConnected: boolean = false;

  public get isUserSignedIn(): boolean {
    const { isConnected, isVerifiedAccount } = this;

    if (!isConnected) {
      return false;
    }
    // according to the https://firebase.google.com/docs/auth/web/manage-users
    return isVerifiedAccount;
  }

  public get isAuthorized(): boolean {
    const {
      isUserSignedIn,
      valueofCredentialsSignUpOnAuthorizedSuccess: credentialsAuthorizedSuccess,
    } = this;

    if (!isUserSignedIn) {
      return false;
    }
    // according to the https://firebase.google.com/docs/auth/web/manage-users
    return !!credentialsAuthorizedSuccess;
  }

  public get authResult(): ICAConnectionUserAuthorizedResult | void {
    return this.valueofCredentialsSignUpOnAuthorizedSuccess;
  }

  protected app?: firebase.app.App;

  protected configuration?: ICAConnectionConfigurationFirebase;

  protected isAuthorizedWithCredentials: boolean = false;

  protected valueofCredentialsSignUpOnAuthorizedSuccess?: ICAConnectionUserAuthorizedResult;

  protected connectionWithCredentialsStorage?: CAConnectionFirestoreUtilsCredentialsStrorage;

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
    if (!currentUserData.emailVerified) {
      return false;
    }
    return true;
  }

  protected get databaseURL(): Error | string {
    const { configuration } = this;

    if (!configuration) {
      return new Error(
        'There is no url specified for the Firebase authority provided'
      );
    }

    const { databaseURL } = configuration;

    if (dataValidatorUtilURL(databaseURL)) {
      return databaseURL;
    }
    return new Error(
      'An invalid URL provided for the Firebase authority provider'
    );
  }

  // return the firebase application
  public getApp(): void | firebase.app.App {
    return this.app;
  }

  /**
   * sign out if authorized before
   *
   * @returns {(Promise<boolean | Error>)}
   * @memberof CAConnectionWithFirebaseBase
   */
  public async signOut(): Promise<boolean | Error> {
    const isConnected = this.checkIfConnected();

    if (isConnected instanceof Error) {
      return isConnected;
    }

    // disconnect the strage cause it's necessary
    // that the user was authorized
    const disconnectFromStorageResult = await this.disconnectCredentialsStorage();

    if (disconnectFromStorageResult instanceof Error) {
      return disconnectFromStorageResult;
    }

    const { app } = this;

    try {
      await app!!.auth().signOut();
    } catch (err) {
      console.error(err);
      return new Error('Failed to sign out');
    }
    this.handleUnauthorized();

    return true;
  }

  /**
   * connect to the Firebase database. To authorize
   * in the database to set credentials it is necesssry
   * to authorize in.
   *
   * @param {ICAConnectionConfigurationFirebase} configuration
   * @param {string} name - name of the application,
   * it's necessary to provide a name string if more than one Firebase
   * applications will be used simultaneousely. But at the first time
   * no name must be provided, cause it means that the DEFAULT application
   * will be created, which is required by the Firebase.
   * @returns {(Promise<boolean | Error>)}
   * @memberof CAConnectionWithFirebaseBase
   */
  public async connect(
    configuration: ICAConnectionConfigurationFirebase,
    name?: string
  ): Promise<boolean | Error> {
    let app;

    try {
      app = firebase.initializeApp(configuration, name);
      this.configuration = configuration;
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

  /**
   * This method may be substituted by firebase
   * connection implementation to be compilant
   * to an CA identifier version.
   * When call the method createOrSetCredentialsInDB
   * functions to generate credentials and store
   * it in the database may be substitudet by
   * an implementation of it compolant to the
   * identifier version.
   * Thi version is compilant to the identity v1.
   *
   * @param signUpCredentials
   */
  protected async generateAndSetCredentialsForTheCurrentUser(
    signUpCredentials: ICAConnectionSignUpCredentials
  ): Promise<Error | TCentralAuthorityUserCryptoCredentials> {
    const credentialsProvidedCheckResult = this.checkSignUpCredentials(
      signUpCredentials
    );

    if (credentialsProvidedCheckResult instanceof Error) {
      console.error(credentialsProvidedCheckResult);
      return credentialsProvidedCheckResult;
    }

    return this.createOrSetCredentialsInDB(signUpCredentials.cryptoCredentials);
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
    const { isConnected, connectionWithCredentialsStorage } = this;

    if (
      !connectionWithCredentialsStorage ||
      !connectionWithCredentialsStorage.isConnected
    ) {
      return false;
    }
    return !isConnected
      ? new Error('There is no active connection with the Firebase')
      : true;
  }

  protected checkSignUpCredentials(
    signUpCredentials: ICAConnectionSignUpCredentials
  ): boolean | Error {
    if (!signUpCredentials) {
      return new Error('Sign up credentials must be provided');
    }
    if (typeof signUpCredentials !== 'object') {
      return new Error('Sign up credentials must be an object');
    }

    const {
      cryptoCredentials: credentialsGiven,
      login,
      password,
    } = signUpCredentials;

    if (credentialsGiven) {
      const resultCheckCredentialsGiven = this.checkUserIdentityIsValidForConfigurationProvided(
        credentialsGiven
      );

      if (resultCheckCredentialsGiven instanceof Error) {
        console.error(resultCheckCredentialsGiven);
        return new Error(
          'Credentials given is not valid for the Firebase auth provider'
        );
      }
    }
    if (!dataValidatorUtilEmail(login)) {
      return new Error('The login must be an email valid');
    }
    if (!validatePassword(password)) {
      return new Error('The password provided is not valid');
    }
    return true;
  }

  protected setConnectionWithCredentialsStorage(
    connectionWithCredentialsStorage: CAConnectionFirestoreUtilsCredentialsStrorage
  ) {
    this.connectionWithCredentialsStorage = connectionWithCredentialsStorage;
  }

  protected async startConnectionWithCredentialsStorage(): Promise<
    boolean | Error
  > {
    if (this.connectionWithCredentialsStorage) {
      // if already connected with the credentials storage
      return true;
    }

    const connectionWithCredentialsStorage = new CAConnectionFirestoreUtilsCredentialsStrorage(
      this
    );
    const storageConnectionResult = await connectionWithCredentialsStorage.connect();

    if (storageConnectionResult instanceof Error) {
      console.error(storageConnectionResult);
      return new Error('Failed connect to the Firebase credentials storage');
    }
    if (!connectionWithCredentialsStorage.isConnected) {
      return new Error(
        'Connection to the Firebase credentials storage was not succeed'
      );
    }
    this.setConnectionWithCredentialsStorage(connectionWithCredentialsStorage);
    return true;
  }

  protected async waitingUserInit(): Promise<void | firebase.User | Error> {
    const isConnected = this.checkIfConnected();

    if (isConnected instanceof Error) {
      return new Error('The connection is not established');
    }
    if (!this.app) {
      return new Error('The Firebase app is not defined');
    }
    return new Promise((res) => {
      this.app!!.auth().onAuthStateChanged((user) => {
        debugger;
        if (user && user.email) {
          res(user);
        }
      });
    });
  }

  protected handleUnauthorized() {
    this.setAuthorizedStatus(false);
    this.valueofCredentialsSignUpOnAuthorizedSuccess = undefined;
  }

  // handle an authorization attemp failed
  protected onAuthorizationFailed(error: Error | string): Error {
    const err = error instanceof Error ? error : new Error(String(error));

    console.error(err);
    console.error('Authorization failed on remote Firebase server');
    this.handleUnauthorized();
    return err;
  }

  protected async singUpWithAuthCredentials(
    authCredentials: ICentralAuthorityUserAuthCredentials
  ): Promise<boolean | Error> {
    const checkSignUpCredentialsResult = this.checkSignUpCredentials(
      authCredentials
    );

    if (checkSignUpCredentialsResult instanceof Error) {
      console.error(checkSignUpCredentialsResult);
      return this.onAuthorizationFailed(checkSignUpCredentialsResult);
    }

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

  /**
   * sign in under the login
   * provided by the user
   * @param authCredentials
   * @param {string} authCredentials.login
   * @param {string} authCredentials.password
   */
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

    // current user is instance
    // of the firebase current user
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
      return {
        ...updatedProfile,
        email,
      };
    }
    return updatedProfile;
  }

  protected async handleAuthEmailNotVerified(): Promise<boolean | Error> {
    debugger;
    const isConnected = this.checkIfConnected();

    if (isConnected instanceof Error) {
      return isConnected;
    }

    const { currentUser } = this;
    debugger;
    if (!currentUser) {
      return new Error('There is no user authorized');
    }

    try {
      await currentUser.sendEmailVerification();
    } catch (err) {
      console.error(err);
      return new Error('Failed to send the email verification link');
    }
    return true;
  }

  /**
   * check if an account of the user
   * was verified or not.
   * If it wasn't, then send an email
   * to verify it.
   * @protected
   * @returns {(Promise<boolean | Error>)}
   * @memberof CAConnectionWithFirebase
   */
  protected async chekIfVerifiedAccount(): Promise<boolean | Error> {
    // if the account was validated by email
    if (this.isVerifiedAccount) {
      return true;
    }

    // if the account was not validated by email
    // send the verification email
    const sendVerificationEmailResult = await this.handleAuthEmailNotVerified();

    if (sendVerificationEmailResult instanceof Error) {
      console.error(sendVerificationEmailResult);
      return new Error('Failed to send the email verification');
    }
    return new ErrorExtendedBaseClass(
      'Please verify the email address',
      CA_CONNECTION_ERROR_ACCOUNT_NOT_VERIFIED_CODE
    );
  }

  protected generateNewCryptoCredentialsForConfigurationProvided = async (): Promise<
    Error | TCentralAuthorityUserCryptoCredentials
  > => {
    const { databaseURL } = this;

    if (databaseURL instanceof Error) {
      return databaseURL;
    }

    const cryptoCredentials = await generateCryptoCredentialsWithUserIdentityV1(
      {
        authorityProviderURI: databaseURL,
      }
    );

    if (cryptoCredentials instanceof Error) {
      console.error(cryptoCredentials);
      return new Error('Failed to generate a new crypto credentials');
    }
    return cryptoCredentials;
  };

  protected checkUserIdentityIsValidForConfigurationProvided(
    cryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Error | TCentralAuthorityUserCryptoCredentials {
    const { databaseURL } = this;

    if (databaseURL instanceof Error) {
      return databaseURL;
    }
    if (!checkIsValidCryptoCredentials(cryptoCredentials)) {
      return new Error('The crypto credentials value is not valid');
    }

    const caUserIdentity = new CentralAuthorityIdentity(cryptoCredentials);

    if (!caUserIdentity.isValid) {
      return new Error('User identity is not valid');
    }

    const { identityDescription: identityDescriptionParsed } = caUserIdentity;

    if (identityDescriptionParsed instanceof Error) {
      console.error(identityDescriptionParsed);
      return new Error('Failed to get description by identity string');
    }
    if (
      identityDescriptionParsed[
        CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME
      ] !== databaseURL
    ) {
      return new Error(
        'Wrong authority provider url got from the identity string'
      );
    }
    return cryptoCredentials;
  }

  protected async readCryptoCredentialsForTheUserFromDatabase(): Promise<
    Error | TCentralAuthorityUserCryptoCredentials | null
  > {
    const isConnected = this.checkIfConnected();

    if (!isConnected) {
      return new Error(
        'There is no active connection to the Firebase auth provider'
      );
    }

    const { connectionWithCredentialsStorage } = this;
    const credentialsForTheCurrentUser = await connectionWithCredentialsStorage!!.getCredentialsForTheCurrentUser();

    if (credentialsForTheCurrentUser instanceof Error) {
      console.error(credentialsForTheCurrentUser);
      return new Error('Failed to read credentials of the current user');
    }
    return credentialsForTheCurrentUser;
  }

  protected setCryptoCredentialsForTheUserToDatabase = async (
    cryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<Error | TCentralAuthorityUserCryptoCredentials> => {
    const isConnected = this.checkIfConnected();
    const { connectionWithCredentialsStorage } = this;

    if (!isConnected) {
      return new Error(
        'There is no active connection to the Firebase auth provider'
      );
    }
    // set the new generated credentials forcely
    // and rewrite the existing
    // cause it is not valid
    const setCredentialsResult = await connectionWithCredentialsStorage!!.setUserCredentials(
      cryptoCredentials
    );

    if (setCredentialsResult instanceof Error) {
      return setCredentialsResult;
    }
    // if not an error then return
    // a crypto credentials
    return setCredentialsResult;
  };

  protected async createOrSetCredentialsInDB(
    credentialsGiven?: TCentralAuthorityUserCryptoCredentials,
    generateNewCryptoCredentialsForConfigurationProvided: () => Promise<
      Error | TCentralAuthorityUserCryptoCredentials
    > = this.generateNewCryptoCredentialsForConfigurationProvided,
    setCryptoCredentialsForTheUserToDatabase: (
      cryptoCredentials: TCentralAuthorityUserCryptoCredentials
    ) => Promise<Error | TCentralAuthorityUserCryptoCredentials> = this
      .setCryptoCredentialsForTheUserToDatabase
  ): Promise<Error | TCentralAuthorityUserCryptoCredentials> {
    let attempt = 0;
    let cryptoCredentials:
      | TCentralAuthorityUserCryptoCredentials
      | Error = new Error(
      'Failed to generate and set a crypto credentials for the user because of unknown reason'
    );
    let isSuccess: boolean = false;

    if (
      typeof generateNewCryptoCredentialsForConfigurationProvided !== 'function'
    ) {
      return new Error(
        'The generateNewCryptoCredentialsForConfigurationProvided argument must be a function'
      );
    }
    if (typeof setCryptoCredentialsForTheUserToDatabase !== 'function') {
      return new Error(
        'The setCryptoCredentialsForTheUserToDatabase argument must be a function'
      );
    }

    // try a multiple times cause may be
    // a network errors or user id
    // is already exists in the database
    while (
      attempt < CA_CONNECTION_FIREBASE_CREDENTIALS_GENERATION_MAX_ATTEMPTS &&
      !isSuccess
    ) {
      cryptoCredentials = credentialsGiven
        ? // if a credentials provided, then use it
          credentialsGiven
        : // if a credentials not provided, generate a new one
          await generateNewCryptoCredentialsForConfigurationProvided();

      if (cryptoCredentials instanceof Error) {
        // fialed to generate a new crypto credentials
        console.error(cryptoCredentials);
      } else {
        const setCredentialsResult = await setCryptoCredentialsForTheUserToDatabase(
          cryptoCredentials
        );

        if (setCredentialsResult instanceof Error) {
          console.error(setCredentialsResult);
          cryptoCredentials = new Error(
            'Failed to store credentials for the user in the database'
          );
        } else {
          cryptoCredentials = setCredentialsResult;
          isSuccess = true;
        }
      }
      attempt += 1;
    }
    return cryptoCredentials;
  }

  /**
   * check if a credentials are already exists
   * in the remote storage for the user.
   *
   * @protected
   * @returns
   * @memberof CAConnectionWithFirebaseBase
   */
  protected async checkIfCredentialsExistsForTheUser(): Promise<
    Error | void | TCentralAuthorityUserCryptoCredentials
  > {
    const credentialsExistingForTheCurrentUser = await this.readCryptoCredentialsForTheUserFromDatabase();

    if (credentialsExistingForTheCurrentUser instanceof Error) {
      // if something was going wrong when reading
      // a credentials for the current user
      // return an Error, because if ignore
      // and set a new credentials in storage
      // the data may become inconsistent, cause
      // credentials is already exists in the database
      // but an error has occurred once for a some reason.
      console.error(credentialsExistingForTheCurrentUser);
      return new Error(
        'Failed to read credentials for the user from the Firebase database'
      );
    }

    if (credentialsExistingForTheCurrentUser) {
      const credentialsValidationResult = this.checkUserIdentityIsValidForConfigurationProvided(
        credentialsExistingForTheCurrentUser
      );

      if (credentialsValidationResult instanceof Error) {
        console.error(credentialsValidationResult);
        console.error('The credentials stored for the user is not valid');
        // if credentials exists for the user but invalid at now
        // return an error to inform that the user can't user
        // this account for authorization.
        // Credentials was already read by another users
        // and if we set a new one in the storage it may
        // cause inconsistency.
        return new ErrorExtendedBaseClass(
          "Sorry, you can't use this account anymore, cause a credentials existing for the account exists and not valid",
          CA_CONNECTION_ERROR_ACCOUNT_CAN_NOT_BE_USED_ANYMORE
        );
      }

      // if the credentials read from the
      // Firebase storage is valid
      // for the current configuration return it
      return credentialsExistingForTheCurrentUser;
    }
  }

  protected async createOrReturnExistingCredentialsForUser(
    signUpCredentials: ICAConnectionSignUpCredentials
  ): Promise<Error | TCentralAuthorityUserCryptoCredentials> {
    const credentialsExistingForTheCurrentUser = await this.checkIfCredentialsExistsForTheUser();

    if (credentialsExistingForTheCurrentUser instanceof Error) {
      return credentialsExistingForTheCurrentUser;
    }
    if (credentialsExistingForTheCurrentUser != null) {
      // if an existing credentials returned
      return credentialsExistingForTheCurrentUser;
    }
    // if there is no credentials stored for the user

    // generate a new credentials for the user and
    // set it in the storage. If a credentials was
    // provided into signUpCredentials and valid, it will be used
    // instead of generating a new one.
    const newCredentialsGenerated = await this.generateAndSetCredentialsForTheCurrentUser(
      signUpCredentials
    );

    if (newCredentialsGenerated instanceof Error) {
      console.error(newCredentialsGenerated);
      return new Error(
        'Failed to generate or set a crypto credentials for the user'
      );
    }
    return newCredentialsGenerated;
  }

  protected async signIn(
    firebaseCredentials: ICAConnectionSignUpCredentials
  ): Promise<boolean | Error> {
    const checkSignUpCredentialsResult = this.checkSignUpCredentials(
      firebaseCredentials
    );

    if (checkSignUpCredentialsResult instanceof Error) {
      console.error(checkSignUpCredentialsResult);
      return this.onAuthorizationFailed(checkSignUpCredentialsResult);
    }

    // try to sign in with the credentials, then try to sign up
    return this.singInWithAuthCredentials(firebaseCredentials);
  }

  protected async signUp(
    signUpCredentials: ICAConnectionSignUpCredentials
  ): Promise<Error | boolean> {
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
    return true;
  }

  protected async disconnectCredentialsStorage(): Promise<Error | boolean> {
    const { connectionWithCredentialsStorage } = this;

    if (
      connectionWithCredentialsStorage &&
      connectionWithCredentialsStorage.isConnected
    ) {
      const res = await connectionWithCredentialsStorage.disconnect();

      if (res instanceof Error) {
        console.error(res);
        return new Error(
          'Failed to disconnect from the Firebase credentials storage'
        );
      }
    }

    this.connectionWithCredentialsStorage = undefined;
    return true;
  }
}

export default CAConnectionWithFirebaseBase;