import {
  CRYPTO_UTIL_GENERATE_KEYPAIR_OPTIONS,
  CRYPTO_UTIL_KEYPAIR_USAGES,
  CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT,
  CRYPTO_UTIL_KEY_ALGORYTHM,
} from './crypto-utils.const';
import {
  TCRYPTO_UTIL_KEY_EXPORT_FORMAT_TYPE,
  TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE,
  TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE,
} from './crypto-utils.types';

export const cryptoModule = window.crypto.subtle;

export const generateKeyPair = () =>
  cryptoModule.generateKey(
    CRYPTO_UTIL_GENERATE_KEYPAIR_OPTIONS,
    true,
    CRYPTO_UTIL_KEYPAIR_USAGES
  );

export const exportKey = (
  key: CryptoKey
): PromiseLike<TCRYPTO_UTIL_KEY_EXPORT_FORMAT_TYPE> => {
  return cryptoModule.exportKey(CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT, key);
};

export const exportPublicKey = async (keyPair: CryptoKeyPair) => {
  return exportKey(keyPair.publicKey);
};

export const exportPublicKeyAsString = async (keyPair: CryptoKeyPair) => {
  return JSON.stringify(exportPublicKey(keyPair));
};

export const exportKeyPair = async (
  keyPair: CryptoKeyPair
): Promise<TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE> => {
  return {
    private: await exportKey(keyPair.privateKey),
    public: await exportKey(keyPair.publicKey),
  };
};

export const exportKeyPairAsString = (keyPair: CryptoKeyPair): string => {
  return JSON.stringify(exportKeyPair(keyPair));
};

export const importKey = (key: object): PromiseLike<CryptoKey> => {
  return cryptoModule.importKey(
    CRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT,
    key,
    CRYPTO_UTIL_KEY_ALGORYTHM,
    true,
    CRYPTO_UTIL_KEYPAIR_USAGES
  );
};

export const importKeyPair = async (
  keyPair: TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE
): Promise<TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE> => {
  return {
    public: await importKey(keyPair.public),
    private: await importKey(keyPair.private),
  };
};

export const importKeyPairFromString = (
  keyPairString: string
): Promise<TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE> | Error => {
  try {
    return importKeyPair(JSON.parse(keyPairString));
  } catch (err) {
    return err;
  }
};

export const importKeyFromString = (
  keyString: string
): PromiseLike<CryptoKey> | Error => {
  try {
    return importKey(JSON.parse(keyString));
  } catch (err) {
    return err;
  }
};
