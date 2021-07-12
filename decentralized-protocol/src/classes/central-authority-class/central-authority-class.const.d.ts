export declare const CENTRAL_AUTHORITY_CLASS_ERRORS_PREFIX = "CentralAuthority";
export declare const CENTRAL_AUTHORITY_CLASS_OPTIONS_SCHEMA: {
    type: string;
    properties: {
        authProvidersPool: {
            type: string;
            properties: {
                providersConfigurations: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            options: {
                                type: string;
                            };
                            caProviderUrl: {
                                type: string;
                                format: string;
                            };
                            caProvider: {
                                oneOf: {
                                    type: string;
                                }[];
                            };
                        };
                        required: string[];
                    };
                };
            };
            required: string[];
        };
        user: {
            type: string;
            properties: {
                authProviderUrl: {
                    type: string;
                    format: string;
                };
                credentials: {
                    type: string;
                    properties: {
                        login: {
                            type: string;
                            minLength: number;
                        };
                        password: {
                            type: string;
                            minLength: number;
                        };
                        cryptoCredentials: {
                            type: string;
                        };
                    };
                    required: string[];
                };
                profile: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        email: {
                            type: string;
                        };
                        phone: {
                            type: string;
                        };
                        photoURL: {
                            type: string;
                        };
                    };
                };
            };
            required: string[];
        };
    };
    required: string[];
};
export declare const CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_STORAGE_DB_NAME = "__ca_conn";
export declare const CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_SWARM_USERS_CREDENTIALS_CACHE_CAPACITY = 1000;
//# sourceMappingURL=central-authority-class.const.d.ts.map