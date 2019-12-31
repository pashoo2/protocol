export const a = 1;
// TODO
// import { SecretStorage } from 'classes/secret-storage-class';
// import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
// import {
//   TCentralAuthorityCredentialsStorageAuthCredentials,
//   TCentralAuthorityUserCryptoCredentials,
// } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types-crypto-credentials';
// import {
//   TCentralAuthorityUserIdentity,
//   TCACryptoKeyPairs,
// } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
// import {
//   validateUserIdentity,
//   validateAuthCredentials,
// } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
// import {
//   CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
//   CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME,
// } from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
// import {
//   exportCryptoCredentialsToString,
//   getUserCredentialsByUserIdentityAndCryptoKeys,
//   importCryptoCredentialsFromAString,
// } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials';
// import {
//   CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS,
//   CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_CRYPTO_CREDENTIALS,
//   CENTRAL_AUTHORITY_STORAGE_PROVIDER_NAME,
// } from './central-authority-storage-credentials.const';
// import { TSecretStoreConfiguration } from 'classes/secret-storage-class/secret-storage-class.types';
// import { calculateHash } from 'utils/hash-calculation-utils/hash-calculation-utils';
// import { checkIsValidCryptoCredentials } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
// import {
//   ICAStorageCredentials,
//   ICAStorageCredentialsAuthCredentials,
//   ICAStorageCredentialsUserCryptoInfo,
// } from './central-authority-storage-credentials.types';
// import { validateUserCryptoInfo } from './central-authority-storage-credentials.utils';

// export class CentralAuthorityCredentialsStorage
//   extends getStatusClass<typeof CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS>({
//     errorStatus: CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.ERROR,
//     initialStatus: CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.NEW,
//     instanceName: 'CentralAuthorityCredentialsStorage',
//   })
//   implements ICAStorageCredentials {
//   protected __userIdentity?: TCentralAuthorityUserIdentity;

//   protected __userIdentityHash?: string;

//   protected secretStorageConnection?: SecretStorage;

//   protected userCryptoCredentialsCached?: TCentralAuthorityUserCryptoCredentials;

//   protected get userIdentity(): undefined | string {
//     const { __userIdentity } = this;

//     if (validateUserIdentity(__userIdentity)) {
//       return __userIdentity;
//     }
//     return undefined;
//   }

//   protected get userIdentityHash(): undefined | string {
//     const { __userIdentityHash } = this;

//     return __userIdentityHash || undefined;
//   }

//   protected get secretStorageCredentialsValueKey(): string {
//     const { userIdentityHash } = this;

//     return `${CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_CRYPTO_CREDENTIALS}__${userIdentityHash}`;
//   }

//   protected get isConnectedToStorage(): boolean {
//     const { status } = this;

//     return status === CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.CONNECTED;
//   }

//   protected get secretStorageOptions(): Partial<TSecretStoreConfiguration> {
//     return {
//       storageProviderName: CENTRAL_AUTHORITY_STORAGE_PROVIDER_NAME,
//     };
//   }

//   /**
//    * connect to the storage where the user's cryptro keys are
//    * stored.
//    *
//    * @param {ICAStorageCredentialsAuthCredentials} credentials
//    * @returns {(Promise<void | Error>)}
//    * @memberof CentralAuthorityCredentialsStorage
//    */
//   public async connect(
//     credentials: ICAStorageCredentialsAuthCredentials
//   ): Promise<void | Error> {
//     this.setStatus(CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.CONNECTING);
//     this.createSecretStorageInstance();

//     const connectionResult = await this.connectToTheStorage(credentials);

//     if (connectionResult instanceof Error) {
//       this.setStatus(
//         CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.CONNECTION_FAILED
//       );
//       CentralAuthorityCredentialsStorage.error(connectionResult);
//       return connectionResult;
//     }
//     this.setStatus(CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.CONNECTED);
//   }

//   public async setUserCryptoInfo(
//     userCryptoInfo: ICAStorageCredentialsUserCryptoInfo
//   ): Promise<Error | boolean> {
//     const { isConnectedToStorage } = this;

//     if (!isConnectedToStorage) {
//       return new Error('There is no an active connection to the storage');
//     }

//     const userCryptoInfoValidationResult = validateUserCryptoInfo(
//       userCryptoInfo
//     );

//     if (userCryptoInfoValidationResult instanceof Error) {
//       return userCryptoInfoValidationResult;
//     }

//     const { userIdentity, cryptoKeyPairs } = userCryptoInfo;

