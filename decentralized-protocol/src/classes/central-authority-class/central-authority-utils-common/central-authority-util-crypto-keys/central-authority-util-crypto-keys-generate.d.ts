import { TCACryptoKeyPairs, TCentralAuthorityUserCryptoCredentials } from '../../central-authority-class-types/central-authority-class-types';
import { ICAUserUniqueIdentifierMetadata } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';
export declare const generateEncryptKeyPair: () => Promise<CryptoKeyPair | Error>;
export declare const generateSignKeyPair: () => Promise<CryptoKeyPair | Error>;
export declare const generateKeyPairs: () => Promise<TCACryptoKeyPairs | Error>;
export declare const generateCryptoCredentialsV1: () => Promise<TCentralAuthorityUserCryptoCredentials | Error>;
export declare const generateCryptoCredentialsWithUserIdentityV1: (identityMetadata: ICAUserUniqueIdentifierMetadata) => Promise<TCentralAuthorityUserCryptoCredentials | Error>;
export declare const generateCryptoCredentialsWithUserIdentityV2: (identityMetadata: ICAUserUniqueIdentifierMetadata) => Promise<TCentralAuthorityUserCryptoCredentials | Error>;
//# sourceMappingURL=central-authority-util-crypto-keys-generate.d.ts.map