import { TTypedArrays } from 'types/main.types';

/**
 * allow format types for storing an encryption key
 */

export type TEncryptionKeyStoreFormatType = string | ArrayBuffer | JsonWebKey | TTypedArrays;
