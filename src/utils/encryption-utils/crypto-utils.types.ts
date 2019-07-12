import { TTypedArrays } from 'types/main.types';
import {
  CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME,
  CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME,
} from './crypto-utils.const';

export type TCRYPTO_UTIL_IMPORT_KEY_TYPES = TTypedArrays | ArrayBuffer;

export type TCRYPTO_UTIL_KEY_EXPORT_FORMAT_TYPE = object;

export type TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE = {
  [CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]: TCRYPTO_UTIL_IMPORT_KEY_TYPES;
  [CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]: TCRYPTO_UTIL_IMPORT_KEY_TYPES;
};

export type TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE = {
  [CRYPTO_UTIL_KEYPAIR_PUBLIC_KEY_NAME]: CryptoKey;
  [CRYPTO_UTIL_KEYPAIR_PRIVATE_KEY_NAME]: CryptoKey;
};

export type TCRYPTO_UTIL_ENCRYPT_DATA_TYPES_NATIVE = TTypedArrays;

export type TCRYPTO_UTIL_ENCRYPT_DATA_TYPES =
  | object
  | string
  | number
  | TCRYPTO_UTIL_ENCRYPT_DATA_TYPES_NATIVE;

export type TCRYPTO_UTIL_ENCRYPT_KEY_TYPES =
  | CryptoKey
  | CryptoKeyPair
  | string
  | TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE
  | TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE;

export type TCRYPTO_UTIL_DECRYPT_KEY_TYPES =
  | CryptoKey
  | CryptoKeyPair
  | string
  | TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE
  | TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE;

export type TCRYPTO_UTIL_DECRYPT_DATA_TYPES_NATIVE = TTypedArrays;

export type TCRYPTO_UTIL_DECRYPT_DATA_TYPES = string | TTypedArrays;

export type TCRYPTO_UTILS_ENCRYPT_DATA_KEY_CONFIG =
  | string
  | RsaOaepParams
  | AesCtrParams
  | AesCbcParams
  | AesCmacParams
  | AesGcmParams
  | AesCfbParams;

export type TCRYPTO_UTILS_DATA_WITH_INITIALIZATION_VECTOR = {
  iv: ArrayBuffer;
  data: ArrayBuffer;
};

export type TCRYPTO_UTILS_DECRYPT_DATA_KEY_CONFIG =
  | string
  | RsaOaepParams
  | AesCtrParams
  | AesCbcParams
  | AesCmacParams
  | AesGcmParams
  | AesCfbParams;
