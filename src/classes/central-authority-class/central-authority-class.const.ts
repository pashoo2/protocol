import {CONST_VALIDATION_SCHEMES_URL} from "const/const-validation-schemes/const-validation-schemes-common";

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
                type: 'string',
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
          required: ['login', 'password'],
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