//     const cryptoCredentials = getUserCredentialsByUserIdentityAndCryptoKeys(
//       userIdentity,
//       cryptoKeyPairs
//     );

//     if (cryptoCredentials instanceof Error) {
//       console.error(cryptoCredentials);
//       return new Error(
//         'Failed to create a valid crypro credentials from the given crypto keys and the user identity'
//       );
//     }

//     const resultSetCryptoCredentialsToStorage = await this.setCryptoCredentialsToStorage(
//       cryptoCredentials
//     );

//     if (resultSetCryptoCredentialsToStorage instanceof Error) {
//       this.unsetUserCredentialsInCache();
//       if ((await this.unsetCryptoCredentialsToStorage()) instanceof Error) {
//         console.error('Failed to unset a crypto credentials in the storage');
//       }
//       console.error(resultSetCryptoCredentialsToStorage);
//       return new Error('Failed to set the crypto credentials in the storage');
//     }

//     const setCredentialsInCacheResult = this.setUserCredentialsToCache(
//       cryptoCredentials
//     );

//     if (setCredentialsInCacheResult instanceof Error) {
//       this.unsetUserCredentialsInCache();
//       console.error(setCredentialsInCacheResult);
//       return new Error('Failed to set the crypto credentials in the cahce');
//     }
//     return true;
//   }

//   protected async setUserIdentity(userIdentity: any): Promise<Error | boolean> {
//     if (validateUserIdentity(userIdentity)) {
//       const userIdentityHash = await calculateHash(userIdentity);

//       if (userIdentityHash instanceof Error) {
//         console.error(userIdentityHash);
//         return new Error("Failed to calculate the user's identity hash");
//       }

//       this.__userIdentity = userIdentity;
//       this.__userIdentityHash = userIdentityHash;
//       return true;
//     }
//     return new Error('The user identity is not valid');
//   }

//   protected createSecretStorageInstance() {
//     const { secretStorageOptions: configuration } = this;

//     this.secretStorageConnection = new SecretStorage(configuration);
//   }

//   /**
//    * authorize to the storage with a password given
//    * @param {object} credentials
//    */
//   protected authorizeWithCredentials(
//     credentials: ICAStorageCredentialsAuthCredentials
//   ): Promise<Error | boolean> | Error {
//     const { secretStorageConnection } = this;

//     if (secretStorageConnection) {
//       return secretStorageConnection.authorize({
//         password: credentials.password,
//       });
//     }
//     return new Error('There is no secretStorageConnection');
//   }

//   protected async connectToTheStorage(
//     credentials: ICAStorageCredentialsAuthCredentials
//   ): Promise<boolean | Error> {
//     const credentialsValidationResult = validateAuthCredentials(credentials);

//     if (credentialsValidationResult instanceof Error) {
//       return credentialsValidationResult;
//     }

//     return this.authorizeWithCredentials(credentials);
//   }

//   protected reset() {
//     this.__userIdentity = undefined;
//     this.__userIdentityHash = undefined;
//     this.secretStorageConnection = undefined;
//   }

//   public async disconnect(): Promise<Error | void> {
//     const { isConnectedToStorage, secretStorageConnection } = this;

//     if (!isConnectedToStorage || !secretStorageConnection) {
//       return new Error('Not connected to the storage');
//     }

//     const disconnectFromStorageResult = await secretStorageConnection.disconnect();

//     if (disconnectFromStorageResult instanceof Error) {
//       console.error(disconnectFromStorageResult);
//       return new Error('Failed to disconnect from the storage');
//     }
//     this.reset();
//     this.setStatus(CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS.DISCONNECTED);
//   }

//   protected setUserCredentialsToCache(
//     userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
//   ): undefined | Error {
//     if (!checkIsValidCryptoCredentials(userCryptoCredentials)) {
//       return new Error('The given value is not a valid crypto credentials');
//     }
//     this.userCryptoCredentialsCached = userCryptoCredentials;
//   }

//   protected unsetUserCredentialsInCache(): void {
//     this.userCryptoCredentialsCached = undefined;
//   }

//   protected async setToStorage(
//     key: string,
//     value: any
//   ): Promise<Error | boolean> {
//     const {
//       secretStorageConnection,
//       isConnectedToStorage: isConnectedToTheSecretStorage,
//     } = this;

//     if (isConnectedToTheSecretStorage && secretStorageConnection) {
//       return secretStorageConnection.set(key, value);
//     }
//     return new Error('There is no active connecion to the secret storage');
//   }

