import memoize from 'lodash.memoize';
import { normalizeUrl } from 'utils';
import { TCAAuthProviderIdentity } from '../central-authority-connections.types';
import { validateCAConnectionAuthProviderUrl } from './central-authority-connections-utils.validators/central-authority-connections-utils.validators';

/**
 * normalize an url provided for
 * as url of an auth provider
 *
 * @param authProviderUrl
 */
export const normalizeCAConnectionAuthProviderURL = memoize(
  (authProviderUrl: TCAAuthProviderIdentity): Error | TCAAuthProviderIdentity => {
    if (!authProviderUrl) {
      return new Error('Auth provider url is not defined');
    }
    if (!validateCAConnectionAuthProviderUrl(authProviderUrl)) {
      return new Error('The auth provider url is not valid');
    }
    return normalizeUrl(authProviderUrl);
  }
);
