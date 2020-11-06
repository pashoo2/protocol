import {
  CA_CONNECTION_AUTH_PROVIDERS,
  CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS,
} from '../../central-authority-connections.const';
import { CA_CONNECTIONS_AUTH_PROVIDERS_VALUES } from './central-authority-connections-utils.validators.const';
import validator from 'validator';
import { TCAAuthProviderIdentity } from '../../central-authority-connections.types';

export const validateCAConnectionAuthProviderType = (caAuthProvider: any): caAuthProvider is CA_CONNECTION_AUTH_PROVIDERS =>
  CA_CONNECTIONS_AUTH_PROVIDERS_VALUES.includes(caAuthProvider);

export const validateCAConnectionAuthProviderUrl = (caAuthProviderUrl: string): caAuthProviderUrl is TCAAuthProviderIdentity => {
  try {
    return validator.isURL(caAuthProviderUrl);
  } catch {
    return false;
  }
};

export const validateCAConnectionAuthProviderConnectionConfiguration = (
  authProviderType: CA_CONNECTION_AUTH_PROVIDERS,
  connectionConf: any
): boolean => {
  if (validateCAConnectionAuthProviderType(authProviderType)) {
    const AuthProviderConnectionConstructor = CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS[authProviderType];

    return AuthProviderConnectionConstructor.validateConfiguration(connectionConf);
  }
  return false;
};
