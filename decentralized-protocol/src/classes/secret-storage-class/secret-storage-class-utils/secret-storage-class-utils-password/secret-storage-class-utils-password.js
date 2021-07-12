import { generateSaltString, generatePasswordKeyByPasswordString } from '@pashoo2/crypto-utilities';
export const generatePasswordKeyByPasswordSalt = (password, salt) => {
    return generatePasswordKeyByPasswordString(password, salt);
};
export const generateSaltForPassword = () => {
    return generateSaltString();
};
//# sourceMappingURL=secret-storage-class-utils-password.js.map