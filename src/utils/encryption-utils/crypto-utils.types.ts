import { TTypedArrays } from 'types/main.types';

export type TCRYPTO_UTIL_KEY_EXPORT_FORMAT_TYPE = object;

export type TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE = {
  publicKey: object;
  privateKey: object;
};

export type TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE = {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
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
