export const CA_AUTH_CONNECTION_FIREBASE_UTILS_VALIDATOR_SCHEME_CONNECTION_OPTIONS = {
  type: 'object',
  properties: {
    apiKey: {
      type: 'string',
    },
    authDomain: {
      type: 'string',
    },
    databaseURL: {
      type: 'string',
      format: 'uri',
    },
    projectId: {
      type: 'string',
    },
    storageBucket: {
      type: 'string',
    },
    messagingSenderId: {
      type: 'string',
    },
  },
  required: [
    'apiKey',
    'authDomain',
    'databaseURL',
    'projectId',
    'storageBucket',
    'messagingSenderId',
  ],
};
