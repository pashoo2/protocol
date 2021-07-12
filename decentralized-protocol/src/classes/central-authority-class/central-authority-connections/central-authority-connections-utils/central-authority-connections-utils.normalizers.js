import memoize from 'lodash.memoize';
import { normalizeUrl } from "../../../../utils";
import { validateCAConnectionAuthProviderUrl } from './central-authority-connections-utils.validators/central-authority-connections-utils.validators';
export const normalizeCAConnectionAuthProviderURL = memoize((authProviderUrl) => {
    if (!authProviderUrl) {
        return new Error('Auth provider url is not defined');
    }
    if (!validateCAConnectionAuthProviderUrl(authProviderUrl)) {
        return new Error('The auth provider url is not valid');
    }
    return normalizeUrl(authProviderUrl);
});
//# sourceMappingURL=central-authority-connections-utils.normalizers.js.map