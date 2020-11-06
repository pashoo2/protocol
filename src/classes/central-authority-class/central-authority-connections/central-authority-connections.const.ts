import { CAConnectionWithFirebase } from './central-authority-connection-firebase';

export enum CA_CONNECTION_AUTH_PROVIDERS {
  FIREBASE,
}

export const CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS = {
  [CA_CONNECTION_AUTH_PROVIDERS.FIREBASE]: CAConnectionWithFirebase,
};

/**
 * validators for configuration, which is specific for an auth
 * provider type's connection
 */
export const CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONFIGURATION_VALIDATORS = {
  [CA_CONNECTION_AUTH_PROVIDERS.FIREBASE]: CAConnectionWithFirebase.validateConfiguration,
};
