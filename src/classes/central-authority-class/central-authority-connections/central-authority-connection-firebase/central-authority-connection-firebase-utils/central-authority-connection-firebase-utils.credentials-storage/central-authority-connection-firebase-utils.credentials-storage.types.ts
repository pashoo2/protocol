import firebase from 'firebase/app';
import { CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_FIREBASE_USER_ID_PROPERTY } from './central-authority-connection-firebase-utils.credentials-storage.const';
import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';

export interface ICAConnectionFirestoreUtilsCredentialsStrorage {
  setUserCredentials(
    userId: TSwarmMessageUserIdentifierSerialized,
    cryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<Error | boolean>;
  getUserCredentials(
    userId: TSwarmMessageUserIdentifierSerialized
  ): Promise<Error | null | TCentralAuthorityUserCryptoCredentials>;
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
