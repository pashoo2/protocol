import { CA_CONNECTION_AUTH_PROVIDERS, CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS } from '../../central-authority-connections.const';
import { ICAConnectionAuthProviderConstructor } from '../../central-authority-connections.types';
import { validateCAConnectionAuthProviderType } from '../central-authority-connections-utils.validators/central-authority-connections-utils.validators';

export const getConnectionConstructorAuthProviderType = (type: CA_CONNECTION_AUTH_PROVIDERS): Error | ICAConnectionAuthProviderConstructor | void => {
  if (!validateCAConnectionAuthProviderType(type)) {
    return new Error('The auth provider type is not valid');
  }
  return CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS[type];
};
