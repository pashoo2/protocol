export const CONST_VALIDATION_SCHEMES_CREDENTIALS_MAIN_CA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'userId',
    'signPublicKey',
    'signPrivateKey',
    'encryptPublicKey',
    'encryptPrivateKey',
  ],
  userId: {
    type: 'string',
    format: 'uuid',
  },
  signPublicKey: {
    type: 'string',
  },
  signPrivateKey: {
    type: 'string',
  },
  encryptPublicKey: {
    type: 'string',
  },
  encryptPrivateKey: {
    type: 'string',
  },
};
