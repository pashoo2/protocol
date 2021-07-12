import { TCentralAuthorityUserIdentity } from '../../central-authority-class-types/central-authority-class-types-common';
import { TCentralAuthorityUserCryptoCredentials } from '../../central-authority-class-types/central-authority-class-types-crypto-credentials';
import { TCACryptoKeyPairs } from '../../central-authority-class-types/central-authority-class-types-crypto-keys';
import { CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME, CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME } from '../central-authority-util-crypto-keys/central-authority-util-crypto-keys.const';
export declare const getCryptoKeysByCryptoCredentials: (cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null) => TCACryptoKeyPairs | null;
export declare const getUserIdentityFromCryptoCredentials: (cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null) => TCentralAuthorityUserIdentity | null;
export declare const getKeyPairByCryptoCredentials: (cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null, keyType: typeof CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME | typeof CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME) => CryptoKeyPair | null;
export declare const getPubKeyByCryptoCredentials: (cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null, keyType: typeof CA_CRYPTO_KEY_PAIRS_SIGN_KEY_PAIR_NAME | typeof CA_CRYPTO_KEY_PAIRS_ENCRYPTION_KEY_PAIR_NAME) => CryptoKey | null;
export declare const getDataSignPubKeyByCryptoCredentials: (cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null) => CryptoKey | null;
export declare const getDataSignKeyPairByCryptoCredentials: (cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null) => CryptoKeyPair | null;
export declare const getDataEncryptionPubKeyByCryptoCredentials: (cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null) => CryptoKey | null;
export declare const getDataEncryptionKeyPairByCryptoCredentials: (cryptoCredentials: TCentralAuthorityUserCryptoCredentials | null) => CryptoKeyPair | null;
//# sourceMappingURL=central-authority-utils-crypto-credentials-crypto-keys.d.ts.map