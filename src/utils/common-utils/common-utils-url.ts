import normalizeUrlModule from 'normalize-url';

/**
 * normalize the url string
 * by
 *
 * @param {string} url
 */
export const normalizeUrl = (url: string): string | Error => {
  try {
    return normalizeUrlModule(url, {
      defaultProtocol: 'https:', // the default protocol must be https:
      normalizeProtocol: true,
      stripWWW: true,
      sortQueryParameters: true, // it is necessary to compare two urls
    });
  } catch (err) {
    return err;
  }
};