//   protected async readFromStorage(
//     key: string
//   ): Promise<Error | string | undefined> {
//     const {
//       secretStorageConnection,
//       isConnectedToStorage: isConnectedToTheSecretStorage,
//     } = this;

//     if (isConnectedToTheSecretStorage && secretStorageConnection) {
//       return secretStorageConnection.get(key);
//     }
//     return new Error('There is no active connecion to the secret storage');
//   }

//   protected async setCryptoCredentialsToStorage(
//     userCryptoInfo: ICAStorageCredentialsUserCryptoInfo
//   ): Promise<Error | boolean> {
//     const {
//       isConnectedToStorage: isConnectedToTheSecretStorage,
//       secretStorageCredentialsValueKey,
//     } = this;

//     if (!isConnectedToTheSecretStorage) {
//       return new Error('There is no active connecion to the secret storage');
//     }

//     const exportedUserCryptoCredentials = await exportCryptoCredentialsToString(
//       userCryptoInfo
//     );

//     if (exportedUserCryptoCredentials instanceof Error) {
//       return exportedUserCryptoCredentials;
//     }
//     return this.setToStorage(
//       secretStorageCredentialsValueKey,
//       exportedUserCryptoCredentials
//     );
//   }

//   protected unsetCryptoCredentialsToStorage(): Promise<Error | boolean> {
//     const { secretStorageCredentialsValueKey } = this;

//     return this.setToStorage(secretStorageCredentialsValueKey, null);
//   }

//   protected getCredentialsCached():
//     | TCentralAuthorityUserCryptoCredentials
//     | Error
//     | undefined {
//     const { userCryptoCredentialsCached } = this;

//     if (!userCryptoCredentialsCached) {
//       return undefined;
//     }
//     if (checkIsValidCryptoCredentials(userCryptoCredentialsCached)) {
//       return userCryptoCredentialsCached;
//     }
//     return new Error('There is no a crypto credetials cached');
//   }

//   protected async readCryptoCredentialsFromStorage(): Promise<
//     TCentralAuthorityUserCryptoCredentials | Error | null
//   > {
//     const { secretStorageCredentialsValueKey } = this;

//     const cryptoCredentials = await this.readFromStorage(
//       secretStorageCredentialsValueKey
//     );

//     if (cryptoCredentials instanceof Error) {
//       console.error(cryptoCredentials);
//       return new Error('Failed to read the credentials from the storage');
//     }
//     if (!cryptoCredentials) {
//       console.warn('There is no crypto credentials stored');
//       return null;
//     }

//     const importedCryptoKey = await importCryptoCredentialsFromAString(
//       cryptoCredentials
//     );

//     if (importedCryptoKey instanceof Error) {
//       console.error(importedCryptoKey);
//       return new Error(
//         'Failed to import a crypto credentials value from the string stored'
//       );
//     }

//     const resultSetInCache = this.setUserCredentialsToCache(importedCryptoKey);

//     if (resultSetInCache instanceof Error) {
//       console.error(resultSetInCache);
//       this.unsetUserCredentialsInCache();
//       return new Error(
//         'Failed to set the crypto credentials value in the cache'
//       );
//     }
//     return importedCryptoKey;
//   }

//   public async getUserCryptoInfo(): Promise<
//     TCentralAuthorityUserCryptoCredentials | Error | null
//   > {
//     const { isConnectedToStorage } = this;

//     if (!isConnectedToStorage) {
//       return new Error('There is no an active connection to the storage');
//     }
//     const cachedCryptoCredentials = this.getCredentialsCached();

//     if (cachedCryptoCredentials instanceof Error) {
//       console.error(cachedCryptoCredentials);
//       console.error('Failed to read a cached value of a crypto credentials');
//     }
//     if (cachedCryptoCredentials) {
//       return cachedCryptoCredentials;
//     }

//     const storedCryptoCredentials = await this.readCryptoCredentialsFromStorage();

//     if (storedCryptoCredentials instanceof Error) {
//       console.error(storedCryptoCredentials);
//       return new Error(
//         'Failed to read a crypto credentials value from the storage'
//       );
//     }
//     if (!storedCryptoCredentials) {
//       console.warn('A crypto credentials value is absent');
//       return null;
//     }

//     const setToCacheResult = this.setUserCredentialsToCache(
//       storedCryptoCredentials
//     );

//     if (setToCacheResult instanceof Error) {
//       console.error(setToCacheResult);
//       this.unsetUserCredentialsInCache();
//       console.error(
//         'Failed to set the crypto credentials read from the storage in the cache'
//       );
//     }
//     return storedCryptoCredentials;
//   }
// }
