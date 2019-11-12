import {
  TCentralAuthorityUserIdentity,
  TCACryptoKeyPairs,
  TCentralAuthorityUserCryptoCredentials,
  TCentralAuthorityUserCryptoCredentialsExported,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ownValueOf } from 'types/helper.types';
import { ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';

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
  // is the instance is connected
  // to the storage and active
  isActive: boolean;
  // connect to the storage with the credentials
  // to decrypt a values stored
  connect(credentials: ISecretStoreCredentials): Promise<boolean | Error>;
  // disconnect from the storage
  disconnect(): Promise<boolean | Error>;
  // read credentials from the storage
  getCredentials(
    identity: TCentralAuthorityUserIdentity
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | null>;
  // store credentials for the identity
  // in the storage
  setCredentials(
    identity: TCentralAuthorityUserIdentity,
    cryptoCredentials: TCACryptoKeyPairs
  ): Promise<boolean | Error>;
  // Store the crypto credentials.
  // It will be parsed to
  // identity and key pairs
  setCredentials(
    cryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<boolean | Error>;
  // store the crypto credentials
  // exported to a string.
  // It will be parsed to
  // identity and key pairs
  setCredentials(
    cryptoCredentialsExportedAsString: string
  ): Promise<boolean | Error>;
}
