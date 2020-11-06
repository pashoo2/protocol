import normalizeUrlModule, { Options } from 'normalize-url';

/**
 * normalize the url string
 * by
 *
 * @param {string} url
 */
export const normalizeUrl = (url: string, options?: Options): string | Error => {
  try {
    return normalizeUrlModule(url, {
      defaultProtocol: 'https:', // the default protocol must be https:
      normalizeProtocol: true,
      stripWWW: true,
      sortQueryParameters: true, // it is necessary to compare two urls
      ...options,
    });
  } catch (err) {
    return err;
  }
};
