import { CA_CONNECTION_AUTH_PROVIDERS } from '../../central-authority-connections.const';
export declare const validateCAConnectionAuthProviderType: (caAuthProvider: any) => caAuthProvider is CA_CONNECTION_AUTH_PROVIDERS;
export declare const validateCAConnectionAuthProviderUrl: (caAuthProviderUrl: string) => caAuthProviderUrl is string;
export declare const validateCAConnectionAuthProviderConnectionConfiguration: (authProviderType: CA_CONNECTION_AUTH_PROVIDERS, connectionConf: any) => boolean;
//# sourceMappingURL=central-authority-connections-utils.validators.d.ts.map