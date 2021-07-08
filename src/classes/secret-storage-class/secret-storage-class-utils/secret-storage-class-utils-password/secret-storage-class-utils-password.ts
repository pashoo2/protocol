import { generateSaltString, generatePasswordKeyByPasswordString, TSaltUtilsSaltType } from '@pashoo2/crypto-utilities';

export const generatePasswordKeyByPasswordSalt = (password: string, salt: TSaltUtilsSaltType): Promise<CryptoKey | Error> => {
  return generatePasswordKeyByPasswordString(password, salt);
};

export const generateSaltForPassword = (): string | Error => {
  return generateSaltString();
};
