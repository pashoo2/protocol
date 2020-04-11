import { CONST_VALIDATION_SCHEMES_URL } from 'const/const-validation-schemes/const-validation-schemes-common';

export const CENTRAL_AUTHORITY_CLASS_ERRORS_PREFIX = 'CentralAuthority';

export const CENTRAL_AUTHORITY_CLASS_OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    authProvidersPool: {
      type: 'object',
      properties: {
        providersConfigurations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              options: {
                type: 'object',
              },
              caProviderUrl: CONST_VALIDATION_SCHEMES_URL,
              caProvider: {
                oneOf: [
                  {
                    type: 'string',
                  },
                  {
                    type: 'number',
                  },
                ],
              },
            },
            required: ['options', 'caProviderUrl', 'caProvider'],
          },
        },
      },
      required: ['providersConfigurations'],
    },
    user: {
      type: 'object',
      properties: {
        authProviderUrl: CONST_VALIDATION_SCHEMES_URL,
        credentials: {
          type: 'object',
          properties: {
            login: {
              type: 'string',
              minLength: 2,
            },
            password: {
              type: 'string',
              minLength: 2,
            },
            cryptoCredentials: {
              type: 'object',
            },
          },
          required: ['login'],
        },
        profile: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            phone: {
              type: 'string',
            },
            photoURL: {
              type: 'string',
            },
          },
        },
      },
      required: ['authProviderUrl', 'credentials'],
    },
  },
  required: ['authProvidersPool', 'user'],
};

export const CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_STORAGE_DB_NAME =
  '__ca_conn';

export const CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_SWARM_USERS_CREDENTIALS_CACHE_CAPACITY = 1000;
