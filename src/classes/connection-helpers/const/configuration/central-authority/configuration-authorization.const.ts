import { IConnectionBridgeOptionsAuth } from 'classes/connection-bridge/types/connection-bridge.types';
import { CONFIGURATION_CENTRAL_AUTHORITY_PROVIDERS } from './configuration-central-authority-providers';

export const CONFIGURATION_AUTHORIZATION_FIREBASE_AUTH_PROVIDER_DEFAULT =
  CONFIGURATION_CENTRAL_AUTHORITY_PROVIDERS.FIREBASE_WATCHA as const;

export const CONFIGURATION_AUTHORIZATION_FIREBASE_AUTH_PROVIDER_OPTIONS_DEFAULT: IConnectionBridgeOptionsAuth<false> = {
  providerUrl: CONFIGURATION_AUTHORIZATION_FIREBASE_AUTH_PROVIDER_DEFAULT,
  // use session persistance
  session: {},
  credentials: undefined,
};
