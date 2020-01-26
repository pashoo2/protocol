import { ICentralAuthorityOptions } from '../../../classes/central-authority-class/central-authority-class.types';
import {
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CREDENTIALS,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_URL,
} from '../central-authority-connection.test/central-authority-connections-pool.test/central-authority-connections-pool.test.const';
import {
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_AUTH_PROVIDERS_CONF,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_AUTH_PROVIDERS_CONF_INVALID,
} from '../central-authority-connection.test/central-authority-connections-pool.test/central-authority-connections-pool.test.const';
export {
  CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY,
  CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY_SECOND,
} from '../central-authority-swarm-credentials-provider/central-authority-swarm-credentials-provider.shared';
export const CA_CLASS_OPTIONS_VALID_NO_PROFILE: ICentralAuthorityOptions = {
  authProvidersPool: {
    providersConfigurations:
      CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_AUTH_PROVIDERS_CONF.providers,
  },
  user: {
    authProviderUrl: CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_URL,
    credentials: CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CREDENTIALS,
  },
};

export const CA_CLASS_OPTIONS_VALID_WITH_PROFILE: ICentralAuthorityOptions = {
  authProvidersPool: {
    providersConfigurations:
      CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_AUTH_PROVIDERS_CONF.providers,
  },
  user: {
    authProviderUrl: CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_URL,
    credentials: CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CREDENTIALS,
    profile: {
      // TODO - add email
      name: 'profile',
      photoURL:
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png',
    },
  },
};

export const CA_CLASS_OPTIONS_NOT_VALID_PROVIDERS: ICentralAuthorityOptions = {
  authProvidersPool: {
    providersConfigurations:
      CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_AUTH_PROVIDERS_CONF_INVALID.providers,
  },
  user: CA_CLASS_OPTIONS_VALID_NO_PROFILE.user,
};

export const CA_CLASS_OPTIONS_NOT_VALID_USER_CREDENTIALS: ICentralAuthorityOptions = {
  authProvidersPool: {
    providersConfigurations:
      CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_AUTH_PROVIDERS_CONF.providers,
  },
  user: {
    ...CA_CLASS_OPTIONS_VALID_NO_PROFILE.user,
    credentials: {
      ...CA_CLASS_OPTIONS_VALID_NO_PROFILE.user.credentials,
      password: 'not valid password',
    },
  },
};

export const CA_CLASS_USER_IDENTITY_NOT_EXISTS_AUTH_PROVIDER_YARU =
  '02https://ya.ru|0skX1iXT0rQCl5FxGzISu9dUPg23';

export const CA_CLASS_USER_IDENTITY_NOT_EXISTS_AUTH_PROVIDER_MAILRU =
  '02https://mail.ru|0skX1iXT0rQCl5FxGzISu9dUPg23';

export const CA_CLASS_USER_IDENTITY_NOT_VALID_NO_DELIMETER =
  '02https://ya.ru0skX1iXT0rQCl5FxGzISu9dUPg23';

export const CA_CLASS_USER_IDENTITY_NOT_VALID_NO_VERSION =
  'https://ya.ru|0skX1iXT0rQCl5FxGzISu9dUPg23';

export const CA_CLASS_USER_IDENTITY_NOT_VALID_NO_AUTH_PROVIDER_URL =
  '02|0skX1iXT0rQCl5FxGzISu9dUPg23';

export const CA_CLASS_USER_IDENTITY_NOT_VALID_NO_USER_IDENTITY =
  '02https://ya.ru|';
