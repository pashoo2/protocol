import { CAConnectionWithFirebaseUtilDatabase } from '../central-authority-connection-firebase-utils.database/central-authority-connection-firebase-utils.database';
import {
  getUserIdentityByCryptoCredentials,
  exportCryptoCredentialsToString,
  importCryptoCredentialsFromAString,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import {
  CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX,
  CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY,
  CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_MAXIMUM_STORED_VALUES_CHECK,
} from './central-authority-connection-firebase-utils.credentials-storage.const';
import {
  ICAConnectionFirebase,
  ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure,
} from './central-authority-connection-firebase-utils.credentials-storage.types';
import { encodeForFirebaseKey } from 'utils/firebase-utils/firebase-utils';
import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { checkIsValidExportedCryptoCredentialsToString } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';

/**
 * This class is used for storing
 * and reading the user's credentials.
 * It also used for reading
 * credentials of another user from the
 * Firebase remote database.
 * @export
 * @class CAConnectionFirestoreUtilsCredentialsStrorage
 * @extends {CAConnectionWithFirebaseUtilDatabase}
 */
export class CAConnectionFirestoreUtilsCredentialsStrorage extends CAConnectionWithFirebaseUtilDatabase {
  protected connectionToFirebase?: ICAConnectionFirebase;

  protected app?: firebase.app.App;

  /**
   * returns a string will used to store/read value of
   * the user credentials
   * @protected
   * @param {string} userId
   * @returns {string}
   * @memberof CAConnectionFirestoreUtilsCredentialsStrorage
   */
  protected getCredentialsKeyByUserId(userId: string): string {
    return `${CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX}${encodeForFirebaseKey(
      userId
    )}`;
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

    if (!connectionToFirebase || !connectionToFirebase.isUserSignedIn) {
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

  constructor(connectionToFirebase: ICAConnectionFirebase) {
    super();

    this.setUpConnection(connectionToFirebase);
  }

  protected setUpConnection(connectionToFirebase: ICAConnectionFirebase) {
    if (!connectionToFirebase.isUserSignedIn) {
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

  /**
   *
   * check if a credentials set in the storage
   * are in the valid format
   * @protected
   * @param {*} storedCredentialsValue
   * @returns {storedCredentialsValue is ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure}
   * @memberof CAConnectionFirestoreUtilsCredentialsStrorage
   */
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

      // an id set for the user by the Firebase
      if (typeof firebaseId === 'string') {
        if (checkIsValidExportedCryptoCredentialsToString(credentials)) {
          return true;
        }
        console.error(
          "Credentials are't exists or invalid in the stored credentials"
        );
      } else {
        console.error(
          'Firebase user id is not valid in the stored credentials'
        );
      }
    }
    return false;
  }

  protected async getCredentialsByValueStored(
    storedCredentialsValue: any
  ): Promise<TCentralAuthorityUserCryptoCredentials | null | Error> {
    if (storedCredentialsValue == null) {
      return null;
    }
    if (storedCredentialsValue instanceof Error) {
      return storedCredentialsValue;
    }
    if (!this.checkStoredCredentialsFormat(storedCredentialsValue)) {
      return new Error('the value stored have an unknown format');
    }

    const { credentials: exportedCredentials } = storedCredentialsValue;
    const importedCredentials = await importCryptoCredentialsFromAString(
      exportedCredentials
    );

    if (importedCredentials instanceof Error) {
      console.error(importedCredentials);
      return new Error('Failed to import credentials value stored');
    }
    return importedCredentials;
  }

  /**
   *
   * filter a value stored for the user key
   * to get a value of the credentials
   * for the user
   * @protected
   * @param {{
   *     [key: string]: any;
   *   }} [valueStored]
   * @returns {(Promise<TCentralAuthorityUserCryptoCredentials | null | Error>)}
   * @memberof CAConnectionFirestoreUtilsCredentialsStrorage
   */
  protected async filterCredentialsValues(valueStored?: {
    [key: string]: any;
  }): Promise<TCentralAuthorityUserCryptoCredentials | null | Error> {
    if (!valueStored) {
      return null;
    }
    if (valueStored instanceof Error) {
      return valueStored;
    }

    const keys = Object.keys(valueStored);

    // if an empty object
    if (keys.length === 0) {
      return null;
    }

    const len = Math.min(
      keys.length,
      CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_MAXIMUM_STORED_VALUES_CHECK
    );
    let idx = 0;
    let keyValueStored;
    let valueValueStored;
    let credentialsImported;

    // for each property of the value stored
    // check wherether it is a valid
    // crypto credentials
    for (; idx < len; idx++) {
      keyValueStored = keys[idx];
      valueValueStored = valueStored[keyValueStored];
      credentialsImported = await this.getCredentialsByValueStored(
        valueValueStored
      );

      if (!(credentialsImported instanceof Error)) {
        return credentialsImported;
      }
    }
    return null;
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
      // read a value storerd as user's
      // credentials in the database
      const snapshot = await database
        .ref(CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX)
        .orderByChild(
          CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY
        )
        .equalTo(firebaseUserId)
        .once('value');

      if (snapshot.exists()) {
        const valueStored = snapshot.val();
        return this.filterCredentialsValues(valueStored);
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
  ): Promise<Error | TCentralAuthorityUserCryptoCredentials> {
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

    // check if a credentials value is
    // already exists for the user
    const credentialsForTheCurrentUser = await this.getCredentialsForTheCurrentUser();

    if (
      credentialsForTheCurrentUser != null &&
      !(credentialsForTheCurrentUser instanceof Error)
    ) {
      // if a credentials are already stored for the user
      // return it
      return credentialsForTheCurrentUser;
    }

    const userId = getUserIdentityByCryptoCredentials(credentials);

    if (userId instanceof Error) {
      console.error(userId);
      return new Error("Failed to get a user's identity from the credentials");
    }

    const exportedCryptoCredentials = await exportCryptoCredentialsToString(
      credentials
    );

    if (exportedCryptoCredentials instanceof Error) {
      console.error(exportedCryptoCredentials);
      return new Error('Failed to export the crypto credentials value');
    }

    //check if the user id is not exists in the database
    const credentialsForTheUserId = await this.getUserCredentials(userId);

    if (
      credentialsForTheUserId != null &&
      !(credentialsForTheUserId instanceof Error)
    ) {
      return new Error(
        'A crypto credentials is already exists for the user id'
      );
    }

    const keyForValue = this.getCredentialsKeyByUserId(userId);
    const storeResult = await this.setValue<
      ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure
    >(keyForValue, {
      credentials: exportedCryptoCredentials,
      [CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY]: firebaseUserId,
    });

    if (storeResult instanceof Error) {
      console.error(storeResult);
      return new Error('Failed to store the credentials in the database');
    }
    return credentials;
  }

  /**
   *
   * return a credentials for the user
   * with the id = userId.
   * For the v1 the user id must be a uuidV4.
   * For the v2 the user id must be a login(email)
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
    if (!validateUserIdentity(userId)) {
      return new Error('The user identity is not valid');
    }

    const keyForValue = this.getCredentialsKeyByUserId(userId);
    const storedCredentialsValue = await this.getValue<
      ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure
    >(keyForValue);

    return this.getCredentialsByValueStored(storedCredentialsValue);
  }

  // disconnect from the database
  public async disconnect(): Promise<Error | boolean> {
    const isConnected = this.checkIsConnected();

    if (!isConnected) {
      return true;
    }
    const { database } = this;

    if (!database) {
      return new Error('There is no active database connection');
    }
    try {
      await database.goOffline();
    } catch (err) {
      console.error();
      return new Error('Failed to disconnect from the databases');
    }
    return true;
  }
}
