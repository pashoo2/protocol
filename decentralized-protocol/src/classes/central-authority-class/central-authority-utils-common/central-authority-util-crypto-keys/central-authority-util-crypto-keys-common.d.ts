import { TCACryptoKeyPairs, TCACryptoPubilicKeys, TCACryptoKeyPairsExported } from '../../central-authority-class-types/central-authority-class-types';
export declare const checkIsCryptoKeyPairsExportedAsString: (v: any) => boolean;
export declare const checkIsCryptoKeyPairs: (keyPairs: any, checkPrivateKeys?: boolean) => keyPairs is TCACryptoKeyPairs;
export declare const checkIsCryptoKeyPairsExported: (keyPairs: any) => keyPairs is TCACryptoKeyPairsExported;
export declare const checkIsPublicKeys: (keysPublic: any) => keysPublic is TCACryptoPubilicKeys;
export declare const getPublicKeysFromCryptoKeyPairs: (keyPairs: TCACryptoKeyPairs) => TCACryptoPubilicKeys | Error;
//# sourceMappingURL=central-authority-util-crypto-keys-common.d.ts.map