import { validateBySchema } from 'utils/validation-utils/validation-utils';
import { caValidatorsCryptoKeysExportedObjectValidationSchema } from './central-authority-validators-crypto-keys-schemas';
import {
  TCentralAuthorityUserCryptoCredentialsExported,
  TCentralAuthorityUserCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import {
  CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME,
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
  CA_CREDENTIALS_KEY_CRYPTO_CREDENTIALS_EXPORTED_AS_STRING_MIN_LENGTH,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
import { validateUserIdentity } from '../central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import {
  checkIsCryptoKeyPairs,
  checkIsCryptoKeyPairsExportedAsString,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';

export const caValidateCryptoKeyPairExportedObject = (value: any): boolean =>
  validateBySchema(caValidatorsCryptoKeysExportedObjectValidationSchema, value);

/**
 * validate is a given value has
 * a valid crypto key pair and
 * the user identity
 * in the raw format
 * @param {any} cryptoCredentials
 */
export const checkIsValidCryptoCredentials = (
  cryptoCredentials: any
): cryptoCredentials is TCentralAuthorityUserCryptoCredentials => {
  if (!cryptoCredentials || typeof cryptoCredentials !== 'object') {
    return false;
  }

  const {
    [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeys,
    [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity,
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
    [CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME]: cryptoKeys,
    [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: userIdentity,
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
      'There is a wrong format of the crypto credentials value, case the crypto keys exported as a string value have a wrong type'
    );
    return false;
  }
  return true;
};

export const checkIsValidExportedCryptoCredentialsToString = (
  cryptoCredentialsExportedAsString: any
): boolean => {
  return (
    typeof cryptoCredentialsExportedAsString === 'string' &&
    cryptoCredentialsExportedAsString.length >
      CA_CREDENTIALS_KEY_CRYPTO_CREDENTIALS_EXPORTED_AS_STRING_MIN_LENGTH
  );
};
