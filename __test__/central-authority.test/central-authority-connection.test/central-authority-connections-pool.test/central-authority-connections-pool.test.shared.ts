import { CAConnectionsPool } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-pool/central-authority-connections-pool';
import { CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_AUTH_PROVIDERS_CONF } from './central-authority-connections-pool.test.const';

export {
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_AUTH_PROVIDERS_CONF,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_AUTH_PROVIDERS_CONF_INVALID,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CREDENTIALS,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_URL,
} from './central-authority-connections-pool.test.const';

export const createCAConnectionsPoolWithTwoProviders = () => {
  return new CAConnectionsPool(
    CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_AUTH_PROVIDERS_CONF
  );
};
