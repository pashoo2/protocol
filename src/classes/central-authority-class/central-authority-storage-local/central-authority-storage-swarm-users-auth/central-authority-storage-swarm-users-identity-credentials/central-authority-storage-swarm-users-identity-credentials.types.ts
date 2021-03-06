import { TCAUserIdentityRawTypes } from './../../../central-authority-class-user-identity/central-authority-class-user-identity.types';
import {
  TCentralAuthorityUserIdentity,
  TCACryptoKeyPairs,
  TCentralAuthorityUserCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

/**
 * Contains the user's identifier
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

export interface ICAIdentityCredentialsStorageConntionOptions {
  storageName?: string;
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
  connect(options?: ICAIdentityCredentialsStorageConntionOptions): Promise<boolean | Error>;
  // disconnect from the stor`age
  disconnect(): Promise<boolean | Error>;
  // read credentials from the storage
  getCredentials(identity: TCAUserIdentityRawTypes): Promise<TCentralAuthorityUserCryptoCredentials | Error | null>;
  // store credentials for the identity
  // in the storage
  setCredentials(identity: TCAUserIdentityRawTypes, cryptoCredentials: TCACryptoKeyPairs): Promise<boolean | Error>;
  // Store the crypto credentials.
  // It will be parsed to
  // identity and key pairs
  setCredentials(cryptoCredentials: TCAUserIdentityRawTypes): Promise<boolean | Error>;
  // store the crypto credentials
  // exported to a string.
  // It will be parsed to
  // identity and key pairs
  setCredentials(cryptoCredentialsExportedAsString: string): Promise<boolean | Error>;
  /**
   * save credentials in the storage and do not validate
   * the private key if not exists.
   *
   * @param {(TCAUserIdentityRawTypes | string)} cryptoCredentials
   * @returns {(Promise<boolean | Error>)}
   * @memberof ICAIdentityCredentialsStorage
   */
  setCredentialsNoCheckPrivateKey(cryptoCredentials: TCAUserIdentityRawTypes | string): Promise<boolean | Error>;
  /**
   * save credentials in the storage and do not validate
   * the private key if not exists.
   *
   * @param {(TCAUserIdentityRawTypes | string)} cryptoCredentials
   * @returns {(Promise<boolean | Error>)}
   * @memberof ICAIdentityCredentialsStorage
   */
  setCredentialsNoCheckPrivateKey(cryptoCredentials: TCAUserIdentityRawTypes | string): Promise<boolean | Error>;
}
