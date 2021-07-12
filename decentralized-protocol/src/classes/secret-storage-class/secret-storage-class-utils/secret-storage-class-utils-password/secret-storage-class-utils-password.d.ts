import { TSaltUtilsSaltType } from '@pashoo2/crypto-utilities';
export declare const generatePasswordKeyByPasswordSalt: (password: string, salt: TSaltUtilsSaltType) => Promise<CryptoKey | Error>;
export declare const generateSaltForPassword: () => string | Error;
//# sourceMappingURL=secret-storage-class-utils-password.d.ts.map