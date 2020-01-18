import { CAConnectionsPool } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-pool/central-authority-connections-pool';
import {
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF,
} from './central-authority-connections-pool.test.const';

export const createCAConnectionsPoolWithTwoProviders = () => {
  return new CAConnectionsPool({
    providers: [
      CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF,
      CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF,
    ],
  });
};
