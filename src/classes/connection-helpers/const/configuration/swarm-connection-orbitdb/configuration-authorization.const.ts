import { IConnectionBridgeOptionsAuth } from 'classes/connection-bridge/types/connection-bridge.types';
import { CONNECT_TO_SWARM_AUTH_PROVIDERS } from 'components/connect-to-swarm';

export const CONFIGURATION_AUTHORIZATION_FIREBASE_AUTH_PROVIDER_DEFAULT =
  CONNECT_TO_SWARM_AUTH_PROVIDERS.FIREBASE_WATCHA as const;

export const CONFIGURATION_AUTHORIZATION_FIREBASE_AUTH_PROVIDER_OPTIONS_DEFAULT: IConnectionBridgeOptionsAuth<false> = {
  providerUrl: CONFIGURATION_AUTHORIZATION_FIREBASE_AUTH_PROVIDER_DEFAULT,
  // use session persistance
  session: {},
  credentials: undefined,
};
