import { TCentralAuthorityUserCryptoCredentials, TCentralAuthorityUserCryptoCredentialsExported } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
export declare const caValidateCryptoKeyPairExportedObject: (value: any) => boolean;
export declare const checkIsValidCryptoCredentials: (cryptoCredentials: any, checkPrivateKey?: boolean) => cryptoCredentials is TCentralAuthorityUserCryptoCredentials;
export declare const checkIsValidCryptoCredentialsWithFunc: (cryptoCredentials: any, credentialsValidationFunction: (c: any) => boolean) => cryptoCredentials is TCentralAuthorityUserCryptoCredentialsExported;
export declare const checkIsValidCryptoCredentialsExportedFormat: (cryptoCredentials: any) => cryptoCredentials is TCentralAuthorityUserCryptoCredentialsExported;
export declare const checkIsValidExportedCryptoCredentialsToString: (cryptoCredentialsExportedAsString: any) => boolean;
//# sourceMappingURL=central-authority-validators-crypto-keys.d.ts.map