import { TCACryptoKeyPairs, TCACryptoPubilicKeys } from '../../central-authority-class-types/central-authority-class-types';
export declare const importKeyPairsFromString: (keyPairsString: string, password?: string) => Promise<TCACryptoKeyPairs | Error>;
export declare const importPublicKeyPairsFromString: (publicKeyPairsString: string) => Promise<Error | TCACryptoPubilicKeys>;
//# sourceMappingURL=central-authority-util-crypto-keys-import.d.ts.map