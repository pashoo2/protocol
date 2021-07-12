import { CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS, } from '../../central-authority-connections.const';
import { CA_CONNECTIONS_AUTH_PROVIDERS_VALUES } from './central-authority-connections-utils.validators.const';
import validator from 'validator';
export const validateCAConnectionAuthProviderType = (caAuthProvider) => CA_CONNECTIONS_AUTH_PROVIDERS_VALUES.includes(caAuthProvider);
export const validateCAConnectionAuthProviderUrl = (caAuthProviderUrl) => {
    try {
        return validator.isURL(caAuthProviderUrl);
    }
    catch (_a) {
        return false;
    }
};
export const validateCAConnectionAuthProviderConnectionConfiguration = (authProviderType, connectionConf) => {
    if (validateCAConnectionAuthProviderType(authProviderType)) {
        const AuthProviderConnectionConstructor = CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS[authProviderType];
        return AuthProviderConnectionConstructor.validateConfiguration(connectionConf);
    }
    return false;
};
//# sourceMappingURL=central-authority-connections-utils.validators.js.map