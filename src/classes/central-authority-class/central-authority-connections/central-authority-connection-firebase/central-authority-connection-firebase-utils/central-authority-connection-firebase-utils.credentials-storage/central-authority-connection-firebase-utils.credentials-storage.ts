import { CAConnectionWithFirebaseUtilDatabase } from '../central-authority-connection-firebase-utils.database/central-authority-connection-firebase-utils.database';
import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { checkIsValidCryptoCredentials } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import { getUserIdentityByCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import {
  CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX,
  CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY,
} from './central-authority-connection-firebase-utils.credentials-storage.const';
import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure } from './central-authority-connection-firebase-utils.credentials-storage.types';
import CAConnectionWithFirebase from '../../central-authority-connection-firebase';

export class CAConnectionFirestoreUtilsCredentialsStrorage extends CAConnectionWithFirebaseUtilDatabase {
  protected connectionToFirebase?: CAConnectionWithFirebase;

  protected app?: firebase.app.App;

  protected getCredentialsKeyByUserId(userId: string): string {
    return `${CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX}_${userId}`;
  }

  protected checkIsConnected(): boolean | Error {
    const isConnectedToDatabase = super.checkIsConnected();

    if (isConnectedToDatabase instanceof Error) {
      return isConnectedToDatabase;
    }

    const { app, connectionToFirebase } = this;

    if (!connectionToFirebase) {
      return new Error(
        'There is no instance implements a connection to the Firebase application'
      );
    }
    if (!connectionToFirebase.isConnected) {
      return new Error(
        'There is no active connection to the firebase appliction'
      );
    }
    if (!app) {
      return new Error('There is no app connection');
    }
    return true;
  }

  protected get firebaseUserData(): firebase.User | null | Error {
    const isConnected = this.checkIsConnected();

    if (isConnected instanceof Error) {
      return isConnected;
    }

    const { app } = this;

    try {
      return app!!.auth().currentUser;
    } catch (err) {
      console.error(err);
      return new Error('Failed to get the user id for firebase');
    }
  }

  protected get firebaseUserId(): string | Error {
    const { firebaseUserData: userData } = this;

    if (userData instanceof Error) {
      console.error(userData);
      return new Error('Failed to read the user data from a firebase');
    }
    if (userData == null) {
      return new Error('There is no user data');
    }
    try {
      return userData.uid;
    } catch (err) {
      console.error(err);
      return new Error('Failed to get the user id for firebase');
    }
  }

  protected checkIsAuthorized(): boolean | Error {
    const isConnectedToDatabase = this.checkIsConnected();

    if (isConnectedToDatabase instanceof Error) {
      return isConnectedToDatabase;
    }

    const { firebaseUserId, connectionToFirebase } = this;

    if (!connectionToFirebase || !connectionToFirebase.isAuthorized) {
      return new Error(
        'The user is not authorized in the Firebase application'
      );
    }
    if (firebaseUserId instanceof Error) {
      console.error(firebaseUserId);
      return new Error('The user is not authorized');
    }
    return true;
  }

  constructor(connectionToFirebase: CAConnectionWithFirebase) {
    super();

    this.setUpConnection(connectionToFirebase);
  }

  protected setUpConnection(connectionToFirebase: CAConnectionWithFirebase) {
    if (
      typeof connectionToFirebase !== 'object' ||
      !(connectionToFirebase instanceof CAConnectionWithFirebase)
    ) {
      throw new Error('There is no instance of CAConnectionWithFirebase');
    }
    if (!connectionToFirebase.isAuthorized) {
      throw new Error('The user must be authorized in firebase');
    }
    this.connectionToFirebase = connectionToFirebase;

    const app = connectionToFirebase.getApp();

    if (!app) {
      throw new Error(
        'There is no insatnce which implements a connection to the Firebase app'
      );
    }
    this.app = app;
  }

