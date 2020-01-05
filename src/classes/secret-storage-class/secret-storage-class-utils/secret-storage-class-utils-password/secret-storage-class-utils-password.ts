import { generateSaltString } from './../../../../utils/encryption-utils/salt-utils';
import { generatePasswordKeyByPasswordString } from 'utils/password-utils/derive-key.password-utils';
import { TSaltUtilsSaltType } from 'utils/encryption-utils/salt-utils.types';

export const generatePasswordKeyByPasswordSalt = (
  password: string,
  salt: TSaltUtilsSaltType
): Promise<CryptoKey | Error> => {
  return generatePasswordKeyByPasswordString(password, salt);
};

export const generateSaltForPassword = (): string | Error => {
  return generateSaltString();
};
