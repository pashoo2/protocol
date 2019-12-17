import { ICAStorageCredentialsUserCryptoInfo } from './central-authority-storage-credentials.types';
import {
  validateLogin,
  validateUserIdentity,
} from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { checkIsCryptoKeyPairs } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';

export const validateUserCryptoInfo = (
  userCryptoInfo: ICAStorageCredentialsUserCryptoInfo
): Error | void => {
  if (!userCryptoInfo) {
    return new Error('The user crypto info is not defined');
  }
  if (typeof userCryptoInfo !== 'object') {
    return new Error('A user crypto info must be an object');
  }

  const { login, userIdentity, cryptoKeyPairs } = userCryptoInfo;

  if (!validateLogin(login)) {
    return new Error('The login is not valid');
  }
  if (!validateUserIdentity(userIdentity)) {
    return new Error('The user identity is not valid');
  }
  if (checkIsCryptoKeyPairs(cryptoKeyPairs)) {
    return new Error('The crypto key pairs is not valid');
  }
};
