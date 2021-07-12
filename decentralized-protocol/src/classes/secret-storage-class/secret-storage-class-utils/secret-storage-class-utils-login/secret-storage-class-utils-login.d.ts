export declare const getLoginHash: (login: string) => Promise<string | Error>;
export declare const getCryptoKeyByLogin: (login: string) => Promise<CryptoKey | Error>;
export declare const encryptValueByLogin: (login: string, value: string) => Promise<string | Error>;
export declare const decryptValueByLogin: (login: string, value: string) => Promise<Error | string>;
//# sourceMappingURL=secret-storage-class-utils-login.d.ts.map