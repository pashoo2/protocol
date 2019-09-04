import {
  TCentralAuthorityUserCryptoCredentialsExported,
  TCentralAuthorityUserCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types-crypto-credentials';
import {
  checkIsCryptoKeyPairs,
  exportKeyPairsAsString,
  importKeyPairsFromString,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import {
  CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME,
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
import {
  TCentralAuthorityUserIdentity,
  TCACryptoKeyPairs,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { CentralAuthorityIdentity } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  checkIsValidCryptoCredentials,
  checkIsValidCryptoCredentialsExportedFormat,
  checkIsValidExportedCryptoCredentialsToString,
} from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';

export const exportCryptoCredentialsToString = async (
  userCryptoCredentials: TCentralAuthorityUserCryptoCredentials
): Promise<Error | string> => {
  if (!checkIsValidCryptoCredentials(userCryptoCredentials)) {
    return new Error('The given value is not a valid crypto credentials');
  }

  const {
    [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeys,
    [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity,
  } = userCryptoCredentials;
  const exportedCryptoKeys = await exportKeyPairsAsString(cryptoKeys);

  if (exportedCryptoKeys instanceof Error) {
    return exportedCryptoKeys;
  }

  const cryptoCredentialsExported = {
    [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: exportedCryptoKeys,
    [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity,
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
      !checkIsValidExportedCryptoCredentialsToString(
        exportedCryptoCredentialsAsString
      )
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
    [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeysExported,
    [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentityExported,
  } = cryptoCredentialsExported;
  const cryptoKeysImported = await importKeyPairsFromString(cryptoKeysExported);

  if (cryptoKeysImported instanceof Error) {
    console.error(cryptoKeysImported);
    return new Error(
      'Failed to import a crypto key pairs from the given string'
    );
  }

  const cryptoCredentials = {
    [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeysImported,
    [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentityExported,
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
  if (!checkIsValidExportedCryptoCredentialsToString(cryptoCredentialsString)) {
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
    [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity,
    [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeyPairs,
  };

  if (!checkIsValidCryptoCredentials(cryptoCredentials)) {
    return new Error('Failed to create a valid crypto credentials');
  }
  return cryptoCredentials;
};

export const getExportedAsStringCryptoCredentials = async (
  identity: TCentralAuthorityUserIdentity,
  cryptoCredentialsKeyPairs: TCACryptoKeyPairs
): Promise<Error | string> => {
  try {
    // parse the identity
    const caIdentity = new CentralAuthorityIdentity(identity);
    const { isValid } = caIdentity;

    if (!isValid) {
      return new Error('The identity is not valid or have an unknown format');
    }
    if (!checkIsCryptoKeyPairs(cryptoCredentialsKeyPairs)) {
      return new Error(
        'The crypto keys are not valid or have an unknown format'
      );
    }

    const caUserCryptoCredentials = getUserCredentialsByUserIdentityAndCryptoKeys(
      identity,
      cryptoCredentialsKeyPairs
    );

    if (caUserCryptoCredentials instanceof Error) {
      console.error(caUserCryptoCredentials);
      return new Error('Failed to get User crypto credentials');
    }
    return exportCryptoCredentialsToString(caUserCryptoCredentials);
  } catch (err) {
    console.error(err);
    return new Error('Failed to process the credentials or identity');
  }
};

export const getExportedCryptoCredentialsByCAIdentity = async (
  caIdentity: CentralAuthorityIdentity,
  cryptoCredentialsKeyPairs: TCACryptoKeyPairs
): Promise<Error | string> => {
  if (typeof caIdentity === 'object') {
    return getExportedAsStringCryptoCredentials(
      String(caIdentity), // conver it to identity
      cryptoCredentialsKeyPairs
    );
  }
  return new Error('The identity has a wrong format');
};

export const replaceCryptoCredentialsIdentity = (
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials,
  identity: TCentralAuthorityUserIdentity
): Error | TCentralAuthorityUserCryptoCredentials => {
  if (checkIsValidCryptoCredentials(cryptoCredentials)) {
    return {
      ...cryptoCredentials,
      [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: identity,
    };
  }
  return new Error('The crypto credentials have a wrong format');
};

export const getUserIdentityByCryptoCredentials = (
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials
): Error | TCentralAuthorityUserIdentity => {
  if (typeof cryptoCredentials !== 'object') {
    return new Error('The crypto credentials have an unknown format');
  }

  const {
    [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity,
  } = cryptoCredentials;

  if (validateUserIdentity(userIdentity)) {
    return userIdentity;
  }
  return new Error('The user identity is not valid');
};

export const getCryptoKeyPairsByCryptoCredentials = (
  cryptoCredentials: TCentralAuthorityUserCryptoCredentials
): Error | TCACryptoKeyPairs => {
  if (typeof cryptoCredentials !== 'object') {
    return new Error('The crypto credentials have an unknown format');
  }

  const {
    [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeyPairs,
  } = cryptoCredentials;

  if (checkIsCryptoKeyPairs(cryptoKeyPairs)) {
    return cryptoKeyPairs;
  }
  return new Error('The crypto key pairs are not valid');
};
