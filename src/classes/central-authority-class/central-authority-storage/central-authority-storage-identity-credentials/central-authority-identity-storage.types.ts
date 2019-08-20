import {
  TCentralAuthorityUserIdentity,
  TCACryptoKeyPairs,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ownValueOf } from 'types/helper.types';
import { TSecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';

/**
 * contains the user's identifier
 * and a keys for data sign and
 * data encryption. An identifier
 * is unique, but an identifier's
 * value must be different for
 * the same user. It is necessary
 * to parse it and get a unique
 * value, which is uniquely
 * identifies the user throughout
 * the app.
 * @export
 * @interface ICAIdentityCredentialsDescription
 */
export interface ICAIdentityCredentialsDescription {
  // an identiy of the user
  identity: TCentralAuthorityUserIdentity;
  // a key pairs for data sign and data encryption for the user
  credentials: TCACryptoKeyPairs;
}

/**
 * defines how does a user's
 * identity and credentials will be stored
 * @export
 * @interface ICAIdentityCredentialsDescriptionStored
 */
export interface ICAIdentityCredentialsDescriptionStored {
  // the user's unique identifier
  // throughout the app
  id: string;
  // an identiy of the user
  identity: TCentralAuthorityUserIdentity;
  // a key pairs for data sign and data encryption for the user
  credentials: TCACryptoKeyPairs;
}

/**
 * the interface for the storage
 * implementation. There are
 * only two methods to realize
 * the main functionality of it.
 * The first method returns stored
 * credentials of the user. And the
 * second set the credentials
 * of the user in the storage.
 * @export
 * @interface ICAIdentityCredentialsStorage
 */
export interface ICAIdentityCredentialsStorage {
  connect(credentials: TSecretStoreCredentials): Promise<boolean | Error>;
  disconnect(): Promise<boolean | Error>;
  getCredentials(
    identity: TCentralAuthorityUserIdentity
  ): Promise<TCACryptoKeyPairs | Error | null>;
  setCredentials(
    identity: TCentralAuthorityUserIdentity,
    cryptoCredentials: TCACryptoKeyPairs
  ): Promise<boolean | Error>;
}
