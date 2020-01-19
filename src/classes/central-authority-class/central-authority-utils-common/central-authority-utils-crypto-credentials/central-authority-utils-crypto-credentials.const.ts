import { Options as NormilizeUrlOptions } from 'normalize-url';

export const CA_UTILS_CRYPTO_CREDENTIALS_NORMALIZE_URL_OPTIONS: NormilizeUrlOptions = {
  removeTrailingSlash: true,
  sortQueryParameters: true,
  stripProtocol: true,
  stripWWW: true,
};
