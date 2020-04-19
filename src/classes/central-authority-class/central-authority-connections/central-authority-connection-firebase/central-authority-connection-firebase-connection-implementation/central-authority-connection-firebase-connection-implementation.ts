import firebase from 'firebase';
import 'firebase/auth';
import memoize from 'lodash.memoize';
import CAConnectionWithFirebaseBase from '../central-authority-connection-firebase-base/central-authority-connection-firebase-base';
import {
  ICAConnection,
  ICAConnectionSignUpCredentials,
  ICAConnectionUserAuthorizedResult,
} from '../../central-authority-connections.types';
import { isEmptyObject } from 'utils/common-utils/common-utils-objects';
import {
  ICentralAuthorityUserProfile,
  TCentralAuthorityUserCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { getVersionOfCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import {
  CA_USER_IDENTITY_VERSIONS,
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSION_CURRENT,
} from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { generateCryptoCredentialsWithUserIdentityV2 } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import { validateUserIdentityVersion } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { TUserIdentityVersion } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';
import { ICAConnectionConfigurationFirebase } from '../central-authority-connection-firebase.types.configuration';
import { CA_CONNECTION_STATUS } from '../../central-authority-connections-const/central-authority-connections-const';

/**
 *
 * This is the class realized connection with the Firebase.
 * It allows to sign up and authorize on it, set a crypto credentials
 * for the user and read credentials for another users.
 * The versions of a connections to the Firebase must
 * extends this class. This implementation is compilant
 * to the V1 and V2 of the user identity.
 *
 * @export
 * @class CAConnectionWithFirebase
 * @implements {ICAConnection}
 */
export class CAConnectionWithFirebaseImplementation
  extends CAConnectionWithFirebaseBase
  implements ICAConnection {
  public get cryptoCredentials():
    | TCentralAuthorityUserCryptoCredentials
    | undefined {
    const { valueofCredentialsSignUpOnAuthorizedSuccess } = this;

    if (valueofCredentialsSignUpOnAuthorizedSuccess) {
      const { cryptoCredentials } = valueofCredentialsSignUpOnAuthorizedSuccess;

      return cryptoCredentials;
    }
  }

  public get authProviderURL() {
    const { databaseURL } = this;

    return databaseURL instanceof Error ? undefined : databaseURL;
  }

  /**
   * the current status of the connection
   * to the Firebase remote database
   *
   * @readonly
   * @type {CA_CONNECTION_STATUS}
   * @memberof CAConnectionWithFirebaseImplementation
   */
  public get status(): CA_CONNECTION_STATUS {
    const { isConnected, isAuthorized, isAnonymousely } = this;

    if (!isConnected) {
      return CA_CONNECTION_STATUS.DISCONNECTED;
    }
    if (isAuthorized) {
      return CA_CONNECTION_STATUS.AUTHORIZED;
    }
    if (isAnonymousely) {
      return CA_CONNECTION_STATUS.CONNECTED;
    }
    return CA_CONNECTION_STATUS.DISCONNECTED;
  }

  /**
   * whether the user is connected anonymousely
   * or not. User must be authorized or connected
   * anonymousely
   *
   * @memberof CAConnectionWithFirebaseImplementation
   */
  protected isAnonymousely = false;

  protected userLogin?: string;

  /**
   * list with identity versions supported by the connection
   *
   * @type {Array<TUserIdentityVersion>}
   * @memberof CAConnectionWithFirebaseImplementation
   */
  protected readonly supportedVersions: Array<TUserIdentityVersion> = [
    CA_USER_IDENTITY_VERSIONS['01'],
    CA_USER_IDENTITY_VERSIONS['02'],
  ];

  /**
   * checks whether the identity version
   * is supported by the connection
   *
   * @memberof CAConnectionWithFirebaseImplementation
   */
  public isVersionSupported = memoize(
    (version: TUserIdentityVersion): boolean =>
      this.supportedVersions.includes(version)
  );

  /**
   * connect to the Firebase database. To authorize
   * in the database to set credentials it is necesssry
   * to authorize in.
   * To read credentials of another user authorization is not
   * necessary.
   * Connection will be established in the anonymous mode
   *
   * @param {ICAConnectionConfigurationFirebase} configuration
   * @returns {(Promise<boolean | Error>)}
   * @memberof CAConnectionWithFirebaseBase
   */
  public async connect(
    configuration: ICAConnectionConfigurationFirebase
  ): Promise<boolean | Error> {
    // if there is an active apps exists then it is necessary
    // to provide the app name, elswere the Firebase will throw
    // an error.
    const appName = firebase.apps.length
      ? configuration.databaseURL
      : undefined;
    const resultConnection = await super.connect(configuration, appName);

    if (resultConnection instanceof Error) {
      return resultConnection;
    }
    return true;
  }

  public async signInAnonymousely(): Promise<Error | void> {
    try {
      // may be authentificated with session
      //await this.signInWithSessionPersisted();
      const connectAnonymouselyResult = await this.app
        .auth()
        .signInAnonymously();
      if (connectAnonymouselyResult instanceof Error) {
        return connectAnonymouselyResult;
      }
    } catch (err) {
      console.error(err);
      return new Error('Failed to connect anonymousely');
    }

    const connectWithStorageResult = await this.startConnectionWithCredentialsStorage();

    if (connectWithStorageResult instanceof Error) {
      console.error(connectWithStorageResult);
      return new Error('Failed to connect to the credentials storage');
    }
    this.setIsAnonymousely();
  }

  /**
   * return a credentials for the user
   * with the id = userId.
   * For the v1 the user id must be a uuidV4.
   * For the v2 the user id must be a login/email/uuid.
   * under which the user was registered the
   * Firebase account.
   *
   * @param {string} userId
   * @returns {(Promise<Error | null | TCentralAuthorityUserCryptoCredentials>)}
   * @memberof CAConnectionFirestoreUtilsCredentialsStrorage
   */
  public async getUserCredentials(
    userId: string
  ): Promise<Error | null | TCentralAuthorityUserCryptoCredentials> {
    const { status } = this;

    if (status !== CA_CONNECTION_STATUS.DISCONNECTED) {
      const { connectionWithCredentialsStorage } = this;

      return connectionWithCredentialsStorage!.getUserCredentials(userId);
    }
    return new Error('Not connected to the Firebase');
  }

  /**
   * @param {ICAConnectionSignUpCredentials} firebaseCredentials
   * @param firebaseCredentials.login - there must be an email to authorize with a Firebase account
   * @param firebaseCredentials.password - password used for encrypt a sensitive data and authorize
   * in the Firebase account
   * @param profile - if provided then the user profile will be set in firebase
   */
  public async authorize(
    firebaseCredentials: ICAConnectionSignUpCredentials,
    profile?: Partial<ICentralAuthorityUserProfile>
  ): Promise<ICAConnectionUserAuthorizedResult | Error> {
    const isConnected = this.checkIfConnected();

    if (isConnected instanceof Error) {
      return this.onAuthorizationFailed(isConnected);
    }

    let authHandleResult;
    const { isAuthorized } = this;

    if (isAuthorized) {
      authHandleResult = this.valueofCredentialsSignUpOnAuthorizedSuccess!!;
    } else {
      // try to sign in with the credentials, then try to sign up
      // const userLoggedPromise = this.waitingUserInit();
      const signInResult = await this.signIn(firebaseCredentials);

      if (signInResult instanceof Error) {
        console.warn('Failed to sign in with the credentials given');

        if (!firebaseCredentials.password) {
          // if there is no password provided, return the error
          return signInResult;
        }

        // if failed to sign in with the credentials
        // try to sign up
        const signUpResult = await this.signUp(firebaseCredentials);

        if (signUpResult instanceof Error) {
          console.error('The user was failed to sign up');
          return this.onAuthorizationFailed(signUpResult);
        }
      }
      // const user = await userLoggedPromise;
      // if (!user) {
      //   return new Error('Failed to get the user authorized');
      // }
      // if (user instanceof Error) {
      //   return new Error('Error on login');
      // }
      // if (!user.emailVerified) {

      // check if the account was verfied by the user
      const isVerifiedResult = await this.chekIfVerifiedAccount();

      if (isVerifiedResult instanceof Error) {
        console.error('The account is not verified');
        return this.onAuthorizationFailed(isVerifiedResult);
      }
      //}

      const connectWithStorageResult = await this.startConnectionWithCredentialsStorage();

      if (connectWithStorageResult instanceof Error) {
        console.error(connectWithStorageResult);
        return new Error('Failed to connect to the credentials storage');
      }
      // set the user login to use it to generate
      // crypto credentials
      this.setUserLogin(firebaseCredentials.login);

      // create a new credentnials for the user or return
      // an existing.
      // if a crytpto credentials provided in signUpCredentials
      // it will be used to set in the Firebase credentials
      // storage
      const cryptoCredentials = await this.createOrReturnExistingCredentialsForUser(
        firebaseCredentials
      );

      if (cryptoCredentials instanceof Error) {
        console.error('Failed to get a crypto credentials valid for the user');
        return this.onAuthorizationFailed(cryptoCredentials);
      }

      // give user's profile
      // with a credentials
      authHandleResult = await this.returnOnAuthorizedResult(cryptoCredentials);
    }

    if (authHandleResult instanceof Error) {
      return this.onAuthorizationFailed(authHandleResult);
    }
    // if a profile data is necessary to be set
    // by a profile data from the arguments given
    if (profile && !isEmptyObject(profile)) {
      const setProfileResult = await this.setProfileData(profile);

      if (setProfileResult instanceof Error) {
        console.error(setProfileResult);
        return this.onAuthorizationFailed('Failed to set the profile data');
      }

      // set porofile is the user's profile
      // data stored in the firebase
      authHandleResult = {
        profile: setProfileResult,
        // TODO it is necessry to set this credentials in the database
        cryptoCredentials: authHandleResult.cryptoCredentials,
      };
    }
    // set the authentification success
    // result. To return it on the second authorization
    // request
    this.valueofCredentialsSignUpOnAuthorizedSuccess = authHandleResult;
    this.setValueofCredentialsSignUpOnAuthorizedSuccess(authHandleResult);
    this.unsetIsAnonymousely();
    return authHandleResult;
  }

  /**
   * disconnect from the app and sign out
   * if authorized
   *
   * @returns
   * @memberof CAConnectionWithFirebaseImplementation
   */
  public async disconnect() {
    const { app } = this;
    if (!app) {
      return;
    }
    if ((app as any).isDeleted_) {
      return;
    }
    if (this.status === CA_CONNECTION_STATUS.AUTHORIZED) {
      const signOutResult = await this.signOut();

      if (signOutResult instanceof Error) {
        return signOutResult;
      }
      if (signOutResult !== true) {
        return new Error('An unknown error has occurred while sign out');
      }
    }
    return this.disconnectFromTheApp();
  }

  public async delete(
    firebaseCredentials: ICAConnectionSignUpCredentials
  ): Promise<Error | boolean> {
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

    // try to sign in with the credentials.
    // it is required by the firebase to sign in before
    // delete the user.
    const signInResult = await this.signIn(firebaseCredentials);

    if (signInResult instanceof Error) {
      console.error('Failed to sign in before the user deletion');
      return signInResult;
    }

    try {
      const result = (await currentUser.delete()) as unknown; // or maybe deleteWithCompletion method

      if (result instanceof Error) {
        console.error(result);
        return new Error('Failed to delete the user from the firebase');
      }
    } catch (err) {
      console.error(err);
      return new Error('Failed to delete the user from the authority');
    }

    // disconnection from the firebase
    // is not necessry cause the firebase
    // disconnects automatically if the user
    // delete himself
    return true;
  }

  /**
   * set that connected anonymousely
   * to the Firebase
   *
   * @protected
   * @memberof CAConnectionWithFirebaseImplementation
   */
  protected setIsAnonymousely() {
    this.isAnonymousely = true;
  }

  /**
   * unset that connected to the Firebase
   * anonymousely
   *
   * @protected
   * @memberof CAConnectionWithFirebaseImplementation
   */
  protected unsetIsAnonymousely() {
    this.isAnonymousely = false;
  }

  protected setValueofCredentialsSignUpOnAuthorizedSuccess(
    authResult: ICAConnectionUserAuthorizedResult
  ) {
    this.valueofCredentialsSignUpOnAuthorizedSuccess = authResult;
  }

  protected unsetValueofCredentialsSignUpOnAuthorizedSuccess() {
    this.valueofCredentialsSignUpOnAuthorizedSuccess = undefined;
  }

  /**
   * set identity versions which are
   * supported by the connection
   * instance
   *
   * @protected
   * @param {Array<TUserIdentityVersion>} [supportedVersions]
   * @returns {(Error | void)}
   * @memberof CAConnectionWithFirebaseImplementation
   */
  protected setVersionsSupported(
    supportedVersions?: Array<TUserIdentityVersion>
  ): Error | void {
    if (supportedVersions instanceof Array) {
      const len = supportedVersions.length;
      let idx = 0;
      let version;

      for (; idx++; len < idx) {
        version = supportedVersions[idx];
        if (validateUserIdentityVersion(version)) {
          this.supportedVersions.push(version);
        }
        return new Error('The version is not supproted');
      }
    }
    return new Error('The argument must be an Array');
  }

  protected setUserLogin(login: string) {
    this.userLogin = login;
  }

  /**
   * this method generates credentials compilant to the version
   * version 2 of the user identity. The firebase app user uid
   * is used as the user id.
   *
   * @protected
   * @returns {(Promise<
   *     Error | TCentralAuthorityUserCryptoCredentials
   *   >)}
   * @memberof CAConnectionWithFirebaseImplementation
   */
  protected generateNewCryptoCredentialsForConfigurationProvidedV2 = async (): Promise<
    Error | TCentralAuthorityUserCryptoCredentials
  > => {
    const { databaseURL, currentUser } = this;

    if (!currentUser) {
      return new Error('The user is not defined');
    }
    if (databaseURL instanceof Error) {
      return databaseURL;
    }

    const cryptoCredentials = await generateCryptoCredentialsWithUserIdentityV2(
      {
        [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: databaseURL,
        [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: currentUser.uid,
      }
    );

    if (cryptoCredentials instanceof Error) {
      console.error(cryptoCredentials);
      return new Error('Failed to generate a new crypto credentials');
    }
    return cryptoCredentials;
  };

  /**
   * substitute the method to support v2 identity
   *
   * @protected
   * @param {ICAConnectionSignUpCredentials} signUpCredentials
   * @returns {(Promise<Error | TCentralAuthorityUserCryptoCredentials>)}
   * @memberof CAConnectionWithFirebaseImplementation
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

    const { cryptoCredentials } = signUpCredentials;
    const V1 = CA_USER_IDENTITY_VERSIONS['01'];
    let credentialsForV1 = false;

    if (this.isVersionSupported(V1)) {
      credentialsForV1 =
        CA_USER_IDENTITY_VERSION_CURRENT === CA_USER_IDENTITY_VERSIONS['01'];

      if (cryptoCredentials) {
        // check a version of the credentials
        // to decide what to do next
        const cryptoCredentialsVersion = getVersionOfCryptoCredentials(
          cryptoCredentials
        );

        if (cryptoCredentialsVersion instanceof Error) {
          console.error(cryptoCredentialsVersion);
          return new Error(
            'Failed to define a version of the crypto credentials'
          );
        }
        if (cryptoCredentialsVersion === CA_USER_IDENTITY_VERSIONS['01']) {
          // if the credentials version is 01 we may use the
          // current implementation cause it is fully
          // compilant to that version
          credentialsForV1 = true;
        } else {
          credentialsForV1 = false;
        }
      }
      // if a credentials for the V1 must be generated and set
      if (credentialsForV1 === true) {
        return this.createOrSetCredentialsInDB(signUpCredentials);
      }
    }
    // if the version is not 01, then provide another implementations
    // of the methods to generate and set the crypto credentials
    return this.createOrSetCredentialsInDB(
      signUpCredentials,
      this.generateNewCryptoCredentialsForConfigurationProvidedV2
    );
  }

  /**
   * disconnect from the Firebase app
   *
   * @protected
   * @returns {(Promise<Error | void>)}
   * @memberof CAConnectionWithFirebaseImplementation
   */
  protected async disconnectFromTheApp(): Promise<Error | void> {
    this.unsetIsAnonymousely();
    this.unsetValueofCredentialsSignUpOnAuthorizedSuccess();

    const disconnectFromStorageResult = await this.disconnectCredentialsStorage();

    if (disconnectFromStorageResult instanceof Error) {
      return disconnectFromStorageResult;
    }

    const { app } = this;

    if (app) {
      try {
        // delete the application to allow connect to the Firebase with the same settings
        await app.delete();
      } catch (err) {
        console.error(err);
        return new Error('Failed to disconnect from the Firebase app');
      }
    } else {
      return new Error('There is no active Firebase App instance to close');
    }
  }
}

export default CAConnectionWithFirebaseImplementation;
