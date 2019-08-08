import { validateBySchema } from 'utils/validation-utils/validation-utils';
import { caValidatorsCryptoKeysExportedObjectValidationSchema } from './central-authority-validators-crypto-keys-schemas';

export const caValidateCryptoKeyPairExportedObject = (value: any): boolean =>
  validateBySchema(caValidatorsCryptoKeysExportedObjectValidationSchema, value);
