import { CAConnectionWithFirebaseUtilDatabase } from '../central-authority-connection-firebase-utils.database/central-authority-connection-firebase-utils.database';
import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { checkIsValidCryptoCredentials } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import { getUserIdentityByCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX } from './central-authority-connection-firebase-utils.credentials-storage.const';
import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';

export class ICAConnectionFirestoreUtilsCredentialsStrorage extends CAConnectionWithFirebaseUtilDatabase {
  protected getCredentialsKeyByUserId(userId: string): string {
    return `${CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX}_${userId}`;
  }
  public async setUserCredentials(
    credentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<Error | boolean> {
    if (!checkIsValidCryptoCredentials(credentials)) {
      return new Error('The credentials value is not valid');
    }

    const userId = getUserIdentityByCryptoCredentials(credentials);

    if (userId instanceof Error) {
      console.error(userId);
      return new Error("Failed to get a user's identity from the credentials");
    }

    const storeResult = this.setValue<TCentralAuthorityUserCryptoCredentials>(
      this.getCredentialsKeyByUserId(userId),
      credentials
    );

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

    const credentialsForTheUser = await this.getValue<
      TCentralAuthorityUserCryptoCredentials
    >(userId);

    if (credentialsForTheUser instanceof Error) {
      console.error(credentialsForTheUser);
      return new Error(
        'Failed to read a crypto credentials for the user identity'
      );
    }
    if (credentialsForTheUser == null) {
      return null;
    }
    if (!checkIsValidCryptoCredentials(credentialsForTheUser)) {
      return new Error(
        'The crypto credentials value read from the storage is not valid'
      );
    }
    return credentialsForTheUser;
  }
}
