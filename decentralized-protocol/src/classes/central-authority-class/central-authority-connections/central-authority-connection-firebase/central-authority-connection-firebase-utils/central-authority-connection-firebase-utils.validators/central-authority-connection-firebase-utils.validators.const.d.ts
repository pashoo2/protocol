export declare const CA_AUTH_CONNECTION_FIREBASE_UTILS_VALIDATOR_SCHEME_CONNECTION_OPTIONS: {
    type: string;
    properties: {
        apiKey: {
            type: string;
            minLength: number;
        };
        authDomain: {
            type: string;
            minLength: number;
        };
        databaseURL: {
            type: string;
            format: string;
        };
        projectId: {
            type: string;
            minLength: number;
        };
        storageBucket: {
            type: string;
        };
        messagingSenderId: {
            type: string;
            minLength: number;
        };
    };
    required: string[];
};
//# sourceMappingURL=central-authority-connection-firebase-utils.validators.const.d.ts.map