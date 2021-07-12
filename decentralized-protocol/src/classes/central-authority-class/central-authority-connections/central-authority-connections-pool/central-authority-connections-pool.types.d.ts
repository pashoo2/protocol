import { ICAConnection, TCAAuthProviderIdentity, TCAConnectionsAuthProviderConnectionOptions, ICAConnectionSignUpCredentials } from '../central-authority-connections.types';
import { CA_CONNECTION_AUTH_PROVIDERS } from '../central-authority-connections.const';
import { ICentralAuthorityUserProfile } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ICAConnectionUserAuthorizedResult } from '../central-authority-connections.types';
import { TCAuthProviderIdentifier } from '../../central-authority-class-user-identity/central-authority-class-user-identity.types';
export declare type TAuthProviderConnectionOptions = TCAConnectionsAuthProviderConnectionOptions;
export interface IAuthProviderConnectionConfiguration {
    options: TAuthProviderConnectionOptions;
    caProviderUrl: TCAAuthProviderIdentity;
    caProvider: CA_CONNECTION_AUTH_PROVIDERS;
}
export interface ICAConnectionsPoolOptions {
    providers: IAuthProviderConnectionConfiguration[];
}
export interface ICAConnectionsPoolCurrentConnections {
    options: TAuthProviderConnectionOptions;
    caProvider: CA_CONNECTION_AUTH_PROVIDERS;
    caProviderUrl: TCAAuthProviderIdentity;
    connection?: ICAConnection;
}
export interface ICAConnectionsPoolConnections {
    [key: string]: ICAConnectionsPoolCurrentConnections;
}
export interface ICAConnectionPoolAuthResult extends ICAConnectionUserAuthorizedResult {
    authProviderId: TCAuthProviderIdentifier;
}
export interface ICAConnectionPool {
    userAuthResult?: ICAConnectionUserAuthorizedResult;
    getConnection(authProviderUrl: TCAAuthProviderIdentity): Promise<Error | ICAConnection>;
    connect(authProviderUrl: TCAAuthProviderIdentity, isAuthentificateAnonymousely?: boolean): Promise<Error | ICAConnection>;
    authorize(authProviderUrl: TCAAuthProviderIdentity, signUpCredentials: ICAConnectionSignUpCredentials, profile?: Partial<ICentralAuthorityUserProfile>): Promise<Error | ICAConnection>;
    disconnect(authProviderUrl: TCAAuthProviderIdentity): Promise<Error | void>;
    close(): Promise<Error | void>;
    signOut(): Promise<Error | void>;
    getCAUserProfile(): Promise<Partial<ICentralAuthorityUserProfile> | undefined | Error>;
}
//# sourceMappingURL=central-authority-connections-pool.types.d.ts.map