  protected checkStoredCredentialsFormat(
    storedCredentialsValue: any
  ): storedCredentialsValue is ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure {
    if (storedCredentialsValue instanceof Error) {
      console.error(storedCredentialsValue);
      return false;
    }
    if (storedCredentialsValue && typeof storedCredentialsValue === 'object') {
      const {
        credentials,
        [CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY]: firebaseId,
      } = storedCredentialsValue;

      if (typeof firebaseId === 'string') {
        if (checkIsValidCryptoCredentials(credentials)) {
          return true;
        }
        console.error(
          'Credentials not exists or is invalid in the stored credentials'
        );
      } else {
        console.error(
          'Firebase user id is not valid in the stored credentials'
        );
      }
    }
    return false;
  }

  protected getCredentialsByValueStored(
    storedCredentialsValue: any
  ): TCentralAuthorityUserCryptoCredentials | null | Error {
    if (storedCredentialsValue == null) {
      return null;
    }
    if (!this.checkStoredCredentialsFormat(storedCredentialsValue)) {
      return new Error('the value stored have an unknown format');
    }
    return storedCredentialsValue.credentials;
  }

  // check if there is a credentials for the current user is exists
  // and return it if exists
  public async getCredentialsForTheCurrentUser(): Promise<
    Error | null | TCentralAuthorityUserCryptoCredentials
  > {
    const isAuthorizedResult = this.checkIsAuthorized();

    if (isAuthorizedResult instanceof Error) {
      console.error(isAuthorizedResult);
      return new Error('The user is not authorized');
    }

    const { firebaseUserId } = this;

    if (firebaseUserId instanceof Error) {
      console.error(firebaseUserId);
      return new Error('Failed to get user id of the firebase user');
    }

    const { database } = this;

    if (!database) {
      return new Error('There is no connection to the database server');
    }

    try {
      const snapshot = await database
        .ref(CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX)
        .orderByChild(
          CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY
        )
        .equalTo(firebaseUserId)
        .once('value');
      debugger; // TODO - next
      if (snapshot.exists()) {
        const valueStored = snapshot.val();

        return this.getCredentialsByValueStored(valueStored);
      }
    } catch (err) {
      console.error(err);
      return new Error('Failed to read the user data from the database');
    }
    return null;
  }

  // store the credentials value
  // for the current user
  public async setUserCredentials(
    credentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<Error | boolean> {
    const isAuthorizedResult = this.checkIsAuthorized();

    if (isAuthorizedResult instanceof Error) {
      console.error(isAuthorizedResult);
      return new Error('The user is not authorized');
    }
    if (!checkIsValidCryptoCredentials(credentials)) {
      return new Error('The credentials value is not valid');
    }

    const { firebaseUserId } = this;
    debugger;
    if (firebaseUserId instanceof Error) {
      console.error(firebaseUserId);
      return new Error('Failed to get user id of the firebase user');
    }

    // check if a credentials value is
    // already exists for the user
    const credentialsForTheCurrentUser = await this.getCredentialsForTheCurrentUser();
    debugger;
    if (
      credentialsForTheCurrentUser != null &&
      !(credentialsForTheCurrentUser instanceof Error)
    ) {
      return true;
    }

    debugger;
    const userId = getUserIdentityByCryptoCredentials(credentials);

    if (userId instanceof Error) {
      console.error(userId);
      return new Error("Failed to get a user's identity from the credentials");
    }
    debugger;
    const storeResult = this.setValue<
      ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure
    >(this.getCredentialsKeyByUserId(userId), {
      credentials,
      [CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY]: firebaseUserId,
    });
    debugger;
    if (storeResult instanceof Error) {
      console.error(storeResult);
      return new Error('Failed to store the credentials in the database');
    }
    return true;
  }

  public async getUserCredentials(
    userId: string
  ): Promise<Error | null | TCentralAuthorityUserCryptoCredentials> {
    if (!validateUserIdentity(userId)) {
      return new Error('The user identity is not valid');
    }

    const storedCredentialsValue = await this.getValue<
      ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure
    >(userId);

    return this.getCredentialsByValueStored(storedCredentialsValue);
  }
}
