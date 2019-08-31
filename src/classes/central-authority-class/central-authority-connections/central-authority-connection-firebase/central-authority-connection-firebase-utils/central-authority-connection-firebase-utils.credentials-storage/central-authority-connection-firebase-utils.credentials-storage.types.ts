import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

export interface ICAConnectionFirestoreUtilsCredentialsStrorage {
  setUserCredentials(
    userId: string,
    cryptoCredentials: TCentralAuthorityUserCryptoCredentials
  ): Promise<Error | boolean>;
  getUserCredentials(
    userId: string
  ): Promise<Error | null | TCentralAuthorityUserCryptoCredentials>;
}
