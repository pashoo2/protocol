import {
  TCentralAuthorityUserCryptoCredentialsExported,
  TCentralAuthorityUserCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types-crypto-credentials';
import {
  checkIsCryptoKeyPairs,
  exportKeyPairsAsString,
  importKeyPairsFromString,
  checkIsCryptoKeyPairsExportedAsString,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import {
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME,
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME,
  CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_CRYPTO_CREDENTIALS_EXPORTED_AS_STRING_MIN_LENGTH,
} from './central-authority-storage-credentials.const';
import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import {
  TCentralAuthorityUserIdentity,
  TCACryptoKeyPairs,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

/**
 * validate is a given value has
 * a valid crypto key pair and
 * the user identity
 * in the raw format
 * @param {any} cryptoCredentials
 */
export const checkIsValidCryptoCredentials = (
  cryptoCredentials: any
): cryptoCredentials is TCentralAuthorityUserCryptoCredentialsExported => {
  if (!cryptoCredentials || typeof cryptoCredentials !== 'object') {
    return false;
  }

  const {
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeys,
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME]: userIdentity,
  } = cryptoCredentials;

  if (!cryptoKeys) {
    console.error(
      'There is a wrong format of the crypto credentials value, case a crypto keys was not found'
    );
    return false;
  }
  if (!userIdentity) {
    console.error(
      'There is a wrong format of the crypto credentials value, case a user identity value was not found'
    );
    return false;
  }
  if (validateUserIdentity(userIdentity)) {
    console.error(
      'There is a wrong format of the crypto credentials value, case the user identity value have a wrong type'
    );
    return false;
  }
  if (!checkIsCryptoKeyPairs(cryptoKeys)) {
    console.error(
      'There is a wrong format of the crypto credentials value, case the crypto keys value have a wrong type'
    );
    return false;
  }
  return true;
};

/**
 * validate is a given value has
 * a valid crypto key pair and
 * the user identity
 * in the exported format
 * @param {any} cryptoCredentials
 */
export const checkIsValidCryptoCredentialsExportedFormat = (
  cryptoCredentials: any
): cryptoCredentials is TCentralAuthorityUserCryptoCredentialsExported => {
  if (!cryptoCredentials || typeof cryptoCredentials !== 'object') {
    return false;
  }

  const {
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeys,
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME]: userIdentity,
  } = cryptoCredentials;

  if (!cryptoKeys) {
    console.error(
      'There is a wrong format of the crypto credentials value, case a crypto keys was not found'
    );
    return false;
  }
  if (!userIdentity) {
    console.error(
      'There is a wrong format of the crypto credentials value, case a user identity value was not found'
    );
    return false;
  }
  if (!validateUserIdentity(userIdentity)) {
    console.error(
      'There is a wrong format of the crypto credentials value, case the user identity value have a wrong type'
    );
    return false;
  }
  if (!checkIsCryptoKeyPairsExportedAsString(cryptoKeys)) {
    console.error(
      'There is a wrong format of the crypto credentials value, case the crypto keys value have a wrong type'
    );
    return false;
  }
  return true;
};

export const checkExportedCryptoCredentialsToString = (
  cryptoCredentialsExportedAsString: any
): boolean => {
  return (
    typeof cryptoCredentialsExportedAsString === 'string' &&
    cryptoCredentialsExportedAsString.length >
      CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_CRYPTO_CREDENTIALS_EXPORTED_AS_STRING_MIN_LENGTH
  );
};

export const exportCryptoCredentialsToString = async (
  userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
): Promise<Error | string> => {
  if (!checkIsValidCryptoCredentials(userCryptoCredentials)) {
    return new Error('The given value is not a valid crypto credentials');
  }

  const {
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeys,
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME]: userIdentity,
  } = userCryptoCredentials;
  const exportedCryptoKeys = await exportKeyPairsAsString(cryptoKeys);

  if (exportedCryptoKeys instanceof Error) {
    return exportedCryptoKeys;
  }
  if (typeof exportedCryptoKeys !== 'string') {
    return new Error('The exported crypto keys have a wrong fromat');
  }

  const cryptoCredentialsExported = {
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeys,
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME]: userIdentity,
  };

  if (!checkIsValidCryptoCredentialsExportedFormat(cryptoCredentialsExported)) {
    return new Error(
      'Failed to create a crypto credentials in the exported format'
    );
  }
  try {
    const exportedCryptoCredentialsAsString = JSON.stringify(
      cryptoCredentialsExported
    );

    if (
      !checkExportedCryptoCredentialsToString(exportedCryptoCredentialsAsString)
    ) {
      return new Error(
        'Failed cause the crypto credentials exported as a sting have a wrong format'
      );
    }
    return exportedCryptoCredentialsAsString;
  } catch (err) {
    console.error(err);
    return new Error('Failed to stringify the crypto credentials');
  }
};

export const importCryptoCredentialsFromExportedFromat = async (
  cryptoCredentialsExported: any
): Promise<Error | TCentralAuthorityUserCryptoCredentials> => {
  if (!checkIsValidCryptoCredentialsExportedFormat(cryptoCredentialsExported)) {
    return new Error('The crypto credentials exported have a wrong format');
  }

  const {
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeysExported,
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME]: userIdentityExported,
  } = cryptoCredentialsExported;
  const cryptoKeysImported = await importKeyPairsFromString(cryptoKeysExported);

  if (cryptoKeysImported instanceof Error) {
    console.error(cryptoKeysImported);
    return new Error(
      'Failed to import a crypto key pairs from the given string'
    );
  }

  const cryptoCredentials = {
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeysImported,
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME]: userIdentityExported,
  };

  if (!checkIsValidCryptoCredentials(cryptoCredentials)) {
    return new Error(
      'Failed to return the crypto credentials imorted in the valid format'
    );
  }
  return cryptoCredentials;
};

export const importCryptoCredentialsFromAString = async (
  cryptoCredentialsString: any
): Promise<Error | TCentralAuthorityUserCryptoCredentials> => {
  const typeCryptoCredentials = typeof cryptoCredentialsString;

  if (typeCryptoCredentials !== 'string') {
    return new Error(
      `The cryptoCredentials value have the wrong type::${typeCryptoCredentials}::`
    );
  }
  if (!checkExportedCryptoCredentialsToString(cryptoCredentialsString)) {
    return new Error('The cryptoCredentials value have a wrong format');
  }

  let cryptoCredentialsExported;
  try {
    cryptoCredentialsExported = JSON.parse(cryptoCredentialsString);
  } catch (err) {
    console.error(err);
    return new Error('Failed to parse the given crypto credentials string');
  }
  return importCryptoCredentialsFromExportedFromat(cryptoCredentialsExported);
};

export const getUserCredentialsByUserIdentityAndCryptoKeys = (
  userIdentity: TCentralAuthorityUserIdentity,
  cryptoKeyPairs: TCACryptoKeyPairs
): Error | TCentralAuthorityUserCryptoCredentials => {
  if (!validateUserIdentity(userIdentity)) {
    return new Error('The user identity has a wrong format');
  }
  if (!checkIsCryptoKeyPairs(cryptoKeyPairs)) {
    return new Error('The crypto key pairs has a wrong format');
  }

  const cryptoCredentials = {
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_USER_ID_KEY_NAME]: userIdentity,
    [CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeyPairs,
  };

  if (!checkIsValidCryptoCredentials(cryptoCredentials)) {
    return new Error('Failed to create a valid crypto credentials');
  }
  return cryptoCredentials;
};
