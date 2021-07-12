export const CA_AUTH_CONNECTION_FIREBASE_UTILS_VALIDATOR_SCHEME_CONNECTION_OPTIONS = {
    type: 'object',
    properties: {
        apiKey: {
            type: 'string',
            minLength: 5,
        },
        authDomain: {
            type: 'string',
            minLength: 1,
        },
        databaseURL: {
            type: 'string',
            format: 'uri',
        },
        projectId: {
            type: 'string',
            minLength: 5,
        },
        storageBucket: {
            type: 'string',
        },
        messagingSenderId: {
            type: 'string',
            minLength: 5,
        },
    },
    required: ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'storageBucket', 'messagingSenderId'],
};
//# sourceMappingURL=central-authority-connection-firebase-utils.validators.const.js.map