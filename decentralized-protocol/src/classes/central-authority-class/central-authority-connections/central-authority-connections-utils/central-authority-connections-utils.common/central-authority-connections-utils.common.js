import { CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS, } from '../../central-authority-connections.const';
import { validateCAConnectionAuthProviderType } from '../central-authority-connections-utils.validators/central-authority-connections-utils.validators';
export const getConnectionConstructorAuthProviderType = (type) => {
    if (!validateCAConnectionAuthProviderType(type)) {
        return new Error('The auth provider type is not valid');
    }
    return CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS[type];
};
//# sourceMappingURL=central-authority-connections-utils.common.js.map