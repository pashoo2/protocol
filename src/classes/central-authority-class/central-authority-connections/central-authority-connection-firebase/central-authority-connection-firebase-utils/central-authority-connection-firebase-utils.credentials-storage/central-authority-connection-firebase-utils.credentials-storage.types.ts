import * as firebase from 'firebase/app';
import { CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY } from './central-authority-connection-firebase-utils.credentials-storage.const';
import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { CA_CONNECTION_STATUS } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-const/central-authority-connections-const';

export interface ICAConnectionFirestoreUtilsCredentialsStrorage {
  setUserCredentials(userId: string, cryptoCredentials: TCentralAuthorityUserCryptoCredentials): Promise<Error | boolean>;
  getUserCredentials(userId: string): Promise<Error | null | TCentralAuthorityUserCryptoCredentials>;
}

export interface ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure {
  [CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY]: string;
  credentials: string;
}

export interface ICAConnectionFirebase {
  isConnected: boolean;
  isUserSignedIn: boolean;
  getApp(): void | firebase.app.App;
}
