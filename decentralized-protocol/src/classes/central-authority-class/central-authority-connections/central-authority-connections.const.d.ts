import { CAConnectionWithFirebase } from './central-authority-connection-firebase';
export declare enum CA_CONNECTION_AUTH_PROVIDERS {
    FIREBASE = 0
}
export declare const CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS: {
    0: typeof CAConnectionWithFirebase;
};
export declare const CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONFIGURATION_VALIDATORS: {
    0: (configuration: any) => configuration is import("./central-authority-connection-firebase").ICAConnectionConfigurationFirebase;
};
//# sourceMappingURL=central-authority-connections.const.d.ts.map