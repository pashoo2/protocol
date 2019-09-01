import {
  TCentralAuthorityUserCryptoCredentials,
  TCentralAuthorityUserIdentity,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_USERID_PROP_NAME } from './central-authority-connection-firebase-utils.credentials-storage.const';

export interface ICAConnectionFirestoreUtilsCredentialsStrorage {
  setUserCredentials(
    userId: string,
    cryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<Error | boolean>;
  getUserCredentials(
    userId: string
  ): Promise<Error | null | TCentralAuthorityUserCryptoCredentials>;
}

export interface ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure {
  [CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_USERID_PROP_NAME]: TCentralAuthorityUserIdentity;
  credentials: TCentralAuthorityUserCryptoCredentials;
}
